import { Badge, Table } from '@kryv/teal'

const projectRows = [
  { id: 'orion', name: 'Orion', owner: 'Avery', status: 'Ready' },
  { id: 'atlas', name: 'Atlas', owner: 'Morgan', status: 'Review' },
  { id: 'nova', name: 'Nova', owner: 'Riley', status: 'Ready' },
]

const projectColumns = [
  { key: 'name', header: 'Project', cell: (row) => <strong>{row.name}</strong> },
  { key: 'owner', header: 'Owner', cell: (row) => row.owner },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge variant={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
    ),
  },
]

export function TableDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full">
        <Table
          caption="Projects"
          loading
          loadingLabel="Loading projects"
          rows={projectRows}
          getRowKey={(row) => row.id}
          columns={projectColumns}
        />
      </div>
    )
  }
  return (
    <div className="w-full">
      <Table
        caption="Projects"
        rows={projectRows}
        getRowKey={(row) => row.id}
        columns={projectColumns}
      />
    </div>
  )
}
