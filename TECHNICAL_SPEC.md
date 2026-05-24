# Technical Spec - Serfinanza Action Hub

Fecha: 2026-05-24  
Estado: listo para implementacion MVP  
Fuente funcional: `SERFINANZA_ACTION_HUB_SPEC.md` y `DEMO_SCRIPT.md`

## 1. Objetivo Tecnico

Construir un prototipo local de Serfinanza Action Hub que permita demostrar una atencion presencial simulada con copiloto contextual, persistencia local, dashboard de calidad, consola de brechas y reporte diario Markdown para marketing.

El prototipo debe priorizar estabilidad de demo sobre autonomia amplia.

## 2. Principios Tecnicos

1. La demo debe funcionar sin depender criticamente de internet.
2. Gemini debe ser opcional: mejora redaccion si hay API key, pero no bloquea el flujo.
3. La transcripcion de audio sera simulada visualmente.
4. SQLite local sera suficiente para eventos, sesiones, brechas y reportes.
5. Las respuestas principales deben estar controladas por reglas y datos semilla.
6. La UI debe mostrar producto real, no solo paginas de texto.
7. MCP queda fuera del MVP local.

## 3. Stack

- Runtime: Node.js 22.
- Framework: Next.js fullstack con App Router.
- Lenguaje: TypeScript.
- UI: Tailwind CSS con componentes propios inspirados en shadcn/ui.
- Iconos: `lucide-react`.
- Persistencia: SQLite local usando `node:sqlite`.
- IA opcional: Gemini por API REST si existe `GEMINI_API_KEY`.
- Ejecucion: local.

Nota: `node:sqlite` esta disponible en el entorno actual, aunque Node lo marca como experimental. Para hackathon es aceptable porque evita dependencias nativas de SQLite en Windows.

## 4. Ubicacion Del Prototipo

La aplicacion vive en:

`prototype/`

La raiz del workspace conserva solo documentos activos y carpetas de insumo/historial.

## 5. Vistas

### 5.1 `/`

Redirige o presenta acceso rapido a las cuatro vistas.

### 5.2 `/advisor`

Vista principal de demo: puesto del asesor.

Debe mostrar:

- asesor dummy;
- cliente dummy;
- sede;
- estado `Escuchando`;
- consentimiento informado;
- transcripcion simulada;
- tarjetas de preguntas detectadas;
- botones `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`;
- respuesta estructurada;
- acciones `Marcar resuelto`, `Reportar brecha`.

### 5.3 `/quality`

Panel supervisor/calidad.

Debe mostrar:

- KPIs operativos;
- filtros visuales por sede, asesor, tema, producto, canal y evento;
- temas con mas apoyo requerido;
- sedes con mas friccion;
- vista individual bajo filtro;
- recomendaciones de refuerzo.

### 5.4 `/admin`

Consola administrador.

Debe mostrar:

- cola de brechas;
- estado;
- prioridad por frecuencia;
- sede;
- asesor;
- tema;
- fuente;
- accion sugerida textual;
- transcripcion asociada cuando aplique.

Acciones:

- cambiar estado a `pendiente`;
- cambiar estado a `en_revision`;
- cambiar estado a `resuelta`.

### 5.5 `/marketing`

Reporte marketing.

Debe mostrar:

- oportunidades de contenido;
- estado contra indice web precargado;
- preview del reporte Markdown diario;
- boton para generar reporte local.

## 6. API Routes

### 6.1 `POST /api/session/start`

Crea una sesion de atencion.

Input:

```json
{
  "advisorId": "adv_001",
  "customerId": "cus_001",
  "officeId": "off_001"
}
```

Output:

```json
{
  "sessionId": "ses_001"
}
```

### 6.2 `POST /api/events`

Registra un evento operativo.

Eventos permitidos:

- `SESSION_STARTED`
- `CONSENT_NOTICE_SHOWN`
- `QUESTION_DETECTED`
- `BUTTON_SELECTED`
- `ANSWER_SHOWN`
- `RESOLVED`
- `GAP_CREATED`
- `GAP_STATUS_CHANGED`
- `MARKETING_OPPORTUNITY_CREATED`
- `DAILY_REPORT_GENERATED`

### 6.3 `POST /api/advisor/respond`

Devuelve respuesta estructurada para una pregunta detectada.

Input:

```json
{
  "sessionId": "ses_001",
  "intent": "ACTUALIZACION_DATOS",
  "question": "Puedo actualizar mi direccion y mis ingresos por WhatsApp?"
}
```

Output:

```json
{
  "summary": "...",
  "script": "...",
  "checklist": [],
  "recommendedChannel": "...",
  "requiredDocuments": [],
  "warnings": [],
  "nextBestAction": "...",
  "sources": []
}
```

