# Functional Spec - Serfinanza Action Hub

## 1. Proposito

Este documento define el comportamiento funcional esperado de Serfinanza Action Hub para el MVP de hackathon.

El objetivo no es describir toda la arquitectura ni toda la interfaz. El objetivo es dejar claro que debe hacer el producto, como debe responder y que criterios debe cumplir para demostrar el outcome principal.

## 2. Outcome Funcional

El sistema debe convertir una necesidad bancaria expresada por un cliente o asesor en una respuesta personalizada, confiable y accionable, terminando en una siguiente mejor accion o en un escalamiento justificado.

## 3. Roles Del MVP

### 3.1 Asesor

Usuario interno que consulta procesos para atender mejor a un cliente.

Capacidades:

- Hacer preguntas operativas.
- Recibir respuesta recomendada para el cliente.
- Ver checklist del proceso.
- Ver canal recomendado.
- Ver fuente usada.
- Ver criterio de escalamiento.

### 3.2 Cliente

Usuario externo que consulta sobre productos o necesidades financieras.

Capacidades:

- Hacer preguntas en lenguaje natural.
- Recibir explicacion clara.
- Recibir siguiente mejor accion.
- Ver advertencias cuando apliquen.
- Avanzar hacia CTA simulado.

### 3.3 Knowledge Intelligence

Vista interna para entender que esta ocurriendo en las interacciones.

Capacidades:

- Ver intenciones frecuentes.
- Ver vacios de conocimiento.
- Ver oportunidades de contenido.
- Ver metricas de resolucion, calidad y escalamiento.

## 4. Estados De Una Interaccion

Toda interaccion debe pasar por estos estados logicos:

1. Captura de pregunta.
2. Deteccion de rol.
3. Deteccion de intencion.
4. Identificacion de producto o proceso.
5. Consulta de conocimiento aprobado o reglas.
6. Generacion de respuesta.
7. Seleccion de siguiente mejor accion.
8. Evaluacion de seguridad o escalamiento.
9. Registro de evento auditable.

## 5. Tipos De Salida

El sistema puede producir cuatro tipos de salida:

### 5.1 Respuesta Informativa

Explica un concepto o proceso.

Ejemplo:

"Un CDT es un producto de ahorro e inversion a plazo fijo..."

### 5.2 Respuesta Operativa

Entrega pasos, documentos, canal y criterio de escalamiento.

Ejemplo:

"Para actualizar informacion laboral, solicita soporte documental y deriva al canal..."

### 5.3 Siguiente Mejor Accion

Recomienda una accion concreta.

Ejemplo:

"Siguiente mejor accion: guiar al cliente a actualizar direccion por canal digital y escalar ingresos por requerir soporte."

### 5.4 Escalamiento

Indica que el sistema no debe resolver de forma automatica.

Ejemplo:

"Este caso requiere validacion humana porque implica datos sensibles o documentacion no confirmada."

## 6. Flujo Principal De Demo - Asesor Actualiza Datos

### 6.1 Entrada

Rol:

Asesor.

Pregunta ejemplo:

"Cliente quiere cambiar ingresos y direccion por WhatsApp. Se puede?"

### 6.2 Comportamiento Esperado

El sistema debe:

1. Detectar que el usuario es asesor interno.
2. Detectar la intencion: actualizacion de datos.
3. Distinguir entre datos de contacto/direccion y datos laborales/ingresos.
4. Consultar reglas o fuente documental relacionada con actualizacion de datos.
5. Entregar respuesta operativa.
6. Recomendar canal por tipo de dato.
7. Indicar documentos o soportes cuando aplique.
8. Incluir fuente o referencia.
9. Indicar si hay que escalar.
10. Registrar evento para Knowledge Intelligence.

### 6.3 Salida Esperada

La respuesta debe incluir:

- Resumen corto para el asesor.
- Respuesta sugerida para entregar al cliente.
- Checklist operativo.
- Canal recomendado.
- Documentos o soportes requeridos.
- Criterio de escalamiento.
- Fuente consultada.
- Siguiente mejor accion.

### 6.4 Siguiente Mejor Accion

La siguiente mejor accion recomendada debe ser:

"Actualizar los datos simples por canal permitido y escalar o completar por canal validado los datos que requieran soporte documental."

### 6.5 Criterios De Aceptacion

El flujo se considera correcto si:

- No responde de forma generica.
- Diferencia direccion de ingresos.
- No afirma que todo se puede hacer por WhatsApp si hay restricciones.
- Entrega checklist accionable.
- Cita o muestra fuente.
- Registra la interaccion como caso de actualizacion de datos.

## 7. Flujo De Cierre De Demo - Cliente Interesado En CDT

### 7.1 Entrada

Rol:

Cliente.

Pregunta ejemplo:

"Tengo 5 millones y quiero invertirlos 180 dias. Que me conviene?"

### 7.2 Comportamiento Esperado

El sistema debe:

