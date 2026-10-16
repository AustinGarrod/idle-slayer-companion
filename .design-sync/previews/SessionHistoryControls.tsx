import { SessionHistoryControls } from 'idle-slayer-companion'

// The app paints its dark canvas on :root; the card harness paints body white.
const Page = () => <style>{"body{background:var(--canvas)!important}#root{min-height:0!important}"}</style>

const noop = () => {}

// MapApp's footer bar (.atlas > footer, desktop widths). Its rules are scoped
// under .atlas and hidden below 1100px, so the bar's own flex layout is inlined.
const footer = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '6px 16px', borderTop: '1px solid #574631', background: 'var(--surface)' } as const
const status = { marginRight: 'auto', color: 'var(--muted)', fontSize: '.75rem', lineHeight: 1.5 }
const footerButton = { fontSize: '.8125rem' }

export const FooterUndoAvailable = () => (
  <footer style={footer}>
    <Page />
    <span style={status}>Unofficial companion · Saved on this device</span>
    <SessionHistoryControls undoAction="purchase" busy={false} onUndo={noop} onRedo={noop} />
    <button style={footerButton}>Map help…</button>
    <button style={footerButton}>About & sources</button>
  </footer>
)

// The Map options dialog repeats the controls in its "Undo & redo" section.
const dialog = { width: 520, padding: 20, border: '1px solid var(--frame)', borderRadius: 8, background: 'var(--surface)' }
export const OptionsUndoAndRedo = () => (
  <div style={dialog}>
    <Page />
    <section className="session-history" aria-label="Undo and redo">
      <h3>Undo &amp; redo</h3>
      <SessionHistoryControls undoAction="milestone" redoAction="ultra_ascension" busy={false} onUndo={noop} onRedo={noop} />
      <p>Up to 20 changes are available during this visit, including spoiler settings. Undo restores progress before the action; Redo restores the undone change. A new change clears Redo.</p>
    </section>
  </div>
)

export const NothingToUndo = () => (
  <div style={dialog}>
    <Page />
    <section className="session-history" aria-label="Undo and redo">
      <h3>Undo &amp; redo</h3>
      <SessionHistoryControls busy={false} onUndo={noop} onRedo={noop} />
      <p>Up to 20 changes are available during this visit, including spoiler settings.</p>
    </section>
  </div>
)

export const SavingInProgress = () => (
  <footer style={footer}>
    <Page />
    <span style={status}>Unofficial companion · Saving…</span>
    <SessionHistoryControls undoAction="game_import" redoAction="spoilers" busy onUndo={noop} onRedo={noop} />
    <button style={footerButton}>Map help…</button>
  </footer>
)
