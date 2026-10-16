import { CounterEditor } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// In the app these sit in an EntityCard's fieldset.companion-card-controls under .companion-page.
const page = { padding: 16, width: 'auto', maxWidth: 420 }
const noop = () => {}

export const QuestProgress = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <CounterEditor label="Recorded progress" value="6400" target="15000" onChange={noop} />
    </fieldset>
  </div>
)

export const TargetReached = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <CounterEditor label="Recorded progress" value="120" target="120" onChange={noop} />
    </fieldset>
  </div>
)

export const NotRecorded = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <CounterEditor label="Recorded progress" target="25000" onChange={noop} />
    </fieldset>
  </div>
)

export const InventoryAndKills = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <CounterEditor label="Recorded inventory" value="140" onChange={noop} />
      <CounterEditor label="Recorded kills" value="18450" onChange={noop} />
    </fieldset>
  </div>
)
