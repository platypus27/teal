import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavRail, NavRailItem, TooltipProvider } from '../src/index'

const icon = <svg data-testid="item-icon" aria-hidden="true" />

describe('nav rail', () => {
  it('renders a labeled navigation landmark with a default name', () => {
    render(
      <NavRail>
        <NavRailItem icon={icon} label="Home" />
      </NavRail>,
    )
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('accepts a custom landmark label', () => {
    render(
      <NavRail aria-label="Product">
        <NavRailItem icon={icon} label="Home" />
      </NavRail>,
    )
    expect(screen.getByRole('navigation', { name: 'Product' })).toBeInTheDocument()
  })

  it('renders a button without href and a link with href', () => {
    render(
      <NavRail>
        <NavRailItem icon={icon} label="Action" onClick={() => {}} />
        <NavRailItem icon={icon} label="Home" href="/" />
      </NavRail>,
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('marks the active item as the current page', () => {
    render(
      <NavRail>
        <NavRailItem icon={icon} label="Home" href="/" active />
        <NavRailItem icon={icon} label="Settings" href="/settings" />
      </NavRail>,
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('renders an attention dot only when badge is set', () => {
    render(
      <NavRail>
        <NavRailItem icon={icon} label="Notifications" badge />
        <NavRailItem icon={icon} label="Settings" />
      </NavRail>,
    )
    const withBadge = screen.getByRole('button', { name: 'Notifications' })
    const withoutBadge = screen.getByRole('button', { name: 'Settings' })
    expect(withBadge.querySelector('.teal-u-bg-error')).not.toBeNull()
    expect(withBadge.querySelector('.teal-u-bg-error')).toHaveAttribute('aria-hidden', 'true')
    expect(withoutBadge.querySelector('.teal-u-bg-error')).toBeNull()
  })

  it('shows the label in a tooltip on hover', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0} disableHoverableContent>
        <NavRail>
          <NavRailItem icon={icon} label="Home" href="/" />
        </NavRail>
      </TooltipProvider>,
    )
    await user.hover(screen.getByRole('link', { name: 'Home' }))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Home')
  })

  it('forwards refs to the rail and item elements', () => {
    const railRef = createRef<HTMLElement>()
    const itemRef = createRef<HTMLElement>()
    render(
      <NavRail ref={railRef}>
        <NavRailItem ref={itemRef} icon={icon} label="Home" />
      </NavRail>,
    )
    expect(railRef.current).toBe(screen.getByRole('navigation', { name: 'Primary' }))
    expect(itemRef.current).toBe(screen.getByRole('button', { name: 'Home' }))
  })
})
