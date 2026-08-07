import { render, screen } from '@testing-library/react'
import { Bell, Calendar, Home, Search, User } from 'lucide-react'
import { BottomNav, BottomNavItem } from '../src/BottomNav'

function renderBottomNav() {
  return render(
    <BottomNav>
      <BottomNavItem active href="#home" icon={<Home />} label="Home" />
      <BottomNavItem href="#search" icon={<Search />} label="Search" />
      <BottomNavItem href="#calendar" icon={<Calendar />} label="Calendar" />
      <BottomNavItem badge={3} href="#alerts" icon={<Bell />} label="Alerts" />
      <BottomNavItem href="#profile" icon={<User />} label="Profile" />
    </BottomNav>,
  )
}

describe('BottomNav', () => {
  it('renders a navigation landmark with icon and label items', () => {
    renderBottomNav()

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(5)
    expect(screen.getByRole('link', { name: /Search/ })).toBeInTheDocument()
  })

  it('marks the active item with aria-current="page"', () => {
    renderBottomNav()

    expect(screen.getByRole('link', { name: /Home/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Profile/ })).not.toHaveAttribute('aria-current')
  })

  it('renders badge content on the icon corner', () => {
    renderBottomNav()

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('includes safe-area padding for the home indicator', () => {
    renderBottomNav()

    expect(screen.getByRole('navigation', { name: 'Main' }).className).toContain(
      'teal-u-pb-[env(safe-area-inset-bottom)]',
    )
  })

  it('supports a custom accessible name', () => {
    render(
      <BottomNav aria-label="App">
        <BottomNavItem href="#home" icon={<Home />} label="Home" />
      </BottomNav>,
    )

    expect(screen.getByRole('navigation', { name: 'App' })).toBeInTheDocument()
  })
})
