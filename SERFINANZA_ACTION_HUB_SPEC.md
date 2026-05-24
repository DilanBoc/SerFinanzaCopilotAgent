# Serfinanza Action Hub - Especificacion Unificada

Fecha de consolidacion: 2026-05-23  
Metodo: Specs-Driven Development  
Estado: MVP de hackathon  
Version: canal presencial con copiloto contextual

## 1. Decision Estrategica

Serfinanza Action Hub sera un copiloto contextual para atencion presencial en oficina. El sistema acompana la conversacion entre cliente y asesor, detecta preguntas bancarias relevantes, ofrece asistencia estructurada cuando el asesor la necesita y convierte esas interacciones en inteligencia para calidad, entrenamiento y marketing.

El MVP no compite como chatbot generico, agente autonomo de pagos ni plataforma completa de banca agentica. Compite como:

> Copiloto contextual para asesores de oficina + sistema de inteligencia de brechas de conocimiento.

## 2. Outcome Principal

Aumentar la resolucion operativa en primer contacto para asesores de oficina, convirtiendo conversaciones presenciales en respuestas trazables, checklists y siguientes mejores acciones basadas en conocimiento aprobado.

## 3. Canal Principal Y Omnicanalidad

El canal principal del MVP es la oficina presencial.

Escenario base:

1. El cliente llega a una oficina.
2. El asesor inicia la atencion.
3. El puesto fisico informa que la conversacion puede ser transcrita para fines de calidad y mejora del servicio.
4. El sistema muestra estado de escucha en la pantalla del asesor.
5. La conversacion se transcribe de forma visual durante la demo.
6. Cuando el sistema detecta una pregunta bancaria, muestra una tarjeta discreta de asistencia.

La omnicanalidad se mantiene como vision y como dimension de analitica futura. El dashboard puede modelar sedes y canales, pero la demo principal ocurre en oficina.

## 4. Modo De Captura En Demo

La demo usara un modo hibrido visual:

- La UI mostrara estado de microfono `Escuchando`.
- La transcripcion avanzara como si fuera en vivo.
- La conversacion principal sera simulada y controlada para estabilidad.
- El microfono real queda como extra opcional, no como dependencia critica.

Esta decision evita que ruido, permisos, latencia o errores de speech-to-text rompan la demo.

## 5. Consentimiento Y Privacidad

Para el MVP se asume aviso fisico en el puesto del asesor:

> Esta atencion puede ser transcrita para fines de calidad, entrenamiento y mejora del servicio.

La interfaz del asesor mostrara el estado:

`Consentimiento informado por aviso de atencion`

El MVP guarda la transcripcion completa de la atencion, pero el acceso queda restringido:

- Asesor: ve asistencia en tiempo real, no consulta historico completo.
- Supervisor/calidad: ve reportes agregados.
- Administrador: puede revisar transcripciones completas asociadas a brechas o auditoria.

Nota critica: en produccion real, esta decision requeriria validacion legal, tratamiento de datos personales, politicas de retencion, seguridad y consentimiento formal. Para hackathon se modela como flujo controlado.

## 6. Usuarios Y Roles

### 6.1 Asesor De Oficina

Usuario principal.

Necesita:

- Atender al cliente sin interrumpir la conversacion.
- Recibir apoyo solo cuando lo necesita.
- Obtener guion, checklist, canal, documentos, fuente y siguiente accion.
- Confirmar si sabe responder, si necesita ayuda, si debe escalar o si la deteccion no aplica.

### 6.2 Supervisor / Calidad

Usuario secundario.

Necesita:

- Ver reportes agregados por sede, asesor, tema, producto, canal y fecha.
- Identificar temas donde los asesores necesitan refuerzo.
- Ver tendencias de uso del copiloto y fricciones operativas.
- No gestionar brechas directamente en el MVP.

### 6.3 Administrador Del Sistema

Responsable de revisar brechas.

Necesita:

