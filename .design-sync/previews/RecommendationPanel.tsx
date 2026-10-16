import { Dialog, RecommendationPanel, recommendUpgrades, sampleCatalog, sampleEmptyProfile, sampleRecommendations, sampleVisibleUpgrades, sampleWikiPriorities } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const handlers = { onSelect: noop, onPurchase: noop, onReviewRequirements: noop }

// MapApp: Next upgrade → <Dialog title="Suggested next upgrade"><RecommendationPanel …/></Dialog>
export const EarlyRunSuggestions = () => (
  <>
    <Page />
    <Dialog title="Suggested next upgrade" close={noop}>
      <RecommendationPanel catalog={sampleCatalog} recommendations={sampleRecommendations} {...handlers} />
    </Dialog>
  </>
)

export const FreshProfile = () => (
  <>
    <Page />
    <Dialog title="Suggested next upgrade" close={noop}>
      <RecommendationPanel catalog={sampleCatalog} recommendations={recommendUpgrades(sampleCatalog, sampleEmptyProfile, sampleWikiPriorities)} {...handlers} />
    </Dialog>
  </>
)

// No visible upgrade meets its requirements: the panel offers a requirement review instead.
const blocked = { ...sampleRecommendations, status: 'blocked' as const, suggestions: [] }
const reviewTarget = sampleVisibleUpgrades.find((node) => node.title === 'Boost Coin')

export const NothingEligible = () => (
  <>
    <Page />
    <Dialog title="Suggested next upgrade" close={noop}>
      <RecommendationPanel catalog={sampleCatalog} recommendations={blocked} blockedUpgrade={reviewTarget} {...handlers} />
    </Dialog>
  </>
)
