import { CompanionModules, sampleCompanionEntities, sampleCompanionProgress, sampleEmptyCompanionProgress } from 'idle-slayer-companion'
import type { CompanionEntity } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}
const find = (system: CompanionEntity['system'], title: string) =>
  sampleCompanionEntities.find((entity) => entity.system === system && entity.title === title)!
const key = (entity: CompanionEntity) => `${entity.system}:${entity.id}`
const additionalSack = find('craft', 'Additional Sack')
const advancedTools = find('craft', 'Advanced Tools')
const collector = find('achievement', 'Collector')
const sharpArrows = find('divinity', 'Sharp Arrows')
const baneOfBosses = find('divinity', 'Bane of Bosses')
const theSacredHerbs = find('quest', 'The Sacred Herbs')

const modules = {
  entities: sampleCompanionEntities, progress: sampleCompanionProgress, onRecord: noop, onTrack: noop,
  pinnedRefs: new Set<string>([key(collector), key(advancedTools), key(sharpArrows), key(baneOfBosses), key(theSacredHerbs)]),
  onPinGoal: noop, onNavigate: noop, recipePlans: {}, onRecipePlan: noop,
}
const frame = { height: 900, overflow: 'hidden' } as const

export const Overview = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="overview" {...modules} goalEntries={[
      { ref: { system: 'craft', id: advancedTools.id }, title: advancedTools.title, status: 'incomplete' },
      { ref: { system: 'achievement', id: collector.id }, title: collector.title, status: 'untracked' },
      { ref: { system: 'divinity', id: sharpArrows.id }, title: sharpArrows.title, status: 'complete' },
    ]} />
  </div>
)

export const Achievements = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="achievements" {...modules} />
  </div>
)

// Capture settles by awaiting img.decode(); loading="lazy" icons far below the
// viewport never load and hang it. Crafting therefore shows a bounded, coherent subset:
// three recipes and exactly the materials their plans require.
const ankh = find('craft', 'Ankh')
const craftingEntities = sampleCompanionEntities.filter((entity) =>
  (entity.system === 'craft' && [additionalSack.id, ankh.id, advancedTools.id].includes(entity.id)) ||
  (entity.system === 'material' && ['Bat Wings', 'Root', 'Titanium', 'Dragon Scale'].includes(entity.title)))

export const CraftingWithPlans = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="crafting" {...modules} entities={craftingEntities} recipePlans={{ [additionalSack.id]: '2', [ankh.id]: '1' }}
      entityStates={{ [key(advancedTools)]: { available: false, blockers: ['Discover Spirit Boost', 'Discover Pincer'] } }} />
  </div>
)

// Quest records as the importer stores them: counter, objective and reward claim.
const questId = (title: string) => find('quest', title).id
const villageId = (title: string) => find('village', title).id
const questProgress = {
  ...sampleCompanionProgress,
  modules: {
    ...sampleCompanionProgress.modules,
    quest: { ...sampleCompanionProgress.modules.quest, records: {
      [questId('Box Hunt')]: { count: '120', completed: true, claimed: true },
      [questId('Cobra Venom')]: { count: '11000', completed: true, claimed: false },
      [questId('Toxin Study')]: { count: '6400', completed: false, claimed: false },
    } },
    village: { ...sampleCompanionProgress.modules.village, records: {
      [villageId('Light the cave dynamite.')]: { completed: true },
    } },
  },
}

export const Quests = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="quests" {...modules} progress={questProgress} />
  </div>
)

export const DivinityWishlist = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="divinities" {...modules} entityStates={{
      [key(find('divinity', 'Arrow Choke'))]: { available: true, active: true },
      [key(find('divinity', 'Egg Master'))]: { available: true, active: false },
    }} />
  </div>
)

export const UntrackedSection = () => (
  <div style={frame}>
    <Page />
    <CompanionModules section="achievements" {...modules} progress={sampleEmptyCompanionProgress} pinnedRefs={new Set()} />
  </div>
)

