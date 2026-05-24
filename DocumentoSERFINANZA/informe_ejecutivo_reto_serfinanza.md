# Informe ejecutivo - Reto Serfinanza: adquisicion digital y Agente 360

Fecha de analisis: 2026-05-23  
Insumos revisados:

- `Reto2_Adquisicion_Digital_Serfinanza_FINAL.pptx`
- `01_tarjeta_credito_beneficios.pdf`
- `02_actualizacion_datos_procesos.pdf`
- `03_cdt_caracteristicas_beneficios.pdf`
- `04_registro_app_serfinanza.pdf`
- `05_extracto_credito_canales.pdf`
- `ResumenIAdelPPT.txt`

## 1. Lectura ejecutiva

El reto no es solamente "hacer un chatbot". El problema central declarado en la presentacion es que el conocimiento del banco no llega a tiempo, ni con consistencia, a quien lo necesita. Eso afecta a dos publicos:

- Clientes externos: necesitan respuestas rapidas, claras y accionables sobre productos, canales, requisitos, costos, beneficios y procesos.
- Clientes internos: asesores, fuerza comercial, call center, oficinas y marketing necesitan encontrar informacion confiable sin depender de memoria, reentrenamiento constante o busquedas manuales.

La oportunidad de hackathon esta en construir una experiencia de informacion financiera omnicanal, gobernada y medible, que sirva tanto para atencion como para adquisicion digital. El banco pide explicitamente impacto dual: mejorar la capacidad del empleado y mejorar la experiencia del cliente.

## 2. Necesidades detectadas

### 2.1 Necesidades del cliente externo

Los PDFs muestran consultas frecuentes y transaccionales de alto valor para autoservicio:

- Conocer beneficios, tasas, cuotas de manejo, requisitos y canales de la tarjeta de credito.
- Entender como actualizar datos, que documentos requiere cada caso y por que canal hacerlo.
- Comparar y simular un CDT segun monto, plazo, tasa, pago de intereses y retiro anticipado.
- Registrarse y resolver problemas de acceso en la App Serfinanza.
- Generar, descargar y entender extractos de productos de credito.

Estas consultas tienen un patron claro: el cliente no solo pregunta "que es", sino "que hago ahora, por que canal, con que documentos, cuanto tarda y que pasa si falla".

### 2.2 Necesidades del cliente interno

La presentacion identifica dolores internos concretos:

- Asesores con curva de aprendizaje alta.
- Respuestas inconsistentes entre canales.
- Acceso lento a informacion vigente.
- Costos por reentrenamiento y rotacion.
- Errores humanos en procesos operativos.
- Baja personalizacion por falta de contexto del cliente.

El problema de fondo es de gestion del conocimiento, no solo de interfaz. Sin una base curada, versionada y trazable, cualquier copiloto puede responder bonito pero incorrecto.

### 2.3 Necesidades de marketing y adquisicion digital

El resumen del reto menciona presencia digital, SEO, motores de inteligencia artificial y apoyo a marketing con copiloto. Eso implica necesidades adicionales:

- Convertir conocimiento de productos en contenido encontrable por Google y por motores de IA.
- Crear paginas, FAQs y respuestas estructuradas por intencion de busqueda.
- Medir que preguntas hacen los usuarios, donde abandonan y que productos generan interes.
- Generar contenido comercial y educativo con control de marca, compliance y trazabilidad.
- Conectar la consulta informativa con una accion de adquisicion: solicitar tarjeta, abrir CDT, descargar app, actualizar datos o pedir asesoria.

## 3. Puntos ciegos y supuestos que deben cuestionarse

1. Pensar que Copilot Studio por si solo resuelve el reto es un supuesto debil. La herramienta ayuda, pero el valor depende de la calidad del conocimiento, reglas de escalamiento, medicion y gobierno.

2. SEO y "presencia en motores de IA" no se arreglan solo con un asistente conversacional. Se requiere contenido publico indexable, datos estructurados, arquitectura de informacion, autoridad de dominio y respuestas consistentes en canales propios.

3. No hay evidencia de integraciones reales con core bancario, CRM, analitica, CMS o autenticacion. Para una demo se debe evitar prometer acciones reales como bloquear tarjetas, modificar datos o abrir productos si no existen APIs disponibles. La alternativa correcta es simular flujos y dejar claro el punto de integracion.

4. Los documentos PDF tienen datos sensibles desde el punto de vista reputacional: tasas, costos, telefonos, plazos y condiciones "sujetas a cambio". Una solucion seria debe responder con fecha de vigencia, fuente y advertencia cuando aplique.

5. "Personalizacion" sin datos del cliente puede volverse una afirmacion vacia. En hackathon se puede mostrar personalizacion por perfil simulado, pero en produccion requiere consentimiento, seguridad, trazabilidad y controles de riesgo.

## 4. Opciones de solucion

### Opcion A - Agente 360 de conocimiento bancario

Un asistente basado en RAG sobre documentos oficiales del banco, con respuestas citadas, lenguaje simple y orientacion por siguiente mejor accion.

