import { Dialog, PriorAscensionsForm } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const review = () => undefined

// MapApp: inside <Dialog title="Your progress"> → .progress-actions, after Ultra Ascend…
const Progress = ({ epoch, disabled = false }: { epoch: number; disabled?: boolean }) => (
  <>
    <Page />
    <Dialog title="Your progress" close={noop}>
      <div className="progress-actions">
        <button onClick={noop}>Ultra Ascend…</button>
        <small>Preview a new reset: clear repeat purchases, activate eligible Astral locks and retain permanent ownership and milestones.</small>
        <PriorAscensionsForm key={epoch} epoch={epoch} disabled={disabled} onReview={review} onEdit={noop} />
        <button className="danger" onClick={noop}>Clear all progress…</button>
      </div>
    </Dialog>
  </>
)

export const FirstRun = () => <Progress epoch={0} />

export const ExistingHistory = () => <Progress epoch={7} />

export const SavingDisabled = () => <Progress epoch={3} disabled />
