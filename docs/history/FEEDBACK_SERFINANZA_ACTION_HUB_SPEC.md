# Feedback Critico - Serfinanza Action Hub Spec

Fecha: 2026-05-23  
Archivo revisado: `SERFINANZA_ACTION_HUB_SPEC.md`  
Objetivo del feedback: identificar ambiguedades, riesgos y decisiones faltantes antes de cerrar especificaciones.

## 1. Diagnostico General

El spec mejoro mucho al cerrar el foco en un copiloto operativo para asesores de primera linea. Esa decision reduce el riesgo de competir como "otro chatbot bancario" y hace que el producto sea mas defendible en hackathon.

La idea central ya es clara:

> convertir conocimiento aprobado en decisiones operativas para asesores.

Sin embargo, el documento todavia mezcla algunos niveles: estrategia, funcionalidad, arquitectura, demo y pitch. Eso no es grave para un primer consolidado, pero si queremos usarlo como base de construccion, faltan definiciones mas cerradas sobre comportamiento, datos, fuentes, criterios de aceptacion y experiencia de usuario.

Mi critica principal: el spec ya dice bien "que queremos ser", pero aun no define con suficiente precision "que debe pasar exactamente en pantalla y en el sistema para que sepamos que lo logramos".

## 2. Fortalezas Reales

### 2.1 Foco De Nicho Correcto

El giro hacia asesores de primera linea es una buena decision. Es mas creible que prometer autoservicio total para clientes o pagos agenticos.

Por que funciona:

- El usuario interno tolera mejor una herramienta asistiva en MVP.
- El riesgo reputacional baja porque el asesor sigue en control.
- La demo puede mostrar impacto operacional sin integraciones bancarias reales.
- El banco obtiene valor incluso si el cliente final nunca ve el agente.

### 2.2 Diferenciador Mas Fuerte Que Chatbot

El concepto de salida estructurada con checklist, fuentes, canal, escalamiento y NBA es fuerte. Si se implementa bien, se vera como plataforma operativa, no como prompt bonito.

### 2.3 Knowledge Intelligence Es Un Buen Segundo Acto

La idea de "consola de friccion activa" es mejor que un dashboard pasivo. El CTA de generar FAQ o guia desde vacios reales puede diferenciar la demo.

### 2.4 Sacar Pagos Agenticos Del MVP Fue Correcto

Mantener pagos agenticos en el MVP habria abierto demasiadas preguntas dificiles: responsabilidad, autenticacion, integraciones, tokens, fraude, regulacion y contracargos. Como vision futura esta bien; como MVP era debil.

## 3. Riesgos Criticos

## 3.1 El Outcome Quedo Reducido Pero No Reescrito Del Todo

El outcome actual dice:

> Aumentar la resolucion personalizada y segura de necesidades financieras en el primer contacto, convirtiendo conocimiento bancario aprobado en la siguiente mejor accion para cada asesor.

Problema: "necesidades financieras" sigue sonando amplio. Si el MVP es asesor operativo, el outcome deberia reflejar atencion, procesos y adquisicion asistida, no necesidades financieras en general.

Riesgo: un mentor puede preguntar si estamos resolviendo atencion, ventas, conocimiento, formacion de asesores o inteligencia de negocio.

Pregunta para cerrar:

> Queremos que el outcome se centre en "resolucion operativa en primer contacto" o mantener "necesidades financieras" por amplitud estrategica?

Propuesta mas precisa:

> Aumentar la resolucion operativa en primer contacto para asesores de primera linea, convirtiendo conocimiento aprobado del banco en respuestas trazables, checklists y siguientes mejores acciones.

## 3.2 "Asesores De Primera Linea" Sigue Siendo Un Segmento Amplio

El spec habla de asesores de primera linea, pero no define exactamente cual:

- oficina fisica;
- call center;
- WhatsApp;
- fuerza comercial;
- soporte digital;
- onboarding;
- servicio al cliente;
- ventas de productos.

Esto importa porque cada canal cambia:

