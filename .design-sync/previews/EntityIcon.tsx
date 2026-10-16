import { EntityIcon, sampleCompanionEntities } from 'idle-slayer-companion'
import type { CompanionEntity } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const page = { padding: 16, width: 'auto' }
const find = (system: CompanionEntity['system'], title: string) =>
  sampleCompanionEntities.find((entity) => entity.system === system && entity.title === title)!
const row = { display: 'flex', flexWrap: 'wrap', gap: 20 } as const
const cell = { display: 'grid', justifyItems: 'center', gap: 6, width: 92, color: '#b8ad98', fontSize: 11, textAlign: 'center' } as const

const withArt = [
  find('achievement', 'Lava Trophy'), find('craft', 'Advanced Tools'), find('material', 'Dragon Scale'),
  find('quest', 'Box Hunt'), find('enemy', 'Bat'), find('divinity', 'Sharp Arrows'),
]

export const CatalogIcons = () => (
  <div className="companion-page" style={page}>
    <Page />
    <div style={row}>{withArt.map((entity) => <div key={entity.id} style={cell}><EntityIcon entity={entity} /><span>{entity.title}</span></div>)}</div>
  </div>
)

// Entries without reviewed art (every Village board task) fall back to the system symbol.
const villageTask = find('village', 'Build the Tavern.')
const withoutArt: CompanionEntity[] = [villageTask, ...withArt.map((entity) => ({ ...entity, icon: undefined }))]

export const SymbolFallbacks = () => (
  <div className="companion-page" style={page}>
    <Page />
    <div style={row}>{withoutArt.map((entity) => <div key={entity.system} style={cell}><EntityIcon entity={entity} /><span>{entity.system}</span></div>)}</div>
  </div>
)
