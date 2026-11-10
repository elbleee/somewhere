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

Milestone 02 adds recursive collection ownership, breadcrumb navigation, per-collection theme settings, editable content records, and automatic local persistence in the browser. Milestone 03 adds long-press object arrangement, grid reordering, size presets, move between collections, rename, duplicate, delete, and undo/redo for structural changes. Milestone 04 introduced object-specific visual treatments. The asset-library milestone now adds reusable SVG folders (six finishes), sticky notes (four colors), lined/blank/grid/kraft/reminder paper, a Polaroid frame, coffee cup, potted plant, brass pen, brass paperclip, and a dedicated walnut-grain surface. Collection folders, notes, checklists, documents, reminders, photos, and perimeter accessories now reference independent assets where integrated. These are first-pass vector assets, not final photographic art.

## Project structure

- `src/scenes/` — scene composition and configuration
- `src/components/` — reusable interface and scene components
- `src/assets/` — layered production asset library
- `src/types.ts` — shared scene and object types
- `src/App.tsx` — initial desk experience

## Asset integration and mobile fixes

- The main desk always retains the walnut surface; collection themes select independent scene backgrounds.
- Scene SVGs are first-pass illustrations, not photographic final art.
- Accessories and the layered live clock are imported through Vite so deployed asset URLs resolve correctly under GitHub Pages' `/somewhere/` path.
- Touch gestures no longer capture the pointer immediately, preserving ordinary vertical scrolling while keeping press-and-hold behavior.
- A successful production build and iPhone visual regression check are still required before declaring this release verified.
