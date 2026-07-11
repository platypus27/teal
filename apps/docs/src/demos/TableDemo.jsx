import { Badge, Table } from '@kryv/teal'

const projectRows = [
  { id: 'orion', name: 'Orion', owner: 'Avery', status: 'Ready' },
  { id: 'atlas', name: 'Atlas', owner: 'Morgan', status: 'Review' },
  { id: 'nova', name: 'Nova', owner: 'Riley', status: 'Ready' },
]

export function TableDemo() {
  return (
    <div className="w-full">
      <Table
        caption="Projects"
        rows={projectRows}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Project', cell: (row) => <strong>{row.name}</strong> },
          { key: 'owner', header: 'Owner', cell: (row) => row.owner },
          {
            key: 'status',
            header: 'Status',
            cell: (row) => (
              <Badge tone={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
            ),
          },
        ]}
      />
    </div>
  )
}
