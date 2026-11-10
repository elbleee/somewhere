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
