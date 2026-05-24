# 0001. Usar Whisper Tiny Como Modelo STT Local Por Defecto

Fecha: 2026-05-24  
Estado: aceptada  
Contexto: experimento local de microfono para Serfinanza Action Hub

## Contexto

El prototipo necesita demostrar que el copiloto puede recibir transcripcion desde un microfono local y activar asistencia contextual para el asesor. Se probo `faster-whisper` con modelos `tiny`, `small` y `medium`.

`tiny` funciono correctamente y permitio detectar la frase "Quiero abrir un CDT" desde voz real. `small` y `medium` no llegaron a estar operativos porque la descarga/cache de Hugging Face quedo bloqueada o incompleta en esta maquina.

## Decision

Usar `tiny` como modelo STT local por defecto en `voice-agent/main.py`.

Mantener la variable `WHISPER_MODEL_SIZE` para permitir experimentos manuales con `small` o `medium`, sin hacerlos dependencia de la demo.

Actualizacion 2026-05-24: se descargaron y validaron modelos locales `base` y `small` en formato `faster-whisper`. El servicio puede resolverlos desde `voice-agent/models/`, pero el default sigue siendo `tiny`.

## Consecuencias

Positivas:

- Arranque rapido.
- Menor consumo de CPU/RAM.
- Menor riesgo de romper la demo.
- Ya fue validado localmente.

Negativas:

- Menor precision de transcripcion.
- Mas probabilidad de errores en ruido o frases largas.
- No resuelve diarizacion.

## Alternativas Consideradas

### `small`

Mejor balance teorico entre precision y latencia, pero no quedo operativo por bloqueo de descarga/cache.

### `medium`

Mejor precision esperada, pero demasiado pesado para el contexto local y fallo por cache incompleto.

### Servicio cloud STT

Mas robusto para produccion, pero aumenta configuracion, credenciales y dependencia de red. Queda fuera del experimento local inmediato.

## Diarizacion

No se implementa diarizacion en el MVP experimental. Para la demo se mantiene hablante por defecto `Cliente`.

Opciones futuras:

- Simulacion controlada de speaker en UI.
- Captura por dos dispositivos o canales.
- Diarizacion post-atencion con pyannote o servicio cloud.
