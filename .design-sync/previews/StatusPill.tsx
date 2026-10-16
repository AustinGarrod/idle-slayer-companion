import { StatusPill } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const surface = { background: 'var(--canvas)', padding: 16, borderRadius: 6 }

export const RecordedStates = () => (
  <div style={{ ...surface, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Page />
    <StatusPill status="complete">Earned</StatusPill>
    <StatusPill status="incomplete">Not earned</StatusPill>
    <StatusPill status="unknown">Not recorded</StatusPill>
  </div>
)

export const SystemLabels = () => (
  <div style={{ ...surface, display: 'grid', gap: 10 }}>
    <Page />
    <div className="companion-card-badges"><StatusPill status="complete">Owned</StatusPill><span className="companion-tag">Permanent</span></div>
    <div className="companion-card-badges"><StatusPill status="incomplete">Not claimed</StatusPill></div>
    <div className="companion-card-badges"><StatusPill status="complete">Selected</StatusPill><span className="companion-tag">Dark Divinities</span></div>
    <div className="companion-card-badges"><StatusPill status="incomplete">In progress</StatusPill><span className="companion-tag">Village board</span></div>
  </div>
)
