import { Dialog, GoalsPanel, sampleCatalog, sampleProfile, sampleVisibleUpgrades } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const idOf = (title: string) => sampleVisibleUpgrades.find((node) => node.title === title)!.id
type Mode = 'acquire' | 'activate' | 'rebuild'

// A static useGoals() controller: goals live in their own document, separate from progress.
const controller = (targets: { id: string; mode: Mode }[], error = '') => {
  const state = { goals: { version: 1 as const, targets }, error, raw: null, dirty: Boolean(error), readable: !error }
  return { ...state, edit: () => true, useSaved: noop, getState: () => state }
}

const saved = controller([
  { id: idOf('Soul Slash'), mode: 'acquire' },
  { id: idOf('Ultra Ascension'), mode: 'rebuild' },
  { id: idOf('Soul Reaper'), mode: 'acquire' },
  { id: idOf('Divinities'), mode: 'activate' },
])

// MapApp: <Dialog title="Your progress"> … <GoalsPanel …/></Dialog> (the panel closes the dialog).
const Goals = ({ intentions, targetId = null }: { intentions: ReturnType<typeof controller>; targetId?: string | null }) => (
  <>
    <Page />
    <Dialog title="Your progress" close={noop}>
      <GoalsPanel catalog={sampleCatalog} profile={sampleProfile} targetId={targetId as string} intentions={intentions} onInspect={noop} />
    </Dialog>
  </>
)

export const SavedGoals = () => <Goals intentions={saved} />

// Opened from an upgrade's details: the goal chooser appears above the list.
export const ChoosingGoal = () => <Goals intentions={saved} targetId={idOf('Sacred Book of Projectiles')} />

export const NoGoalsYet = () => <Goals intentions={controller([])} />

export const SaveFailed = () => (
  <Goals intentions={controller([{ id: idOf('Dagger Edge'), mode: 'acquire' }, { id: idOf('Portals'), mode: 'rebuild' }],
    'Goals could not be saved. Your intentions remain usable for this visit. Retry saving before closing this page.')} />
)
