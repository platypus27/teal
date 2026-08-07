import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { NotificationCenter, type NotificationCenterItem } from '../src/NotificationCenter'

const items: NotificationCenterItem[] = [
  { id: '1', title: 'Deploy finished', appLabel: 'Orion', timestamp: '2 min ago', href: '/deploys/42', severity: 'success' },
  { id: '2', title: 'Quota almost reached', appLabel: 'Billing', timestamp: '1 hour ago', href: '/billing', severity: 'warning', read: true },
  { id: '3', title: 'New comment on PR 17', appLabel: 'Forge', timestamp: 'Yesterday', href: '/prs/17', read: true },
]

function renderCenter(props: Partial<Parameters<typeof NotificationCenter>[0]> = {}) {
  return render(
    <NotificationCenter trigger={<Button>Open notifications</Button>} items={items} {...props} />,
  )
}

describe('NotificationCenter', () => {
  it('opens from its trigger and lists the notifications', async () => {
    const user = userEvent.setup()
    renderCenter()

    expect(screen.queryByRole('list', { name: 'Notifications' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open notifications' }))

    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Deploy finished, unread' })).toHaveAttribute('href', '/deploys/42')
    expect(screen.getByText('1 hour ago')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('shows the mark-all-read action only while unread items remain', async () => {
    const user = userEvent.setup()
    const onMarkAllRead = vi.fn()
    renderCenter({ onMarkAllRead })

    await user.click(screen.getByRole('button', { name: 'Open notifications' }))
    await user.click(screen.getByRole('button', { name: 'Mark all as read' }))
    expect(onMarkAllRead).toHaveBeenCalledTimes(1)
  })

  it('hides the mark-all-read action when everything is read', async () => {
    const user = userEvent.setup()
    renderCenter({ items: items.map((item) => ({ ...item, read: true })), onMarkAllRead: vi.fn() })

    await user.click(screen.getByRole('button', { name: 'Open notifications' }))
    expect(screen.queryByRole('button', { name: 'Mark all as read' })).not.toBeInTheDocument()
  })

  it('renders the empty message when there are no notifications', async () => {
    const user = userEvent.setup()
    renderCenter({ items: [] })

    await user.click(screen.getByRole('button', { name: 'Open notifications' }))
    expect(screen.getByText("You're all caught up")).toBeInTheDocument()
  })

  it('supports controlled open state', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return <NotificationCenter trigger={<Button>Toggle</Button>} items={items} open={open} onOpenChange={setOpen} />
    }
    render(<Controlled />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
