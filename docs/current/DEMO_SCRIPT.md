# Demo Script - Serfinanza Action Hub

Duracion objetivo: 4 a 5 minutos  
Formato: demo guiada con narrativa de producto  
Objetivo: demostrar que la atencion presencial puede convertirse en inteligencia accionable para asesores, calidad y marketing.

> Nota de vigencia 2026-05-24: la demo estable debe ejecutarse en modo `Simulado`. El modo `Microfono local` con Whisper `tiny` es un extra experimental validado, pero no debe ser la unica ruta de presentacion. Los botones actuales son `Ver asistencia`, `Cerrar`, `Resuelto`, `Escalar` y `Brecha`.

## 1. Mensaje Central

Serfinanza Action Hub no es otro chatbot bancario. Es un copiloto contextual para asesores de oficina que escucha una conversacion presencial con aviso visible, detecta preguntas bancarias, ofrece apoyo estructurado cuando el asesor lo necesita y convierte cada interaccion en datos utiles para entrenamiento, supervision y contenido.

## 2. Preparacion De La Demo

### Datos Visibles

Asesor dummy:

- Nombre: Laura Martinez
- Sede: Oficina Barranquilla Centro
- Equipo: Atencion presencial
- Seniority: asesora nueva

Cliente dummy:

- Nombre: Andres Perez
- Segmento: persona natural
- Productos activos: tarjeta de credito
- Canal preferido: WhatsApp
- Antiguedad: 2 anos
- Propension comercial: interes medio en ahorro/inversion
- Alertas: requiere validacion para cambios de informacion laboral

Estado inicial:

- Microfono: `Escuchando`
- Consentimiento: `Informado por aviso de atencion`
- Modo demo recomendado: `Simulado`
- Modo experimental opcional: `Microfono local`

## 3. Escena 1 - Apertura: Atencion Presencial

### Narrativa Del Presentador

"El reto no es solo responder preguntas. En oficina, el asesor esta hablando con el cliente y no siempre tiene tiempo de buscar en PDFs, paginas o procedimientos. Action Hub acompana esa conversacion y solo interviene cuando detecta una pregunta relevante."

### Accion En Pantalla

Abrir vista `Puesto del asesor`.

Mostrar:

- datos del asesor;
- datos del cliente;
- estado `Escuchando`;
- aviso `Consentimiento informado por aviso de atencion`;
- panel de transcripcion.

### Transcripcion Simulada

Cliente:

> Buenos dias. Quiero actualizar unos datos porque cambie de direccion y tambien cambiaron mis ingresos. Me dijeron que tal vez eso se puede hacer por WhatsApp.

Asesor:

> Claro, revisemos que tipo de datos necesitas actualizar.

Cliente:

> Entonces, puedo actualizar mi direccion y mis ingresos por WhatsApp?

### Evento Esperado

El sistema detecta pregunta:

- Intencion: `ACTUALIZACION_DATOS`
- Confianza: alta
- Fragmento: "puedo actualizar mi direccion y mis ingresos por WhatsApp?"

Debe aparecer tarjeta con botones:

- `Ver asistencia`
- `Cerrar`

## 4. Escena 2 - Asesor Pide Apoyo

### Narrativa Del Presentador

"El sistema no reemplaza al asesor. Le pregunta si necesita apoyo. Si el asesor sabe la respuesta, confirma y continua. Si no, pide una respuesta estructurada con fuente."

### Accion En Pantalla

Click en `Ver asistencia`.

### Respuesta Estructurada Esperada

Resumen:

> La actualizacion depende del tipo de dato. Los datos de contacto pueden tener canales digitales habilitados, pero informacion laboral o ingresos puede requerir soporte y validacion.

Guion sugerido:

> Senor Andres, podemos orientarlo con la actualizacion. Para datos simples como direccion o contacto se debe usar el canal habilitado por el banco. Para ingresos o informacion laboral, normalmente se requiere soporte documental o validacion adicional antes de completar el cambio.

Checklist:

- Identificar si el dato es de contacto, direccion, laboral o financiero.
- Validar canal permitido para cada tipo de dato.
- Solicitar soporte si aplica.
- Escalar si la fuente no confirma el caso.

Canal recomendado:

> Canal digital habilitado o atencion asistida segun tipo de dato.

Advertencia:

> No confirmar actualizacion de ingresos sin soporte o fuente aprobada.

Fuente:

> `DocumentoSERFINANZA/02_actualizacion_datos_procesos.pdf`

Siguiente mejor accion:

> Guiar la actualizacion de datos simples por canal permitido y validar soporte para ingresos antes de continuar.

Acciones visibles:

