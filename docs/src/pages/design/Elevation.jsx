import { Page, Section } from '../../components/Page.jsx'

const LEVELS = [
  ['sm', 'shadow-sm', 'Subtle lift — tooltips, the toggle thumb.'],
  ['card', 'shadow-[0_4px_28px_-10px_rgba(0,100,102,0.12)]', 'Resting cards and surfaces.'],
  ['overlay', 'shadow-[0_12px_32px_-12px_rgba(0,100,102,0.25)]', 'Dropdowns, dialogs, toasts — elements that float above the page.'],
]

export function Elevation() {
  return (
    <Page
      title="Elevation"
      description="Shadows are teal-tinted and soft. Three levels cover the system: a whisper for small controls, a resting lift for cards, and a deeper float for overlays."
    >
      <Section title="Levels">
        <div className="grid gap-6 sm:grid-cols-3">
          {LEVELS.map(([name, cls, note]) => (
            <div key={name} className="space-y-3">
              <div className={`flex h-28 items-center justify-center rounded-2xl border border-outline-variant/10 bg-surface-container ${cls}`}>
                <span className="font-headline text-sm font-bold text-on-surface">{name}</span>
              </div>
              <code className="monotype block break-all text-[10px] text-on-surface-variant">{cls}</code>
              <p className="text-xs text-on-surface-variant">{note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notes">
        <ul className="list-inside list-disc space-y-1 text-sm text-on-surface-variant">
          <li>Shadows use the teal channel (<code className="monotype text-xs">rgba(0,100,102,…)</code>) so light and dark themes stay on-brand.</li>
          <li>Cards lift a touch on hover (<code className="monotype text-xs">Card hover</code>) rather than changing colour.</li>
        </ul>
      </Section>
    </Page>
  )
}