- lenguaje;
- tiempo disponible;
- tipo de respuesta;
- necesidad de evidencia;
- CTA;
- forma de escalar.

Pregunta para cerrar:

> Para la demo, el asesor representa WhatsApp/call center, oficina, fuerza comercial o un rol transversal?

Recomendacion:

Elegir uno como caso principal. Mi candidato: **asesor de WhatsApp/call center**. Tiene friccion alta, necesita velocidad, y conecta bien con respuestas copiables, links y escalamiento.

## 3.3 La NBA Todavia No Tiene Taxonomia

El spec define bien la idea de siguiente mejor accion, pero no clasifica tipos de NBA. Eso puede hacer que cada respuesta invente una estructura distinta.

Necesitamos una taxonomia cerrada para MVP.

Propuesta inicial:

- `RESOLVE_WITH_SCRIPT`: responder al cliente con guion sugerido.
- `REQUEST_DOCUMENTS`: pedir soportes especificos.
- `REDIRECT_TO_CHANNEL`: enviar al canal correcto.
- `ESCALATE_TO_SUPERVISOR`: escalar por falta de fuente, riesgo o excepcion.
- `SEND_CTA_LINK`: compartir enlace o CTA de adquisicion.
- `CREATE_KNOWLEDGE_GAP`: registrar vacio de conocimiento.
- `GENERATE_CONTENT_DRAFT`: generar borrador de FAQ/guia.

Pregunta para cerrar:

> Que tipos de NBA queremos permitir en el MVP y cuales quedan fuera?

## 3.4 No Esta Definido Que Significa "Fuente Aprobada"

El spec exige fuente aprobada, pero no define su jerarquia ni que pasa ante conflicto.

Ejemplo de conflicto:

- PDF del reto dice una cosa.
- Web publica dice otra.
- FAQ dice algo incompleto.
- Tasas y tarifas cambian.

Sin jerarquia, el sistema puede citar cualquier cosa y seguir pareciendo "confiable".

Preguntas para cerrar:

> Que fuente tiene prioridad: PDF local del reto, web publica o contenido indexado mas reciente?

> Como debe responder el sistema si dos fuentes se contradicen?

Propuesta:

Jerarquia para MVP:

1. Documento oficial del reto asociado a la intencion.
2. Pagina publica del banco si corresponde al mismo producto/proceso.
3. FAQ publica como apoyo.
4. Si hay conflicto o falta de claridad: escalar y registrar gap.

## 3.5 El Caso De Actualizacion De Datos Necesita Reglas Mas Concretas

El flujo principal es bueno, pero todavia esta expresado en alto nivel. Para demo necesitamos una respuesta esperada mas concreta.

Hoy dice:

- distinguir direccion de ingresos;
- recomendar canal;
- pedir soportes;
- escalar si aplica.

Pero no define:

- que datos se pueden actualizar por WhatsApp;
- que datos requieren soporte;
- que canal exacto se recomienda;
- que texto se le da al asesor;
- que documentos se piden;
- cuando se escala.

Riesgo: durante la implementacion se inventen reglas no documentadas.

Pregunta para cerrar:

> Tenemos suficiente evidencia en `02_actualizacion_datos_procesos.pdf` para definir reglas concretas, o debemos dejar algunos campos como "requiere validacion con fuente oficial"?

Recomendacion:

Crear una tabla de decision para este caso:

| Tipo de dato | Canal permitido | Documento requerido | Escala | NBA |
|---|---|---|---|---|
| Direccion | Pendiente validar | Pendiente validar | Pendiente validar | Pendiente validar |
| Ingresos | Pendiente validar | Pendiente validar | Pendiente validar | Pendiente validar |
| Telefono/correo | Pendiente validar | Pendiente validar | Pendiente validar | Pendiente validar |

## 3.6 El Caso CDT Puede Parecer Venta, No Resolucion Operativa

El caso CDT cierra bien la demo, pero hay un riesgo: puede verse como un asesor vendiendo un producto sin suficiente contexto del cliente.

Para evitarlo, el sistema debe ser cuidadoso:

