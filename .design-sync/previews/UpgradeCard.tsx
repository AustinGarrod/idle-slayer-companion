import { Background, ReactFlow, ReactFlowProvider, edgeTypes, nodeTypes, sampleCatalog, sampleProfile, upgradeState, visibility } from 'idle-slayer-companion'
import type { Profile } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

// UpgradeCard is the React Flow node type 'upgrade'. These stories mount it the
// way MapApp does: section.atlas > .workspace > section.map > ReactFlow, fixed
// positions centred via nodeOrigin, no dragging or connection edits.
type Center = { x: number; y: number }
const byId = new Map(sampleCatalog.upgrades.map((upgrade) => [upgrade.id, upgrade]))
const byTitle = (title: string) => sampleCatalog.upgrades.find((upgrade) => upgrade.title === title)!
const WEB = { width: 132, height: 122 }, GAME = { width: 100, height: 100 }

type Options = { profile: Profile; centers: Map<string, Center>; game?: boolean; selected?: string }

function buildFlow({ profile, centers, game = false, selected }: Options) {
  const ids = new Set(centers.keys())
  const size = game ? GAME : WEB
  const connections = visibility(sampleCatalog, profile).connections.filter((edge) => ids.has(edge.from) && ids.has(edge.to))
  const related = new Set(connections.flatMap((edge) => edge.from === selected ? [edge.to] : edge.to === selected ? [edge.from] : []))
  const nodes = [...centers].map(([id, position]) => {
    const upgrade = byId.get(id)!
    return { id, type: 'upgrade', position, data: { upgrade, state: upgradeState(upgrade, profile) }, selected: selected === id,
      className: selected && id !== selected ? related.has(id) ? 'node-related' : 'node-muted' : '', ...size, ...(game ? { zIndex: 2 } : {}) }
  })
  const edges = connections.map((edge) => {
    const from = centers.get(edge.from)!, to = centers.get(edge.to)!
    const dx = to.x - from.x, dy = to.y - from.y, horizontal = Math.abs(dx) > Math.abs(dy)
    const direction = edge.to === selected ? 'incoming' : edge.from === selected ? 'outgoing' : null
    const owned = Object.hasOwn(profile.purchases, edge.from)
    const color = direction === 'incoming' ? '#f1d79b' : game ? direction === 'outgoing' || owned ? '#ff00be' : '#7d7d7d' : '#b860af'
    return { id: `${edge.from}:${edge.to}`, source: edge.from, target: edge.to,
      sourceHandle: game ? horizontal ? dx > 0 ? 'right-out' : 'left-out' : dy > 0 ? 'bottom-out' : 'top-out' : 'right-out',
      targetHandle: game ? horizontal ? dx > 0 ? 'left-in' : 'right-in' : dy > 0 ? 'top-in' : 'bottom-in' : 'left-in',
      type: game ? 'native' : 'dependency', focusable: false, selectable: false,
      data: { points: game ? [from, to] : undefined },
      className: selected ? direction ? `connection-${direction}` : 'connection-muted' : '',
      style: { stroke: color, strokeWidth: game ? direction ? 14 : 12 : direction ? 4 : 2 }, zIndex: direction ? 1 : 0,
      markerEnd: game && !direction ? undefined : { type: 'arrowclosed', markerUnits: 'userSpaceOnUse', width: game ? 24 : 32, height: game ? 24 : 32, color } }
  })
  const visible = visibility(sampleCatalog, profile)
  return { nodes, edges, visible }
}

