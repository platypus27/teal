import { Page, Section } from '../../components/Page.jsx'

const SCALE = [
  ['text-xs', '0.75rem / 12px'],
  ['text-sm', '0.875rem / 14px'],
  ['text-base', '1rem / 16px'],
  ['text-lg', '1.125rem / 18px'],
  ['text-xl', '1.25rem / 20px'],
  ['text-2xl', '1.5rem / 24px'],
  ['text-3xl', '1.875rem / 30px'],
  ['text-4xl', '2.25rem / 36px'],
]

export function Typography() {
  return (
    <Page
      title="Typography"
      description="Two families: Plus Jakarta Sans for headlines (font-headline) and Manrope for body and labels (font-body / font-label). Both are loaded globally in global.css."
    >
      <Section title="Families">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
            <div className="text-xs font-semibold text-on-surface-variant">font-headline</div>
            <div className="mt-2 font-headline text-2xl font-extrabold text-on-surface">Plus Jakarta Sans</div>
            <div className="mt-1 font-headline text-lg font-bold text-on-surface">Aa Bb Cc 0123</div>
          </div>
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
            <div className="text-xs font-semibold text-on-surface-variant">font-body / font-label</div>
            <div className="mt-2 text-2xl font-semibold text-on-surface">Manrope</div>
            <div className="mt-1 text-lg text-on-surface">Aa Bb Cc 0123</div>
          </div>
        </div>
      </Section>

      <Section title="Scale">
        <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container">
          {SCALE.map(([cls, size]) => (
            <div key={cls} className="flex items-baseline gap-4 border-b border-outline-variant/10 px-5 py-3 last:border-b-0">
              <code className="monotype w-20 shrink-0 text-xs text-on-surface-variant">{cls}</code>
              <span className={`${cls} font-headline font-bold text-on-surface`}>The quick teal fox</span>
              <span className="ml-auto text-xs text-on-surface-variant">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <ul className="list-inside list-disc space-y-1 text-sm text-on-surface-variant">
          <li>Headlines use <code className="monotype text-xs">font-headline font-bold/extrabold</code>; body uses the default Manrope.</li>
          <li>Primary text is <code className="monotype text-xs">text-on-surface</code>; secondary/muted text is <code className="monotype text-xs">text-on-surface-variant</code>.</li>
          <li>Labels and eyebrows are small, semibold, sometimes uppercase with tracking.</li>
        </ul>
      </Section>
    </Page>
  )
}
