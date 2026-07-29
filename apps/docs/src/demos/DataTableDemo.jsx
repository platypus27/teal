import { useMemo, useState } from 'react'
import { DataTable } from '@kryv/teal'

const projects = [
  { id: 'atlas', name: 'Atlas redesign', owner: 'Mira Chen', status: 'Active', updated: '2026-07-24' },
  { id: 'billing', name: 'Billing migration', owner: 'Jonas Weber', status: 'Paused', updated: '2026-07-21' },
  { id: 'docs', name: 'Docs overhaul', owner: 'Priya Nair', status: 'Active', updated: '2026-07-27' },
  { id: 'mobile', name: 'Mobile app', owner: 'Sam Ortiz', status: 'Review', updated: '2026-07-18' },
  { id: 'onboarding', name: 'Onboarding revamp', owner: 'Lena Fischer', status: 'Active', updated: '2026-07-25' },
]

const columns = [
  { key: 'name', header: 'Project', sortable: true, cell: (row) => row.name },
  { key: 'owner', header: 'Owner', sortable: true, cell: (row) => row.owner },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  { key: 'updated', header: 'Last updated', sortable: true, cell: (row) => row.updated },
]

export function DataTableDemo({ exampleIndex = 0 }) {
  const [sort, setSort] = useState(/** @type {{ key: string, direction: 'asc' | 'desc' }} */ ({ key: 'updated', direction: 'desc' }))
  const [selectedKeys, setSelectedKeys] = useState(['atlas'])

  const sortedRows = useMemo(() => {
    const copy = [...projects]
    copy.sort((a, b) => {
      const order = String(a[sort.key]).localeCompare(String(b[sort.key]))
      return sort.direction === 'asc' ? order : -order
    })
    return copy
  }, [sort])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-2xl">
        <DataTable
          caption="Projects with row selection"
          columns={columns}
          rows={sortedRows}
          getRowKey={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          density="compact"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <DataTable
        caption="Workspace projects"
        columns={columns}
        rows={sortedRows}
        getRowKey={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}
