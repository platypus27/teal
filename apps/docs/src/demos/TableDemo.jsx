import { useMemo, useState } from 'react'
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

const sortableColumns = [
  { key: 'name', header: 'Project', sortable: true, cell: (row) => row.name },
  { key: 'owner', header: 'Owner', sortable: true, cell: (row) => row.owner },
  { key: 'status', header: 'Status', cell: (row) => row.status },
]

export function TableDemo({ exampleIndex = 0 }) {
  const [sort, setSort] = useState(/** @type {{ key: string, direction: 'asc' | 'desc' }} */ ({ key: 'name', direction: 'asc' }))
  const [selectedKeys, setSelectedKeys] = useState(['atlas'])

  const sortedRows = useMemo(() => {
    const copy = [...projectRows]
    copy.sort((a, b) => {
      const order = String(a[sort.key]).localeCompare(String(b[sort.key]))
      return sort.direction === 'asc' ? order : -order
    })
    return copy
  }, [sort])

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
  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-2xl">
        <Table
          caption="Projects with sorting and row selection"
          columns={sortableColumns}
          rows={sortedRows}
          getRowKey={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
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