Capacidades:

- Responder preguntas de productos y procesos.
- Mostrar fuente documental y fecha de actualizacion.
- Diferenciar respuesta para cliente externo y asesor interno.
- Escalar a asesor humano cuando la pregunta implique autenticacion, reclamo, transaccion o excepcion.
- Generar resumen operativo para el asesor: respuesta sugerida, pasos, documentos y canal recomendado.

Valor:

- Ataca directamente el dolor del PPTX.
- Es viable con los documentos disponibles.
- Permite demo clara en Copilot Studio, Angular y .NET.

Limitacion:

- No mejora por si sola la adquisicion digital si no se conecta con conversiones, formularios, campanas o analitica.

### Opcion B - Motor de adquisicion digital asistida

Una experiencia publica que convierte preguntas financieras en rutas de adquisicion.

Ejemplos:

- "Quiero invertir 5 millones por 180 dias" -> simulacion de CDT -> recomendacion de plazo -> CTA de apertura.
- "Necesito una tarjeta de credito" -> prediagnostico de perfil -> comparacion Clasica/Gold/Platinum -> CTA de solicitud.
- "No puedo entrar a la app" -> guia de registro/recuperacion -> CTA de descarga o soporte.

Capacidades:

- Landing o micrositio SEO con FAQs estructuradas.
- Asistente conversacional por producto.
- Calculadoras y simuladores.
- Captura de leads con consentimiento.
- Eventos de analitica por intencion, producto y abandono.

Valor:

- Conecta informacion con crecimiento digital.
- Es mas atractivo para un reto de fintech/adquisicion.

Limitacion:

- Requiere mas definicion comercial: productos prioritarios, funnel, fuentes de trafico y metricas de conversion.

### Opcion C - Copiloto para marketing financiero

Una herramienta interna para que marketing cree, revise y publique contenido confiable a partir del conocimiento aprobado.

Capacidades:

- Generar FAQs SEO por producto.
- Crear borradores de articulos, posts y respuestas para motores de IA.
- Sugerir titulos, metadescripciones y schema markup.
- Revisar consistencia contra documentos fuente.
- Alertar contenido desactualizado cuando cambien tasas, costos o condiciones.

Valor:

- Atiende la necesidad mencionada de equipo de marketing apoyado con copiloto.
- Mejora presencia digital de forma mas sostenible que publicar contenido manual.

Limitacion:

- Si se presenta solo esto, puede parecer alejado del dolor principal de atencion al cliente y asesor.

### Opcion D - Plataforma integral: Knowledge-to-Growth

Combina las tres capas anteriores:

- Capa de conocimiento: base documental curada y versionada.
- Capa de asistencia: agente para cliente y asesor.
- Capa de crecimiento: SEO, contenido, analitica y rutas de conversion.

Valor:

- Es la narrativa mas fuerte: el mismo conocimiento sirve para atencion, ventas, marketing y mejora continua.

Limitacion:

- Para hackathon hay que acotar muy bien el MVP. Intentar construirlo todo completo seria un error.

## 5. Alcance recomendado para el hackathon

La mejor apuesta es una version acotada de la Opcion D, con demo funcional en tres escenarios.

### MVP propuesto: "Serfinanza Knowledge-to-Growth"

#### Modulo 1 - Agente 360 para cliente externo

Interfaz conversacional que responde sobre:

- Tarjeta de credito.
- CDT.
- Registro en App.
- Actualizacion de datos.
- Extractos de credito.

Debe entregar:

- Respuesta clara.
- Pasos accionables.
- Canal recomendado.
- Documentos requeridos, si aplica.
- Fuente usada.
- CTA: abrir producto, descargar app, solicitar asesoria o continuar en canal digital.

#### Modulo 2 - Copiloto interno para asesores

Vista para empleado con:

- Busqueda conversacional.
- Respuesta recomendada para cliente.
- Checklist operativo.
- Riesgos o advertencias.
- Cuando escalar.
- Fuentes consultadas.

Ejemplo: "Cliente quiere actualizar informacion laboral por WhatsApp". El copiloto debe indicar que los datos basicos si pueden actualizarse por WhatsApp, pero la informacion laboral requiere documentacion y puede necesitar Web, sucursal o validacion.

#### Modulo 3 - Consola de marketing y mejora continua

Panel simple con:

- Preguntas frecuentes detectadas.
- Intenciones por producto.
- Contenido sugerido para SEO/FAQ.
- Oportunidades de conversion.
- Indicadores de calidad: preguntas sin respuesta, respuestas con baja confianza, documentos desactualizados.

Este modulo es clave para diferenciarse. Muchos equipos haran un chatbot; pocos mostraran como el banco aprende, mejora contenido y crece digitalmente.

## 6. Arquitectura sugerida

### Frontend

- Angular.
- Dos experiencias: cliente externo y empleado interno.
- Panel de marketing con analitica basica.

### Backend

- .NET API.
- Servicios para consulta de conocimiento, registro de conversaciones, metricas, perfiles simulados y reglas de escalamiento.

