import { useState } from 'react'
import { Button, NotificationCenter } from '@kryv/teal'

/** @type {import('@kryv/teal').NotificationCenterItem[]} */
const initialItems = [
  { id: '1', title: 'Deploy finished', appLabel: 'Orion', timestamp: '2 min ago', href: '#', severity: 'success' },
  { id: '2', title: 'Quota almost reached', appLabel: 'Billing', timestamp: '1 hour ago', href: '#', severity: 'warning' },
  { id: '3', title: 'New comment on PR 17', appLabel: 'Forge', timestamp: 'Yesterday', href: '#', read: true },
]

export function NotificationCenterDemo({ exampleIndex = 0 }) {
  const [items, setItems] = useState(initialItems)

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <NotificationCenter
          trigger={<Button variant="secondary">Notifications</Button>}
          items={[]}
          onMarkAllRead={() => {}}
        />
        <span className="text-sm text-teal-on-surface-variant">An empty center shows the catch-up message.</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <NotificationCenter
        trigger={<Button variant="secondary">Notifications</Button>}
        items={items}
        onMarkAllRead={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
      />
      <span className="text-sm text-teal-on-surface-variant">Unread rows stay emphasized until marked read.</span>
    </div>
  )
}
