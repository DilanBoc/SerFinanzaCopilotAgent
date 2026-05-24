# Product Spec - Serfinanza Action Hub

## 1. Resumen

Serfinanza Action Hub es una plataforma de asistencia bancaria que convierte conocimiento aprobado del banco en la siguiente mejor accion personalizada, confiable y segura para clientes y asesores.

El producto no busca ser "otro chatbot bancario". Su diferencial es que no se limita a responder preguntas: interpreta la necesidad, consulta conocimiento oficial, adapta la respuesta al contexto del usuario, recomienda una accion y aplica controles cuando la accion tiene riesgo financiero u operativo.

## 2. Outcome Principal

Aumentar la resolucion personalizada y segura de necesidades financieras en el primer contacto, convirtiendo conocimiento bancario aprobado en la siguiente mejor accion para cada cliente o asesor.

## 3. Problema

El conocimiento del banco no llega a tiempo, con suficiente precision, contexto y accionabilidad a quienes lo necesitan.

Esto genera cuatro efectos principales:

- Clientes con tiempos de espera altos y respuestas inconsistentes entre canales.
- Asesores que dependen de memoria, experiencia individual o busquedas manuales.
- Errores operativos por informacion incompleta, desactualizada o mal interpretada.
- Oportunidades perdidas de adquisicion digital cuando una consulta no se convierte en una accion concreta.

El problema no es solo de atencion. Es un problema de conocimiento bancario convertido en accion.

## 4. Tesis De Producto

Si el banco organiza su conocimiento aprobado en una capa accionable, puede resolver mejor en el primer contacto y preparar el camino hacia experiencias agenticas mas avanzadas.

La secuencia correcta es:

1. Responder con conocimiento aprobado.
2. Personalizar segun contexto, rol e intencion.
3. Recomendar la siguiente mejor accion.
4. Preparar acciones financieras con controles.
5. Ejecutar solo cuando existan integraciones, permisos, autenticacion y trazabilidad suficientes.

Para la hackathon, el producto debe demostrar los primeros cuatro pasos y simular el quinto cuando sea necesario.

## 5. Usuarios Objetivo

### 5.1 Cliente Externo

Persona que necesita resolver una duda, tomar una decision o iniciar una accion relacionada con productos y canales de Serfinanza.

Necesidades:

- Entender productos como tarjeta de credito o CDT.
- Saber que hacer, por que canal y con que requisitos.
- Resolver problemas de acceso, extractos o actualizacion de datos.
- Recibir una respuesta personalizada sin esperar a un asesor.
- Pasar de la informacion a una accion concreta.

### 5.2 Asesor Interno

Empleado de oficina, call center, WhatsApp, fuerza comercial o soporte que atiende clientes y necesita informacion confiable rapidamente.

Necesidades:

- Encontrar respuestas aprobadas sin depender de memoria.
- Saber que pasos seguir en procesos operativos.
- Entender cuando escalar.
- Mantener consistencia entre canales.
- Reducir errores y tiempo de atencion.

### 5.3 Knowledge Intelligence / Adquisicion Digital

Capacidad interna que convierte interacciones de clientes y asesores en aprendizaje accionable para mejorar atencion, conocimiento y adquisicion digital.

Necesidades:

- Identificar intenciones frecuentes.
- Detectar oportunidades de contenido SEO o FAQ.
- Conectar preguntas con CTAs de adquisicion.
- Medir abandono, conversion simulada y temas sin respuesta.
- Detectar vacios de conocimiento y procesos que generan friccion.

### 5.4 Banco / Riesgo / Operaciones

Areas responsables de asegurar que las respuestas, recomendaciones y acciones sean confiables, auditables y consistentes con politicas internas.

Necesidades:

- Trazabilidad de fuentes.
- Control sobre respuestas sensibles.
- Registro de decisiones y recomendaciones.
- Escalamiento de casos ambiguos o riesgosos.
- Preparacion para escenarios agenticos con consentimiento y limites.

## 6. Jobs To Be Done

### Cliente Externo

Cuando tengo una necesidad financiera o una duda sobre un producto, quiero recibir una respuesta clara y personalizada que me diga que hacer ahora, para resolverla sin esperar ni navegar multiples canales.

