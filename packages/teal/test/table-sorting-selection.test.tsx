import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, type TableColumn, type TableSort } from '../src/Table'

interface Project {
  id: string
  name: string
  status: string
}

const rows: Project[] = [
  { id: 'atlas', name: 'Atlas', status: 'Active' },
  { id: 'billing', name: 'Billing', status: 'Paused' },
  { id: 'docs', name: 'Docs', status: 'Active' },
]

const columns: Array<TableColumn<Project>> = [
  { key: 'name', header: 'Name', cell: (row) => row.name, sortable: true },
  { key: 'status', header: 'Status', cell: (row) => row.status },
]

describe('Table sorting', () => {
  it('renders caption, headers, and rows, with no button on non-sortable columns', () => {
    render(<Table caption="Projects" columns={columns} rows={rows} getRowKey={(row) => row.id} />)

    expect(screen.getByRole('region', { name: 'Projects table' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Atlas' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Status/ })).toBeNull()
  })

  it('reports the next sort direction when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    const { rerender } = render(
      <Table caption="Projects" columns={columns} rows={rows} getRowKey={(row) => row.id} onSortChange={onSortChange} />,
    )

    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })

    const sort: TableSort = { key: 'name', direction: 'asc' }
    rerender(
      <Table caption="Projects" columns={columns} rows={rows} getRowKey={(row) => row.id} sort={sort} onSortChange={onSortChange} />,
    )
    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' })
  })

  it('exposes the current sort through aria-sort and uses sortKey when provided', () => {
    const keyedColumns: Array<TableColumn<Project>> = [
      { key: 'name', header: 'Name', sortable: true, sortKey: 'projectName', cell: (row) => row.name },
    ]
    render(
      <Table
        caption="Projects"
        columns={keyedColumns}
        rows={rows}
        getRowKey={(row) => row.id}
        sort={{ key: 'projectName', direction: 'desc' }}
      />,
    )
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
  })
})

describe('Table selection', () => {
  it('selects all rows from the header checkbox', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table caption="Projects" columns={columns} rows={rows} getRowKey={(row) => row.id} selectable onSelectionChange={onSelectionChange} />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }))

    expect(onSelectionChange).toHaveBeenCalledWith(['atlas', 'billing', 'docs'])
  })

  it('renders the header select-all with the same centered shell as row checkboxes', () => {
    render(
      <Table caption="Projects" columns={columns} rows={rows} getRowKey={(row) => row.id} selectable selectedKeys={[]} />,
    )

    const headerCell = screen.getByRole('checkbox', { name: 'Select all rows' }).closest('th')
    const rowCell = screen.getAllByRole('checkbox', { name: /Select row/ })[0]!.closest('td')
    expect(headerCell?.querySelector(':scope > div')).toHaveClass('teal-u-flex', 'teal-u-items-center')
    expect(rowCell?.querySelector(':scope > div')).toHaveClass('teal-u-flex', 'teal-u-items-center')
  })

  it('marks the header checkbox indeterminate when selection is partial', () => {
    render(
      <Table
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
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
      <Table
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
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
      <Table
        caption="Projects"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        selectable
        selectedKeys={['atlas', 'billing', 'docs']}
        onSelectionChange={onSelectionChange}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })
})
