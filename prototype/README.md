# Serfinanza Action Hub Prototype

Prototipo local del MVP definido en `../SERFINANZA_ACTION_HUB_SPEC.md`.

## Requisitos

- Node.js 22+
- npm

## Instalacion

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Vistas

- `/advisor`: puesto del asesor con transcripcion simulada.
- `/quality`: dashboard de calidad/supervision.
- `/admin`: cola de brechas.
- `/marketing`: oportunidades y reporte diario Markdown.

## IA

El flujo principal funciona sin API key.

Gemini funciona como mejora opcional para generar el reporte Markdown de marketing.

Crear `.env.local` si quieres activarlo:

```bash
GEMINI_API_KEY=tu_api_key
GEMINI_MODEL=gemini-1.5-flash
```

Si la API falla o no existe la variable, el MVP usa fallback deterministico.

## Persistencia

Usa SQLite local mediante `node:sqlite`.

Archivos generados:

- `data/action-hub.sqlite`
- `generated/reports/marketing-YYYY-MM-DD.md`

Estos archivos estan ignorados por `.gitignore`.

## Verificacion

```bash
npm run typecheck
npm run build
```
