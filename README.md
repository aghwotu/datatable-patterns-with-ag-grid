# AG-Grid Patterns Demo

**[Live demo →](https://datatable-patterns-with-ag-grid.vercel.app/)**

A POC / visual reference for common AG-Grid features — patterns that come up repeatedly across real projects, shown in an Angular app with no Enterprise license required.

Built to have a place to see how AG-Grid features look and behave when composed together. Each demo includes source code you can browse inline.

## What's inside

### Feature Explorer

A controlled environment for isolating AG-Grid behaviors—column visibility, row actions, filters, renderers, and grouping—to understand how individual features affect table density, usability, and complexity. Toggle features on/off to evaluate UX trade-offs in isolation.

![Feature Explorer](src/public/feature-explorer.png)

**Features demonstrated:**

- Column visibility management with progressive disclosure
- Row actions and context menus
- Custom cell renderers (badges, progress bars, trends)
- Grouped column headers with visibility controls
- Floating filters
- Row selection and details panels

### Observability Table

A production-style observability table inspired by [OpenStatus](https://data-table.openstatus.dev/), designed to surface status, latency, and trends without overwhelming operators. Focuses on dense data scanning, conditional highlighting, and drill-down workflows.

![Observability Table](src/public/open-status.png)

**Features demonstrated:**

- External filter panels with status/method/endpoint filtering
- Custom cell renderers for status, latency, and timing phases
- Server-driven data with debounced search
- Loading states and latency-aware pagination
- High-signal UI optimized for operational monitoring

## Notes

- **AG-Grid Community only** — no Enterprise features, so the patterns apply to most projects.
- This is a POC. The code is exploratory, not held to production standards.

## Tech Stack

- **Angular 21** with Signals
- **AG-Grid Community 35** (no Enterprise features)
- **Angular CDK** for menus and overlays
- **Tailwind CSS 4** for styling
- **RxJS** for reactive data flows

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Project Status

Actively developed. Feedback and contributions welcome — open an issue or reach out.
