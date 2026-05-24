# Experimento Local: Microfono + Whisper

## Objetivo

Probar una version del copiloto presencial donde la transcripcion proviene de un microfono local y no de frases simuladas.

Este experimento no reemplaza la demo estable. El modo simulado sigue disponible como respaldo.

## Flujo

```text
Microfono local
-> voice-agent/main.py
-> faster-whisper
-> WebSocket ws://localhost:8765/ws/transcript
-> app asesor
-> detector de consulta
-> tarjeta de asistencia
```

## Decisiones

- No se guarda audio.
- Solo se envia texto transcrito al frontend.
- El modelo por defecto es `tiny` en CPU con `int8`.
- La deteccion de consulta se hace en la app con reglas conservadoras.
- El frontend conserva el boton `Siguiente frase` para modo simulado.

## Como correr

App web:

```powershell
cd prototype
npm run dev
```

Servicio de voz:

```powershell
cd voice-agent
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:8765/health
```

## Pruebas recomendadas

- "Quiero abrir un CDT."
- "Necesito actualizar mis datos."
- "Si soy independiente, que soporte me aceptan para actualizar ingresos?"
- "Buenos dias, vengo para una cita."

## Riesgos

- En CPU puede haber latencia.
- Windows puede requerir permisos o drivers de microfono.
- La primera ejecucion puede tardar por descarga del modelo.
- Si se quiere experimentar con mayor precision, arrancar con `$env:WHISPER_MODEL_SIZE='small'`.
- El ruido ambiente puede afectar la transcripcion.
