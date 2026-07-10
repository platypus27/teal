import { Page, Section } from '../components/Page.jsx'
import { Preview } from '../components/Preview.jsx'
import { CodeBlock } from '../components/CodeBlock.jsx'
import { PropsTable } from '../components/PropsTable.jsx'

export function ComponentDoc({ meta }) {
  return (
    <Page title={meta.name} description={meta.description}>
      <Section title="Import">
        <CodeBlock code={meta.importLine} />
      </Section>

      <Section title="Examples">
        <div className="space-y-6">
          {meta.examples.map((ex, i) => (
            <Preview key={i} title={ex.title} code={ex.code}>
              <ex.Demo />
            </Preview>
          ))}
        </div>
      </Section>

      <Section title="Props">
        <PropsTable props={meta.props} />
      </Section>

      {meta.extraProps?.map((t) => (
        <Section key={t.title} title={t.title}>
          <PropsTable props={t.props} />
        </Section>
      ))}
    </Page>
  )
}
