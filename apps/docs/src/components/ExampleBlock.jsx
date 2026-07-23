import { Tabs } from '@kryv/teal'
import { CodeBlock } from './CodeBlock.jsx'
import { DemoErrorBoundary } from './DemoErrorBoundary.jsx'
import { Preview } from './Preview.jsx'

export function ExampleBlock({ title = undefined, description = undefined, source, lang = 'jsx', children }) {
  return (
    <div className="space-y-3">
      {title ? <h3 className="font-teal-headline text-lg font-bold text-teal-on-surface">{title}</h3> : null}
      {description ? <p className="max-w-2xl text-sm text-teal-on-surface-variant">{description}</p> : null}
      <Tabs
        aria-label={title ? `${title} example` : 'Code example'}
        items={[
          {
            value: 'preview',
            label: 'Preview',
            content: (
              <Preview>
                <DemoErrorBoundary>{children}</DemoErrorBoundary>
              </Preview>
            ),
          },
          {
            value: 'code',
            label: 'Code',
            content: <CodeBlock code={source} lang={lang} label={title ? undefined : 'example.jsx'} />,
          },
        ]}
      />
    </div>
  )
}
