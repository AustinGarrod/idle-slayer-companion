import { Icon, SPCost, sampleCatalog, sampleProfile, visibility } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// Icon is sized by its context: 48px in the inspector heading, 28px in the
// inspector's .connection-list buttons (aside.details column beside the map).
const panel = { width: 340, borderLeft: '1px solid #79603b' }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!
const byId = new Map(sampleCatalog.upgrades.map((upgrade) => [upgrade.id, upgrade]))

// The list only shows connections within the shared visible graph.
const Connections = ({ title, spoilers = false }: { title: string; spoilers?: boolean }) => {
  const detail = byTitle(title)
  const { connections } = visibility(sampleCatalog, { ...sampleProfile, showSpoilers: spoilers })
  const incoming = connections.filter((edge) => edge.to === detail.id).map((edge) => byId.get(edge.from)!)
  const outgoing = connections.filter((edge) => edge.from === detail.id).map((edge) => byId.get(edge.to)!)
  return <aside className="details expanded" style={panel} aria-label="Upgrade details">
    <Page />
    <div className="detail-heading">
      <div className="detail-identity"><Icon node={detail} /><div><h2>{detail.title}</h2></div></div>
      <div className="detail-tools"><button aria-label="Close upgrade details">×</button></div>
      <small className="detail-cost"><SPCost value={detail.cost} /></small>
    </div>
    <div className="connection-list">
      <section aria-label="Connected from"><h3>Connected from</h3>{incoming.length ? incoming.map((node) => <button key={node.id}><Icon node={node} /><span>{node.title}</span><span aria-hidden="true">←</span></button>) : <p>No visible incoming connections.</p>}</section>
      <section aria-label="Leads to"><h3>Leads to</h3>{outgoing.length ? outgoing.map((node) => <button key={node.id}><Icon node={node} /><span>{node.title}</span><span aria-hidden="true">→</span></button>) : <p>No visible outgoing connections.</p>}</section>
      <small>Connections show paths. Purchase requirements above specify AND / OR and activation gates.</small>
    </div>
  </aside>
}

/** Early tree hub: one incoming, five outgoing connections. */
export const StarterConnections = () => <Connections title="True Idle Slayer" />

/** Astral hub with its two incoming cooking upgrades (spoilers shown). */
export const AstralConnections = () => <Connections title="Astral Slayer" spoilers />

/** The tree root: no incoming connection; hidden branches stay out of the list. */
export const TreeRoot = () => <Connections title="Permanent Slayer" />
