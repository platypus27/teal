import { useRef } from 'react'
import { AnchorNav } from '@kryv/teal'

const overviewSections = [
  { id: 'anchor-overview', label: 'Overview' },
  { id: 'anchor-features', label: 'Features' },
  { id: 'anchor-pricing', label: 'Pricing' },
  { id: 'anchor-faq', label: 'FAQ' },
]

const seededSections = [
  { id: 'seeded-overview', label: 'Overview' },
  { id: 'seeded-features', label: 'Features' },
  { id: 'seeded-pricing', label: 'Pricing' },
  { id: 'seeded-faq', label: 'FAQ' },
]

const guideItems = [
  { id: 'guide-install', label: 'Installation' },
  {
    id: 'guide-usage',
    label: 'Usage',
    children: [
      { id: 'guide-npm', label: 'With npm' },
      { id: 'guide-pnpm', label: 'With pnpm' },
    ],
  },
  { id: 'guide-reference', label: 'Reference' },
]

function flatten(items) {
  return items.flatMap((item) => [item, ...(item.children ?? [])])
}

function ScrollSpyDemo({ defaultActiveId = undefined, items, note }) {
  const containerRef = useRef(null)
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[12rem_1fr]">
      <AnchorNav
        containerRef={containerRef}
        items={items}
        {...(defaultActiveId ? { defaultActiveId } : {})}
      />
      <div
        ref={containerRef}
        tabIndex={0}
        className="h-56 space-y-6 overflow-y-auto rounded-xl border border-teal-outline-variant/30 p-4"
      >
        {flatten(items).map((item) => (
          <section key={item.id} id={item.id} className="h-32">
            <h3 className="font-semibold">{item.label}</h3>
            <p className="text-sm text-teal-on-surface-variant">{note}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export function AnchorNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ScrollSpyDemo
        defaultActiveId="seeded-features"
        items={seededSections}
        note="Scroll or click a link to track this section."
      />
    )
  }

  if (exampleIndex === 2) {
    return <ScrollSpyDemo items={guideItems} note="Nested items indent and track this section." />
  }

  return <ScrollSpyDemo items={overviewSections} note="Scroll or click a link to track this section." />
}