- Ver cola de brechas.
- Revisar transcripciones asociadas cuando aplique.
- Cambiar estado de brecha: `pendiente`, `en revision`, `resuelta`.
- Ver accion sugerida por el sistema, sin registrar derivacion estructurada.

### 6.4 Marketing / Contenido

Beneficiario de una seccion dentro del dashboard y de un reporte diario Markdown.

Necesita:

- Identificar oportunidades de contenido.
- Revisar consultas frecuentes sin acceder a transcripciones completas.
- Recibir briefs accionables con evidencia agregada, fuentes e instrucciones de implementacion.

## 7. Propuesta De Valor

Para asesores:

- Asistencia contextual en tiempo real sin obligar a escribir preguntas.
- Respuestas estructuradas con fuente y siguiente accion.
- Menor dependencia de memoria.
- Menor riesgo de respuestas inconsistentes.

Para calidad y entrenamiento:

- Deteccion de temas donde asesores piden apoyo.
- Vista por sede, asesor, equipo, tema y producto.
- Recomendaciones de refuerzo por patrones reales.

Para marketing:

- Oportunidades de contenido basadas en consultas reales.
- Comparacion contra indice web precargado.
- Reporte diario en Markdown claro para humanos y modelos de IA.

## 8. Alcance MVP

### Incluye

- Vista `Puesto del asesor`.
- Vista `Panel supervisor/calidad`.
- Vista `Consola administrador`.
- Vista `Reporte marketing`.
- Demo de atencion presencial con transcripcion simulada.
- Tarjetas de deteccion de pregunta.
- Botones: `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`.
- Respuesta estructurada despues de `Ver respuesta`.
- Acciones posteriores: `Marcar resuelto`, `Reportar brecha`.
- Dashboard operacional con filtros.
- Cola de brechas simple.
- Reporte diario Markdown para marketing.
- SQLite local.
- Datos dummy avanzados de cliente, asesor, sede y segmento.
- IA hibrida con fallback deterministico y Gemini opcional.

### No Incluye

- Despliegue cloud.
- MCP en el MVP.
- Audio real como dependencia obligatoria.
- Pagos agenticos.
- Apertura real de productos.
- Autenticacion bancaria real.
- Consulta de core bancario.
- Recomendaciones financieras definitivas.
- Envio real de correo.
- Transcripciones completas para marketing.

## 9. Flujo Principal De Atencion

1. Asesor inicia atencion presencial.
2. UI muestra cliente dummy, sede, asesor y estado `Escuchando`.
3. Transcripcion simulada avanza durante la conversacion.
4. Sistema detecta una pregunta bancaria.
5. Aparece tarjeta con:
   - intencion detectada;
   - confianza;
   - fragmento de pregunta;
   - botones `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`.
6. Asesor decide.
7. El sistema registra evento.
8. Si el asesor toca `Ver respuesta`, se muestra respuesta estructurada.
9. Asesor puede `Marcar resuelto` o `Reportar brecha`.
10. Los eventos alimentan dashboard, brechas y reporte de marketing.

## 10. Eventos De La Tarjeta De Asistencia

### `Lo se`

El asesor confirma que puede resolver sin apoyo.

Uso analitico:

- Consulta conocida.
- Tema posiblemente dominado.
- Sirve para comparar contra temas donde se pidio ayuda.

### `Ver respuesta`

El asesor necesita apoyo del copiloto.

Uso analitico:

- Senal de necesidad de soporte.
- Alimenta recomendaciones de refuerzo por asesor, sede, tema y producto.

### `Escalar`

El asesor identifica riesgo operacional, falta de fuente, caso excepcional o necesidad de validacion.

Uso analitico:

- Senal de riesgo operacional.
- No implica automaticamente brecha, pero puede relacionarse con temas de alta friccion.

### `Ignorar`

La deteccion no era relevante.

Uso analitico:

- Falso positivo del detector.
- Sirve para mejorar precision de deteccion.

## 11. Respuesta Estructurada

Cuando el asesor toca `Ver respuesta`, el sistema muestra:

- Guion sugerido para responder al cliente.
- Checklist operativo.
- Canal recomendado.
- Documentos requeridos.
- Fuente consultada.
- Advertencias.
- Siguiente mejor accion.

