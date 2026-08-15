import { createRef } from 'react'
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

describe('Sidebar rail mode', () => {
  function renderRail(extra?: Partial<React.ComponentProps<typeof Sidebar>>) {
    return render(
      <Sidebar aria-label="Primary" mode="rail" {...extra}>
        <SidebarContent>
          <SidebarSection label="Main">
            <SidebarItem href="/" icon={<svg data-testid="home-icon" />} active>
              Home
            </SidebarItem>
            <SidebarItem href="/settings">Settings</SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>,
    )
  }

  it('renders a labeled navigation landmark', () => {
    renderRail()

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('defaults to rail width that expands on hover and focus', () => {
    renderRail()

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toHaveClass('teal-u-w-20', 'hover:teal-u-w-72', 'focus-within:teal-u-w-72')
  })

  it('collapses item labels until hover and shows the active background as an icon chip', () => {
    renderRail()

    const home = screen.getByRole('link', { name: 'Home' })
    expect(home).toHaveAttribute('aria-current', 'page')
    expect(home).not.toHaveClass('teal-u-bg-primary/10')
    expect(screen.getByTestId('home-icon').parentElement).toHaveClass('teal-u-rounded-full', 'teal-u-bg-primary/10')
  })

  it('renders the active background on the row in full mode', () => {
    renderRail({ mode: 'full' })

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('teal-u-bg-primary/10', 'teal-u-rounded-xl')
  })

  it('applies the glass pill styling when floating', () => {
    renderRail({ floating: true })

    expect(screen.getByRole('navigation', { name: 'Primary' })).toHaveClass(
      'teal-u-rounded-[2rem]',
      'teal-u-bg-surface/70',
      'teal-u-backdrop-blur-xl',
      'teal-u-shadow-overlay',
    )
  })

  it('renders as a custom element and forwards refs when as is provided', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Sidebar ref={ref} as="aside" aria-label="Workspace">
        <SidebarContent />
      </Sidebar>,
    )

    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeInTheDocument()
    expect(ref.current).toBe(screen.getByRole('complementary'))
  })
})
