import { Fragment } from "react"
import { Icon, SPCost, sampleCatalog } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// SPCost sits in the inspector's .detail-cost line and in exact-cost / list rows.
// The inspector is the app's aside.details column (320px beside the map).
const panel = { width: 320, borderLeft: '1px solid #79603b' }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!

const Heading = ({ title, state }: { title: string; state: string }) => {
  const upgrade = byTitle(title)
  return <><div className="detail-heading">
    <div className="detail-identity"><Icon node={upgrade} /><div><h2>{upgrade.title}</h2></div></div>
    <div className="detail-tools"><button aria-label="Close upgrade details">×</button></div>
    <small className="detail-cost"><SPCost value={upgrade.cost} /></small>
  </div>
  <p className={`state-label ${state}`}>{state === "available" ? "+ Available" : "◇ Locked"}</p>
  <p className="detail-description">{upgrade.description}</p></>
}

export const InspectorCost = () => (
  <aside className="details expanded" style={panel}>
    <Page />
    <Heading title="Sacred Book of Projectiles" state="available" />
  </aside>
)

export const ScientificCost = () => (
  <aside className="details expanded" style={panel}>
    <Page />
    <Heading title="Random Shine" state="locked" />
  </aside>
)

// Compact (default) next to the full digit grouping used by the exact-cost section.
const scale = ['Permanent Slayer', 'Sword Edge', 'Gemstone Rush', 'Gold Hammer', 'Chest In a Chest', 'Coimbo Release', 'Random Shine']
export const CompactAndFull = () => (
  <aside className="details expanded" style={{ ...panel, width: 380 }}>
    <Page />
    <dl>
      {scale.map((title) => {
        const upgrade = byTitle(title)
        return <Fragment key={upgrade.id}>
          <dt>{upgrade.title}</dt>
          <dd><SPCost value={upgrade.cost} /><br /><small><SPCost value={upgrade.cost} full /></small></dd>
        </Fragment>
      })}
    </dl>
  </aside>
)