- no decir "recomienda CDT";
- decir "presenta CDT como opcion y guia simulacion";
- advertir que rentabilidad depende de tasa vigente, monto, plazo y condiciones;
- sugerir enviar enlace o escalar a asesor especializado si el cliente pide recomendacion personalizada.

Pregunta para cerrar:

> El caso CDT sera una orientacion informativa con CTA o una recomendacion comercial asistida?

Mi recomendacion:

Definirlo como **orientacion de adquisicion asistida**, no recomendacion financiera.

## 3.7 Falta Definir La Experiencia De Pantalla

El spec dice "Vista de asesor" y "Dashboard", pero no define la composicion visual minima.

Para implementacion, falta especificar:

- paneles;
- tarjetas;
- estados;
- filtros;
- acciones del asesor;
- que se copia/envia al cliente;
- que se registra.

Propuesta de UI asesor:

- Panel izquierdo: conversacion y entrada de pregunta.
- Panel central: respuesta estructurada.
- Panel derecho: checklist, fuente, escalamiento, NBA.
- Barra superior: canal simulado, producto/proceso, confianza.
- Botones: copiar guion, marcar resuelto, escalar, registrar gap.

Pregunta para cerrar:

> Queremos una UI tipo consola operativa densa o una experiencia mas simple tipo chat + tarjetas?

## 3.8 Knowledge Intelligence Aun No Tiene Flujo De Accion Cerrado

La consola de friccion activa es una buena idea, pero falta cerrar el flujo.

Hoy sabemos que muestra gaps y CTA para generar FAQ. Falta:

- que datos agrupa;
- como decide que es gap;
- que significa frecuencia suficiente;
- quien aprueba el draft;
- si el draft entra a la base de conocimiento o queda como sugerencia;
- como se evita que contenido generado por IA se vuelva fuente aprobada sin revision.

Riesgo: la consola se vea como magia o reporte mockeado.

Preguntas para cerrar:

> Que condiciones crean un Knowledge Gap?

> El draft de FAQ queda como borrador pendiente de aprobacion o se incorpora automaticamente?

Recomendacion fuerte:

El draft siempre debe quedar en estado `pending_review`. En banca, contenido generado por IA no debe volverse fuente aprobada sin control humano.

## 3.9 La Indexacion Web Puede Abrir Demasiado El Alcance

Indexar la web del banco suena potente, pero es peligroso si no se limita.

Riesgos:

- contenido desactualizado;
- paginas con informacion institucional no accionable;
- duplicados;
- contradicciones con PDFs;
- crawler lento o fragil durante demo;
- depender de internet en hackathon.

Pregunta para cerrar:

> Para el MVP, vamos a indexar la web en vivo o vamos a pre-indexar/capturar paginas seleccionadas antes de la demo?

Mi recomendacion:

Pre-indexar o guardar snapshot de paginas seleccionadas. No depender de crawling en vivo.

## 3.10 MCP Esta Mencionado Pero No Tiene Rol Claro

El spec lista MCP TypeScript SDK, pero no dice que problema concreto resuelve en la demo.

Riesgo: mencionar MCP como buzzword. Un mentor tecnico puede preguntar: "por que MCP aqui y no una lectura normal de archivos?"

Necesitamos definir el rol exacto:

- MCP filesystem para exponer fuentes locales de forma controlada;
- MCP scraper/browser para indexar paginas seleccionadas;
- MCP como capa de herramientas que el agente usa con permisos limitados;
- o MCP solo como arquitectura futura.

Pregunta para cerrar:

> Que herramienta MCP concreta vamos a usar en el MVP y para que accion demostrable?

Recomendacion:

Usarlo para acceso controlado a fuentes: `read_source`, `search_sources`, `list_sources`. Si no vamos a demostrarlo, mejor no sobredimensionarlo en el pitch.

## 3.11 Falta Definir Modo De IA: Real, Mock O Hibrido

El spec dice modo hibrido, pero eso necesita bajarse.

Opciones:

1. Mock controlado para casos demo.
2. LLM real con guardrails.
3. Clasificador deterministico + respuestas estructuradas predefinidas.
4. Hibrido: reglas para intencion, LLM para redaccion, JSON validado.

