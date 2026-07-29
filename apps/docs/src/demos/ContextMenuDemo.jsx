import { ContextMenu } from '@kryv/teal'
import { Archive, Pencil, Share2, Trash2 } from 'lucide-react'

export function ContextMenuDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ContextMenu
        label="Report actions"
        items={[
          { id: 'open', label: 'Open', onSelect: () => undefined },
          { id: 'duplicate', label: 'Duplicate', disabled: true, onSelect: () => undefined },
          { id: 'delete', label: 'Delete', variant: 'danger', separatorBefore: true, onSelect: () => undefined },
        ]}
      >
        <div className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-teal-outline-variant text-sm text-teal-on-surface-variant">
          Right-click the Q2 reliability report
        </div>
      </ContextMenu>
    )
  }

  return (
    <ContextMenu
      label="Project actions"
      items={[
        { id: 'rename', label: 'Rename', icon: <Pencil />, onSelect: () => undefined },
        { id: 'share', label: 'Share', icon: <Share2 />, onSelect: () => undefined },
        { id: 'archive', label: 'Archive', icon: <Archive />, onSelect: () => undefined },
        { id: 'delete', label: 'Delete', icon: <Trash2 />, variant: 'danger', separatorBefore: true, onSelect: () => undefined },
      ]}
    >
      <div className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-teal-outline-variant text-sm text-teal-on-surface-variant">
        Right-click this project card
      </div>
    </ContextMenu>
  )
}
