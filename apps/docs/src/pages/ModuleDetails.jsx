import { Check, X } from 'lucide-react'
import { ExampleBlock } from '../components/ExampleBlock.jsx'
import { Section } from '../components/Page.jsx'
import { Playground } from '../components/Playground.jsx'
import { PropsTable } from '../components/PropsTable.jsx'

export function ModuleDetails({ catalog, record }) {
  const docs = record.apiEntries
  const guide = record.accessibility
  const guidance = record.guidance
  const anatomy = record.anatomy?.length ? record.anatomy : null
  const dosDonts =
    record.dosDonts && (record.dosDonts.dos?.length || record.dosDonts.donts?.length)
      ? record.dosDonts
      : null
  const related = record.related?.length
    ? record.related.map((id) => ({ id, name: catalog.find((entry) => entry.id === id)?.name ?? id }))
    : null

  return (
    <>
      <Section title="Examples">
        <div className="space-y-8">
          {record.examples.map((example) => {
            const Demo = example.Demo
            return (
              <ExampleBlock
                key={example.title}
                title={example.title}
                description={example.description}
                source={example.source}
              >
                <Demo />
              </ExampleBlock>
            )
          })}
        </div>
      </Section>
      {anatomy ? (
        <Section title="Anatomy">
          <dl className="divide-y divide-teal-outline-variant/25 rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container">
            {anatomy.map((entry) => (
              <div key={entry.part} className="px-5 py-4">
                <dt className="font-teal-headline font-bold text-teal-on-surface">{entry.part}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-teal-on-surface-variant">{entry.description}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
      {record.playground ? (
        <Section
          title="Playground"
          description="Tweak props, watch the preview, and copy the generated code. Your choices persist in the URL."
        >
          <Playground config={record.playground} apiEntries={docs} />
        </Section>
      ) : null}
      {guidance ? (
        <Section title="Design guidance">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Use when', guidance.useWhen],
              ['Avoid when', guidance.avoidWhen],
              ['Behavior', guidance.behavior],
              ['Responsive', guidance.responsive],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-5">
                <h3 className="font-teal-headline font-bold text-teal-on-surface">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-on-surface-variant">{text}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      {dosDonts ? (
        <Section title="Do and don't">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-5">
              <h3 className="font-teal-headline font-bold text-teal-primary">Do</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-teal-on-surface-variant">
                {(dosDonts.dos ?? []).map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-5">
              <h3 className="font-teal-headline font-bold text-teal-error">Don&rsquo;t</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-teal-on-surface-variant">
                {(dosDonts.donts ?? []).map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-error" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ) : null}
      <Section title="Interface" description="Generated from the published TypeScript source.">
        {docs.length ? (
          <div className="space-y-8">
            {docs.map((entry) => (
              <div key={entry.displayName} className="space-y-3">
                <h3 className="font-teal-headline font-bold text-teal-on-surface">{entry.displayName}</h3>
                <PropsTable name={entry.displayName} props={entry.props} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-teal-on-surface-variant">
            No additional properties beyond the documented function interface.
          </p>
        )}
      </Section>
      {guide ? (
        <Section title="Accessibility">
          {guide.keyboard?.length ? (
            <div
              role="region"
              aria-label="Keyboard interactions"
              tabIndex={0}
              className="overflow-x-auto rounded-2xl border border-teal-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
            >
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead className="bg-teal-surface-container-high text-xs uppercase tracking-wide text-teal-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Keys</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-outline-variant/25 bg-teal-surface-container">
                  {guide.keyboard.map((row) => (
                    <tr key={row.action}>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap gap-1.5">
                          {row.keys.map((key) => (
                            <kbd
                              key={key}
                              className="rounded-md border border-teal-outline-variant/50 bg-teal-surface-container-high px-1.5 py-0.5 font-mono text-xs text-teal-on-surface"
                            >
                              {key}
                            </kbd>
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-teal-on-surface-variant">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {guide.notes?.length ? (
            <ul className="grid gap-2 text-sm leading-relaxed text-teal-on-surface-variant">
              {guide.notes.map((note) => (
                <li key={note} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-primary" />
                  {note}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}
      {related ? (
        <Section title="Related modules">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`/modules/${entry.id}`}
                  className="block rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container px-5 py-4 font-teal-headline font-bold text-teal-on-surface transition hover:border-teal-primary/40 hover:bg-teal-surface-container-high hover:text-teal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
                >
                  {entry.name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
