import { Button, IconButton, Menu } from '@kryv/teal'
import { Archive, Copy, FileDown, MoreVertical, Settings, Trash2 } from 'lucide-react'

export function MenuDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Menu
        trigger={<Button variant="secondary">Report actions</Button>}
        items={[
          { id: 'duplicate', label: 'Duplicate', icon: <Copy />, onSelect: () => undefined },
          { id: 'export', label: 'Export as PDF', icon: <FileDown />, disabled: true, onSelect: () => undefined },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 />,
            variant: 'danger',
            separatorBefore: true,
            onSelect: () => undefined,
          },
        ]}
      />
    )
  }

  if (exampleIndex === 2) {
    return (
      <Menu
        trigger={
          <IconButton label="Workspace actions">
            <MoreVertical />
          </IconButton>
        }
        items={[
          { id: 'rename', label: 'Rename', icon: <Settings />, onSelect: () => undefined },
          { id: 'duplicate', label: 'Duplicate', icon: <Copy />, onSelect: () => undefined },
          {
            id: 'delete',
            label: 'Delete workspace',
            icon: <Trash2 />,
            variant: 'danger',
            separatorBefore: true,
            onSelect: () => undefined,
          },
        ]}
      />
    )
  }

  if (exampleIndex === 3) {
    return (
      <Menu
        trigger={<Button variant="secondary">Document actions</Button>}
        items={[
          { id: 'export-pdf', label: 'Export as PDF', icon: <FileDown />, onSelect: () => undefined },
          { id: 'copy-link', label: 'Copy link', icon: <Copy />, onSelect: () => undefined },
          { id: 'archive', label: 'Archive', icon: <Archive />, onSelect: () => undefined },
        ]}
      />
    )
  }

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
          variant: 'danger',
          separatorBefore: true,
          onSelect: () => undefined,
        },
      ]}
    />
  )
}
