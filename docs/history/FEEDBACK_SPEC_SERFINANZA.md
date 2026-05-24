# Feedback Estratégico y Funcional - Serfinanza Action Hub Spec

**De:** Senior Product Manager
**Para:** Equipo de Producto / Tech Lead
**Fecha:** 23 de mayo de 2026
**Documento Analizado:** `@SERFINANZA_ACTION_HUB_SPEC.md`

---

## 0. Evaluación General (Lo Bueno)
La especificación ha dado un salto de madurez impresionante. La definición del **Output Estructurado (JSON)** (Sección 13) es exactamente lo que se espera en Specs-Driven Development: transforma un "bot charlatán" en un motor de decisiones integrables. El descarte de pagos agénticos limpia el MVP y asegura viabilidad técnica.

Sin embargo, para que el equipo de desarrollo pueda codificar esto sin ambigüedades, he detectado **vacíos funcionales y lógicos** que debemos discutir y cerrar. No asumiré nada; te planteo las críticas y las preguntas para que lo definamos juntos.

---

## 1. Críticas Funcionales: Los "Cómo" que faltan

### 1.1. El Ruteo del "RAG Acotado" (Sección 12)
Mencionas que el sistema clasifica la intención y luego consulta fuentes permitidas. 
*   **La Crítica:** A nivel técnico, ¿cómo sabe el sistema qué documento corresponde a qué intención? Si dejamos esto abierto, los devs podrían sobre-ingeniar una base de datos vectorial compleja.
*   **Para Discutir:** Para el MVP, ¿podemos acordar un **mapeo estricto o *hardcoded*** en la configuración? (Ej. `if intent == 'ACTUALIZACION_DATOS' -> search_only('02_actualizacion_datos_procesos.pdf')`). ¿O necesitas que esto sea dinámico desde la tabla `knowledge_sources` mediante el campo `intent_scope`?

### 1.2. La Experiencia del "Escalamiento" (Sección 13 y 14.1)
El JSON devuelve `"escalation_flag": true` y `"escalation_reason"`.
*   **La Crítica:** Operativamente, un escalamiento no es solo un aviso visual. ¿Qué debe hacer el front-end cuando lee ese `true`? Si solo ponemos un texto en rojo que diga "Escalar", el flujo operativo muere ahí.
*   **Para Discutir:** ¿Debería la UI renderizar un botón que diga **"Generar Draft de Ticket / Escalar a Nivel 2"**? Aunque en el MVP ese botón no envíe un correo real, debe *parecer* que el asesor tiene un mecanismo para ejecutar ese escalamiento. ¿Cómo te imaginas esa interacción en la pantalla?

### 1.3. Gatillos del "Knowledge Gap" (Sección 15 y 17.3)
El dashboard se alimenta de la tabla `knowledge_gaps`.
*   **La Crítica:** ¿Cuándo y cómo se inserta un registro en esta tabla? ¿Es una decisión puramente sistémica (Ej. el motor falla la búsqueda o el `confidence_score` < 0.7)? ¿O depende de una acción humana (Ej. el asesor presiona un botón de "Respuesta Inútil / Incompleta")?
*   **Para Discutir:** Mi recomendación Lean es tener **ambos**. Un trigger automático por baja confianza, y un botón de *Feedback explícito* en la UI del asesor. ¿Estás de acuerdo? Si es así, debemos agregar ese endpoint al functional spec.

### 1.4. Interfaz de Asesor: ¿Chat, Buscador o Formulario? (Sección 14 y 19)
*   **La Crítica:** Hablamos de "Preguntas" (Ej. "Cliente quiere cambiar ingresos..."). Esto asume una interfaz tipo chat (estilo ChatGPT). Para un "Copiloto Operativo", a veces un formato chat no es lo más eficiente para buscar rápido.
*   **Para Discutir:** ¿La UI principal del asesor es una caja de texto tipo chat libre? ¿O es una barra de "Búsqueda Operativa" que devuelve tarjetas estructuradas (sin historial conversacional largo)? Para la demo, el formato "Chat que devuelve Tarjetas UI" suele verse más moderno, pero debemos confirmar la metáfora visual.

---

## 2. Viabilidad de la Demo (Riesgos de Presentación)

### 2.1. El problema del "Dashboard Vacío" (Sección 14.3)
*   **La Crítica:** En una hackathon de 5 minutos, no tendrás tiempo de hacer 50 preguntas para llenar el dashboard de *Knowledge Intelligence*. Si presentas un dashboard vacío, la propuesta pierde todo su impacto.
*   **Para Discutir:** Necesitamos definir un **"Seed Script" (Datos Simulados)** en la base de datos `SQLite`. Debemos pre-cargar la tabla `interactions` y `knowledge_gaps` con unas 100 interacciones realistas (fricciones en tarjetas, CDT, etc.) para que el gráfico de barras y las "Oportunidades de contenido" ya existan cuando abras la pantalla. ¿Te encargas tú de definir los casos falsos o prefieres que los generemos juntos?

### 2.2. Oportunidades de Contenido: ¿Batch o Real-Time? (Sección 17.4)
*   **La Crítica:** La tabla `content_opportunities` sugiere "Títulos sugeridos". En la vida real, analizar miles de gaps para sugerir un artículo SEO se hace en procesos *batch* (nocturnos). 
*   **Para Discutir:** Para la demo, cuando presionemos `[Generar draft de FAQ para este vacío]`, ¿debemos hacer una llamada LLM en tiempo real en ese momento para generar el borrador frente a los jueces? Es riesgoso por latencia, pero muy visual. ¿O prefieres que ya estén pre-generados en BD?

---

## 3. Checklist de Decisiones (Siguientes Pasos)
Por favor, responde a estos 5 puntos para que podamos actualizar el SPEC definitivamente:

1. [ ] **Mecanismo RAG:** ¿Mapeo estricto (1 intención = 1 doc) o búsqueda semántica en docs filtrados?
2. [ ] **UI Escalamiento:** ¿Qué botón/acción aparece en la UI cuando hay que escalar?
3. [ ] **Trigger de Fricción:** ¿Automático (Score < X) + Botón Manual del asesor?
4. [ ] **Metáfora UI:** ¿Chat conversacional con Tarjetas, o Buscador Operativo?
5. [ ] **Seed Data:** ¿Generamos un set de datos falsos para que el Dashboard de KI brille en el minuto 0?

Quedo a la espera de tus respuestas para iterar sobre esto. No toqué tu archivo original para que mantengas la versión limpia.