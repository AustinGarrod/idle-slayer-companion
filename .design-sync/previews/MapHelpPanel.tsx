import { useEffect } from 'react'
import { Dialog, MapHelpPanel } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}

// MapApp opens this from the toolbar as <Dialog title="Map help">, followed by the keyboard section.
const MapHelpDialog = () => (
  <Dialog title="Map help" close={noop}>
    <MapHelpPanel onProgress={noop} onMilestones={noop} onSpoilers={noop} />
    <h3>Keyboard map navigation</h3>
    <p>The map has one Tab stop for its visible upgrades. All visible upgrades remain available by keyboard.</p>
    <ul>
      <li>From the toolbar, Tab reaches the map shortcut. Press Enter to skip directly to camera controls, or Tab again to explore upgrades.</li>
      <li>Arrow Right / Down browses the next upgrade; Left / Up browses the previous. Home / End jumps to the first / last visible upgrade. Browsing follows catalog order and wraps at its ends.</li>
      <li>Enter / Space selects the focused upgrade and opens its details. Escape deselects it. Focus browsing preserves recorded progress and fixed positions.</li>
      <li>Tab leaves upgrades for camera controls; Shift+Tab returns to the map shortcut and toolbar. Camera controls provide zoom, return to start and directional panning.</li>
      <li>Search selection by keyboard goes directly to details. Closing those details returns to search.</li>
    </ul>
    <p>Screen-reader users may need their reader's interaction mode to send arrow keys to the focused upgrade. The focused upgrade announces its title, state, cost and keyboard instructions.</p>
  </Dialog>
)

export const MapHelp = () => (
  <>
    <Page />
    <MapHelpDialog />
  </>
)

// Same dialog, scrolled to the map-state legend (as a reader reaches it).
const ScrollTo = ({ selector }: { selector: string }) => {
  useEffect(() => { document.querySelector(selector)?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior }) }, [selector])
  return null
}

export const MapStatesLegend = () => (
  <>
    <Page />
    <MapHelpDialog />
    <ScrollTo selector=".map-help h3:nth-of-type(2)" />
  </>
)

export const BackupAndKeyboard = () => (
  <>
    <Page />
    <MapHelpDialog />
    <ScrollTo selector=".map-help h3:nth-of-type(5)" />
  </>
)