- `Resuelto`
- `Escalar`
- `Brecha`

### Accion En Pantalla

Click en `Resuelto`.

### Evento Esperado

Registrar:

- evento `Ver asistencia`;
- respuesta mostrada;
- fuente usada;
- evento `Resuelto`;
- tema `Actualizacion de datos`;
- asesor `Laura Martinez`;
- sede `Barranquilla Centro`.

## 5. Escena 3 - Segunda Consulta: CDT Como Adquisicion Asistida

### Narrativa Del Presentador

"El mismo flujo tambien detecta oportunidades de adquisicion. La diferencia es que no hace una recomendacion financiera definitiva; ayuda al asesor a orientar con informacion aprobada y a llevar al cliente a una siguiente accion segura."

### Transcripcion Simulada

Cliente:

> Ya que estoy aqui, tengo 5 millones guardados y quisiera saber que opcion tengo para invertirlos sin moverlos todos los dias.

### Evento Esperado

El sistema detecta pregunta:

- Intencion: `CDT`
- Confianza: media/alta
- Dato detectado: `5.000.000`
- Producto sugerido: `CDT / CDT Digital`

Aparece tarjeta con botones:

- `Ver asistencia`
- `Cerrar`

### Accion En Pantalla

Click en `Ver asistencia`.

### Respuesta Estructurada Esperada

Resumen:

> El CDT puede ser una opcion de ahorro/inversion a plazo fijo. La rentabilidad depende del monto, plazo y tasa vigente.

Guion sugerido:

> Con ese monto podemos revisar una alternativa como CDT. Es importante simularlo con la tasa vigente y el plazo que prefieras antes de tomar una decision. Puedo orientarte para hacer la simulacion o indicarte el canal digital correspondiente.

Checklist:

- Confirmar monto aproximado.
- Preguntar plazo deseado.
- Explicar que tasa y condiciones pueden variar.
- No prometer rentabilidad sin simulacion vigente.
- Ofrecer simulacion o acompanamiento.

Canal recomendado:

> Simulacion o canal digital habilitado para CDT.

Advertencia:

> No presentar como recomendacion financiera definitiva. Validar tasas vigentes.

Fuente:

> `DocumentoSERFINANZA/03_cdt_caracteristicas_beneficios.pdf`

Siguiente mejor accion:

> Ofrecer simulacion CDT con monto y plazo, y registrar oportunidad de adquisicion asistida.

### Accion En Pantalla

Click en `Resuelto`.

### Evento Esperado

Registrar:

- intencion `CDT`;
- oportunidad de adquisicion;
- respuesta con fuente;
- siguiente mejor accion;
- producto `CDT`.

## 6. Escena 4 - Reportar Brecha

### Narrativa Del Presentador

"Cuando el asesor detecta que la respuesta no es suficiente o que falta una regla clara, puede reportar una brecha. Eso no interrumpe la atencion, pero crea insumo para el administrador y para entrenamiento."

### Transcripcion Simulada

Cliente:

> Y si soy independiente y no tengo certificado laboral, que soporte me aceptan para actualizar ingresos?

### Evento Esperado

El sistema detecta:

- Intencion: `ACTUALIZACION_DATOS`
- Subtema: `ingresos independiente`
- Confianza: baja/media
- Fuente insuficiente o requiere validacion.

### Accion En Pantalla

Click en `Ver asistencia`.

El sistema muestra advertencia:

> No hay informacion suficiente en la base documental para confirmar soportes aceptados en este caso. Recomendar validacion con supervisor o area responsable.

Click en `Reportar brecha`.

### Evento Esperado

Crear brecha:

- estado: `pendiente`;
- prioridad: basada en frecuencia;
- sede: `Barranquilla Centro`;
- asesor: `Laura Martinez`;
- tema: `Actualizacion de ingresos`;
- pregunta: `soporte para independiente sin certificado laboral`;
- fuente asociada: actualizacion de datos;
- transcripcion asociada disponible solo para administrador.

## 7. Escena 5 - Panel Supervisor / Calidad

### Narrativa Del Presentador

"Cada accion del asesor se convierte en inteligencia operacional. Calidad no ve solo volumen de chats; ve donde los asesores necesitan apoyo, que sedes tienen mas friccion y que temas deben reforzarse."

### Accion En Pantalla

Abrir vista `Panel supervisor/calidad`.

Mostrar filtros:

- sede;
- asesor;
- tema;
- producto;
- canal;
- fecha;
- tipo de evento.

Mostrar KPIs:

- consultas detectadas;
- porcentaje `Lo se`;
- porcentaje `Ver respuesta`;
- escalamientos;
- brechas reportadas;
- temas con mayor apoyo requerido.

