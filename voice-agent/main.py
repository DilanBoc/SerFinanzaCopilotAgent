from __future__ import annotations

import asyncio
import os
import queue
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Set

import numpy as np
import sounddevice as sd
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from faster_whisper import WhisperModel


SAMPLE_RATE = int(os.getenv("VOICE_SAMPLE_RATE", "16000"))
CHUNK_SECONDS = float(os.getenv("VOICE_CHUNK_SECONDS", "4"))
MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "tiny")
MODEL_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
HOST = os.getenv("VOICE_AGENT_HOST", "127.0.0.1")
PORT = int(os.getenv("VOICE_AGENT_PORT", "8765"))
MODEL_DIR = Path(__file__).resolve().parent / "models"


@dataclass
class TranscriptMessage:
    text: str
    duration_seconds: float
    latency_seconds: float


app = FastAPI(title="Serfinanza Voice Agent", version="0.1.0")
clients: Set[WebSocket] = set()
audio_queue: "queue.Queue[np.ndarray]" = queue.Queue()
transcript_queue: "queue.Queue[TranscriptMessage]" = queue.Queue()
stop_event = threading.Event()
model: WhisperModel | None = None


@app.get("/health")
def health() -> dict[str, str | int | float]:
    return {
        "status": "ok",
        "sampleRate": SAMPLE_RATE,
        "chunkSeconds": CHUNK_SECONDS,
        "model": MODEL_SIZE,
        "device": MODEL_DEVICE,
        "computeType": COMPUTE_TYPE,
        "connectedClients": len(clients),
    }


@app.websocket("/ws/transcript")
async def transcript_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    clients.add(websocket)
    try:
        await websocket.send_json({"type": "status", "status": "connected"})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.discard(websocket)


async def broadcast_loop() -> None:
    while True:
        message = await asyncio.to_thread(transcript_queue.get)
        stale_clients: list[WebSocket] = []
        payload = {
            "type": "transcript",
            "speaker": "Cliente",
            "text": message.text,
            "durationSeconds": message.duration_seconds,
            "latencySeconds": message.latency_seconds,
        }
        for client in clients:
            try:
                await client.send_json(payload)
            except RuntimeError:
                stale_clients.append(client)
        for client in stale_clients:
            clients.discard(client)


@app.on_event("startup")
async def startup() -> None:
    global model
    model = WhisperModel(resolve_model_path(MODEL_SIZE), device=MODEL_DEVICE, compute_type=COMPUTE_TYPE)
    threading.Thread(target=capture_microphone, daemon=True).start()
    threading.Thread(target=transcription_worker, daemon=True).start()
    asyncio.create_task(broadcast_loop())


@app.on_event("shutdown")
async def shutdown() -> None:
    stop_event.set()


def capture_microphone() -> None:
    frames_per_chunk = int(SAMPLE_RATE * CHUNK_SECONDS)

    def callback(indata: np.ndarray, frames: int, _time, status) -> None:
        if status:
            print(f"Audio status: {status}")
        mono_audio = indata[:, 0].copy()
        audio_queue.put(mono_audio)

    with sd.InputStream(
        channels=1,
        samplerate=SAMPLE_RATE,
        blocksize=frames_per_chunk,
        dtype="float32",
        callback=callback,
    ):
        while not stop_event.is_set():
            time.sleep(0.25)


def resolve_model_path(model_size: str) -> str:
    local_model = MODEL_DIR / f"faster-whisper-{model_size}"
    if local_model.exists():
        return str(local_model)
    return model_size


def transcription_worker() -> None:
    while not stop_event.is_set():
        audio = audio_queue.get()
        started_at = time.perf_counter()
        text = transcribe(audio)
        if not text:
            continue
        transcript_queue.put(
            TranscriptMessage(
                text=text,
                duration_seconds=round(len(audio) / SAMPLE_RATE, 2),
                latency_seconds=round(time.perf_counter() - started_at, 2),
            )
        )


def transcribe(audio: np.ndarray) -> str:
    if model is None:
        return ""

    segments, info = model.transcribe(
        audio,
        language="es",
        vad_filter=True,
        beam_size=1,
        condition_on_previous_text=False,
    )
    if info.language_probability < 0.25:
        return ""
    text = " ".join(segment.text.strip() for segment in segments).strip()
    return text


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=False)
