"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Eye,
  Flag,
  Mic,
  Radio,
  Pause,
  Play,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { ActionButton, Badge, Panel } from "@/components/ui";
import { detectConsultation } from "@/lib/consultation-detector";
import { advisor, detectedQuestions, office, transcript } from "@/lib/demo-data";
import type { CustomerProfile, DetectedQuestion, StructuredAnswer, TranscriptLine } from "@/lib/types";

type WorkdayState = "off" | "active" | "paused";
type AttentionState = "idle" | "customer_loaded" | "in_attention";
type TranscriptMode = "simulated" | "microphone";
type VoiceStatus = "idle" | "connecting" | "connected" | "error";

const VOICE_AGENT_URL = "ws://localhost:8765/ws/transcript";

export default function AdvisorPage() {
  const [workday, setWorkday] = useState<WorkdayState>("off");
  const [attention, setAttention] = useState<AttentionState>("idle");
  const [documentId, setDocumentId] = useState("1045678901");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerError, setCustomerError] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [lineCount, setLineCount] = useState(0);
  const [liveLines, setLiveLines] = useState<TranscriptLine[]>([]);
  const [transcriptMode, setTranscriptMode] = useState<TranscriptMode>("simulated");
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [activeQuestion, setActiveQuestion] = useState<DetectedQuestion | null>(null);
  const [answer, setAnswer] = useState<StructuredAnswer | null>(null);
  const [notice, setNotice] = useState("Inicia jornada para activar el puesto.");

  const visibleLines = useMemo(
    () => transcriptMode === "simulated" ? transcript.slice(0, lineCount) : liveLines,
    [lineCount, liveLines, transcriptMode],
  );
  const copilotActive = workday === "active" && attention === "in_attention";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" && copilotActive) {
        event.preventDefault();
        advanceConversation();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    if (!copilotActive || transcriptMode !== "microphone") {
      setVoiceStatus("idle");
      return;
    }

    setVoiceStatus("connecting");
    const socket = new WebSocket(VOICE_AGENT_URL);

    socket.onopen = () => {
      setVoiceStatus("connected");
      setNotice("Servicio de voz conectado. Habla frente al microfono local.");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== "transcript" || typeof message.text !== "string") return;
        ingestLiveTranscript(message.text);
      } catch {
        setNotice("Se recibio una transcripcion con formato no valido.");
      }
    };

    socket.onerror = () => {
      setVoiceStatus("error");
      setNotice("No se pudo conectar con el servicio local de voz. Puedes usar modo simulado.");
    };

    socket.onclose = () => {
      setVoiceStatus((current) => current === "connected" ? "idle" : current);
    };

    return () => socket.close();
  }, [copilotActive, transcriptMode, sessionId]);

  async function searchCustomer() {
    setCustomerError("");
    setSelectedCustomer(null);
    const response = await fetch(`/api/customers/${encodeURIComponent(documentId.trim())}`);
    if (!response.ok) {
      setCustomerError("Cliente dummy no encontrado. Para el MVP solo se permiten clientes precargados.");
      setAttention("idle");
      return;
    }
    const data = await response.json();
    setSelectedCustomer(data.customer);
    setAttention("customer_loaded");
    setNotice("Cliente identificado. Puedes iniciar atencion.");
  }

  async function startAttention() {
    if (!selectedCustomer || workday !== "active") return;
    const response = await fetch("/api/session/start", { method: "POST" });
    const data = await response.json();
    setSessionId(data.sessionId);
    setAttention("in_attention");
    setLineCount(0);
    setLiveLines([]);
    setAnswer(null);
    setActiveQuestion(null);
    setNotice("Atencion iniciada. Copiloto escuchando.");
  }

  function advanceConversation() {
    if (!copilotActive || transcriptMode !== "simulated") return;
    const nextCount = Math.min(lineCount + 1, transcript.length);
    setLineCount(nextCount);
    setAnswer(null);
    const detected = detectedQuestions.find((question) => question.lineIndex === nextCount - 1) ?? null;
    setActiveQuestion(detected);
    if (detected && sessionId) {
      setNotice(`Pregunta detectada: ${detected.topic}`);
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType: "QUESTION_DETECTED",
          intent: detected.intent,
          confidence: detected.confidence,
          payload: { ...detected, trigger: detected.fragment },
        }),
      });
    }
  }

  function ingestLiveTranscript(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setAnswer(null);
    setLiveLines((currentLines) => {
      const nextLines = [...currentLines, { speaker: "Cliente", text: cleanText } satisfies TranscriptLine];
      const detected = detectConsultation(cleanText, nextLines.length - 1);
      setActiveQuestion(detected);

      if (detected && sessionId) {
        setNotice(`Pregunta detectada por voz: ${detected.topic}`);
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            eventType: "QUESTION_DETECTED",
            intent: detected.intent,
            confidence: detected.confidence,
            payload: { ...detected, trigger: detected.fragment, source: "local-whisper" },
          }),
        });
      } else {
        setNotice("Transcripcion recibida sin consulta accionable.");
      }

      return nextLines;
    });
  }

  async function closeCard() {
    if (!activeQuestion || !sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "CLOSE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    setNotice("Tarjeta cerrada; evento registrado como cierre sin asistencia.");
    setActiveQuestion(null);
  }

  async function viewAssistance() {
    if (!activeQuestion || !sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "VIEW_ASSISTANCE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    const response = await fetch("/api/advisor/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, intent: activeQuestion.intent, question: activeQuestion.fragment }),
    });
    setAnswer(await response.json());
    setNotice("Asistencia estructurada generada.");
  }

  async function markResolved() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "RESOLVED",
        intent: activeQuestion.intent,
        payload: { questionId: activeQuestion.id },
      }),
    });
    setNotice("Consulta marcada como resuelta.");
    setActiveQuestion(null);
    setAnswer(null);
  }

  async function escalate() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "ESCALATE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    setNotice("Caso escalado como riesgo operacional.");
  }

  async function reportGap() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/gaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        intent: activeQuestion.intent,
        topic: activeQuestion.topic,
        questionText: activeQuestion.fragment,
        sourceIds: answer?.sources.map((source) => source.id) ?? [],
      }),
    });
    setNotice("Brecha registrada para administrador.");
    setActiveQuestion(null);
    setAnswer(null);
  }

  return (
    <AuthShell>
      <div className="grid gap-4 xl:grid-cols-[360px_1fr_400px]">
        <aside className="space-y-4">
          <Panel title="Jornada del asesor">
            <div className="space-y-3 text-sm">
              <div className="rounded bg-surface p-3">
                <p className="font-medium">{advisor.name}</p>
                <p className="text-muted">{advisor.seniority}</p>
                <p className="text-muted">{office.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Estado</span>
                <Badge tone={workday === "active" ? "success" : workday === "paused" ? "warn" : "neutral"}>
                  {workday === "active" ? "Jornada activa" : workday === "paused" ? "Copiloto pausado" : "Fuera de jornada"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={() => { setWorkday("active"); setNotice("Jornada iniciada."); }}>
                  <span className="flex items-center gap-2"><Play size={15} /> Iniciar</span>
                </ActionButton>
                <ActionButton onClick={() => { setWorkday(workday === "paused" ? "active" : "paused"); setNotice(workday === "paused" ? "Copiloto reanudado." : "Copiloto pausado."); }} variant="secondary" disabled={workday === "off"}>
                  <span className="flex items-center gap-2"><Pause size={15} /> {workday === "paused" ? "Reanudar" : "Pausar"}</span>
                </ActionButton>
              </div>
            </div>
          </Panel>

          <Panel title="Identificar cliente">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-ink">
                Documento
                <div className="mt-2 flex gap-2">
                  <input
                    value={documentId}
                    onChange={(event) => setDocumentId(event.target.value)}
                    className="min-w-0 flex-1 rounded border border-line px-3 py-2 text-sm"
                    placeholder="Ej. 1045678901"
                  />
                  <button
                    type="button"
                    onClick={searchCustomer}
                    className="focus-ring rounded bg-brand px-3 text-white hover:bg-blue-700"
                    aria-label="Buscar cliente"
                  >
                    <Search size={17} />
                  </button>
                </div>
              </label>
              {customerError ? <p className="text-sm text-danger">{customerError}</p> : null}
              {selectedCustomer ? (
                <div className="rounded border border-line bg-surface p-3 text-sm">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-muted">{selectedCustomer.segment}</p>
                  <p className="text-muted">Canal: {selectedCustomer.preferredChannel}</p>
                  <p className="text-muted">Productos: {selectedCustomer.activeProducts.join(", ")}</p>
                </div>
              ) : null}
              <ActionButton onClick={startAttention} disabled={workday !== "active" || attention !== "customer_loaded"}>
                Iniciar atencion
              </ActionButton>
            </div>
          </Panel>

          {selectedCustomer ? (
            <Panel title="Insights de atencion">
              <div className="space-y-3 text-sm">
                <p className="text-muted">Ultima interaccion: {selectedCustomer.lastInteraction}</p>
                <div>
                  <p className="font-medium">Alertas</p>
                  <div className="mt-2 space-y-1">
                    {selectedCustomer.riskAlerts.map((item) => <Badge key={item} tone="warn">{item}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Sugerencias suaves</p>
                  <ul className="mt-2 space-y-2 text-muted">
                    {selectedCustomer.softInsights.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              </div>
            </Panel>
          ) : null}
        </aside>

        <section className="space-y-4">
          <Panel
            title={transcriptMode === "simulated" ? "Transcripcion en vivo simulada" : "Transcripcion por microfono local"}
            action={
              <Badge tone={copilotActive ? "success" : "neutral"}>
                <Mic size={13} /> {copilotActive ? "Escuchando" : "Inactivo"}
              </Badge>
            }
          >
            <div className="mb-4 grid gap-3 border-b border-line pb-4 md:grid-cols-[1fr_auto]">
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  onClick={() => {
                    setTranscriptMode("simulated");
                    setNotice("Modo simulado activo.");
                  }}
                  variant={transcriptMode === "simulated" ? "primary" : "secondary"}
                >
                  Simulado
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setTranscriptMode("microphone");
                    setNotice("Modo microfono local activo. Inicia el servicio Python para conectar.");
                  }}
                  variant={transcriptMode === "microphone" ? "primary" : "secondary"}
                >
                  <span className="flex items-center gap-2"><Radio size={15} /> Microfono local</span>
                </ActionButton>
              </div>
              <Badge tone={voiceStatus === "connected" ? "success" : voiceStatus === "error" ? "danger" : "neutral"}>
                {transcriptMode === "simulated"
                  ? "Demo controlada"
                  : voiceStatus === "connected"
                    ? "Voz conectada"
                    : voiceStatus === "connecting"
                      ? "Conectando voz"
                      : voiceStatus === "error"
                        ? "Voz desconectada"
                        : "Voz inactiva"}
              </Badge>
            </div>
            <div className="min-h-[560px] space-y-3">
              {visibleLines.map((line: TranscriptLine, index) => (
                <div key={`${line.speaker}-${index}`} className="rounded border border-line bg-surface p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">{line.speaker}</p>
                  <p className="mt-1 leading-6">{line.text}</p>
                </div>
              ))}
              {visibleLines.length === 0 ? (
                <div className="flex min-h-[460px] items-center justify-center rounded border border-dashed border-line text-center text-muted">
                  {copilotActive
                    ? transcriptMode === "simulated"
                      ? "Presiona espacio o usa Siguiente frase para avanzar la conversacion."
                      : "Inicia el servicio Python de voz y habla frente al microfono."
                    : "Inicia jornada, identifica cliente e inicia atencion para activar el copiloto."}
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-sm text-muted">{notice}</p>
              <ActionButton onClick={advanceConversation} disabled={!copilotActive || transcriptMode !== "simulated" || lineCount >= transcript.length} variant="secondary">
                Siguiente frase
              </ActionButton>
            </div>
          </Panel>
        </section>

        <aside className="space-y-4">
          <Panel title="Copiloto contextual">
            {activeQuestion ? (
              <div className="space-y-4">
                <div className="rounded border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-start gap-2">
                    <CircleDot className="mt-1 text-brand" size={17} />
                    <div>
                      <p className="font-medium text-ink">{activeQuestion.topic}</p>
                      <p className="mt-1 text-sm text-muted">{activeQuestion.fragment}</p>
                      <p className="mt-2 text-xs text-muted">Confianza: {Math.round(activeQuestion.confidence * 100)}%</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <ActionButton onClick={viewAssistance}>
                    <span className="flex items-center gap-2"><Eye size={15} /> Ver asistencia</span>
                  </ActionButton>
                  <ActionButton onClick={closeCard} variant="secondary">
                    <span className="flex items-center gap-2"><X size={15} /> Cerrar</span>
                  </ActionButton>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[190px] items-center justify-center rounded border border-dashed border-line text-center text-sm text-muted">
                El copiloto mostrara una tarjeta cuando detecte una pregunta bancaria.
              </div>
            )}
          </Panel>

          {answer ? (
            <Panel
              title="Respuesta estructurada"
              action={
                answer.warnings.length ? (
                  <Badge tone="warn">
                    <AlertTriangle size={13} /> Advertencia
                  </Badge>
                ) : null
              }
            >
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Resumen</p>
                  <p className="mt-1 text-muted">{answer.summary}</p>
                </div>
                <div>
                  <p className="font-medium">Guion sugerido</p>
                  <p className="mt-1 rounded bg-surface p-3 leading-6">{answer.script}</p>
                </div>
                <div>
                  <p className="font-medium">Checklist</p>
                  <ul className="mt-2 space-y-1 text-muted">
                    {answer.checklist.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 text-accent" size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Siguiente mejor accion</p>
                  <p className="mt-1 text-muted">{answer.nextBestAction}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {answer.sources.map((source) => (
                    <Badge key={source.id} tone="brand">{source.label}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ActionButton onClick={markResolved}>Resuelto</ActionButton>
                  <ActionButton onClick={escalate} variant="secondary">
                    <span className="flex items-center gap-2"><Flag size={15} /> Escalar</span>
                  </ActionButton>
                  <ActionButton onClick={reportGap} variant="secondary">Brecha</ActionButton>
                </div>
              </div>
            </Panel>
          ) : null}

          <Panel title="Privacidad">
            <div className="flex items-start gap-2 text-sm text-muted">
              <ShieldCheck className="mt-0.5 text-brand" size={17} />
              <p>Atencion transcrita para calidad y mejora del servicio. Datos dummy para demo.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </AuthShell>
  );
}
