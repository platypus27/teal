import { useState } from 'react'
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Field, Input, Select, Switch, Table } from '@kryv/teal'
import { Page, Section } from '../components/Page.jsx'
import { Preview } from '../components/Preview.jsx'

function SettingsRecipe() {
  const [alerts, setAlerts] = useState(true)
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Account security</CardTitle>
        <CardDescription>Manage sign-in alerts and session policy.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Field label="Security contact" description="Receives account recovery messages">
          <Input type="email" defaultValue="security@example.com" />
        </Field>
        <Field label="Session duration">
          <Select defaultValue="8" options={[{ value: '4', label: '4 hours' }, { value: '8', label: '8 hours' }, { value: '24', label: '24 hours' }]} />
        </Field>
        <Switch label="Suspicious sign-in alerts" description="Notify administrators when a sign-in looks unusual" checked={alerts} onCheckedChange={setAlerts} />
      </CardContent>
      <CardFooter className="justify-end"><Button>Save security settings</Button></CardFooter>
    </Card>
  )
}

const reviewRows = [
  { id: 'incident-1042', owner: 'Avery', priority: 'Critical', title: 'Suspicious sign-in cluster' },
  { id: 'incident-1041', owner: 'Morgan', priority: 'Medium', title: 'New external integration' },
]

function ReviewQueueRecipe() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Review queue</CardTitle>
        <CardDescription>Prioritize work without embedding product-specific workflow in Teal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table
          caption="Incidents awaiting review"
          rows={reviewRows}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'title', header: 'Incident', cell: (row) => row.title },
            { key: 'owner', header: 'Owner', cell: (row) => row.owner },
            {
              key: 'priority',
              header: 'Priority',
              cell: (row) => (
                <Badge tone={row.priority === 'Critical' ? 'danger' : 'warning'}>
                  {row.priority}
                </Badge>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}

export function RecipesPage() {
  return (
    <Page title="Recipes" eyebrow="Patterns" description="Recipes demonstrate product composition without expanding the supported package interface prematurely.">
      <Section title="Settings section" description="Use this composition for related settings with one save action.">
        <Preview><SettingsRecipe /></Preview>
      </Section>
      <Section title="Review queue" description="Combine a structural card, semantic status, and a responsive table for operational review surfaces.">
        <Preview><ReviewQueueRecipe /></Preview>
      </Section>
      <Section title="Promotion rule">
        <p className="max-w-3xl rounded-2xl border border-outline-variant/30 bg-surface-container p-5 text-sm leading-relaxed text-on-surface-variant">A recipe becomes a published module only after at least two Kryv products need the same behavior. Product persistence, validation policy, queries, and domain language stay in the application.</p>
      </Section>
    </Page>
  )
}
