import { ShoppingList, sampleCompanionEntities, sampleCompanionProgress, sampleEmptyCompanionProgress } from 'idle-slayer-companion'
import type { CompanionEntity } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// Rendered at the top of the Crafting & materials section, inside .companion-page.
const page = { padding: 16, width: 'auto' }
const noop = () => {}
const find = (system: CompanionEntity['system'], title: string) =>
  sampleCompanionEntities.find((entity) => entity.system === system && entity.title === title)!
const additionalSack = find('craft', 'Additional Sack')
const ankh = find('craft', 'Ankh')
const chalice = find('craft', 'Chalice')

export const PlannedRecipes = () => (
  <div className="companion-page" style={page}>
    <Page />
    <ShoppingList entities={sampleCompanionEntities} progress={sampleCompanionProgress} onNavigate={noop}
      plans={{ [additionalSack.id]: '2', [ankh.id]: '1' }} />
  </div>
)

export const StockNotRecorded = () => (
  <div className="companion-page" style={page}>
    <Page />
    <ShoppingList entities={sampleCompanionEntities} progress={sampleEmptyCompanionProgress} onNavigate={noop}
      plans={{ [chalice.id]: '3' }} />
  </div>
)

// A recipe that needs a material outside the revealed view withholds complete totals.
const withoutYetiFang = sampleCompanionEntities.filter((entity) => !(entity.system === 'material' && entity.title === 'Yeti Fang'))

export const PartlyHiddenRequirements = () => (
  <div className="companion-page" style={page}>
    <Page />
    <ShoppingList entities={withoutYetiFang} progress={sampleCompanionProgress} onNavigate={noop}
      plans={{ [chalice.id]: '1' }} />
  </div>
)

export const NothingPlanned = () => (
  <div className="companion-page" style={page}>
    <Page />
    <ShoppingList entities={sampleCompanionEntities} progress={sampleCompanionProgress} onNavigate={noop} plans={{}} />
  </div>
)
