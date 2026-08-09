import { lazy, Suspense, useState } from 'react'
import { Page } from '../components/Page.jsx'

const HomeContent = lazy(() =>
  import('./HomeContent.jsx').then((module) => ({ default: module.HomeContent })),
)

export function HomePage() {
  const [markdown, setMarkdown] = useState(null)

  return (
    <Page
      eyebrow="Kryv Labs"
      title="A calm, accessible system for serious product work"
      docTitle="Getting started"
      description="Teal provides typed React modules, semantic design tokens, and tested interaction behavior for Kryv applications."
      markdown={markdown}
      pagination={Boolean(markdown)}
    >
      <Suspense
        fallback={(
          <div role="status" className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-6 text-sm text-teal-on-surface-variant">
            Loading getting started guide...
          </div>
        )}
      >
        <HomeContent onMarkdown={setMarkdown} />
      </Suspense>
    </Page>
  )
}
