# Build Plan - Serfinanza Action Hub

Fecha: 2026-05-24  
Objetivo: construir un MVP local demostrable en hackathon.

## 1. Prioridad De Construccion

La demo debe probar una historia, no cubrir todo el banco. El orden correcto es:

1. Puesto del asesor.
2. Registro de eventos y brecha.
3. Dashboard calidad.
4. Consola administrador.
5. Reporte marketing.
6. Gemini opcional.

No se debe empezar por audio real, despliegue cloud, MCP ni crawling web en vivo.

## 2. Must Have

Debe funcionar para considerar la demo presentable:

- App local Next.js.
- Vista `/advisor`.
- Transcripcion simulada.
- Deteccion de preguntas predefinidas.
- Tarjetas con `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`.
- Respuesta estructurada para actualizacion de datos.
- Respuesta estructurada para CDT.
- `Reportar brecha` crea una brecha.
- `/quality` muestra metricas agregadas.
- `/admin` muestra brechas.
- `/marketing` muestra oportunidades y preview Markdown.
- Persistencia SQLite local.
- Fallback sin Gemini.

## 3. Should Have

Importante, pero no bloqueante:

- Generacion real de archivo Markdown.
- Cambio de estado de brecha.
- Filtros visuales en dashboard.
- Datos dummy avanzados visibles.
- Indicadores de fuente y confianza.
- Uso de Gemini para mejorar redaccion si hay API key.

## 4. Could Have

Solo si sobra tiempo:

- Microfono real experimental.
- Exportar reporte como descarga.
- Mas casos de uso: app, extracto, tarjeta.
- Animacion de transcripcion mas natural.
- Comparacion mas rica contra indice web.

## 5. No Construir En MVP

- Despliegue cloud.
- MCP.
- Autenticacion real.
- Audio real obligatorio.
- Integraciones con correo.
- Consulta a core bancario.
- Pagos o apertura real de productos.
- Recomendacion financiera definitiva.

## 6. Tareas

### Fase 1 - Scaffold

- Crear app en `prototype/`.
- Configurar Next.js, TypeScript, Tailwind.
- Crear layout base y navegacion entre vistas.
- Crear estilos base.

Resultado esperado:

- `npm run dev` levanta una app navegable.

### Fase 2 - Datos Y Persistencia

- Crear modulo SQLite con `node:sqlite`.
- Crear schema.
- Crear seed de asesores, sedes, cliente dummy, eventos demo y fuentes.
- Crear helpers de lectura/escritura.

Resultado esperado:

- La app puede leer datos dummy y registrar eventos.

### Fase 3 - Puesto Del Asesor

- Implementar transcripcion simulada.
- Detectar eventos predefinidos en la conversacion.
- Mostrar tarjeta de asistencia.
- Implementar botones.
- Mostrar respuesta estructurada.
- Registrar `Marcar resuelto` y `Reportar brecha`.

Resultado esperado:

- Se puede ejecutar la escena de actualizacion de datos y CDT.

### Fase 4 - Calidad

- Agregar API de agregados.
- Crear KPIs.
- Crear tablas/listas por sede, asesor, tema y evento.
- Mostrar recomendaciones de refuerzo.

Resultado esperado:

- `/quality` demuestra aprendizaje operacional.

### Fase 5 - Administrador

- Crear cola de brechas.
- Ver detalle.
- Cambiar estado.
- Mostrar accion sugerida textual.

Resultado esperado:

- La brecha reportada aparece y se puede gestionar.

### Fase 6 - Marketing

- Crear oportunidades de contenido demo.
- Comparar contra indice web precargado simulado.
- Generar preview Markdown.
- Guardar archivo en `generated/reports`.

Resultado esperado:

- `/marketing` demuestra ciclo hacia contenido.

### Fase 7 - Gemini Opcional

- Crear helper Gemini por fetch.
- Usar solo si `GEMINI_API_KEY` existe.
- Mantener fallback deterministico.

Resultado esperado:

- La app funciona con o sin API key.

## 7. Riesgos Y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| La demo parece demasiado simulada | Mostrar eventos, persistencia y dashboard conectado |
| Se percibe como vigilancia punitiva | Enfatizar coaching, brechas y mejora de entrenamiento |
| Privacidad por transcripcion completa | Mostrar acceso restringido y no exponer transcripciones a marketing |
| Gemini falla | Fallback deterministico |
| SQLite experimental | Mantener queries simples y datos demo |
| Dashboard parece vanity metrics | Mostrar apoyo requerido, brechas, sedes, temas y acciones sugeridas |

## 8. Definition Of Done

- La demo sigue `DEMO_SCRIPT.md`.
- La app corre local.
- No depende de red para el flujo principal.
- Las vistas principales estan enlazadas.
- Al menos una brecha creada desde `/advisor` aparece en `/admin`.
- Al menos una oportunidad aparece en `/marketing`.
- El reporte Markdown se puede generar o previsualizar.
- El pitch puede ejecutarse en menos de 5 minutos.

