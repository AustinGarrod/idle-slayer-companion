import { TrackingNotice, sampleCompanionProgress, sampleEmptyCompanionProgress } from 'idle-slayer-companion'
import type { CompanionProgress } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// Rendered by CompanionModules directly under each section header, inside .companion-page.
const page = { padding: 16, width: 'auto' }
const noop = () => {}
const empty = sampleEmptyCompanionProgress
const trackedCrafts: CompanionProgress = {
  ...empty,
  modules: { ...empty.modules, craft: { ...empty.modules.craft, tracked: true, source: 'manual' } },
}

export const NotStarted = () => (
  <div className="companion-page" style={page}>
    <Page />
    <TrackingNotice systems={['achievement']} progress={empty} onTrack={noop} />
  </div>
)

export const QuestsAndVillageUntracked = () => (
  <div className="companion-page" style={page}>
    <Page />
    <TrackingNotice systems={['quest', 'village']} progress={empty} onTrack={noop} />
  </div>
)

export const MaterialsUntracked = () => (
  <div className="companion-page" style={page}>
    <Page />
    <TrackingNotice systems={['craft', 'material']} progress={trackedCrafts} onTrack={noop} />
  </div>
)

export const Tracked = () => (
  <div className="companion-page" style={page}>
    <Page />
    <TrackingNotice systems={['craft', 'material']} progress={sampleCompanionProgress} onTrack={noop} />
  </div>
)
