import { useEffect } from 'react'
import { SearchPanel, sampleCatalog, sampleProfile, sampleVisibleUpgrades } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}

// Query and progress filter are internal state; set them the way a user would (native input/change events).
function useTyped(ref: { current: HTMLInputElement | null }, query?: string, filter?: string) {
  useEffect(() => {
    const set = (element: HTMLInputElement | HTMLSelectElement | null, value: string, type: string) => {
      if (!element) return
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')!.set!.call(element, value)
      element.dispatchEvent(new Event(type, { bubbles: true }))
    }
    if (query) set(ref.current, query, 'input')
    if (filter) set(document.querySelector<HTMLSelectElement>('#discovery-state'), filter, 'change')
    ref.current?.blur()
  }, [])
}

// MapApp: section.atlas > header.toolbar, SearchPanel between the brand and Next upgrade.
const Toolbar = ({ open, query, filter }: { open: boolean; query?: string; filter?: string }) => {
  const inputRef = { current: null as HTMLInputElement | null }
  useTyped(inputRef, query, filter)
  return (
    <section className="atlas" aria-label="Ascension map" style={{ height: 700 }}>
      <Page />
      <header className="toolbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true">✦</span><div><h1>Ascension Map</h1><p>Idle Slayer · {sampleCatalog.gameVersion}</p></div></div>
        <SearchPanel upgrades={sampleVisibleUpgrades} profile={sampleProfile} inputRef={inputRef} open={open} onOpenChange={noop} onSelect={noop} />
        <button className="next-upgrade">Next upgrade</button>
        <div className="layout-control" role="group" aria-label="Map layout"><button aria-pressed="true">Game Layout</button><button aria-pressed="false">Detailed Layout</button></div>
        <label className="spoiler-control desktop-action"><input type="checkbox" checked={sampleProfile.showSpoilers} onChange={noop} />Show spoilers</label>
        <button className="desktop-action">Milestones</button><button className="desktop-action">Progress</button><button className="desktop-action">Map view…</button>
        <button className="mobile-options" aria-label="Map options">☰</button>
      </header>
    </section>
  )
}

export const Closed = () => <Toolbar open={false} />

export const OpenAllVisible = () => <Toolbar open />

export const TitleQuery = () => <Toolbar open query="edge" />

export const AvailableFilter = () => <Toolbar open query="soul" filter="available" />

export const NoMatches = () => <Toolbar open query="astral" />
