import { lazy, Suspense, useEffect, useState } from 'react'
import { CodeBlock } from '../components/CodeBlock.jsx'
import { Page, Section } from '../components/Page.jsx'
import moduleRouteIndex from '../generated/module-route-index.json'

const ModuleDetails = lazy(() =>
  import('./ModuleDetails.jsx').then((module) => ({ default: module.ModuleDetails })),
)
const NotFoundPage = lazy(() =>
  import('./NotFoundPage.jsx').then((module) => ({ default: module.NotFoundPage })),
)
const catalog = Object.entries(moduleRouteIndex).map(([id, module]) => ({ id, ...module }))

function LoadingDetails() {
  return (
    <div role="status" className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-6 text-sm text-teal-on-surface-variant">
      Loading module examples...
    </div>
  )
}

export function ModulePage() {
  const moduleId = window.location.pathname.match(/^\/modules\/([^/]+)\/?$/)?.[1]
  const module = catalog.find((item) => item.id === moduleId)
  const [loaded, setLoaded] = useState({ id: null, markdown: null, record: null })
  const [failedId, setFailedId] = useState(null)

  useEffect(() => {
    if (!module || !moduleId) return undefined
    let active = true
    Promise.all([import('../data/catalog.jsx'), import('../lib/markdown.js')])
      .then(async ([catalogModule, markdownModule]) => {
        const record = await catalogModule.loadModuleRecord(moduleId)
        return {
          record,
          markdown: record ? markdownModule.moduleMarkdown(record, record.apiEntries) : null,
        }
      })
      .then(({ markdown, record }) => {
        if (!active) return
        sessionStorage.removeItem(`teal-module-reload:${moduleId}`)
        setLoaded({ id: moduleId, markdown, record })
      })
      .catch(() => {
        if (!active) return
        if (!sessionStorage.getItem(`teal-module-reload:${moduleId}`)) {
          sessionStorage.setItem(`teal-module-reload:${moduleId}`, '1')
          window.location.reload()
          return
        }
        setFailedId(moduleId)
      })
    return () => {
      active = false
    }
  }, [module, moduleId])

  if (!module) {
    return (
      <Suspense
        fallback={(
          <Page title="Page not found" description="The requested module does not exist." pagination={false}>
            <div role="status">Loading page...</div>
          </Page>
        )}
      >
        <NotFoundPage />
      </Suspense>
    )
  }

  const imports = module.imports ?? module.apiNames
  const usageSource = `import { ${imports.join(', ')} } from '@kryv/teal'\n\n${module.usage}`
  const record = loaded.id === moduleId ? loaded.record : null
  const markdown = loaded.id === moduleId ? loaded.markdown : null

  return (
    <Page
      title={module.name}
      eyebrow="Module"
      description={module.description}
      markdown={markdown}
      pagination={Boolean(record)}
    >
      <Section title="Usage">
        <CodeBlock code={usageSource} lang="jsx" />
      </Section>
      {failedId === moduleId ? (
        <div role="alert" className="rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-6 text-sm text-teal-on-surface-variant">
          <p>Examples could not be loaded. This usually means the docs were redeployed while this page was open.</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-teal-primary px-4 py-2 font-semibold text-teal-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      ) : record ? (
        <Suspense fallback={<LoadingDetails />}>
          <ModuleDetails catalog={catalog} record={record} />
        </Suspense>
      ) : (
        <LoadingDetails />
      )}
    </Page>
  )
}
