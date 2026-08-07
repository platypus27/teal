import { TableOfContents } from '@kryv/teal'

const headings = [
  { id: 'installation', level: 2, title: 'Installation' },
  { id: 'npm', level: 3, title: 'With npm' },
  { id: 'pnpm', level: 3, title: 'With pnpm' },
  { id: 'usage', level: 2, title: 'Usage' },
  { id: 'theming', level: 3, title: 'Theming' },
]

export function TableOfContentsDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full gap-6 sm:grid-cols-[14rem_1fr]">
        <TableOfContents
          defaultActiveId="usage"
          headings={[
            { id: 'guide', level: 2, title: 'Guide' },
            { id: 'guide-basics', level: 3, title: 'Basics' },
            { id: 'guide-advanced', level: 4, title: 'Advanced options' },
            { id: 'reference', level: 2, title: 'Reference' },
          ]}
        />
        <div tabIndex={0} className="h-56 space-y-6 overflow-y-auto rounded-xl border border-teal-outline-variant/30 p-4">
          {['guide', 'guide-basics', 'guide-advanced', 'reference'].map((id) => (
            <section key={id} id={id} className="h-28">
              <h3 className="font-semibold">{id}</h3>
              <p className="text-sm text-teal-on-surface-variant">The ToC indents and tracks this section.</p>
            </section>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full gap-6 sm:grid-cols-[14rem_1fr]">
      <TableOfContents headings={headings} />
      <div tabIndex={0} className="h-56 space-y-6 overflow-y-auto rounded-xl border border-teal-outline-variant/30 p-4">
        {headings.map((heading) => (
          <section key={heading.id} id={heading.id} className="h-28">
            <h3 className="font-semibold">{heading.title}</h3>
            <p className="text-sm text-teal-on-surface-variant">The ToC indents and tracks this section.</p>
          </section>
        ))}
      </div>
    </div>
  )
}
