import { CompanionModules, CompanionShell, sampleCompanionEntities, sampleCompanionProgress } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important;padding:0!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const modules = {
  entities: sampleCompanionEntities, progress: sampleCompanionProgress, onRecord: noop, onTrack: noop,
  pinnedRefs: new Set<string>(), onPinGoal: noop, onNavigate: noop, recipePlans: {}, onRecipePlan: noop,
}

export const Overview = () => (
  <div style={{ height: 800, overflow: 'hidden' }}>
    <Page />
    <CompanionShell section="overview" onNavigate={noop} ascension={null} onImport={noop} onBackup={noop} onSettings={noop} onHelp={noop} onInstall={noop}>
      <CompanionModules section="overview" {...modules} />
    </CompanionShell>
  </div>
)

export const BestiarySection = () => (
  <div style={{ height: 800, overflow: 'hidden' }}>
    <Page />
    <CompanionShell section="bestiary" onNavigate={noop} ascension={null} onImport={noop} onBackup={noop} onSettings={noop} onHelp={noop}>
      <CompanionModules section="bestiary" {...modules} />
    </CompanionShell>
  </div>
)
