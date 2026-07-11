import { Page, Section } from '../components/Page.jsx'

const colors = [
  ['Primary', 'bg-primary', 'text-on-primary'],
  ['Success', 'bg-tertiary', 'text-on-tertiary'],
  ['Warning', 'bg-warning', 'text-black'],
  ['Danger', 'bg-error', 'text-on-error'],
  ['Surface', 'bg-surface-container', 'text-on-surface'],
  ['Elevated surface', 'bg-surface-container-high', 'text-on-surface'],
]

export function FoundationsPage() {
  return (
    <Page title="Foundations" eyebrow="Design language" description="Semantic tokens keep visual decisions consistent across themes and products.">
      <Section title="Color" description="Use semantic roles instead of raw palette values.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colors.map(([name, background, foreground]) => (
            <div key={name} className={`${background} ${foreground} flex h-28 items-end rounded-2xl border border-outline-variant/20 p-4 text-sm font-bold`}>{name}</div>
          ))}
        </div>
      </Section>
      <Section title="Typography">
        <div className="space-y-5 rounded-2xl border border-outline-variant/30 bg-surface-container p-6">
          <p className="font-headline text-4xl font-extrabold">Display heading</p>
          <p className="font-headline text-2xl font-bold">Section heading</p>
          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">Body copy uses Manrope with relaxed line height. Headlines use Plus Jakarta Sans to create clear hierarchy without decorative weight.</p>
        </div>
      </Section>
      <Section title="Shape, elevation, and motion">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-container-high p-5">Controls use 12 to 16 pixel radii.</div>
          <div className="rounded-2xl bg-surface-container p-5 shadow-[var(--teal-shadow-card)]">Surfaces use soft teal elevation.</div>
          <div className="rounded-2xl border border-outline-variant/30 p-5">Motion stays between 150 and 200 milliseconds and respects reduced motion.</div>
        </div>
      </Section>
    </Page>
  )
}
