import { useParams } from 'react-router-dom'
import api from '../generated/api.json'
import { CodeBlock } from '../components/CodeBlock.jsx'
import { ExampleBlock } from '../components/ExampleBlock.jsx'
import { Page, Section } from '../components/Page.jsx'
import { Playground } from '../components/Playground.jsx'
import { PropsTable } from '../components/PropsTable.jsx'
import { accessibility } from '../data/accessibility.js'
import { catalog } from '../data/catalog.jsx'
import { moduleMarkdown } from '../lib/markdown.js'
import { NotFoundPage } from './NotFoundPage.jsx'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = catalog.find((item) => item.id === moduleId)
  if (!module) return <NotFoundPage />
  const docs = module.apiNames.flatMap((name) => api.filter((entry) => entry.displayName === name))
  const imports = module.imports ?? module.apiNames
  const guide = accessibility[module.id]
  const usageSource = `import { ${imports.join(', ')} } from '@kryv/teal'\n\n${module.usage}`

  return (
    <Page
      title={module.name}
      eyebrow="Module"
      description={module.description}
      markdown={moduleMarkdown(module, api)}
    >
      <Section title="Usage">
        <CodeBlock code={usageSource} lang="jsx" />
      </Section>
      <Section title="Examples">
        <div className="space-y-8">
          {module.examples.map((example) => {
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
      {module.playground ? (
        <Section
          title="Playground"
          description="Tweak props, watch the preview, and copy the generated code. Your choices persist in the URL."
        >
          <Playground config={module.playground} />
        </Section>
      ) : null}
      <Section title="Interface" description="Generated from the published TypeScript source.">
        {docs.length ? (
          <div className="space-y-8">
            {docs.map((entry) => (
              <div key={entry.displayName} className="space-y-3">
                <h3 className="font-headline font-bold text-on-surface">{entry.displayName}</h3>
                <PropsTable name={entry.displayName} props={entry.props} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">
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
              className="overflow-x-auto rounded-2xl border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead className="bg-surface-container-high text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Keys</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/25 bg-surface-container">
                  {guide.keyboard.map((row) => (
                    <tr key={row.action}>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap gap-1.5">
                          {row.keys.map((key) => (
                            <kbd
                              key={key}
                              className="rounded-md border border-outline-variant/50 bg-surface-container-high px-1.5 py-0.5 font-mono text-xs text-on-surface"
                            >
                              {key}
                            </kbd>
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {guide.notes?.length ? (
            <ul className="grid gap-2 text-sm leading-relaxed text-on-surface-variant">
              {guide.notes.map((note) => (
                <li key={note} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {note}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}
    </Page>
  )
}
