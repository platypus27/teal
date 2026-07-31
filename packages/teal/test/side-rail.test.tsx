import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { SideRail, VerticalNavItem, VerticalNavList } from '../src/index'

const icon = <svg data-testid="item-icon" aria-hidden="true" />

describe('side rail', () => {
  it('renders a labeled navigation landmark with a default name', () => {
    render(
      <SideRail>
        <VerticalNavList>
          <VerticalNavItem icon={icon} href="/">
            Home
          </VerticalNavItem>
        </VerticalNavList>
      </SideRail>,
    )
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('accepts a custom landmark label', () => {
    render(
      <SideRail aria-label="Product navigation">
        <VerticalNavList>
          <VerticalNavItem icon={icon} href="/">
            Home
          </VerticalNavItem>
        </VerticalNavList>
      </SideRail>,
    )
    expect(screen.getByRole('navigation', { name: 'Product navigation' })).toBeInTheDocument()
  })

  it('applies the glass pill styling', () => {
    render(<SideRail aria-label="Primary" />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toHaveClass('teal-u-rounded-full')
    expect(nav).toHaveClass('teal-u-border')
    expect(nav).toHaveClass('teal-u-bg-surface/70')
    expect(nav).toHaveClass('teal-u-backdrop-blur-xl')
    expect(nav).toHaveClass('teal-u-shadow-overlay')
  })

  it('defaults to rail mode that expands on hover and focus', () => {
    render(<SideRail aria-label="Primary" />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toHaveClass('teal-u-w-20')
    expect(nav).toHaveClass('hover:teal-u-w-72')
    expect(nav).toHaveClass('focus-within:teal-u-w-72')
  })

  it('collapses item labels in rail mode until hover', () => {
    render(
      <SideRail aria-label="Primary">
        <VerticalNavList>
          <VerticalNavItem icon={icon} href="/">
            Home
          </VerticalNavItem>
        </VerticalNavList>
      </SideRail>,
    )
    const link = screen.getByRole('link', { name: 'Home' })
    const label = link.querySelector('.teal-u-w-0')
    expect(label).not.toBeNull()
    expect(label).toHaveClass('teal-u-opacity-0')
    expect(label).toHaveClass('group-hover:teal-u-opacity-100')
    expect(label).toHaveClass('group-focus-within:teal-u-opacity-100')
  })

  it('marks the active item as the current page', () => {
    render(
      <SideRail aria-label="Primary">
        <VerticalNavList>
          <VerticalNavItem icon={icon} href="/" active>
            Home
          </VerticalNavItem>
        </VerticalNavList>
      </SideRail>,
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders as a custom element when as is provided', () => {
    const { container } = render(<SideRail as="aside" aria-label="Primary" />)
    expect(container.querySelector('aside')).not.toBeNull()
  })

  it('forwards refs to the rail element', () => {
    const railRef = createRef<HTMLElement>()
    render(<SideRail ref={railRef} aria-label="Primary" />)
    expect(railRef.current).toBe(screen.getByRole('navigation', { name: 'Primary' }))
  })
})
