import { ReadOnlyRequirement, SPCost, sampleCatalog, sampleProfile, visibility } from 'idle-slayer-companion'
import type { Profile } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>


// ReadOnlyRequirement is rendered by ForwardImpactPanel inside the
// "Analyze forward impact" dialog. The dialog surface is inlined here;
// .forward-impact type comes from ForwardImpactPanel.css in the bundle.
const dialog = { width: 520, padding: 20, border: '1px solid var(--frame)', borderRadius: 8, background: 'var(--surface)', fontSize: '.875rem', lineHeight: 1.5 }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!
const visible = visibility(sampleCatalog, sampleProfile)

/** A blocked proposal lists its current purchase and reveal gates. */
export const CurrentGates = () => {
  const target = byTitle('Green Ore')
  return <div className="forward-impact" style={dialog}>
    <Page />
    <h3>Proposed purchase: {target.title}</h3>
    <small style={{ display: 'block' }}>ID: {target.id} · <SPCost value={target.cost} /></small>
    <p role="status">Purchase requirements are not met. Record the missing prerequisites first.</p>
    <h3>Current purchase gates</h3>
    <ReadOnlyRequirement requirement={target.purchase} profile={sampleProfile} visible={visible} />
    <h3>Current reveal gates</h3>
    <ReadOnlyRequirement requirement={target.reveal} profile={sampleProfile} visible={visible} />
  </div>
}

/** An affected row after a hypothetical Red Ore purchase: one AND leaf now satisfied. */
export const RequirementsAfterEvent = () => {
  const red = byTitle('Red Ore'), row = byTitle('Green Ore')
  const after: Profile = { ...sampleProfile, purchases: { ...sampleProfile.purchases, [red.id]: { epoch: 0, active: true } } }
  return <div className="forward-impact" style={dialog}>
    <Page />
    <h3>Still blocked (1)</h3>
    <ul className="forward-impact-rows" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      <li style={{ padding: '12px 0', borderTop: '1px solid #574631' }}>
        <h4 style={{ margin: 0 }}>{row.title}</h4>
        <small style={{ display: 'block' }}>ID: {row.id} · <SPCost value={row.cost} /></small>
        <p>Purchase gates: Missing → Missing.<br />Reveal gates: Satisfied → Satisfied.</p>
        <details open><summary style={{ minHeight: 44, cursor: 'pointer' }}>Requirements after this event</summary>
          <b>Purchase</b><ReadOnlyRequirement requirement={row.purchase} profile={after} visible={visible} />
          <b>Reveal</b><ReadOnlyRequirement requirement={row.reveal} profile={after} visible={visible} />
        </details>
      </li>
    </ul>
  </div>
}

/** OR alternatives with upgrade IDs, as shown for a satisfied row. */
export const OrAlternatives = () => {
  const row = byTitle('Legendary Belt')
  return <div className="forward-impact" style={dialog}>
    <Page />
    <h3>Already eligible before this event (1)</h3>
    <h4 style={{ margin: 0 }}>{row.title}</h4>
    <small style={{ display: 'block' }}>ID: {row.id} · <SPCost value={row.cost} /></small>
    <b>Purchase</b><ReadOnlyRequirement requirement={row.purchase} profile={sampleProfile} visible={visible} />
  </div>
}

/** Gates whose every leaf is hidden while spoilers are off. */
export const HiddenGates = () => {
  const target = byTitle('Chest In a Chest')
  return <div className="forward-impact" style={dialog}>
    <Page />
    <h3>Current purchase gates</h3>
    <ReadOnlyRequirement requirement={target.purchase} profile={sampleProfile} visible={visible} />
    <p>Only visible requirement portions are explained; native gates still apply.</p>
  </div>
}
