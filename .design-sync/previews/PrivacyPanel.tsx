import { Dialog, PrivacyPanel } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
type Status = { enabled: boolean; reason: string; active: boolean; preference: 'enabled' | 'disabled' | 'unavailable' }
const saved = 'Current progress is saved on this device.'

// MapApp: <Dialog title="Privacy & tracking"><PrivacyPanel status={getTrackingStatus()} …/></Dialog>
const Privacy = ({ status, progressStatus = saved, companion = false }: { status: Status; progressStatus?: string; companion?: boolean }) => (
  <>
    <Page />
    <Dialog title="Privacy & tracking" close={noop}>
      <PrivacyPanel status={status} onChange={noop} progressStatus={progressStatus}
        additionalActions={companion ? <button onClick={noop}>Review Ascension references</button> : undefined} />
    </Dialog>
  </>
)

export const TrackingEnabled = () => <Privacy status={{ enabled: true, reason: 'enabled', active: true, preference: 'enabled' }} />

export const TrackingDisabled = () => <Privacy status={{ enabled: false, reason: 'opt-out', active: false, preference: 'disabled' }} companion />

export const BrowserPrivacySignal = () => <Privacy status={{ enabled: false, reason: 'global-privacy-control', active: false, preference: 'enabled' }} progressStatus="Current progress is not saved on this device." />
