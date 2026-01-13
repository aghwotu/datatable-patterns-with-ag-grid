# Enterprise Data Table Patterns (AG Grid)

Production-style data table reference implementations built with Angular + AG Grid.

This repo focuses on **real-world UI constraints** (dense data, latency, conditional actions, progressive disclosure) rather than “feature tours”.

## What’s inside

- **Trading Platform**: high-density table optimized for fast scanning, conditional actions, and latency-aware pagination.
- **Observability Table**: operations dashboard table surfacing status, latency, and timing phases with external filters and drill-down details.
- **Server-Driven Data & Filtering**: pagination/filtering under latency with loading states and debounced search.
- **Column Management**: progressive disclosure for wide, dense datasets.
- **Row Actions & Context Menus**: conditional actions that scale with state/permissions.
- **Floating Filters**: fast column-level filtering without full filter panels.
- **Grouped Column Headers**: wide-table grouping + group visibility controls.
- **Custom Cell Renderers**: scan-friendly visual cells (avatars, badges, progress, trends).
- **Baseline Grid**: a simple reference point for sort/filter/pagination.

## Design notes (what this project is trying to demonstrate)

- **Intent-first patterns**: each scenario has a user workflow, not a checklist of widgets.
- **Constraint-aware UX**: loading states, debounce, progressive disclosure, scanability.
- **Maintainable composition**: reusable components for menus/filters/renderers where it makes sense.

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
