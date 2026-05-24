# Hallazgos Estrategicos y Recomendaciones de Producto
**Proyecto:** Serfinanza Action Hub
**Fecha de Revision:** 23 de mayo de 2026
**Enfoque Metodologico:** Lean Product Management & Specs-Driven Development

---

## 1. Diagnostico General: Posicionamiento y Fortaleza

El proyecto "Serfinanza Action Hub" tiene una base estrategica solida. El mayor acierto documentado es el pivot desde la idea generica de un "chatbot 360 para clientes" hacia un **"Copiloto Operativo para Asesores de Primera Linea"**. 

Este enfoque (descrito en `PUNTO_DE_VISTA_NICHO.md`) resuelve el problema del "Valley of Death" de los prototipos de IA: en lugar de frustrar al cliente final con respuestas limitadas, se empodera al empleado interno, reduciendo el THT (Time to Handle Transaction) y mejorando la consistencia de la informacion.

**Decision de Alcance (Scope Update):** Se ha decidido **descartar el modulo de pagos agenticos** para el MVP de esta hackathon. Esta es una decision Lean acertada. Intentar demostrar infraestructura de pagos delegados (tokens, mandatos, integraciones core) diluiria el foco central del producto: la resolucion operativa basada en el conocimiento bancario documental. El enfoque estricto sera: **Atencion (Asesor) + Inteligencia de Conocimiento (Marketing/Operaciones)**.

---

## 2. Hallazgos Criticos por Area

### 2.1. Narrativa de Producto (Product Spec)

*   **Hallazgo:** La "Siguiente Mejor Accion" (Next Best Action - NBA) es el diferenciador principal propuesto. Sin embargo, en la narrativa actual, la NBA se asume frecuentemente como una accion directa del cliente (ej. "el cliente simula el CDT").
*   **Riesgo:** Si el foco es el asesor, la narrativa debe alinearse. Que el cliente simule el CDT es autoservicio estandar.
*   **Recomendacion (Actionable):** Redefinir la NBA como una **"Venta/Resolucion Asistida"**. La NBA es para el asesor. 
    *   *Ejemplo CDT:* La NBA no es "decirle al cliente que vaya a la web". La NBA es que el sistema le de al asesor el link exacto pre-configurado para que se lo envie al cliente por WhatsApp, o le de el "pitch" exacto basado en el monto que menciono el cliente.

### 2.2. Definicion Funcional (Functional Spec)

*   **Hallazgo:** Los flujos (Ej. "Asesor Actualiza Datos") estan bien descritos a nivel de experiencia conversacional, pero carecen de definicion estructural de datos subyacente. El sistema parece un "wrapper" que genera texto, no un sistema de decisiones.
*   **Riesgo:** En una evaluacion tecnica, parecer un simple "prompt a un LLM" reduce el valor percibido frente a la construccion de una plataforma real.
*   **Recomendacion (Actionable):** Implementar **Estructuras de Datos Deterministicas**. El LLM debe usarse para clasificacion e interpretacion, pero la salida ("La Siguiente Mejor Accion") debe ser un objeto JSON estructurado que la UI renderiza, no un parrafo libre.
    *   *Estructura Sugerida:* Todo output debe contener: `intent_id`, `confidence_score`, `required_documents[]`, `escalation_flag` (boolean), y `source_document_id`.

### 2.3. Knowledge Intelligence (Dashboard y Metricas)

*   **Hallazgo:** Se propone un dashboard para medir interacciones, intenciones y vacios de conocimiento. Es un concepto fuerte ("Knowledge-to-Growth"), pero la metrica de "Preguntas sin respuesta" es pasiva.
*   **Riesgo:** El dashboard puede verse como simple reporteria historica sin accionabilidad.
*   **Recomendacion (Actionable):** Transformar el dashboard en una **"Consola de Friccion Activa" (Knowledge Gap as a Service)**.
    *   El dashboard no solo lista "Preguntas fallidas". Debe agruparlas e incluir un Call to Action para el equipo de Marketing/Operaciones: `[Generar Draft de FAQ para este Vacio]`. Esto demuestra un ciclo cerrado: El asesor no encuentra la respuesta -> El sistema lo registra -> Marketing crea el contenido basado en demanda real -> El asesor resuelve mejor la proxima vez.

