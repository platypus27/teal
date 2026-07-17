import { IconButton, Menu } from '@kryv/teal'
import { Archive, MoreVertical, Settings } from 'lucide-react'

export function MenuDemo({ exampleIndex = 0 }) {
  return (
    <Menu
      trigger={
        <IconButton label={exampleIndex ? 'Additional actions' : 'Project actions'}>
          <MoreVertical />
        </IconButton>
      }
      items={[
        { id: 'settings', label: 'Settings', icon: <Settings />, onSelect: () => undefined },
        {
          id: 'archive',
          label: 'Archive',
          icon: <Archive />,
          variant: 'danger',
          separatorBefore: true,
          onSelect: () => undefined,
        },
      ]}
    />
  )
}