Acciones posteriores:

- `Marcar resuelto`: el asesor uso la respuesta y cerro la consulta.
- `Reportar brecha`: la respuesta no fue suficiente, falta fuente o se detecta necesidad de entrenamiento/contenido.

## 12. Brechas De Conocimiento

Cuando el asesor toca `Reportar brecha`, el sistema registra la consulta como brecha de conocimiento.

Metadatos minimos:

- asesor;
- sede;
- canal;
- tema;
- intencion;
- pregunta detectada;
- fuente usada;
- transcripcion asociada;
- timestamp.

La brecha queda en cola para revision del administrador.

Estados permitidos:

- `pendiente`;
- `en revision`;
- `resuelta`.

No se registra derivacion estructurada. El sistema puede mostrar una accion sugerida textual, por ejemplo:

- reforzar entrenamiento;
- revisar proceso;
- mejorar contenido;
- validar fuente.

## 13. Dashboard Supervisor / Calidad

El dashboard sera operacional.

Debe incluir filtros por:

- sede;
- asesor;
- tema;
- producto;
- canal;
- fecha;
- tipo de evento: `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`.

Debe mostrar:

- uso del copiloto por sede;
- temas donde mas se pidio apoyo;
- temas dominados vs temas con apoyo requerido;
- asesores con mayor necesidad de refuerzo;
- vista individual bajo filtro;
- recomendaciones de refuerzo por asesor, sede y equipo.

La vista general debe ser agregada. El detalle individual aparece solo al filtrar por asesor.

## 14. Administracion De Brechas

La consola de administrador sera una cola operativa simple.

Debe mostrar:

- brechas pendientes;
- estado;
- prioridad por frecuencia;
- sede;
- asesor;
- tema;
- fuente asociada;
- accion sugerida textual;
- acceso a transcripcion asociada cuando aplique.

Acciones del administrador:

- cambiar estado a `pendiente`;
- cambiar estado a `en revision`;
- cambiar estado a `resuelta`.

## 15. Marketing Y Reporte Diario

Marketing no tendra modulo independiente amplio. Tendra una seccion dentro del dashboard y un reporte diario Markdown.

El sistema compara consultas frecuentes y brechas contra un indice web precargado del sitio del banco.

Clasificacion de oportunidad:

- contenido existente;
- contenido incompleto;
- contenido ausente;
- posible actualizacion requerida.

Priorizacion:

- frecuencia;
- impacto en adquisicion;
- severidad de brecha;
- ausencia o incompletitud en web.

Marketing no recibe transcripciones. Recibe evidencia agregada.

## 16. Reporte Diario Markdown Para Marketing

El agente genera al final del dia un archivo Markdown legible para humanos y modelos de IA.

Debe incluir:

1. Metadata del reporte.
2. Resumen ejecutivo.
3. Patrones detectados.
4. Oportunidades priorizadas.
5. Evidencia agregada.
6. Comparacion contra indice web.
7. Brief accionable por oportunidad.
8. Fuentes consultadas.
9. Instrucciones de revision humana.
10. Tareas sugeridas.

No debe incluir transcripciones completas.

Cada brief debe incluir:

- tema;
- evidencia de consultas;
- segmento/canal/sede;
- estado del contenido web;
- oportunidad detectada;
- propuesta de FAQ, guia o mejora de pagina;
- instrucciones de implementacion;
- fuentes usadas;
- nota de revision humana requerida.

## 17. Personalizacion Avanzada Con Datos Dummy

El MVP usara datos dummy para personalizacion avanzada.

Datos dummy:

- cliente;
- asesor;
- sede;
- productos activos;
- segmento comercial;
- historial de consultas;
- intencion previa;
- score interno simulado;
- elegibilidad simulada;
- alertas de riesgo;
- canal preferido;
- antiguedad del cliente;
- propension comercial.

Uso permitido:

- ajustar guion;
- ajustar CTA;
- mostrar alertas;
- personalizar siguiente mejor accion.