Pregunta para cerrar:

> Para la demo, que tanto debe depender de un modelo real?

Mi recomendacion:

Hibrido conservador:

- reglas o clasificador simple para intencion;
- retrieval acotado por intencion;
- plantilla JSON validada;
- LLM solo para redactar `advisor_script` y draft de FAQ;
- fallback deterministico si falla el modelo.

## 3.12 Falta Una Definicion De "Personalizacion"

El spec habla de resolver personalizado, pero en la version final casi no define personalizacion.

Si no se aclara, la personalizacion puede parecer decorativa.

Propuesta:

Para el MVP, personalizacion significa adaptar la accion a:

- rol del usuario: asesor;
- canal simulado: WhatsApp/call center/oficina;
- intencion detectada;
- producto/proceso;
- nivel de confianza;
- tipo de dato o monto/plazo cuando aplique.

Pregunta para cerrar:

> Que variables de personalizacion vamos a mostrar en demo?

## 4. Decisiones Que Faltan Para Cerrar El Spec

Sugiero cerrar estas decisiones antes de construir:

1. Canal principal del asesor: WhatsApp/call center/oficina.
2. Outcome reescrito con foco operativo.
3. Taxonomia de NBA.
4. Jerarquia de fuentes aprobadas.
5. Tabla de decision para actualizacion de datos.
6. Definicion exacta del caso CDT: orientacion, no recomendacion financiera.
7. Composicion minima de UI asesor.
8. Condiciones para crear Knowledge Gap.
9. Flujo de aprobacion de contenido generado.
10. Estrategia de indexacion web: snapshot vs crawling en vivo.
11. Rol concreto de MCP.
12. Modo de IA: real, mock o hibrido.
13. Variables de personalizacion visibles.

## 5. Propuesta De Estructura Para El Spec Final

El documento actual es util, pero podria quedar mas fuerte si se reorganiza asi:

1. Decision estrategica.
2. Outcome y no-outcomes.
3. Usuario principal y canal principal.
4. Casos de uso del MVP.
5. Taxonomia de intenciones.
6. Taxonomia de siguientes mejores acciones.
7. Fuentes y jerarquia.
8. Reglas por caso de uso.
9. Output JSON contract.
10. UI spec.
11. Knowledge Intelligence spec.
12. Modelo de datos.
13. Arquitectura y MCP.
14. Criterios de aceptacion.
15. Pitch.

## 6. Preguntas Para Que Respondas Sobre Este Feedback

Estas son las preguntas que conviene responder para cerrar especificaciones:

1. Que canal representa el asesor principal de la demo: WhatsApp, call center, oficina o transversal?
2. Aceptamos reescribir el outcome hacia "resolucion operativa en primer contacto"?
3. Que tipos de NBA dejamos permitidos en el MVP?
4. Que fuente manda si PDF y web se contradicen?
5. Tenemos reglas concretas del PDF para actualizacion de datos o debemos marcar partes como pendientes de validacion?
6. El caso CDT sera orientacion informativa con CTA o recomendacion comercial asistida?
7. Queremos UI densa tipo consola operativa o chat simple con tarjetas?
8. Que condiciones generan un Knowledge Gap?
9. El draft de FAQ queda siempre pendiente de aprobacion humana?
10. La web se indexa en vivo o usamos snapshot pre-indexado?
11. Que funcion concreta cumple MCP en la demo?
12. La IA sera real, mockeada o hibrida?
13. Que variables de personalizacion se mostraran al jurado?

## 7. Conclusion

El spec va en buena direccion, pero todavia no esta cerrado para construccion. La mayor mejora pendiente es convertir conceptos correctos en contratos operativos: tipos de NBA, jerarquia de fuentes, reglas por caso, UI minima, condiciones de gap y rol real de MCP.

Mi recomendacion es no construir todavia la app completa. Primero cerremos las 13 decisiones anteriores. Si no lo hacemos, el equipo puede construir una demo visualmente atractiva pero conceptualmente inconsistente.

