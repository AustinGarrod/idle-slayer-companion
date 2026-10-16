# Design sync notes (claude.ai/design)

## Build

- The repo is an application, not a component library. `.design-sync/build-ds.mjs` (`cfg.buildCmd`) builds an input package at `.design-sync/.cache/ds-pkg/` from `.design-sync/ds-entry.ts`: sample data JSON, an ESM `index.js`, `index.css` + fonts, and tsc declarations (`types/`). The converter then runs with `--entry` from config (`.design-sync/.cache/ds-pkg/index.js`).
- `build-ds.mjs` uses the converter's staged esbuild (`.ds-sync/node_modules/esbuild`), so stage the scripts and `npm i esbuild ts-morph @types/react` in `.ds-sync/` **before** running `cfg.buildCmd`.
- npm JavaScript must stay external in `index.js`. Pre-bundling it inlines CommonJS deps that `require("react")` and every preview fails with `Dynamic require of "react" is not supported`. Package CSS (`@xyflow/react`, `@fontsource/press-start-2p`) is still inlined. On Windows the onResolve filter must skip absolute `C:\…` paths and the entry point.
- `src/analytics` and `src/pwa` are aliased to `.design-sync/stubs/` so designs never load Umami, transmit events or register a service worker. Re-check this alias if those modules gain new exports used by synced components.
- `import.meta.env.BASE_URL` is defined as `""`; sample catalog icons are rewritten to `data:` URIs so `Icon`/`EntityIcon` render without `public/`.
- Sample data: full `public/catalog.json` (288 upgrade icons inlined) and a curated companion subset (12 achievements, 12 crafts, all 25 materials, 10 quests, 8 Village board tasks, 10 enemies, 10 divinities). `sampleProfile` buys the first 14 reachable upgrades deterministically.
- `ReactFlow`, `ReactFlowProvider` and `Background` are re-exported for map previews but excluded from cards (`componentSrcMap: null`).
- App source change made for the sync: `export` added to the seven presentational helpers in `src/CompanionModules.tsx` (EntityIcon, StatusPill, ObservationSelect, CounterEditor, EntityCard, TrackingNotice, ShoppingList).

## Preview authoring

- The app paints its dark canvas on `:root`; the card harness paints `body` white and `#root{min-height:100svh}` from index.css leaves a band. Every preview story renders `<Page />`: `<style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>`.
- Companion building blocks (EntityCard, ObservationSelect, CounterEditor, ...) must sit inside `<div className="companion-page">`; selects are only styled under that scope.
- Run `package-capture.mjs` one component at a time on this machine; a multi-component capture once hung after a renderer crash.
- The per-story capture viewport is 900x700 unless `cfg.overrides.<Name>.viewport` is set; tall cards need a taller viewport or they clip.
- In `cardMode: single`, the default story is `primaryStory` or else the first export in the compiled module's export order (alphabetical in practice). Set `primaryStory` explicitly.
- Capture crash: the harness `settle()` awaits `img.decode()` for every image. `EntityIcon` uses `<img loading="lazy">`; an icon far below the viewport never loads, the tab crashes ("Target crashed") and every later cell in that run fails. Keep companion-page previews short (CompanionModules `CraftingWithPlans` renders 3 recipes + their materials for this reason). Designs themselves are unaffected.
- Dialog-hosted panels are composed inside the real `<Dialog title="…">` with `cardMode: single` (it calls `showModal()`; several modal dialogs in one grid card would stack).
- Map inspector pieces sit in `aside.details.expanded` (below 1100px `.detail-content`/`.detail-secondary` hide unless expanded; `.details` isn't positioned, give it 320–340px). `.details dd:last-child` spacing breaks if dt/dd pairs are wrapped in a div; use Fragments.
- `.atlas > footer` is `display:none` below 1100px, so SessionHistoryControls previews use a bare `<footer>` with the bar's flex inline.
- The map toolbar switches to its compact two-row layout at `max-width: 68.75em` (1100px). SearchPanel previews copy the toolbar markup with its real classes (`desktop-action`, `mobile-options`); its card viewport is 1280x700 for the desktop row.
- SearchPanel query and filter are internal state; previews set them with the native value setter plus an `input`/`change` event in `useEffect`. `inputRef` is a plain `{ current: null }` object.
- Build connection lists and React Flow edges from `visibility(...).connections`, never `sampleCatalog.connections` (that leaks hidden upgrades). `MarkerType` isn't exported; use the string `'arrowclosed'`. Native edges need `data.points = [from, to]` with centres flipped to `{x, -y}`.
- `sampleProfile` reveals 0 milestones and has no pending (owned, inactive) upgrade. Milestone/Astral/Ultra Ascension examples build a `showSpoilers: true` profile with a recorded milestone.
- `recordCompanionEntity` isn't on the bundle; custom companion progress spreads `progress.modules[system].records` directly. Quest status depends on `claimed`.
- The pwa stub fixes InstallPanel's status (online, offline-ready, can install), so "installed"/"update ready" can't be shown without a configurable stub.
- The `.d.ts` extractor drops `| null` from props: `cfg.dtsPropsFor` restores RecentUpgrades `selected` and GoalsPanel `targetId`. CompanionModules `focusedRef` (optional) and SearchPanel `inputRef` (`RefObject<HTMLInputElement | null>`) also lose `null`, which is harmless for usage.
- `.design-sync/.cache/ds-pkg/index.js` can be imported in plain Node to compute sample states before writing stories.
- Recipe costs in sample data are the game's real Coin values (20–60 digits); long cost lines are correct.

## Known render warns

(none yet)

## Re-sync risks

- `ds-entry.ts` lists the synced components and stylesheets by hand. A new reusable component or panel CSS file in `src/` is invisible until added there (ForwardImpactPanel.css was missed once). Panels not synced (Checkpoint, PrerequisiteRoutes, SavedComparison, UARoadmap, ForwardImpact, GameSaveImport, ProgressTransfer, ProgressComparison, MapApp, App) still have their CSS absent from the bundle.
- `stubs/analytics.ts` and `stubs/pwa.ts` mirror the real modules' export surface. If synced components import new names from `src/analytics` or `src/pwa`, the build fails or ships `undefined`.
- Sample data is derived from `public/catalog.json` and `public/companion-catalog.json` at build time; a catalog revision changes entity choices (the companion subset takes the first entries with icons per system) and can shift previews that look entities up by title.
- Several previews reproduce app layout context by class name (`aside.details`, `header.toolbar`, `.companion-page`, `.forward-impact`); renaming those classes in `src/` silently degrades those cards.
- `.design-sync/docs/<Name>.md` files are category-only stubs (they set the card group). Keep them body-free: a doc with a body replaces the synthesized `.prompt.md`, which drops the preview-derived `## Examples`. A new component needs a stub or it lands in `general`.
- Built with Node 24.4.1, esbuild/ts-morph freshly installed into `.ds-sync/`, Playwright 1.63.0 with cached chromium-1243.
