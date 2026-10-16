import { ExactCostDetails, sampleCatalog } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// ExactCostDetails lives in the inspector's .detail-secondary block
// (aside.details.expanded — secondary content is hidden when collapsed).
const panel = { width: 340, borderLeft: '1px solid #79603b' }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!

const Secondary = ({ title }: { title: string }) => {
  const detail = byTitle(title)
  return <aside className="details expanded" style={panel} aria-label="Upgrade details">
    <Page />
    <div className="detail-secondary">
      <button>Recent upgrades…</button>
      <ExactCostDetails value={detail.cost} upgradeId={detail.id} />
      <button>Compare this upgrade…</button>
    </div>
  </aside>
}

/** 20-digit cost: compact view uses powers of ten, so the exactness note appears. */
export const ScientificCost = () => <Secondary title="Random Shine" />

/** Mid-game cost shown with digit grouping only. */
export const GroupedCost = () => <Secondary title="Gold Hammer" />

/** The cheapest early upgrade. */
export const SmallCost = () => <Secondary title="Permanent Quests" />
