import { ObservationSelect } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// In the app these sit in an EntityCard's fieldset.companion-card-controls; selects are styled under .companion-page.
const page = { padding: 16, width: 'auto', maxWidth: 420 }
const noop = () => {}

export const AchievementStates = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <ObservationSelect label="Achievement" onChange={noop} yes="Earned" no="Not earned" />
      <ObservationSelect label="Achievement" value={false} onChange={noop} yes="Earned" no="Not earned" />
      <ObservationSelect label="Achievement" value onChange={noop} yes="Earned" no="Not earned" />
    </fieldset>
  </div>
)

export const QuestObjectiveAndReward = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <ObservationSelect label="Objective" value onChange={noop} yes="Complete" no="In progress" />
      <ObservationSelect label="Reward" value={false} onChange={noop} yes="Claimed" no="Unclaimed" />
    </fieldset>
  </div>
)

export const DiscoveryAndSelection = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <ObservationSelect label="Material discovery" value onChange={noop} yes="Discovered" no="Not discovered" />
      <ObservationSelect label="Power selection / ownership" value onChange={noop} yes="Selected / owned" no="Not selected / owned" />
    </fieldset>
  </div>
)

export const DisabledWhileSaving = () => (
  <div className="companion-page" style={page}>
    <Page />
    <fieldset className="companion-card-controls">
      <ObservationSelect label="Item ownership" value={false} disabled onChange={noop} yes="Owned" no="Not owned" />
    </fieldset>
  </div>
)
