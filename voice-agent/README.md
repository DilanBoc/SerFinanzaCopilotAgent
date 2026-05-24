# Voice Agent Local Whisper

Servicio experimental para capturar audio desde el microfono local, transcribirlo con `faster-whisper` y enviar las frases a la pantalla del asesor por WebSocket.

## Requisitos

- Python 3.10 o superior.
- Microfono habilitado en Windows.
- Permisos de red local para `localhost:8765`.

## Instalacion

```powershell
cd voice-agent
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Ejecucion

Terminal 1, app web:

```powershell
cd prototype
npm run dev
```

Terminal 2, servicio de voz:

```powershell
cd voice-agent
.\.venv\Scripts\Activate.ps1
python main.py
```

El modelo por defecto es `tiny` porque ya fue validado en la demo local y ofrece la menor latencia en CPU. Los modelos locales `base` y `small` pueden vivir en:

```text
voice-agent/models/faster-whisper-base
voice-agent/models/faster-whisper-small
```

Si necesitas probar mejor reconocimiento y la maquina lo soporta, puedes arrancar con:

```powershell
$env:WHISPER_MODEL_SIZE='small'
python main.py
```

Luego entra al puesto del asesor, inicia jornada, identifica un cliente, inicia atencion y cambia el modo a `Microfono local`.

## Frases de prueba

- Quiero abrir un CDT.
- Necesito actualizar mis datos.
- No se como pagar mi tarjeta.
- Buenos dias, vengo para una cita.

## Notas

- El audio no se guarda.
- Solo se emiten transcripciones al frontend.
- El primer arranque puede tardar porque `faster-whisper` descarga el modelo.
- `base` y `small` reconocen mejor que `tiny`, pero pueden aumentar latencia en CPU.
- Si existe una carpeta local para el modelo, el servicio la usa antes de intentar descargar desde internet.
- Si el microfono falla, usa el modo simulado del frontend.
