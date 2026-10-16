import { Dialog, ReferenceSheetPanel, sampleCatalog, sampleProfile, sampleVisibleUpgrades } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const idsFor = (...titles: string[]) => titles.map((title) => sampleVisibleUpgrades.find((node) => node.title === title)!.id)

// MapApp: <Dialog title="Upgrade reference sheet"><ReferenceSheetPanel …/></Dialog>
const Sheet = ({ ids }: { ids: string[] }) => (
  <>
    <Page />
    <Dialog title="Upgrade reference sheet" close={noop}>
      <ReferenceSheetPanel catalog={sampleCatalog} ids={ids} getIds={() => ids} viewer={sampleProfile} getViewer={() => sampleProfile} remove={noop} clear={noop} />
    </Dialog>
  </>
)

const full = idsFor('Soul Slash', 'Sacred Book of Projectiles', 'Ultra Ascension', 'Divinities')
export const FourSelected = () => <Sheet ids={full} />

export const TwoSelected = () => <Sheet ids={idsFor('Dagger Edge', 'Sword Edge')} />

export const EmptySelection = () => <Sheet ids={[]} />
