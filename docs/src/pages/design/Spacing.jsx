import { Page, Section } from '../../components/Page.jsx'

const SPACE = [
  ['1', 1, '4px'],
  ['2', 2, '8px'],
  ['3', 3, '12px'],
  ['4', 4, '16px'],
  ['5', 5, '20px'],
  ['6', 6, '24px'],
  ['8', 8, '32px'],
  ['10', 10, '40px'],
  ['12', 12, '48px'],
  ['16', 16, '64px'],
]

const RADIUS = [
  ['rounded-sm', '0.375rem / 6px', 'rounded-sm'],
  ['rounded', '0.5rem / 8px', 'rounded'],
  ['rounded-md', '0.625rem / 10px', 'rounded-md'],
  ['rounded-lg', '0.75rem / 12px', 'rounded-lg'],
  ['rounded-xl', '1rem / 16px', 'rounded-xl'],
  ['rounded-2xl', '1.25rem / 20px', 'rounded-2xl'],
  ['rounded-3xl', '1.5rem / 24px', 'rounded-3xl'],
  ['rounded-full', '9999px', 'rounded-full'],
]

export function Spacing() {
  return (
    <Page
      title="Spacing & Radius"
      description="Spacing uses the default Tailwind 4px scale. Radius is a balanced progression tuned so small controls can be pills while large surfaces stay calm — outer = inner + padding."
    >
      <Section title="Spacing scale">
        <div className="space-y-2 rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          {SPACE.map(([name, n, px]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="monotype w-8 shrink-0 text-xs text-on-surface-variant">{name}</code>
              <div className="h-3 rounded-full bg-primary/50" style={{ width: n * 4 }} />
              <span className="text-xs text-on-surface-variant">{px}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius scale">
        <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          {RADIUS.map(([name, px, cls]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={`h-12 w-12 border border-primary/40 bg-primary/10 ${cls}`} />
              <code className="monotype text-[10px] text-on-surface-variant">{name}</code>
              <span className="text-[10px] text-on-surface-variant/70">{px}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Nesting rule">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-2">
            <div className="flex h-12 items-center justify-center rounded-xl bg-primary/15 text-xs font-semibold text-primary">
              outer rounded-2xl (20) · p-2 (8) · inner rounded-xl (16)
            </div>
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">
            When a rounded element sits inside a rounded container, set <code className="monotype text-xs">inner ≈ outer − padding</code> so the
            curves stay concentric instead of bulging at the corners.
          </p>
        </div>
      </Section>
    </Page>
  )
}
