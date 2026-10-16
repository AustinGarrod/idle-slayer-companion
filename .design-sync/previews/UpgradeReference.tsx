import { ExactCostDetails, UpgradeReference, sampleCatalog } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// UpgradeReference sits in the inspector's .detail-secondary block
// (aside.details.expanded — secondary content is hidden when collapsed).
const panel = { width: 340, borderLeft: '1px solid #79603b' }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!

export const ShareReference = () => (
  <aside className="details expanded" style={panel} aria-label="Upgrade details">
    <Page />
    <div className="detail-secondary">
      <UpgradeReference catalog={sampleCatalog} upgrade={byTitle('Sacred Book of Projectiles')} />
    </div>
  </aside>
)

/** The full secondary column, as it follows the connection list. */
export const InspectorSecondary = () => {
  const detail = byTitle('Astral Slayer')
  return <aside className="details expanded" style={panel} aria-label="Upgrade details">
    <Page />
    <div className="detail-secondary">
      <button>Recent upgrades…</button>
      <ExactCostDetails value={detail.cost} upgradeId={detail.id} />
      <button>Compare this upgrade…</button>
      <UpgradeReference catalog={sampleCatalog} upgrade={detail} />
    </div>
  </aside>
}