const Map_ = ({ summary, hint, ...options }: Options & { summary?: string; hint: string }) => {
  const { nodes, edges, visible } = buildFlow(options)
  return <section className="atlas" style={{ height: 600 }} aria-label="Ascension map">
    <Page />
    <div className="workspace">
      <section className={`map ${options.game ? 'map-game' : ''}`} aria-label="Ascension tree">
        <ReactFlowProvider>
          <ReactFlow nodes={nodes as never} edges={edges as never} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodeOrigin={[0.5, 0.5]}
            nodesDraggable={false} nodesConnectable={false} edgesReconnectable={false} deleteKeyCode={null} selectionKeyCode={null} multiSelectionKeyCode={null}
            fitView fitViewOptions={{ padding: 0.16 }} minZoom={0.15} maxZoom={2.5}>
            <Background color="#514432" gap={32} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
        <div className="map-summary">
          <span><b>{visible.owned}</b> / {visible.total} visible upgrades owned</span>
          <span>{summary ?? `Ultra Ascensions ${options.profile.epoch} · ${options.profile.showSpoilers ? 'Spoilers shown' : 'Spoilers hidden'}`}</span>
          <span className="connection-hint">{hint}</span>
        </div>
      </section>
    </div>
  </section>
}

// Detailed (web) layout: prerequisite columns left to right.
const grid = (rows: [string, number, number][]) => new Map(rows.map(([title, column, row]) => [byTitle(title).id, { x: 60 + column * 200, y: 120 + row * 165 }]))
const starter = grid([
  ['Permanent Slayer', 0, 1], ['Soul Gatherer Bundle', 1, 1],
  ['True Idle Slayer', 2, 0], ['Portals', 2, 1], ['Reinvest', 2, 2],
  ['Sword Edge', 3, 0], ['Portal Traveler', 3, 1], ['Money Laundering', 3, 2],
  ['Monolith', 4, 0], ['Stocks Buyer', 4, 2],
])

/** Purchased, available and locked cards in the Detailed layout. */
export const DetailedLayout = () => <Map_ profile={sampleProfile} centers={starter} hint="Prerequisite → upgrade · Select to trace connections" />

/** A selected card: incoming dashed gold, outgoing solid, unrelated cards muted. */
export const SelectedUpgrade = () => <Map_ profile={sampleProfile} centers={starter} selected={byTitle('Soul Gatherer Bundle').id} hint="Dashed: connected from · Solid: leads to" />

// After one Ultra Ascension: some Astrals active, others owned and awaiting activation.
const astralProfile: Profile = (() => {
  const own = (title: string, active: boolean) => [byTitle(title).id, { epoch: 0, active }] as const
  return { ...sampleProfile, epoch: 1, showSpoilers: true, purchases: { ...sampleProfile.purchases, ...Object.fromEntries([
    own('Ramen', true), own('Stew', true), own('Astral Slayer', true), own('Astral Sword', false), own('Land Lord', false),
  ]) } }
})()
const astral = grid([
  ['Ramen', 0, 0.5], ['Stew', 0, 1.5], ['Astral Slayer', 1, 1],
  ['Land Lord', 2, -0.5], ['Astral Sword', 2, 0.5], ['Mastery of Multipliers', 2, 1.5], ['Stone of Hope', 2, 2.5],
  ['Astral Scales', 3, -0.5], ['Stone of Rage', 3, 2.5],
])

/** Astral branch: active, pending (owned · awaiting activation), available and locked. */
export const AstralStates = () => <Map_ profile={astralProfile} centers={astral} hint="Prerequisite → upgrade · Select to trace connections" />

// Game layout: the native tree coordinates (y flipped), circular frames, native lines.
// The Reinvest branch (top-left) is left out so the map summary does not cover it.
const nativeTitles = ['Permanent Slayer', 'Soul Gatherer Bundle', 'True Idle Slayer', 'Soul Reaper', 'Portals',
  'Permanent Quests', 'Mining Jewels', 'Sword Edge', 'Souls Bonus', 'Idle Earrings I', 'Boost Kill', 'Ancient Slayer', 'Monolith', 'Portal Traveler']
const native = new Map(nativeTitles.map((title) => { const upgrade = byTitle(title); return [upgrade.id, { x: upgrade.position.x, y: -upgrade.position.y }] }))

/** Game layout around the tree start, with owned (magenta) and unowned (grey) lines. */
export const GameLayout = () => <Map_ game profile={sampleProfile} centers={native} hint="Grey: unowned prerequisite · Magenta: owned · Select to trace" />