---

## 3. Plan de Accion Tecnico para el MVP (Next.js / SQLite)

Para materializar estas recomendaciones en el prototipo funcional, el desarrollo debe enfocarse en los siguientes entregables tecnicos:

### 3.1. Esquema de Base de Datos Core (SQLite)

El valor del MVP reside en la trazabilidad, no solo en la conversacion. La BD debe soportar el dashboard.

1.  **Tabla `Interactions`:**
    *   `id`, `timestamp`, `role` (asesor/cliente), `query_text`, `intent_detected`, `confidence_score`, `nba_generated` (string JSON), `was_escalated` (boolean).
2.  **Tabla `Knowledge_Sources`:**
    *   `id`, `document_name` (ej. '01_tarjeta_credito_beneficios.pdf'), `valid_until` (fecha simulada para alertas de vigencia), `product_category`.
3.  **Tabla `Knowledge_Gaps` (Para el Dashboard):**
    *   `id`, `unresolved_query`, `frequency`, `status` (pending/draft_generated/resolved).

### 3.2. Implementacion de RAG (Retrieval-Augmented Generation) Acotado

*   **Restriccion:** No indexar documentos completos sin contexto. El RAG en el MVP debe ser deterministico para evitar alucinaciones operativas.
*   **Accion:** Mapear metadatos estrictos. Si el LLM detecta la intencion `[ACTUALIZACION_DATOS]`, la busqueda vectorial o semantica **solo** debe ejecutarse contra el documento `02_actualizacion_datos_procesos.pdf`. 
*   **Output de Confianza:** Si la respuesta no se encuentra en el documento asignado, el sistema DEBE forzar la respuesta: *"Informacion no encontrada en la base documental vigente. [Generando alerta de vacio de conocimiento]. Siguiente Accion: Escalar a supervisor."* Esto demuestra madurez de producto, un bot que sabe decir "no se" es mas valioso en banca que uno que alucina.

### 3.3. Experiencia de Usuario (UI/UX) Diferenciada

Para la demostracion, es vital separar visualmente los roles para el jurado:

*   **Modo Asesor (Dark Mode o UI Densa):** Panel izquierdo con el chat, panel derecho con el "Checklist Operativo" estructurado (Documentos requeridos, canal, limite de autoridad).
*   **Modo Cliente (Opcional si hay tiempo - Mobile UI):** Interfaz limpia tipo WhatsApp/App, enfocada solo en la respuesta resumida y el CTA final.
*   **Modo Consola (Knowledge Intelligence):** Dashboard administrativo centrado en los "Knowledge Gaps" accionables.

---

## 4. Estructura Recomendada para el Pitch (5 Minutos)

Al haber descartado el complejo tema de pagos agenticos, la historia es mucho mas limpia y contundente:

1.  **El Dolor (1 min):** "El conocimiento bancario esta en PDFs muertos. Los asesores dependen de su memoria, generan inconsistencias (riesgo) y hacen esperar al cliente. Un chatbot generico para el cliente solo genera frustracion."
2.  **El Pivot (1 min):** "Presentamos Serfinanza Action Hub: Un copiloto operativo para asesores de primera linea. No damos respuestas al aire, generamos la *Siguiente Mejor Accion* estructurada y basada estrictamente en documentos aprobados."
3.  **La Demo (2 min):**
    *   Mostrar el caso de Actualizacion de Datos (Asesor recibe el checklist exacto).
    *   Mostrar el "Escalamiento" (El asesor pregunta algo que no esta, el bot se detiene y lo marca).
    *   Mostrar el Dashboard (Marketing ve ese "vacio" y puede generar contenido nuevo al instante).
4.  **El Impacto de Negocio (1 min):** "Reduccion del tiempo de atencion, cero alucinaciones operativas, y un ciclo de mejora continua impulsado por datos reales de friccion. El conocimiento se vuelve crecimiento."