Mostrar ejemplos:

- Sede Barranquilla Centro: alta friccion en actualizacion de datos.
- Asesora Laura Martinez: refuerzo sugerido en actualizacion de ingresos.
- Producto CDT: oportunidad de adquisicion recurrente.

### Punto A Demostrar

La herramienta no evalua al asesor de forma punitiva. Identifica necesidades de refuerzo y entrenamiento.

## 8. Escena 6 - Consola Administrador

### Narrativa Del Presentador

"El administrador revisa las brechas reportadas. Puede ver estado, frecuencia, fuente asociada y transcripcion cuando aplica. Asi el conocimiento del banco deja de estar congelado en documentos y empieza a mejorar desde la atencion real."

### Accion En Pantalla

Abrir vista `Consola administrador`.

Mostrar cola:

- brecha `Actualizacion de ingresos - trabajador independiente`;
- estado `pendiente`;
- frecuencia;
- sede;
- asesor;
- fuente asociada;
- accion sugerida textual: `validar fuente y reforzar entrenamiento`.

Cambiar estado:

- `pendiente` a `en revision`.

### Punto A Demostrar

La brecha no queda perdida en una conversacion. Entra en flujo operativo.

## 9. Escena 7 - Reporte Marketing

### Narrativa Del Presentador

"La misma data sirve para marketing, pero sin entregar transcripciones. El sistema genera un reporte diario Markdown con evidencia agregada, comparacion contra el indice web del banco y briefs accionables para revision humana."

### Accion En Pantalla

Abrir vista `Reporte marketing`.

Mostrar oportunidad:

- Tema: `Como actualizar datos personales y laborales`
- Estado web: `contenido incompleto`
- Evidencia agregada: consultas repetidas sobre direccion, ingresos y soportes
- Recomendacion: crear FAQ o mejorar pagina existente
- Revision humana requerida: si

Mostrar vista previa de reporte Markdown.

### Extracto Esperado Del Markdown

```md
# Reporte Diario De Oportunidades De Contenido

Fecha: 2026-05-23
Fuente: interacciones agregadas de oficina presencial

## Resumen Ejecutivo

La principal friccion del dia fue actualizacion de datos, especialmente diferencias entre datos de contacto, direccion e informacion laboral.

## Oportunidad Prioritaria

### Actualizacion De Datos Personales Y Laborales

- Evidencia: consultas repetidas en sede Barranquilla Centro.
- Estado web: contenido incompleto.
- Recomendacion: crear FAQ clara sobre tipos de datos, canales y soportes.
- Fuentes: documento de actualizacion de datos + indice web precargado.
- Revision humana requerida: si.

## Tareas Sugeridas

1. Validar reglas con operaciones.
2. Actualizar FAQ publica.
3. Reforzar onboarding de asesores nuevos.
```

### Punto A Demostrar

Marketing recibe insumos accionables basados en friccion real, no ideas abstractas de contenido.

## 10. Cierre De Demo

### Narrativa De Cierre

"Action Hub convierte una conversacion presencial en tres resultados: el asesor resuelve mejor en el momento, calidad detecta necesidades reales de entrenamiento y marketing recibe oportunidades de contenido basadas en evidencia. La promesa no es automatizar al asesor; es hacer que cada atencion mejore el conocimiento del banco."

## 11. Secuencia Recomendada Para Presentar

1. Abrir con el dolor: conocimiento disperso y asesores bajo presion.
2. Mostrar puesto del asesor.
3. Ejecutar caso actualizacion de datos.
4. Ejecutar caso CDT.
5. Reportar una brecha.
6. Mostrar dashboard de calidad.
7. Mostrar consola administrador.
8. Mostrar reporte marketing.
9. Cerrar con impacto: servicio, entrenamiento y adquisicion.

## 12. Riesgos A Evitar Durante La Demo

- No decir que el sistema reemplaza al asesor.
- No decir que el sistema toma decisiones financieras.
- No prometer audio real si la demo usa transcripcion simulada.
- No mostrar marketing con transcripciones completas.
- No presentar datos dummy como datos reales.
- No hablar de MCP como parte del MVP.
- No vender pagos agenticos dentro del alcance actual.

## 13. Frases Utiles Para Jurados

- "No medimos volumen de chats; medimos friccion operativa."
- "El asesor sigue en control. La IA aparece solo como apoyo contextual."
- "Cada clic genera inteligencia para entrenamiento y mejora de contenido."
- "La demo corre local y no depende criticamente de la API."
- "Marketing no recibe conversaciones; recibe evidencia agregada y briefs revisables."