### 6.4 `POST /api/gaps`

Crea una brecha.

### 6.5 `PATCH /api/gaps/:id`

Actualiza estado de brecha.

### 6.6 `GET /api/dashboard/quality`

Devuelve datos agregados para calidad.

### 6.7 `GET /api/marketing/opportunities`

Devuelve oportunidades de contenido.

### 6.8 `POST /api/marketing/report`

Genera reporte Markdown local.

## 7. SQLite

La base local sera:

`prototype/data/action-hub.sqlite`

### Tablas

#### `advisors`

- `id text primary key`
- `name text not null`
- `office_id text not null`
- `team text not null`
- `seniority text not null`

#### `offices`

- `id text primary key`
- `name text not null`
- `city text not null`
- `region text not null`

#### `customers_dummy`

- `id text primary key`
- `name text not null`
- `segment text not null`
- `active_products text not null`
- `preferred_channel text not null`
- `customer_since text not null`
- `commercial_propensity text not null`
- `risk_alerts text not null`
- `simulated_score integer`
- `simulated_eligibility text not null`

#### `attention_sessions`

- `id text primary key`
- `advisor_id text not null`
- `customer_id text not null`
- `office_id text not null`
- `started_at text not null`
- `ended_at text`
- `consent_notice_shown integer not null`
- `transcript_text text not null`

#### `interaction_events`

- `id text primary key`
- `session_id text not null`
- `timestamp text not null`
- `event_type text not null`
- `detected_intent text`
- `confidence_score real`
- `button_selected text`
- `source_ids text`
- `payload_json text`

#### `knowledge_gaps`

- `id text primary key`
- `session_id text not null`
- `advisor_id text not null`
- `office_id text not null`
- `intent text not null`
- `topic text not null`
- `question_text text not null`
- `source_ids text`
- `status text not null`
- `frequency_key text not null`
- `created_at text not null`

#### `marketing_opportunities`

- `id text primary key`
- `topic text not null`
- `frequency integer not null`
- `impact_score integer not null`
- `web_content_status text not null`
- `recommendation text not null`
- `sources text not null`
- `created_at text not null`

#### `daily_reports`

- `id text primary key`
- `report_type text not null`
- `date text not null`
- `file_path text not null`
- `created_at text not null`

## 8. Datos Semilla

### Asesor

- `adv_001`: Laura Martinez, Oficina Barranquilla Centro, Atencion presencial, asesora nueva.

### Cliente

- `cus_001`: Andres Perez, persona natural, tarjeta de credito, WhatsApp, score simulado, alertas para cambios laborales.

### Sede

- `off_001`: Oficina Barranquilla Centro.

### Intenciones Demo

- `ACTUALIZACION_DATOS`
- `CDT`

### Fuentes Semilla

- `02_actualizacion_datos_procesos.pdf`
- `03_cdt_caracteristicas_beneficios.pdf`
- indice web precargado simulado.

## 9. Motor De Respuesta

El motor opera en este orden:

1. Detecta intencion desde el evento simulado.
2. Carga fuentes permitidas para esa intencion.
3. Aplica respuesta deterministica del caso demo.
4. Si hay `GEMINI_API_KEY`, puede mejorar redaccion del guion o reporte.
5. Valida que la respuesta tenga fuente.
6. Si no hay fuente suficiente, recomienda escalar y crear brecha.

## 10. Gemini Opcional

Variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` opcional

Uso permitido:

- mejorar guion del asesor;
- resumir patrones;
- generar brief Markdown.

Uso no permitido:

- decidir elegibilidad;
- reemplazar fuentes;
- inventar tasas o requisitos;
- saltarse fallback deterministico.

## 11. Reporte Markdown

Ruta de salida:

`prototype/generated/reports/marketing-YYYY-MM-DD.md`

Debe incluir:

- metadata;
- resumen ejecutivo;
- patrones detectados;
- oportunidades priorizadas;
- evidencia agregada;
- comparacion contra indice web;
- brief por oportunidad;
- fuentes;
- instrucciones de revision humana;
- tareas sugeridas.

## 12. Criterios Tecnicos De Aceptacion

La implementacion tecnica minima cumple si:

1. `npm run dev` levanta la app local.
2. `/advisor` reproduce el flujo de transcripcion simulada.
3. Los cuatro botones registran eventos.
4. `Ver respuesta` muestra respuesta estructurada.
5. `Reportar brecha` crea registro visible en `/admin`.
6. `/quality` muestra agregados por sede, asesor, tema y evento.
7. `/marketing` muestra oportunidades y genera Markdown.
8. La app funciona sin `GEMINI_API_KEY`.
9. Si `GEMINI_API_KEY` existe, mejora textos sin romper fallback.
10. No hay dependencias de despliegue cloud ni MCP.