1. Detectar intencion de inversion.
2. Identificar producto candidato: CDT.
3. Extraer monto: 5.000.000.
4. Extraer plazo: 180 dias.
5. Consultar conocimiento aprobado sobre CDT.
6. Explicar el producto en lenguaje claro.
7. Mostrar una simulacion o estimacion si los datos disponibles lo permiten.
8. Advertir que tasas y condiciones pueden variar.
9. Proponer siguiente mejor accion de adquisicion.
10. Registrar intencion de adquisicion.

### 7.3 Salida Esperada

La respuesta debe incluir:

- Explicacion breve de CDT.
- Resumen de monto y plazo interpretado.
- Beneficio o razon por la que podria aplicar.
- Advertencia sobre tasas/condiciones.
- CTA simulado: "Simular CDT", "Iniciar solicitud" o "Hablar con asesor".
- Fuente consultada.
- Siguiente mejor accion.

### 7.4 Siguiente Mejor Accion

La siguiente mejor accion recomendada debe ser:

"Simular CDT con monto y plazo indicados y ofrecer inicio de solicitud o contacto con asesor."

### 7.5 Criterios De Aceptacion

El flujo se considera correcto si:

- No da una recomendacion financiera absoluta.
- No inventa una tasa no disponible.
- Reconoce monto y plazo.
- Convierte la consulta en una accion de adquisicion.
- Registra la interaccion como oportunidad CDT.

## 8. Knowledge Intelligence

### 8.1 Proposito

Knowledge Intelligence convierte interacciones en aprendizaje para mejorar atencion y adquisicion.

No es un modulo de marketing automation. Es una capacidad de inteligencia operacional y de conocimiento.

### 8.2 Datos A Registrar Por Interaccion

Cada interaccion debe registrar:

- Fecha y hora.
- Rol.
- Canal simulado.
- Pregunta.
- Intencion detectada.
- Producto o proceso.
- Fuente usada.
- Tipo de salida.
- Siguiente mejor accion.
- Si hubo escalamiento.
- Si hubo vacio de conocimiento.
- CTA recomendado.

### 8.3 Metricas Del Dashboard

El dashboard debe mostrar:

- Resolucion en primer contacto estimada.
- Tiempo ahorrado al asesor.
- Respuestas con fuente aprobada.
- Siguientes mejores acciones generadas.
- Escalamientos correctos.
- Vacios de conocimiento detectados.
- Oportunidades de contenido.
- Intenciones de adquisicion detectadas.

### 8.4 Oportunidades De Contenido

El sistema debe sugerir contenido cuando detecte:

- Preguntas frecuentes repetidas.
- Procesos con alta friccion.
- Preguntas sin fuente suficiente.
- Intenciones de adquisicion no convertidas.

Ejemplos:

- FAQ: "Como actualizar mis datos en Serfinanza?"
- Guia: "Como entender el extracto de mi tarjeta de credito?"
- FAQ: "Que debo saber antes de abrir un CDT?"

## 9. Reglas De Seguridad Funcional

El sistema debe:

- No ejecutar pagos reales.
- No abrir productos reales.
- No consultar datos personales reales.
- No inventar tasas, costos o requisitos.
- Escalar cuando no haya fuente suficiente.
- Mostrar advertencia cuando la informacion sea variable.
- Diferenciar informacion, recomendacion y accion.
- Registrar eventos auditables.

## 10. Reglas De Personalizacion

La personalizacion debe considerar:

- Rol del usuario.
- Producto o proceso.
- Intencion.
- Canal simulado.
- Datos entregados por el usuario.
- Nivel de riesgo de la accion.

Ejemplos:

- Una misma pregunta sobre actualizacion de datos debe responder distinto para cliente y asesor.
- Una consulta sobre CDT con monto y plazo debe producir una accion mas especifica que una consulta generica.
- Una accion sensible debe pedir confirmacion o escalar.

## 11. Componentes Funcionales Del MVP

### 11.1 Motor De Intencion

Clasifica la pregunta en una intencion principal:

- Actualizacion de datos.
- CDT.
- Tarjeta de credito.
- App / registro.
- Extracto.
- Otra / desconocida.

### 11.2 Motor De Conocimiento

Consulta documentos, reglas o contenido aprobado para construir la respuesta.

### 11.3 Motor De Siguiente Mejor Accion

Define la accion recomendada segun rol, intencion, producto y riesgo.

### 11.4 Motor De Seguridad Y Escalamiento

Determina si la accion puede continuar, debe pedir confirmacion o debe escalar.

### 11.5 Registro De Auditoria

Guarda la interaccion y los datos necesarios para dashboard.

## 12. Modo De Prototipo

Para hackathon, el sistema puede operar en modo hibrido:

- Respuestas controladas para los casos principales de demo.
- Busqueda documental simple para mostrar fuentes.
- Datos simulados para metricas y dashboard.
- Acciones simuladas para adquisicion o preparacion.

El prototipo debe priorizar confiabilidad de la demo sobre autonomia amplia.