Uso no permitido:

- aprobar productos;
- negar productos;
- tomar decisiones financieras definitivas;
- reemplazar validacion oficial.

## 18. Fuentes De Conocimiento

### 18.1 Documentos Locales

- `DocumentoSERFINANZA/02_actualizacion_datos_procesos.pdf`
- `DocumentoSERFINANZA/03_cdt_caracteristicas_beneficios.pdf`
- `DocumentoSERFINANZA/04_registro_app_serfinanza.pdf`
- `DocumentoSERFINANZA/05_extracto_credito_canales.pdf`
- `DocumentoSERFINANZA/01_tarjeta_credito_beneficios.pdf`

### 18.2 Indice Web Precargado

Se usara snapshot/index local de paginas relevantes de `https://bancoserfinanza.com/`.

Prioridad:

1. Actualizacion de datos.
2. Canales de atencion.
3. Preguntas frecuentes.
4. CDT y CDT Digital.
5. CliCuenta.
6. Tarjeta de credito.
7. Tasas y tarifas.
8. Canales de pago, PSE y Serfinanza Virtual.

No se hara crawling en vivo durante la demo.

## 19. Jerarquia De Fuentes

Si hay conflicto entre PDF del reto y web publica, manda el PDF del reto.

La web puede complementar si no contradice el PDF.

Si no hay informacion suficiente en PDF ni web:

1. El sistema no responde de fondo.
2. Recomienda escalar.
3. Registra brecha automaticamente.

## 20. IA Y Modo De Ejecucion

El MVP usara modo hibrido:

- reglas/datos controlados para deteccion y estructura;
- respuestas deterministicas para estabilidad;
- Gemini via API key para mejorar redaccion, resumen y briefs si esta disponible;
- fallback deterministico si Gemini falla o no esta configurado.

La demo no debe depender criticamente de la API.

## 21. Arquitectura Tecnica MVP

- App local: Next.js fullstack.
- Lenguaje: TypeScript.
- UI: Tailwind CSS + shadcn/ui.
- Base de datos: SQLite local.
- Datos: PDFs, indice web precargado, perfiles dummy.
- Despliegue: local.
- MCP: fuera del MVP. Solo se considerara si en una fase futura se usan servicios online como Supabase, Vercel, Railway u otras herramientas externas.

## 22. Eventos En SQLite

Se guardaran eventos operativos completos:

- inicio de atencion;
- consentimiento informado por aviso;
- pregunta detectada;
- intencion;
- confianza;
- boton elegido;
- respuesta mostrada;
- fuente usada;
- brecha creada;
- estado de brecha;
- oportunidad de marketing;
- reporte diario generado.

Aunque se guarda transcripcion completa, no se define como evento analitico principal para dashboard ni se expone a marketing.

## 23. Modelo De Datos MVP

### 23.1 `advisors`

- `id`
- `name`
- `office_id`
- `team`
- `seniority`

### 23.2 `offices`

- `id`
- `name`
- `city`
- `region`

### 23.3 `customers_dummy`

- `id`
- `name`
- `segment`
- `active_products`
- `preferred_channel`
- `customer_since`
- `commercial_propensity`
- `risk_alerts`
- `simulated_score`
- `simulated_eligibility`

### 23.4 `attention_sessions`

- `id`
- `advisor_id`
- `customer_id`
- `office_id`
- `started_at`
- `ended_at`
- `consent_notice_shown`
- `transcript_text`

### 23.5 `interaction_events`

- `id`
- `session_id`
- `timestamp`
- `event_type`
- `detected_intent`
- `confidence_score`
- `button_selected`
- `source_ids`
- `payload_json`

### 23.6 `knowledge_gaps`

- `id`
- `session_id`
- `advisor_id`
- `office_id`
- `intent`
- `topic`
- `question_text`
- `source_ids`
- `status`
- `frequency_key`
- `created_at`

### 23.7 `marketing_opportunities`

- `id`
- `topic`
- `frequency`
- `impact_score`
- `web_content_status`
- `recommendation`
- `sources`
- `created_at`

