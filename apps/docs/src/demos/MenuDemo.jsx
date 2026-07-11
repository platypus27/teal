import { IconButton, Menu } from '@kryv/teal'
import { Archive, MoreVertical, Settings } from 'lucide-react'

export function MenuDemo() {
  return (
    <Menu
      trigger={
        <IconButton label="Project actions">
          <MoreVertical />
        </IconButton>
      }
      items={[
        { id: 'settings', label: 'Settings', icon: <Settings />, onSelect: () => undefined },
        {
          id: 'archive',
          label: 'Archive',
          icon: <Archive />,
          tone: 'danger',
          separatorBefore: true,
          onSelect: () => undefined,
        },
      ]}
    />
  )
}
