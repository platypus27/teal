import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from '../src/Sidebar'

function renderSidebar(extraProps = {}) {
  return render(
    <Sidebar {...extraProps}>
      <SidebarHeader>
        <span>Acme</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSection label="Workspace">
          <SidebarItem active href="#overview">
            Overview
          </SidebarItem>
          <SidebarItem href="#projects">Projects</SidebarItem>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarCollapseButton />
      </SidebarFooter>
    </Sidebar>,
  )
}

describe('Sidebar', () => {
  it('renders a navigation landmark with header, items, and footer', () => {
    renderSidebar()

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument()
  })

  it('marks the active item with aria-current="page"', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute('aria-current')
  })

  it('collapses to an icon rail when the collapse button is clicked', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    renderSidebar({ onCollapsedChange })

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }))

    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute('data-collapsed')
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports a default collapsed state', () => {
    renderSidebar({ defaultCollapsed: true })

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute('data-collapsed')
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
  })

  it('respects the controlled collapsed prop', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    renderSidebar({ collapsed: true, onCollapsedChange })

    const nav = screen.getByRole('navigation', { name: 'Sidebar' })
    expect(nav).toHaveAttribute('data-collapsed')

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }))
    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    expect(nav).toHaveAttribute('data-collapsed')
  })

  it('allows a custom accessible name', () => {
    render(
      <Sidebar aria-label="Docs">
        <SidebarContent>
          <SidebarItem href="#a">A</SidebarItem>
        </SidebarContent>
      </Sidebar>,
    )

    expect(screen.getByRole('navigation', { name: 'Docs' })).toBeInTheDocument()
  })

  it('calls a consumer onClick on the collapse button after toggling', () => {
    const onClick = vi.fn()
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarCollapseButton onClick={onClick} />
        </SidebarContent>
      </Sidebar>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