### Asesor Interno

Cuando atiendo un caso que no domino completamente, quiero obtener una respuesta aprobada, contextual y operativa, para orientar bien al cliente desde el primer contacto.

### Knowledge Intelligence / Adquisicion

Cuando clientes y asesores generan interacciones repetidas o dudas no resueltas, quiero convertir esas senales en mejoras de conocimiento, contenido y rutas de accion, para mejorar atencion y aumentar adquisicion digital con informacion confiable.

### Banco / Riesgo

Cuando un agente recomienda o prepara una accion financiera, quiero verificar permisos, limites, fuente y trazabilidad, para evitar errores, abuso o decisiones no autorizadas.

## 7. Propuesta De Valor

Serfinanza Action Hub permite que el conocimiento aprobado del banco se convierta en resolucion personalizada desde el primer contacto.

Para clientes:

- Respuestas claras, accionables y adaptadas a su necesidad.
- Menos espera y menos saltos entre canales.
- Siguiente mejor accion para avanzar.

Para asesores:

- Copiloto operativo con checklist, fuentes y criterios de escalamiento.
- Menor curva de aprendizaje.
- Mayor consistencia en la atencion.

Para el banco:

- Mayor control sobre calidad de respuesta.
- Mejor trazabilidad de decisiones.
- Datos para mejorar contenido, procesos y adquisicion.
- Base conceptual para evolucionar hacia acciones agenticas seguras.

## 8. Principios De Producto

1. La respuesta debe ser accionable, no solo informativa.
2. Toda recomendacion debe poder explicar su fuente o regla.
3. La personalizacion debe basarse en contexto relevante, no en adornos conversacionales.
4. Las acciones sensibles deben escalar, pedir confirmacion o quedar simuladas.
5. El producto debe diferenciar claramente entre cliente externo y asesor interno.
6. Lo no soportado por documentos o reglas debe declararse como no confirmado.
7. El MVP debe demostrar valor sin depender de integraciones bancarias reales.

## 9. Personalizacion

La personalizacion del MVP se define por:

- Rol: cliente, asesor o marketing.
- Intencion: consultar, comparar, resolver, abrir, pagar, actualizar, entender.
- Producto: tarjeta de credito, CDT, app, actualizacion de datos, extracto.
- Contexto simulado: monto, plazo, canal, tipo de cliente, nivel de riesgo.
- Estado de la accion: informativa, preparatoria, transaccional simulada o requiere escalamiento.

No se considera personalizacion suficiente:

- Saludar por nombre.
- Reescribir la misma respuesta con tono distinto.
- Dar recomendaciones sin explicar fuente, regla o razon.

## 10. Siguiente Mejor Accion

La siguiente mejor accion es la recomendacion concreta que el sistema entrega despues de entender la necesidad.

Ejemplos:

- Simular un CDT.
- Iniciar solicitud de tarjeta.
- Descargar o registrarse en la app.
- Consultar o entender extracto.
- Actualizar datos por el canal adecuado.
- Escalar a asesor humano.
- Preparar un pago simulado bajo confirmacion.
- Generar contenido FAQ para marketing.

Una respuesta sin siguiente accion se considera incompleta para el objetivo del producto.

## 11. Alcance MVP

El MVP debe cubrir tres experiencias:

### 11.1 Experiencia Cliente

Interfaz conversacional donde el cliente puede preguntar sobre productos o procesos y recibir:

- Respuesta clara.
- Pasos accionables.
- Canal recomendado.
- CTA.
- Fuente o referencia documental.
- Advertencia si la informacion puede variar.

Casos prioritarios:

- CDT.
- Tarjeta de credito.
- Registro en app.
- Extracto de credito.

### 11.2 Experiencia Asesor

Vista interna donde el asesor puede consultar procesos y recibir:

- Respuesta recomendada para cliente.
- Checklist operativo.
- Documentos o requisitos.
- Canal recomendado.
- Criterios de escalamiento.
- Fuente usada.

Caso prioritario:

- Actualizacion de datos.

### 11.3 Experiencia De Accion Segura

Flujo que demuestra como una necesidad puede convertirse en accion financiera preparada, con controles.