### 23.8 `daily_reports`

- `id`
- `report_type`
- `date`
- `file_path`
- `created_at`

## 24. Vistas Del MVP

### 24.1 Puesto Del Asesor

Elementos:

- estado de escucha;
- aviso de consentimiento informado;
- datos dummy del cliente;
- transcripcion en vivo simulada;
- tarjetas de pregunta detectada;
- respuesta estructurada;
- acciones `Marcar resuelto` y `Reportar brecha`.

### 24.2 Panel Supervisor / Calidad

Elementos:

- KPIs operativos;
- filtros;
- temas con mayor apoyo requerido;
- sedes con mayor friccion;
- vista individual bajo filtro;
- recomendaciones de refuerzo.

### 24.3 Consola Administrador

Elementos:

- cola de brechas;
- estados simples;
- prioridad por frecuencia;
- detalle de brecha;
- transcripcion asociada;
- accion sugerida textual.

### 24.4 Reporte Marketing

Elementos:

- oportunidades de contenido;
- estado contra indice web;
- vista previa del reporte Markdown diario;
- generacion simulada del archivo.

## 25. Casos De Demo

### 25.1 Actualizacion De Datos

Cliente pregunta:

> Puedo actualizar mi direccion y mis ingresos por WhatsApp?

El sistema detecta `ACTUALIZACION_DATOS`, muestra tarjeta y permite al asesor pedir apoyo.

Respuesta debe incluir:

- guion sugerido;
- distincion entre tipos de dato;
- canal recomendado;
- documentos si aplica;
- fuente;
- advertencia o escalamiento si no hay certeza.

### 25.2 CDT / Inversion

Cliente pregunta:

> Tengo 5 millones, que opcion tengo para invertirlos?

El sistema detecta `CDT`, usa datos dummy, fuentes y reglas suaves.

Respuesta debe:

- presentar CDT como opcion informativa, no recomendacion definitiva;
- mencionar monto detectado;
- sugerir simulacion o asesoria;
- advertir que tasas y condiciones pueden variar;
- registrar oportunidad de adquisicion.

### 25.3 Brecha Y Dashboard

El asesor reporta una brecha.

El sistema:

- la registra;
- la muestra en cola de administrador;
- alimenta dashboard de calidad;
- puede contribuir a oportunidad de marketing.

### 25.4 Reporte Diario Marketing

La vista marketing muestra un reporte Markdown generado con oportunidades priorizadas, evidencia agregada e instrucciones de revision humana.

## 26. Criterios De Aceptacion De Demo

La demo se considera exitosa si demuestra:

1. Atencion presencial simulada.
2. Deteccion contextual de preguntas.
3. Decision del asesor con `Lo se`, `Ver respuesta`, `Escalar`, `Ignorar`.
4. Respuesta estructurada despues de `Ver respuesta`.
5. Registro de brecha desde `Reportar brecha`.
6. Dashboard por sede, asesor, tema y producto.
7. Oportunidad de marketing basada en evidencia agregada.
8. Reporte Markdown diario para marketing.
9. Uso de datos dummy para personalizacion avanzada con reglas suaves.
10. Funcionamiento local con SQLite y fallback deterministico.

## 27. Pitch Recomendado

Serfinanza Action Hub es un copiloto contextual para asesores de oficina. Mientras el asesor atiende al cliente, el sistema escucha la conversacion con aviso visible, detecta preguntas bancarias y ofrece apoyo estructurado solo cuando el asesor lo necesita.

Cada clic del asesor genera inteligencia: si sabe responder, si necesita apoyo, si debe escalar o si la deteccion no aplica. Esa data permite a calidad identificar brechas por sede, asesor y tema; al administrador revisar vacios de conocimiento; y a marketing recibir un reporte diario con oportunidades de contenido basadas en consultas reales.

No estamos construyendo otro chatbot. Estamos convirtiendo la atencion presencial en un sistema de aprendizaje operativo para mejorar servicio, entrenamiento y adquisicion.

