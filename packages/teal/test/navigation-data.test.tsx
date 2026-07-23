import { createRef } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion, Breadcrumb, Menu, Pagination, Popover, Table, Tabs, VerticalNav, VerticalNavItem, VerticalNavList } from '../src/index'

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
    act(() => profile.focus())
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

  it('supports modal menus', async () => {
    const user = userEvent.setup()
    render(
      <Menu
        modal
        trigger={<button type="button">Actions</button>}
        items={[{ id: 'archive', label: 'Archive', onSelect: () => {} }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(await screen.findByRole('menu')).toBeInTheDocument()
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

  it('only makes the table region focusable when the content scrolls', () => {
    const columns = [{ key: 'name', header: 'Project', cell: (row: { id: string }) => row.id }]
    const { unmount } = render(
      <Table caption="Projects" rows={rows} getRowKey={(row) => row.id} columns={columns} />,
    )
    expect(screen.getByRole('region', { name: 'Projects table' })).not.toHaveAttribute('tabindex')
    unmount()

    const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(500)
    const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300)
    render(<Table caption="Projects" rows={rows} getRowKey={(row) => row.id} columns={columns} />)
    expect(screen.getByRole('region', { name: 'Projects table' })).toHaveAttribute('tabindex', '0')
    scrollWidth.mockRestore()
    clientWidth.mockRestore()
  })

  it('marks the region busy and announces loading without naming rows', () => {
    const { container } = render(
      <Table
        caption="Projects"
        rows={[]}
        getRowKey={(row: { id: string }) => row.id}
        columns={[{ key: 'name', header: 'Project', cell: () => null }]}
        loading
        loadingLabel="Loading projects"
      />,
    )
    expect(screen.getByRole('region', { name: 'Projects table' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects')
    container.querySelectorAll('tr').forEach((row) => expect(row).not.toHaveAttribute('aria-label'))
  })

  it('forwards refs to the table, tabs, and pagination roots', () => {
    const tableRef = createRef<HTMLDivElement>()
    const tabsRef = createRef<HTMLDivElement>()
    const paginationRef = createRef<HTMLElement>()
    render(
      <>
        <Table
          ref={tableRef}
          caption="Projects"
          rows={rows}
          getRowKey={(row) => row.id}
          columns={[{ key: 'name', header: 'Project', cell: (row) => row.name }]}
        />
        <Tabs
          ref={tabsRef}
          aria-label="Account settings"
          items={[{ value: 'profile', label: 'Profile', content: 'Profile panel' }]}
        />
        <Pagination ref={paginationRef} page={1} pageCount={3} onPageChange={() => {}} />
      </>,
    )
    expect(tableRef.current).toBe(screen.getByRole('region', { name: 'Projects table' }))
    expect(tabsRef.current).toContainElement(screen.getByRole('tab', { name: 'Profile' }))
    expect(paginationRef.current).toBe(screen.getByRole('navigation', { name: 'Pagination' }))
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


describe('breadcrumb and accordion', () => {
  it('marks the last breadcrumb item as the current page', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Orion' },
        ]}
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    const current = screen.getByText('Orion')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.closest('a')).toBeNull()
  })

  it('collapses long breadcrumbs into an overflow menu', async () => {
    const user = userEvent.setup()
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Alpha', href: '/alpha' },
          { label: 'Beta', href: '/beta' },
          { label: 'Gamma', href: '/gamma' },
          { label: 'Delta', href: '/delta' },
          { label: 'Current' },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Beta' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show hidden breadcrumb items' }))
    expect(await screen.findByRole('menuitem', { name: 'Beta' })).toBeInTheDocument()
  })

  it('expands one accordion item at a time by default', async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        items={[
          { value: 'one', title: 'First', content: 'First panel' },
          { value: 'two', title: 'Second', content: 'Second panel' },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'First' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('button', { name: 'Second' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps multiple accordion items open in multiple mode', async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        multiple
        items={[
          { value: 'one', title: 'First', content: 'First panel' },
          { value: 'two', title: 'Second', content: 'Second panel' },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'First' }))
    await user.click(screen.getByRole('button', { name: 'Second' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not open disabled accordion items', async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        items={[{ value: 'one', title: 'Locked', content: 'Hidden panel', disabled: true }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Locked' }))
    expect(screen.getByRole('button', { name: 'Locked' })).toHaveAttribute('aria-expanded', 'false')
  })
})


describe('vertical nav items', () => {
  it('renders the icon column only when an icon is provided', () => {
    render(
      <VerticalNav aria-label="Primary">
        <VerticalNavList>
          <VerticalNavItem href="/plain">Plain</VerticalNavItem>
          <VerticalNavItem href="/icon" icon={<svg data-testid="nav-icon" />}>
            With icon
          </VerticalNavItem>
        </VerticalNavList>
      </VerticalNav>,
    )
    expect(screen.getByRole('link', { name: 'Plain' }).querySelector('.teal-u-w-16')).toBeNull()
    expect(screen.getByRole('link', { name: 'With icon' }).querySelector('.teal-u-w-16')).not.toBeNull()
  })
})
