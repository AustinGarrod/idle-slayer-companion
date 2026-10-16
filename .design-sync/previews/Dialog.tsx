import { Dialog, SPCost, sampleCatalog } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const upgrade = (title: string) => sampleCatalog.upgrades.find((node) => node.title === title)!
// MapApp's previewIdentity(): title and exact SP cost.
const identity = (title: string) => { const node = upgrade(title); return <>{node.title} · <SPCost value={node.cost} /></> }

export const RecordPurchase = () => (
  <>
    <Page />
    <Dialog title="Record purchase?" close={noop}>
      <p>Record 3 purchases, including missing prerequisites.</p>
      <ul className="upgrade-changes">
        {['Land Lord', 'Leadership Master', 'Daily Silver Bonus'].map((title) => <li key={title} data-upgrade-id={upgrade(title).id}>{identity(title)}</li>)}
      </ul>
      <div className="dialog-actions purchase-confirm-actions">
        <button className="primary" onClick={noop}>Apply purchases</button>
        <button onClick={noop}>Cancel</button>
      </div>
    </Dialog>
  </>
)

export const ChoosePrerequisitePath = () => (
  <>
    <Page />
    <Dialog title="Choose a prerequisite path" close={noop}>
      <p>This OR requirement has no satisfied path. Choose before any progress changes.</p>
      <button className="full" onClick={noop}>Gem Buyer</button>
      <button className="full" onClick={noop}>Gem Seller</button>
    </Dialog>
  </>
)

export const ReloadWithUnsavedProgress = () => (
  <>
    <Page />
    <Dialog title="Reload with unsaved progress?" close={noop}>
      <p>Current progress could not be saved. Reloading may lose these changes and clears session-only Undo and Redo. Export a backup first to keep this progress.</p>
      <p>Recording stops when you confirm the tracking change and reload. Cancelling keeps this session and its current tracking choice.</p>
      <div className="dialog-actions">
        <button className="primary" onClick={noop}>Export backup and reload</button>
        <button className="danger" onClick={noop}>Reload without backup</button>
        <button onClick={noop}>Cancel</button>
      </div>
    </Dialog>
  </>
)
