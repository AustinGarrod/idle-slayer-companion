import { Dialog, InstallPanel } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}

// MapApp: <Dialog title="Install & offline"><InstallPanel …/></Dialog>. Design previews use a
// fixed PWA status: online, offline files ready, install prompt offered.
export const ReadyToInstall = () => (
  <>
    <Page />
    <Dialog title="Install & offline" close={noop}>
      <InstallPanel onReload={noop} onRepair={noop} progressStatus="Current progress is saved on this device." />
    </Dialog>
  </>
)

export const RepairInProgress = () => (
  <>
    <Page />
    <Dialog title="Install & offline" close={noop}>
      <InstallPanel onRepair={noop} repairBusy progressStatus="Saving current progress on this device…" />
    </Dialog>
  </>
)
