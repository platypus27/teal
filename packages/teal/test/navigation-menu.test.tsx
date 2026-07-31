import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavigationMenu, type NavigationMenuItem } from '../src/NavigationMenu'

const items: NavigationMenuItem[] = [
  { type: 'link', label: 'Home', href: '/', active: true },
  { type: 'link', label: 'Pricing', href: '/pricing' },
  {
    type: 'panel',
    label: 'Products',
    content: <a href="/products/analytics">Analytics suite</a>,
  },
]

describe('NavigationMenu', () => {
  it('renders a navigation landmark with all labels', () => {
    render(<NavigationMenu label="Main" items={items} />)

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument()
  })

  it('marks the active link with aria-current="page"', () => {
    render(<NavigationMenu label="Main" items={items} />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Pricing' })).not.toHaveAttribute('aria-current')
  })

  it('hides panel content until its trigger is activated', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<NavigationMenu label="Main" items={items} />)

    expect(screen.queryByRole('link', { name: 'Analytics suite' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Products' }))

    expect(await screen.findByRole('link', { name: 'Analytics suite' })).toBeInTheDocument()
  })

  it('closes the panel when the trigger is clicked again', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<NavigationMenu label="Main" items={items} />)

    const trigger = screen.getByRole('button', { name: 'Products' })
    await user.click(trigger)
    expect(await screen.findByRole('link', { name: 'Analytics suite' })).toBeInTheDocument()

    await user.click(trigger)
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Analytics suite' })).not.toBeInTheDocument())
  })
})