Caso prioritario:

- Entender extracto de tarjeta y preparar pago simulado con confirmacion.

Controles minimos:

- Confirmacion humana antes de ejecutar.
- Registro auditable.
- Verificacion contra mandato o limite simulado.
- Mensaje claro de que no se ejecuta un pago real en el MVP.

## 12. Fuera De Alcance

Para evitar una demo fragil, queda fuera del MVP:

- Ejecucion real de pagos.
- Integracion real con core bancario.
- Apertura real de productos.
- Autenticacion bancaria real.
- Consulta real de saldos o extractos personales.
- Decision automatica de credito.
- Recomendacion financiera personalizada sin perfil validado.
- Manejo de datos personales reales.
- Disputas o contracargos reales.

Estas capacidades pueden describirse como evolucion futura, no como promesa del prototipo.

## 13. Casos De Uso Prioritarios

### Caso 1 - Cliente Quiere Invertir En CDT

Pregunta ejemplo:

"Tengo 5 millones y quiero invertirlos 180 dias. Que me conviene?"

Resultado esperado:

- Identifica intencion de inversion.
- Explica CDT en lenguaje simple.
- Usa informacion aprobada.
- Simula o prepara una estimacion si hay datos suficientes.
- Advierte que tasas y condiciones pueden cambiar.
- Propone siguiente accion: simular, iniciar apertura o contactar asesor.

### Caso 2 - Asesor Atiende Actualizacion De Datos

Pregunta ejemplo:

"Cliente quiere cambiar ingresos y direccion por WhatsApp. Se puede?"

Resultado esperado:

- Identifica rol interno.
- Distingue entre tipos de dato.
- Recomienda canal correcto.
- Lista documentos o soportes si aplican.
- Indica cuando escalar.
- Muestra fuente.

### Caso 3 - Cliente No Entiende Su Extracto

Pregunta ejemplo:

"No entiendo cuanto debo pagar de mi tarjeta este mes."

Resultado esperado:

- Explica conceptos del extracto.
- Diferencia pago minimo, pago total y fecha limite.
- Recomienda revisar valores exactos en canal oficial o extracto.
- Prepara una accion simulada de pago si el usuario lo solicita.
- Solicita confirmacion antes de cualquier accion.
- Registra evidencia de decision.

## 14. Seguridad Y Confianza

El MVP debe mostrar controles visibles, aunque sean simulados:

- Fuente documental.
- Fecha o vigencia cuando aplique.
- Nivel de confianza o advertencia.
- Escalamiento a humano.
- Confirmacion para acciones sensibles.
- Registro de auditoria.
- Distincion entre informacion, recomendacion y accion.

La capa agentica se presenta como preparacion segura, no como autonomia plena.

## 15. Metricas De Exito

### Cliente

- Porcentaje de consultas con siguiente mejor accion.
- Tiempo estimado de resolucion.
- Porcentaje de casos resueltos sin escalamiento.
- Clics en CTA de adquisicion.

### Asesor

- Reduccion estimada de tiempo de busqueda.
- Porcentaje de respuestas con checklist completo.
- Porcentaje de casos con fuente citada.
- Casos escalados correctamente.

### Banco

- Preguntas sin respuesta.
- Intenciones mas frecuentes.
- Productos con mayor interes.
- Acciones recomendadas por tipo.
- Eventos auditables generados.
- Vacios de conocimiento detectados.
- Oportunidades de contenido derivadas de interacciones reales.

### Metricas Visuales Para Dashboard MVP

- Resolucion en primer contacto estimada: casos resueltos sin escalamiento.
- Tiempo ahorrado al asesor: estimacion por tipo de consulta.
- Respuestas con fuente aprobada: porcentaje de respuestas trazables.
- Siguientes mejores acciones generadas: acciones utiles por intencion.
- Escalamientos correctos: casos donde el sistema no improviso.
- Vacios de conocimiento detectados: preguntas sin fuente suficiente.
- Oportunidades de contenido: FAQs o guias sugeridas desde interacciones.
- Intenciones de adquisicion detectadas: CDT, tarjeta, app, actualizacion, extracto.

