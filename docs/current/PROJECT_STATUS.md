# Estado Actual - Serfinanza Action Hub

Fecha: 2026-05-24  
Rama activa: `experiment-local-whisper-stt`  
Estado: prototipo local funcional con experimento de voz

## Producto

Serfinanza Action Hub es un copiloto contextual para atencion presencial en oficina. El asesor inicia jornada, identifica un cliente dummy, inicia una atencion y puede usar transcripcion simulada o microfono local experimental. Cuando el sistema detecta una consulta bancaria, muestra una tarjeta de asistencia con respuesta estructurada, fuentes y acciones operativas.

## Flujo Actual Del Asesor

1. Login con rol asesor.
2. Iniciar jornada.
3. Buscar cliente dummy por documento.
4. Iniciar atencion.
5. Elegir modo `Simulado` o `Microfono local`.
6. Recibir tarjeta cuando se detecta consulta.
7. Acciones disponibles: `Ver asistencia`, `Cerrar`, `Resuelto`, `Escalar`, `Brecha`.
8. Finalizar atencion para limpiar sesion, transcripcion y conexion de voz.

## Voz Local

El servicio `voice-agent/` captura microfono local, transcribe con `faster-whisper` y envia texto por WebSocket a la app.

Decision vigente:

- Modelo por defecto: `tiny`.
- Motivo: fue el unico modelo validado estable en esta maquina.
- `small` y `medium` quedan como experimentos futuros porque la descarga/cache de Hugging Face se bloqueo.
- No se guarda audio.
- Solo se envia texto transcrito al frontend.

## Diarizacion

No esta implementada. Para el MVP se mantiene etiquetado simple como `Cliente` para las frases entrantes por microfono. La diarizacion real queda como investigacion posterior por su complejidad, dependencias y riesgo de demo.

Opciones futuras:

- Simulacion controlada de hablante en UI.
- Dos fuentes de audio separadas: asesor y cliente.
- Procesamiento post-atencion con pyannote o servicio cloud.

## Riesgos Vigentes

- `node:sqlite` funciona pero Node lo marca experimental.
- El reconocimiento con `tiny` es rapido, pero menos preciso.
- Modelos `small` y `medium` pueden mejorar precision, pero no estan operativos localmente por bloqueo de descarga/cache.
- La demo debe conservar modo simulado como fallback principal.

## Comandos

App:

```powershell
cd prototype
npm run dev
```

Servicio de voz:

```powershell
cd voice-agent
.\.venv\Scripts\Activate.ps1
python main.py
```

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:8765/health
```
