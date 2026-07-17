import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu, Pagination, Popover, Table, Tabs } from '../src/index'

describe('navigation modules', () => {
  it('moves between tabs with the keyboard and exposes the active panel', async () => {
    const user = userEvent.setup()
    render(
      <Tabs
        aria-label="Account settings"
        defaultValue="profile"
        items={[
          { value: 'profile', label: 'Profile', content: 'Profile panel' },
          { value: 'security', label: 'Security', content: 'Security panel' },
        ]}
      />,
    )

    const profile = screen.getByRole('tab', { name: 'Profile' })
    profile.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security panel')
  })

  it('runs structured menu actions', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Menu
        trigger={<button type="button">Actions</button>}
        items={[{ id: 'archive', label: 'Archive', variant: 'danger', onSelect }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Archive' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('anchors arbitrary popover content to a trigger', async () => {
    const user = userEvent.setup()
    render(
      <Popover label="Filters" trigger={<button type="button">Filters</button>}>
        <p>Filter controls</p>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Filters' }))
    expect(await screen.findByText('Filter controls')).toBeVisible()
  })

  it('gives rich popover dialogs an accessible name', async () => {
    const user = userEvent.setup()
    render(
      <Popover
        label="Workspace navigation"
        trigger={<button type="button">Open workspace</button>}
      >
        <nav>Planning tools</nav>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open workspace' }))
    expect(
      await screen.findByRole('dialog', { name: 'Workspace navigation' }),
    ).toBeVisible()
  })
})

describe('data modules', () => {
  const rows = [
    { id: 'a', name: 'Alpha', status: 'Ready' },
    { id: 'b', name: 'Beta', status: 'Pending' },
  ]

  it('renders accessible tabular data through column definitions', () => {
    render(
      <Table
        caption="Projects"
        rows={rows}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Project', cell: (row) => row.name },
          { key: 'status', header: 'Status', cell: (row) => row.status },
        ]}
      />,
    )
    expect(screen.getByRole('table', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Project' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Beta' })).toBeInTheDocument()
  })

  it('shows an explicit empty result instead of an empty table body', () => {
    render(
      <Table
        caption="Projects"
        rows={[]}
        getRowKey={(row: { id: string }) => row.id}
        columns={[{ key: 'name', header: 'Project', cell: () => null }]}
        empty="No projects found"
      />,
    )
    expect(screen.getByText('No projects found')).toBeInTheDocument()
  })

  it('keeps pagination controlled and disables unavailable directions', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