## 16. Riesgos Y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---:|---|
| Parecer un chatbot generico | Alto | Demostrar siguiente mejor accion, fuentes, checklist y accion segura simulada |
| Mezclar atencion, adquisicion y pagos sin coherencia | Alto | Usar el outcome de resolucion personalizada en primer contacto como hilo conductor |
| Prometer pagos reales sin infraestructura | Alto | Simular pagos y explicar los puntos de integracion futura |
| Responder con informacion inventada | Alto | Usar documentos aprobados, fuentes y escalamiento cuando no haya certeza |
| Personalizacion superficial | Medio | Personalizar por rol, intencion, producto, canal y nivel de riesgo |
| Exceso de alcance | Alto | Limitar demo a tres casos de uso prioritarios |
| Riesgo regulatorio | Alto | No ejecutar transacciones reales ni dar recomendaciones financieras definitivas sin validacion |

## 17. Criterios De Exito Para Hackathon

La demo sera exitosa si logra probar que:

1. El sistema entiende una necesidad bancaria y no solo palabras clave.
2. La respuesta usa conocimiento aprobado.
3. La salida cambia segun rol: cliente o asesor.
4. Cada respuesta importante termina en una siguiente mejor accion.
5. Las acciones sensibles tienen confirmacion, limites o escalamiento.
6. El banco obtiene trazabilidad y datos para mejorar.
7. La propuesta se diferencia claramente de un chatbot tradicional.

## 18. Supuestos Actuales

- El reto de Serfinanza valora una solucion que combine atencion, conocimiento y adquisicion digital.
- Los documentos disponibles son suficientes para una base de conocimiento inicial.
- La demo puede usar datos simulados para perfiles, extractos, mandatos y eventos.
- La ejecucion real de pagos no es necesaria para demostrar el valor central.
- Copilot Studio puede ser parte de la arquitectura, pero el valor del producto no debe depender solo de la herramienta.

## 19. Decisiones

### 19.1 Decisiones Cerradas

1. Nombre final del producto: Serfinanza Action Hub.
2. Caso de uso principal para abrir la demo: Caso 2 - Asesor atiende actualizacion de datos.
3. Knowledge Intelligence queda como capacidad de aprendizaje para mejorar atencion y adquisicion, no como modulo de marketing automation.
4. El cierre de la demo sera el caso CDT como siguiente mejor accion de adquisicion segura.
5. Las metricas del dashboard se enfocaran en resolucion, calidad, trazabilidad, escalamiento y aprendizaje; no en volumen de chats.
6. Stack aprobado para prototipo: Next.js fullstack, TypeScript, MCP TypeScript SDK, SQLite, Tailwind/shadcn.

### 19.2 Decisiones Pendientes

1. Definir si la demo incluira login/perfiles simulados o selector manual de rol.
2. Definir fuentes exactas que alimentaran cada caso de uso.
3. Definir si el prototipo usara modelo real, respuestas mockeadas controladas o un modo hibrido.
4. Definir alcance visual del dashboard Knowledge Intelligence para la primera version.

## 20. Stack Aprobado Para Prototipo

El prototipo se construira con un stack agil y estable:

- Frontend y backend: Next.js fullstack con TypeScript.
- UI: Tailwind CSS y shadcn/ui.
- MCP: MCP TypeScript SDK.
- Persistencia demo: SQLite.
- Documentos y reglas: archivos locales procesados desde los insumos de Serfinanza.
- RAG / busqueda documental: implementacion simple y controlada para hackathon.
- Auditoria: registro local de interacciones, fuentes, acciones recomendadas y escalamiento.

La razon de esta eleccion es reducir friccion de desarrollo, mantener una sola base TypeScript y permitir una demo web completa con vistas de asesor, cliente y dashboard.

## 21. Recomendacion De Foco

Para la hackathon, el producto debe enfocarse en el caso "de necesidad bancaria a siguiente mejor accion segura".

La narrativa recomendada:

"Serfinanza no necesita solo responder mas rapido. Necesita resolver mejor desde el primer contacto. Nuestro agente usa conocimiento aprobado, entiende el contexto del cliente o asesor y propone la siguiente mejor accion con controles de confianza."
