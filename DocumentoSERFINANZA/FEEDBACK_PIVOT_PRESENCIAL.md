# Feedback Estratégico y Técnico - Pivot a "Copiloto Presencial"

**De:** Senior Product Manager
**Para:** Equipo de Producto / Tech Lead
**Fecha:** 24 de mayo de 2026
**Documentos Analizados:** `SERFINANZA_ACTION_HUB_SPEC.md`, `DEMO_SCRIPT.md`, `TECHNICAL_SPEC.md`, `BUILD_PLAN.md`

---

## 1. Evaluación Estratégica del Pivot

El giro hacia un **Copiloto Contextual para oficinas presenciales basado en transcripción (Speech-to-Text simulado)** es una jugada audaz y altamente diferenciadora para una hackathon. Rompe completamente con el paradigma del "asesor tecleando en un chat" y resuelve el problema real: el asesor no tiene tiempo de escribir mientras atiende en persona.

**Lo brillante del nuevo enfoque:**
1.  **Cero Fricción de Entrada:** El asesor no "pregunta", el sistema "escucha" y sugiere.
2.  **Dashboard Orgánico:** Los datos para Calidad y Marketing se generan como subproducto de la atención natural, no porque el asesor llenó un formulario.

**El Riesgo Principal:**
El "Valle de lo Extraño" (Uncanny Valley) de las demos. Si la transcripción simulada se ve robótica o los tiempos de aparición de las tarjetas no se sienten naturales, los jueces pensarán que es un *mockup* en Figma y no software real.

---

## 2. Recomendaciones sobre la Experiencia (DEMO_SCRIPT.md)

### 2.1. El control de la "Transcripción Simulada"
En el script de la demo (Escenas 1 y 3), mencionas que la transcripción avanza. 
*   **Problema:** Si el texto aparece mágicamente de golpe, se ve falso. Si avanza solo por tiempo, el presentador tendrá que correr para hablar al mismo ritmo que la UI.
*   **Accionable (Crucial para el Dev):** En el `TECHNICAL_SPEC.md`, debes instruir que la transcripción simulada avance **controlada por el teclado del presentador (Ej. barra espaciadora)**. Cada vez que el presentador presiona espacio (o un botón oculto), aparece la siguiente línea de diálogo. Esto permite que el presentador haga pausas, mire al jurado y actúe naturalmente sin que la UI se le adelante.

### 2.2. La tarjeta de Intervención ("Escena 1")
*   **Problema:** Cuando el sistema detecta "ACTUALIZACION_DATOS", aparecen 4 botones (`Lo sé`, `Ver respuesta`, `Escalar`, `Ignorar`). En una atención física rápida, 4 botones son muchos.
*   **Accionable:** Simplifica cognitivamente. Mantén `Ver respuesta` (grande/primario) y `Cerrar/Ignorar` (pequeño/secundario). Mueve el `Escalar` *dentro* de la respuesta estructurada (como lo tienes en la Escena 4). El "Lo sé" y el "Ignorar" funcionalmente hacen lo mismo (cierran la tarjeta sin ver la respuesta), el backend puede deducir que si la cerró sin leerla, es que "Lo sabía".

---

## 3. Recomendaciones Técnicas (TECHNICAL_SPEC.md & BUILD_PLAN.md)

### 3.1. Estado de la Base de Datos (`node:sqlite`)
*   **Acierto:** Usar SQLite local es perfecto para evitar fallos de red.
*   **Mejora (Seed Data Dinámico):** El Build Plan debe incluir un script `npm run db:seed` explícito. Para que el dashboard (`/quality`) se vea impresionante, el seed no debe insertar datos de "hoy" solamente. Debe insertar datos de los **últimos 30 días** simulados, con tendencias (Ej. "Las consultas sobre CDT han subido un 40% esta semana"). Esto vende la idea de "Inteligencia Operacional".

### 3.2. Fallback Determinístico vs. LLM (Sección 10)
*   **Acierto:** Que la demo no dependa críticamente de la API de Gemini te salva de desastres de wifi.
*   **Mejora de "Magia":** Ya que estás simulando el Speech-to-Text, usa la API de Gemini *sólo* en el momento de generar el **Reporte Markdown de Marketing** en vivo. Es un punto de alto impacto visual ver cómo la IA redacta el markdown frente a los jueces basándose en la data de SQLite. Si falla, el fallback devuelve un string estático.

### 3.3. Estructura del Payload JSON (`interaction_events`)
*   En el esquema de BD (`23.5`), guardas un `payload_json`. 
*   **Accionable:** Asegúrate de guardar el **Trigger Phrase** exacto de la transcripción que disparó la tarjeta. (Ej. `{"trigger": "puedo actualizar mi dirección por WhatsApp"}`). Esto es vital para mostrar en la vista de Admin por qué el sistema intervino.

---

## 4. El "Killer Feature" para el Pitch

En tu pitch final, agrega esta línea:

> *"La mayoría de los bancos analizan las llamadas de call center días después para auditoría. Serfinanza Action Hub analiza la conversación presencial en tiempo real, empodera al asesor en ese mismo instante, y genera la auditoría y el contenido de marketing como un subproducto automático. Pasamos de auditar el pasado a potenciar el presente."*

---

## 5. Resumen de Siguientes Pasos (Para el Equipo Dev)

1.  **Mecanismo de Avance:** Programar la UI de `/advisor` para que la transcripción simulada avance con la barra espaciadora (presentación a prueba de balas).
2.  **Script de Seeding:** Crear `scripts/seed.ts` para llenar la base de datos con un mes de historial falso, garantizando que `/quality` se vea lleno y útil desde el segundo 0.
3.  **Simplificar Botones UI:** Reducir de 4 botones a 2 principales (`Ver Asistencia`, `Cerrar`) en la tarjeta emergente para hacerla más realista para un asesor bajo presión.
4.  **Ejecutar Build Plan:** El plan de 7 fases está perfectamente estructurado. Recomiendo que las fases 1, 2 y 3 se terminen el día 1 de desarrollo.

Este proyecto tiene todas las de ganar si la UI se siente fluida y los datos del dashboard cuentan una historia de dolor resuelto. ¿Acordamos integrar estos ajustes técnicos al flujo de desarrollo?