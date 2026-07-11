import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table } from '@kryv/teal'

const reviewRows = [
  { id: 'incident-1042', owner: 'Avery', priority: 'Critical', title: 'Suspicious sign-in cluster' },
  { id: 'incident-1041', owner: 'Morgan', priority: 'Medium', title: 'New external integration' },
]

export function ReviewQueueRecipe() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Review queue</CardTitle>
        <CardDescription>
          Prioritize work without embedding product-specific workflow in Teal.
        </CardDescription>
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
                <Badge tone={row.priority === 'Critical' ? 'danger' : 'warning'}>{row.priority}</Badge>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
