import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable, type DataTableColumn } from '../src/DataTable'

interface Project {
  id: string
  name: string
  owner: string
  status: string
}

const rows: Project[] = [
  { id: 'atlas', name: 'Atlas redesign', owner: 'Mira Chen', status: 'Active' },
  { id: 'billing', name: 'Billing migration', owner: 'Jonas Weber', status: 'Paused' },
  { id: 'docs', name: 'Docs overhaul', owner: 'Priya Nair', status: 'Active' },
]

const columns: Array<DataTableColumn<Project>> = [
  { key: 'name', header: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'owner', header: 'Owner', sortable: true, cell: (row) => row.owner },
  { key: 'status', header: 'Status', cell: (row) => row.status },
]

function getRowKey(row: Project) {
  return row.id
}

describe('DataTable', () => {
  it('renders caption, headers, and rows', () => {
    render(<DataTable caption="Projects" columns={columns} rows={rows} getRowKey={getRowKey} />)
    expect(screen.getByRole('region', { name: 'Projects table' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Billing migration' })).toBeInTheDocument()
    // Non-sortable columns render plain header content without a button
    expect(screen.queryByRole('button', { name: /Status/ })).not.toBeInTheDocument()
  })

  it('reports the next sort direction when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    const { rerender } = render(
      <DataTable caption="Projects" columns={columns} rows={rows} getRowKey={getRowKey} onSortChange={onSortChange} />,
    )

    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' })

    rerender(
      <DataTable
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        onSortChange={onSortChange}
        sort={{ key: 'name', direction: 'asc' }}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' })
  })

  it('exposes the current sort through aria-sort and uses sortKey when provided', () => {
    const keyedColumns: Array<DataTableColumn<Project>> = [
      { key: 'name', header: 'Name', sortable: true, sortKey: 'projectName', cell: (row) => row.name },
    ]
    render(
      <DataTable
        caption="Projects"
        columns={keyedColumns}
        rows={rows}
        getRowKey={getRowKey}
        sort={{ key: 'projectName', direction: 'desc' }}
      />,
    )
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
  })

  it('selects all rows from the header checkbox', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        selectable
        selectedKeys={[]}
        onSelectionChange={onSelectionChange}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }))
    expect(onSelectionChange).toHaveBeenCalledWith(['atlas', 'billing', 'docs'])
  })

  it('marks the header checkbox indeterminate when selection is partial', () => {
    render(
      <DataTable
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        selectable
        selectedKeys={['atlas']}
      />,
    )
    const header = screen.getByRole('checkbox', { name: 'Select all rows' })
    expect(header).toHaveAttribute('aria-checked', 'mixed')
    expect(screen.getAllByRole('checkbox', { name: 'Select row' })[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles a single row and accepts a Set of selected keys', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        selectable
        selectedKeys={new Set(['atlas'])}
        onSelectionChange={onSelectionChange}
      />,
    )

    const rowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select row' })
    await user.click(rowCheckboxes[1]!)
    expect(onSelectionChange).toHaveBeenCalledWith(['atlas', 'billing'])
  })

  it('clears the selection when the header checkbox is clicked while all rows are selected', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        selectable
        selectedKeys={['atlas', 'billing', 'docs']}
        onSelectionChange={onSelectionChange}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })
})
