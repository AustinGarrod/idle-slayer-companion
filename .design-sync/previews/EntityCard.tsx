import { EntityCard, sampleCompanionEntities } from 'idle-slayer-companion'
import type { CompanionEntity } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// EntityCard always renders inside a .companion-page (which scopes select styling).
const page = { padding: 16, width: 'auto' }
const find = (system: CompanionEntity['system'], title: string) =>
  sampleCompanionEntities.find((entity) => entity.system === system && entity.title === title)!
const lookup = new Map(sampleCompanionEntities.map((entity) => [`${entity.system}:${entity.id}`, { ref: { system: entity.system, id: entity.id }, title: entity.title }]))
const handlers = { onPin: () => {}, onRecord: () => {}, onPlan: () => {}, onNavigate: () => {} }

export const EarnedAchievement = () => (
  <div className="companion-page" style={{ ...page, maxWidth: 420 }}>
    <Page />
    <EntityCard entity={find('achievement', 'Collector')} record={{ completed: true }} pinned={false} lookup={lookup} {...handlers} />
  </div>
)

export const CraftWithRecipe = () => (
  <div className="companion-page" style={{ ...page, maxWidth: 420 }}>
    <Page />
    <EntityCard entity={find('craft', 'Advanced Tools')} record={{}} pinned planned="2" lookup={lookup}
      state={{ available: false, blockers: ['Discover Titanium', 'Build the Armory'] }} {...handlers} />
  </div>
)

export const EnemyKills = () => (
  <div className="companion-page" style={{ ...page, maxWidth: 420 }}>
    <Page />
    <EntityCard entity={find('enemy', 'Bat')} record={{ discovered: true, count: '18450' }} pinned={false} lookup={lookup}
      state={{ masteryTier: 2, masteryKills: '18450' }} {...handlers} />
  </div>
)

export const SelectedDivinity = () => (
  <div className="companion-page" style={{ ...page, maxWidth: 420 }}>
    <Page />
    <EntityCard entity={find('divinity', 'Sharp Arrows')} record={{ selected: true }} pinned={false} lookup={lookup}
      state={{ available: true, active: true }} {...handlers} />
  </div>
)

export const AchievementGrid = () => (
  <div className="companion-page" style={page}>
    <Page />
    <div className="companion-entity-grid">
      <EntityCard entity={find('achievement', 'Easy Task')} record={{ completed: true }} pinned={false} lookup={lookup} {...handlers} />
      <EntityCard entity={find('achievement', 'Collector')} record={{ completed: false }} pinned lookup={lookup} {...handlers} />
      <EntityCard entity={find('achievement', 'Lava Trophy')} record={{}} pinned={false} lookup={lookup} {...handlers} />
    </div>
  </div>
)
