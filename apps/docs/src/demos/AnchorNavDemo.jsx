import { AnchorNav } from '@kryv/teal'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
]

export function AnchorNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full gap-6 sm:grid-cols-[12rem_1fr]">
        <AnchorNav
          defaultActiveId="features"
          items={sections}
        />
        <div tabIndex={0} className="h-56 space-y-6 overflow-y-auto rounded-xl border border-teal-outline-variant/30 p-4">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="h-32">
              <h3 className="font-semibold">{section.label}</h3>
              <p className="text-sm text-teal-on-surface-variant">Scroll or click a link to track this section.</p>
            </section>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full gap-6 sm:grid-cols-[12rem_1fr]">
      <AnchorNav items={sections} />
      <div tabIndex={0} className="h-56 space-y-6 overflow-y-auto rounded-xl border border-teal-outline-variant/30 p-4">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="h-32">
            <h3 className="font-semibold">{section.label}</h3>
            <p className="text-sm text-teal-on-surface-variant">Scroll or click a link to track this section.</p>
          </section>
        ))}
      </div>
    </div>
  )
}
