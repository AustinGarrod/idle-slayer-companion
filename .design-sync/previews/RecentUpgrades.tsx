import { Dialog, RecentUpgrades, sampleVisibleUpgrades } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const pick = (...titles: string[]) => titles.map((title) => sampleVisibleUpgrades.find((node) => node.title === title)!)

// MapApp: <Dialog title="Recent upgrades"><RecentUpgrades …/></Dialog>, newest first.
const recent = pick('Soul Slash', 'Sacred Book of Projectiles', 'Dagger Edge', 'Idle Earrings III', 'Portals', 'Permanent Quests')

export const InspectedThisVisit = () => (
  <>
    <Page />
    <Dialog title="Recent upgrades" close={noop}>
      <RecentUpgrades upgrades={recent} visibleUpgrades={sampleVisibleUpgrades} selected={recent[0].id} onSelect={noop} onClear={noop} />
    </Dialog>
  </>
)

export const SingleEntry = () => (
  <>
    <Page />
    <Dialog title="Recent upgrades" close={noop}>
      <RecentUpgrades upgrades={pick('Ultra Ascension')} visibleUpgrades={sampleVisibleUpgrades} selected={null} onSelect={noop} onClear={noop} />
    </Dialog>
  </>
)

export const NothingInspected = () => (
  <>
    <Page />
    <Dialog title="Recent upgrades" close={noop}>
      <RecentUpgrades upgrades={[]} visibleUpgrades={sampleVisibleUpgrades} selected={null} onSelect={noop} onClear={noop} />
    </Dialog>
  </>
)
