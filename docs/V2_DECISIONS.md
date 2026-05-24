# V2 Decisions - Serfinanza Action Hub

Fecha: 2026-05-24

## Decisiones Cerradas

1. Login con usuario y contraseña dummy.
2. Admin ve todo; asesor, supervisor y marketing solo ven su vista correspondiente.
3. Flujo asesor con jornada, pausa/reanudacion del copiloto e inicio de atencion.
4. Documento de cliente obligatorio antes de iniciar atencion.
5. Si el documento no existe, se muestra error. Solo clientes dummy.
6. Insights del cliente: operativos + comerciales suaves.
7. Reemplazar `Control demo` por flujo realista: iniciar jornada, buscar cliente, iniciar atencion y activar copiloto.
8. Tarjeta de deteccion simplificada: `Ver asistencia` y `Cerrar`; dentro de respuesta aparecen `Marcar resuelto`, `Escalar` y `Reportar brecha`.
9. Dashboard calidad con seed de 30 dias y tendencias.
10. Brechas con filtros por estado, tema, sede, asesor, prioridad y fecha.
11. Marketing con oportunidades accionables + comparacion por segmento/canal/sede.
12. Estrategia: spec breve + implementacion inmediata.

## Deuda Tecnica Explicitada

- El avance de transcripcion sigue siendo simulado. Debe evolucionar a interaccion mas natural con barra espaciadora o speech-to-text real.
- La autenticacion es dummy y no debe tratarse como seguridad real.
- Los datos de cliente son dummy y no provienen de core bancario.

