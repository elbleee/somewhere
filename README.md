# Somewhere

A visual, tactile personal organizer.

## Product direction

Somewhere is organized around visual spaces rather than conventional lists and folders. The home screen is a desk; collections open into their own environments; notes, checklists, photos, links, documents, and reminders behave like physical objects.

## Design principles

- Clean & Textured is the initial visual system.
- Nine themes share the same object identities and interaction model.
- Themes change the visual language; asset packs change the available materials and objects.
- Scenes are layered: surface, environment, objects, accessories, lighting, and controls.
- Collections can be nested and themed independently.
- Controls use lightweight line icons and contextual fan-out interactions.
- Normal swipes scroll. Moving an object requires a deliberate press-and-hold.

## Development

This repository uses React, TypeScript, and Vite.

```bash
npm install
npm run dev
npm run build
```

## Current milestone

Milestone 02 adds recursive collection ownership, breadcrumb navigation, per-collection theme settings, editable content records, and automatic local persistence in the browser. Milestone 03 adds long-press object arrangement, grid reordering, size presets, move between collections, rename, duplicate, delete, and undo/redo for structural changes. Production visual assets are a separate pipeline; the current surface and stationery treatments are placeholders, not final art.

## Project structure

- `src/scenes/` — scene composition and configuration
- `src/components/` — reusable interface and scene components
- `src/assets/` — layered production asset library
- `src/types.ts` — shared scene and object types
- `src/App.tsx` — initial desk experience
