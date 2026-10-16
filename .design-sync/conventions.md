# Building with the Idle Slayer Companion design system

Idle Slayer Companion is an unofficial, dark-only companion for the game Idle Slayer: cocoa/charcoal surfaces, gold frames, magenta connections, pixel headings over readable system text. Components are plain React from `window.IdleSlayerCompanion`; **no provider or theme wrapper is needed**. Link `styles.css` once: it carries every token, global element style, component class and the Press Start 2P font.

## Page setup

- The app paints its canvas on `:root` (`background: #15120f; color: #f8efd9`). If your page or a container sets its own background, use `background: var(--canvas)`. Never put these components on white.
- `h1`/`h2` render in Press Start 2P automatically; keep it for headings only. Body text is system-ui. `small` is a muted block.
- Global element styles apply with no class: `button` (raised, 44px tall, gold border on hover), `button.primary` (gold fill, the one main action), `button.danger`, `button.full` (full width), `input`, `input[type=checkbox]`, `a` (bright gold).

## Tokens (CSS custom properties)

`--canvas` page · `--surface` panels/dialogs · `--raised` buttons/cards · `--frame` gold borders and accents · `--bright-gold` emphasis, links, focus · `--connection` magenta map links · `--muted` secondary text · `--complete` green success · `--danger` destructive/error. Style your own glue with `var(--…)`, not new hex values.

## Class vocabulary (from the bundled CSS)

- Companion pages: wrap module content in `div.companion-page` (centred, max 1360px, padded; it also styles `select`). Page title: `header.companion-page-header` containing `span.companion-eyebrow`, `h1`, `p`. Section heading: `div.companion-subheading` with an `h2` and a `span.companion-tag`. Card grid: `div.companion-entity-grid`. Overview tiles: `.companion-journey-grid` / `.companion-journey-card`. Empty state: `div.companion-empty-state` (`span` symbol, `h2`, `p`). Notice: `.companion-blocker`.
- Recorded status: `<StatusPill status="complete" | "incomplete" | "unknown">`. Unknown progress always reads "Not recorded", never "incomplete".
- Dialog body: `<Dialog title close>` children are `p`, lists and a `div.dialog-actions` with `button.primary` first.
- Ascension map: `UpgradeCard` is the React Flow node type `upgrade`. Render it through `ReactFlowProvider` + `ReactFlow` with `nodeTypes`/`edgeTypes` from this bundle, inside `section.atlas > .workspace > section.map`. The map is read-only: `nodesDraggable={false} nodesConnectable={false}`. The upgrade inspector is `aside.details.expanded`. Costs use `<SPCost value="…">` (decimal strings, never numbers).

## Data and spoiler rules

Sample data ships on the bundle: `sampleCatalog`, `sampleProfile`, `sampleEmptyProfile`, `sampleVisibleUpgrades`, `sampleRecommendations`, `sampleCompanionEntities`, `sampleCompanionProgress`, `sampleEmptyCompanionProgress`, plus helpers `visibility`, `upgradeState`, `recommendUpgrades`, `emptyProfile`, `emptyCompanionProgress`. Show only what `visibility(catalog, profile)` returns (its `upgrades` and `connections`); never list hidden upgrades, connections or totals. Companion components never simulate spending or rewards.

## Where the truth lives

`styles.css` imports `_ds_bundle.css` (all app stylesheets). Read it before inventing classes. Each component's `components/<group>/<Name>/<Name>.prompt.md` has its props and verified examples, and `<Name>.html` shows the real renders.

## Example

```jsx
const { CompanionShell, CompanionModules, StatusPill, sampleCompanionEntities, sampleCompanionProgress } = window.IdleSlayerCompanion
const noop = () => {}

<CompanionShell section="bestiary" onNavigate={noop} ascension={null} onImport={noop} onBackup={noop}>
  <CompanionModules section="bestiary" entities={sampleCompanionEntities} progress={sampleCompanionProgress}
    onRecord={noop} onTrack={noop} pinnedRefs={new Set()} onPinGoal={noop} onNavigate={noop}
    recipePlans={{}} onRecipePlan={noop} />
</CompanionShell>

// Your own section inside a companion page:
<div className="companion-page">
  <header className="companion-page-header"><span className="companion-eyebrow">Season goals</span><h1>Trophy hunt</h1><p>Achievements you have recorded this week.</p></header>
  <div className="companion-subheading"><h2>Recorded</h2><span className="companion-tag">Visible entries only</span></div>
  <StatusPill status="complete">Earned</StatusPill>
  <div className="dialog-actions"><button className="primary">Pin as goal</button><button>Cancel</button></div>
</div>
```
