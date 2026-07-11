import { Navigate, useParams } from 'react-router-dom'
import api from '../generated/api.json'
import { Page, Section } from '../components/Page.jsx'
import { Preview } from '../components/Preview.jsx'
import { PropsTable } from '../components/PropsTable.jsx'
import { catalog } from '../data/catalog.jsx'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = catalog.find((item) => item.id === moduleId)
  if (!module) return <Navigate to="/" replace />
  const docs = module.apiNames.flatMap((name) => api.filter((entry) => entry.displayName === name))
  const Demo = module.Demo

  return (
    <Page title={module.name} eyebrow="Module" description={module.description}>
      <Section title="Example">
        <Preview label={`${module.name} states`}><Demo /></Preview>
      </Section>
      <Section title="Interface" description="Generated from the published TypeScript source.">
        {docs.length ? docs.map((entry) => (
          <div key={entry.displayName} className="space-y-3">
            <h3 className="font-headline font-bold text-on-surface">{entry.displayName}</h3>
            <PropsTable props={entry.props} />
          </div>
        )) : <p className="text-sm text-on-surface-variant">No additional properties beyond the documented function interface.</p>}
      </Section>
    </Page>
  )
}
