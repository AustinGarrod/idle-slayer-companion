import { Icon, RequirementView, SPCost, sampleCatalog, sampleProfile, upgradeState, visibility } from 'idle-slayer-companion'
import type { Profile } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// MapApp's inspector: aside.details (320px column beside the map). "expanded"
// keeps .detail-content visible below the 1100px compact breakpoint.
const panel = { width: 340, borderLeft: '1px solid #79603b' }
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!
const stateLabels: Record<string, string> = { pending: '◷ Owned · awaiting activation', purchased: '✓ Purchased and active', locked: '◇ Locked', available: '+ Available' }

// "Show spoilers" browsing with the Armory item recorded as received.
const spoilerProfile: Profile = { ...sampleProfile, showSpoilers: true, milestones: { jal6x8iarlhjjeujvy5e: true } }

const Inspector = ({ title, profile }: { title: string; profile: Profile }) => {
  const detail = byTitle(title)
  const visible = visibility(sampleCatalog, profile)
  const state = upgradeState(detail, profile)
  const onReview = () => {}
  return <aside className="details expanded" style={panel} aria-label="Upgrade details">
    <Page />
    <div className="detail-heading">
      <div className="detail-identity"><Icon node={detail} /><div><h2>{detail.title}</h2></div></div>
      <div className="detail-tools"><button aria-label="Close upgrade details">×</button></div>
      <small className="detail-cost"><SPCost value={detail.cost} /></small>
    </div>
    <p className={`state-label ${state}`}>{stateLabels[state]}</p>
    <div className="detail-content">
      <dl>
        <dt>Purchase requirements</dt>
        <dd><RequirementView requirement={detail.purchase} profile={profile} visible={visible} onReview={onReview} /></dd>
        <dt>Reveal requirements</dt>
        <dd><RequirementView requirement={detail.reveal} profile={profile} visible={visible} onReview={onReview} /></dd>
      </dl>
    </div>
  </aside>
}

/** OR: one owned path already satisfies the purchase gate. */
export const OrPathSatisfied = () => <Inspector title="Legendary Belt" profile={sampleProfile} />

/** AND: both ore upgrades must be active; neither is yet. */
export const AndRequirementsMissing = () => <Inspector title="Green Ore" profile={sampleProfile} />

/** Astral gate mixing an active upgrade with a recorded milestone item (spoilers shown). */
export const MilestoneGate = () => <Inspector title="Chest In a Chest" profile={spoilerProfile} />

/** Astral Slayer also needs at least one Ultra Ascension (spoilers shown). */
export const UltraAscensionGate = () => <Inspector title="Astral Slayer" profile={spoilerProfile} />
