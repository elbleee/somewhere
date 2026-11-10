# Somewhere asset library

Production art is stored by reusable layer, not baked into full-screen mockups. Vector assets remain crisp at phone and tablet sizes; content labels stay live in the app.

## Desk surfaces
- `desk-surfaces/walnut-grain.svg` — current warm walnut vector base. The approved photographic walnut texture remains the target for the next surface upgrade.

## Collection environments
- `environments/meadow.svg` — garden/yard direction.
- `environments/outer-space.svg` — Ideas direction.
- `environments/studio.svg` — Work direction.
- `environments/library.svg` — warm library scene.
- `environments/cabin.svg` — cinematic cabin interior.
- `environments/night-sky.svg` — night landscape and moon.

These are scene starting points, not yet wired to collection rendering.

## Clocks
- `clocks/clock-face.svg`
- `clocks/hour-hand.svg`
- `clocks/minute-hand.svg`
- `clocks/second-hand.svg`

Clock face and hands are separate layers. The desk clock reads the device's local time.

## Folders
- `folders/folder-sage.svg`
- `folders/folder-sand.svg`
- `folders/folder-rose.svg`
- `folders/folder-cream.svg`
- `folders/folder-blue.svg`
- `folders/folder-olive.svg`

Folder artwork contains no labels. Collection names and counts remain live app text.

## Paper
- `papers/sticky-butter.svg`
- `papers/sticky-sage.svg`
- `papers/sticky-blue.svg`
- `papers/sticky-rose.svg`
- `papers/paper-lined.svg`
- `papers/paper-blank.svg`
- `papers/paper-grid.svg`
- `papers/paper-kraft.svg`
- `papers/paper-reminder.svg`
- `papers/polaroid-frame.svg`

## Accessories
- `accessories/coffee-cup.svg`
- `accessories/potted-plant.svg`
- `accessories/brass-pen.svg`
- `accessories/brass-paperclip.svg`
- `accessories/brass-binder-clip.svg`
- `accessories/brass-pushpin.svg`
- `accessories/washi-tape.svg`
- `accessories/fern-frond.svg`

## Asset rules
- No text baked into reusable objects.
- Keep artwork independent from app controls and content.
- Prefer transparent backgrounds for isolated accessories.
- Keep shadows subtle and consistent with the default upper-left light direction.
- Theme-specific rendering preserves object identity; asset packs provide material and color variants.


## Central catalog

- `manifest.ts` is the central import catalog for surfaces, collection finishes, paper finishes, accessories, clocks, and environments.
- UI components should select a stable asset ID from the catalog instead of embedding file paths or duplicating import lists.
- The catalog records human-readable labels and lightweight grouping metadata. It does not decide which finish a user sees; that selection belongs to workspace/collection settings.

## Production consistency checklist

Before an asset is promoted from prototype to production:

1. Use a deliberate viewBox and preserve the intended aspect ratio; do not stretch stationery or accessories to fill arbitrary rectangles.
2. Keep isolated accessories transparent outside their silhouette.
3. Keep live labels, counts, and user content out of SVG artwork.
4. Use a consistent upper-left key light and a restrained shadow. Avoid baking a second shadow into artwork when the component already supplies one.
5. Keep material texture subtle enough that small text remains legible on phone screens.
6. Test each object at small, medium, and large sizes on a narrow viewport.
7. Confirm that the asset remains recognizable in all nine theme treatments.

## Known art gaps

The current vector set is a functional placeholder library, not finished production illustration. Highest-value upgrades are:
- Replace the stylized walnut vector with the approved high-resolution photographic wood surface.
- Redraw the folder and paper masters so shadow, edge, material, and color can be varied independently.
- Refine the scene environments with stronger perspective, depth, and deliberately reserved content zones.
- Expand accessory silhouettes while keeping the same object categories available in every theme.


## Layered object architecture (current direction)

Use three independent layers for desk objects:

- **Silhouette:** geometry only, monochrome SVG in `silhouettes/`. Apply finish color/material in CSS or component styling.
- **Material:** seamless or repeatable overlay in `materials/`. Texture must never define the object's geometry.
- **Elevation:** one component-level shadow recipe. Do not bake shadows into the silhouette or finish artwork.

This avoids the double-card / double-shadow problem and lets the same object take on a different theme without duplicating its shape.

### Available neutral primitives

- `silhouettes/folder.svg`
- `silhouettes/paper-sheet.svg`
- `silhouettes/sticky-note.svg`
- `silhouettes/polaroid.svg`
- `materials/paper-fiber.svg`
- `materials/linen-weave.svg`
- `materials/graph-paper.svg`
- `materials/ruled-paper.svg`
- `materials/walnut-highlight.svg`

### Theme tokens

`theme-system.ts` defines all nine themes as a complete set of palette, environment, material, lighting, texture, and shadow tokens. The default remains Clean & Textured. A collection can select its own theme independently of the main desk.

### Folder finish cleanup

The six existing folder finish SVGs have been simplified to material artwork only. Their drop shadows are now expected to come from the object component, not from inside the SVG. Keep the same rule for future finishes.

### Implementation guardrails

- A single object must have one silhouette and one elevation shadow.
- Do not place a visible card/container behind a folder or paper object.
- Use `object-fit: fill` only for surfaces designed to stretch; preserve aspect ratio for stationery and accessories.
- Use CSS masks with the neutral silhouettes when the finish needs to be recolored at runtime.
- Use the catalog in `manifest.ts`; do not create ad-hoc duplicate asset imports.


## Live finish customization

The object options sheet now exposes the reusable finish catalog:

- Collections can select any of the six folder finishes.
- Notes can select sticky or sheet paper finishes.
- Checklists, documents, and reminders can select sheet finishes.
- Photos use the dedicated Polaroid frame.

Selections are stored on each `SceneObject.appearance` record as stable asset IDs, not copied URLs. The renderer resolves those IDs through `manifest.ts`. Objects without an explicit choice receive a stable ID-based default so their appearance does not change when reordered.

Theme environment names are resolved from `theme-system.ts`; the scene class mapping translates catalog names to the existing CSS environment classes.
