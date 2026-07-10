import { Page, Section } from '../../components/Page.jsx'

const MOTIONS = [
  ['Hover / focus', '150–200ms', 'Colour and border transitions on inputs, buttons, list items.'],
  ['Press', 'active:scale-[0.98]', 'A quick tactile press on buttons.'],
  ['Lift', 'hover:-translate-y-0.5', 'Cards rise slightly on hover with a stronger shadow.'],
  ['Dialog', '150ms ease-out', 'Scrim fades; panel fades + scales from 95% to 100%.'],
  ['Tooltip', 'delay-75 · 150ms', 'Short hover delay, then a 150ms fade — avoids flicker.'],
  ['Toast', 'timer-based', 'Auto-dismiss after the duration; pauses while hovered.'],
]

export function Motion() {
  return (
    <Page
      title="Motion"
      description="Motion is short and purposeful: it confirms interaction and lifts elements, never decorates. Most transitions are 150–200ms with the default easing."
    >
      <Section title="Patterns">
        <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container">
          {MOTIONS.map(([name, val, note]) => (
            <div key={name} className="flex items-baseline gap-4 border-b border-outline-variant/10 px-5 py-3 last:border-b-0">
              <span className="w-28 shrink-0 text-sm font-semibold text-on-surface">{name}</span>
              <code className="monotype shrink-0 text-xs text-primary">{val}</code>
              <span className="ml-auto text-right text-xs text-on-surface-variant">{note}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Reduced motion">
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Respect <code className="monotype text-xs">prefers-reduced-motion</code>. The current transforms are small (scales, a 0.5px lift, fades)
          and safe, but if you add larger motion, gate it behind a reduced-motion media query so it disables for users who ask for less movement.
        </p>
      </Section>
    </Page>
  )
}