### IA

- Copilot Studio para orquestacion conversacional.
- RAG sobre documentos oficiales.
- Prompts separados por rol: cliente, asesor, marketing.
- Guardrails: no inventar tasas, no ejecutar transacciones no disponibles, responder con fuente y escalar casos sensibles.

### Datos

- Documentos PDF procesados como base de conocimiento.
- Metadatos por documento: producto, publico, vigencia, canal, sensibilidad, ultima actualizacion.
- Eventos de analitica: pregunta, intencion, producto, respuesta, confianza, CTA, conversion simulada.

## 7. Casos de demo recomendados

### Caso 1 - Cliente pregunta por CDT

Pregunta: "Tengo 5 millones y quiero invertirlos 180 dias, cuanto gano y como lo abro?"

Respuesta esperada:

- Explica CDT.
- Usa tasa del documento como referencia.
- Muestra rendimiento aproximado.
- Recomienda App o portal web para constituirlo.
- Advierte que tasas pueden cambiar.
- CTA: "simular CDT" o "abrir desde App".

### Caso 2 - Asesor nuevo atiende actualizacion de datos

Pregunta interna: "El cliente quiere cambiar ingresos y direccion por WhatsApp, se puede?"

Respuesta esperada:

- Direccion: si puede hacerse por WhatsApp/App/Web.
- Ingresos: requiere soporte documental.
- Recomienda canal Web con carga documental o sucursal.
- Da checklist de documentos y tiempos.
- Indica cuando escalar.

### Caso 3 - Marketing detecta oportunidad SEO

Insight:

- Muchas preguntas sobre "como descargar extracto", "que significa pago minimo" o "como abrir CDT".

Salida esperada:

- Sugerencia de FAQ publica.
- Titulo SEO.
- Metadescripcion.
- CTA a App/Portal.
- Schema FAQPage sugerido.

## 8. Indicadores de exito

### Para cliente externo

- Tiempo promedio de respuesta.
- Porcentaje de resolucion en primer contacto.
- Reduccion de consultas repetitivas al call center.
- Clics en CTA de adquisicion.
- Conversiones simuladas por producto.

### Para empleado

- Tiempo de busqueda de informacion.
- Tasa de respuestas correctas.
- Tiempo de onboarding de asesores.
- Preguntas escaladas correctamente.
- Uso del copiloto por area/canal.

### Para marketing y crecimiento

- Nuevas oportunidades de contenido detectadas.
- FAQs generadas y aprobadas.
- Trafico organico por producto.
- Consultas provenientes de motores de IA.
- Conversion de contenido a lead o autoservicio.

## 9. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---:|---|
| Respuestas inventadas o desactualizadas | Alto | RAG con fuentes, fecha de vigencia, umbral de confianza y escalamiento |
| Prometer transacciones sin integracion | Alto | Demo con simulacion explicita y puntos de integracion definidos |
| Datos financieros cambiantes | Alto | Metadatos de vigencia y flujo de aprobacion de contenido |
| Exceso de alcance | Medio | MVP con 3 productos/procesos y 3 roles: cliente, asesor, marketing |
| Falta de diferenciacion frente a otros chatbots | Medio | Incluir analitica, SEO y mejora continua |
| Riesgos regulatorios y de compliance | Alto | No dar asesoramiento financiero personalizado sin perfil validado; incluir disclaimers y escalamiento |

## 10. Recomendacion final

La propuesta mas solida no debe venderse como "un chatbot de Serfinanza". Debe venderse como una plataforma de conocimiento bancario que convierte informacion aprobada en tres resultados:

1. Mejor atencion: respuestas consistentes, rapidas y trazables para clientes.
2. Mejor operacion: asesores nuevos y existentes consultan procesos sin depender de memoria.
3. Mejor crecimiento: marketing identifica demanda, genera contenido confiable y conecta preguntas con adquisicion digital.

El nombre sugerido para la demo es:

**Serfinanza Knowledge-to-Growth: del conocimiento bancario a la adquisicion digital.**

Mensaje central para jurados:

> "No construimos otro bot. Construimos el sistema que hace que el conocimiento aprobado del banco alimente atencion, ventas, marketing y mejora continua con trazabilidad."

## 11. Entregables sugeridos para el equipo

- Demo web Angular con tres vistas: cliente, asesor y marketing.
- API .NET con endpoints simulados para consulta, metricas y conversion.
- Agente en Copilot Studio o flujo equivalente conectado a base documental.
- Base de conocimiento inicial con los cinco PDFs.
- Dashboard de preguntas, intenciones, productos y CTAs.
- Pitch de 5 minutos centrado en outcomes, no en features.

## 12. Frase de cierre

El punto fuerte del reto es que une atencion, conocimiento y crecimiento. El punto debil seria quedarse en una solucion cosmetica de IA. Para ganar, la demo debe probar que el banco puede aprender de cada pregunta, mejorar su contenido y convertir informacion confiable en adquisicion digital medible.
