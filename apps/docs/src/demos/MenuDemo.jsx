import { Button, IconButton, Menu } from '@kryv/teal'
import { Archive, Copy, FileDown, MoreVertical, Pencil, Settings, Share2, Trash2 } from 'lucide-react'

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

  if (exampleIndex === 4) {
    return (
      <Menu
        mode="context"
        label="Project actions"
        items={[
          { id: 'rename', label: 'Rename', icon: <Pencil />, onSelect: () => undefined },
          { id: 'share', label: 'Share', icon: <Share2 />, onSelect: () => undefined },
          { id: 'archive', label: 'Archive', icon: <Archive />, onSelect: () => undefined },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 />,
            variant: 'danger',
            separatorBefore: true,
            onSelect: () => undefined,
          },
        ]}
      >
        <div className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-teal-outline-variant text-sm text-teal-on-surface-variant">
          Right-click this project card
        </div>
      </Menu>
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
