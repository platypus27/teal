import { fireEvent, render, screen } from '@testing-library/react'
import { SubNav, SubNavItem } from '../src/SubNav'

function renderSubNav() {
  return render(
    <SubNav aria-label="Settings">
      <SubNavItem active href="#general">
        General
      </SubNavItem>
      <SubNavItem href="#members">Members</SubNavItem>
      <SubNavItem href="#billing">Billing</SubNavItem>
      <SubNavItem href="#audit">Audit log</SubNavItem>
    </SubNav>,
  )
}

describe('SubNav', () => {
  it('renders a navigation landmark with a scrollable row', () => {
    renderSubNav()

    const nav = screen.getByRole('navigation', { name: 'Settings' })
    expect(nav).toBeInTheDocument()
    expect(nav.className).toContain('teal-u-overflow-x-auto')
  })

  it('marks the active item with aria-current="page"', () => {
    renderSubNav()

    expect(screen.getByRole('link', { name: 'General' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Billing' })).not.toHaveAttribute('aria-current')
  })

  it('moves focus with arrow keys', () => {
    renderSubNav()

    const general = screen.getByRole('link', { name: 'General' })
    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowRight' })
    expect(screen.getByRole('link', { name: 'Members' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('link', { name: 'Members' }), { key: 'ArrowRight' })
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('link', { name: 'Billing' }), { key: 'ArrowLeft' })
    expect(screen.getByRole('link', { name: 'Members' })).toHaveFocus()
  })

  it('wraps around at the ends and supports Home and End', () => {
    renderSubNav()

    const general = screen.getByRole('link', { name: 'General' })
    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowLeft' })
    expect(screen.getByRole('link', { name: 'Audit log' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('link', { name: 'Audit log' }), { key: 'Home' })
    expect(screen.getByRole('link', { name: 'General' })).toHaveFocus()

    fireEvent.keyDown(general, { key: 'End' })
    expect(screen.getByRole('link', { name: 'Audit log' })).toHaveFocus()
  })
})
