import { lazy, Suspense, useEffect, useState } from 'react'
import { Page } from '../components/Page.jsx'

const RecipesContent = lazy(() =>
  import('./RecipesContent.jsx').then((module) => ({ default: module.RecipesContent })),
)

export function RecipesPage() {
  const [markdown, setMarkdown] = useState(null)
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    let secondFrame = null
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setContentReady(true))
    })
    return () => {
      cancelAnimationFrame(firstFrame)
      if (secondFrame !== null) cancelAnimationFrame(secondFrame)
    }
  }, [])

  const loading = (
    <div role="status" className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-6 text-sm text-teal-on-surface-variant">
      Loading recipes...
    </div>
  )

  return (
    <Page
      title="Recipes"
      eyebrow="Patterns"
      description="Recipes demonstrate product composition without expanding the supported package interface prematurely."
      markdown={markdown}
      pagination={Boolean(markdown)}
    >
      {contentReady ? (
        <Suspense fallback={loading}>
          <RecipesContent onMarkdown={setMarkdown} />
        </Suspense>
      ) : loading}
    </Page>
  )
}
