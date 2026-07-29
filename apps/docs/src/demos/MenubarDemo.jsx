import { Menubar } from '@kryv/teal'
import { Copy, FilePlus2, Scissors } from 'lucide-react'

export function MenubarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Menubar
        label="Editor"
        menus={[
          {
            label: 'Edit',
            items: [
              { id: 'cut', label: 'Cut', icon: <Scissors />, onSelect: () => undefined },
              { id: 'copy', label: 'Copy', icon: <Copy />, onSelect: () => undefined },
              { id: 'paste', label: 'Paste', disabled: true, onSelect: () => undefined },
            ],
          },
          {
            label: 'Project',
            items: [
              { id: 'archive', label: 'Archive', onSelect: () => undefined },
              { id: 'delete', label: 'Delete', variant: 'danger', separatorBefore: true, onSelect: () => undefined },
            ],
          },
        ]}
      />
    )
  }

  return (
    <Menubar
      label="Application"
      menus={[
        {
          label: 'File',
          items: [
            { id: 'new', label: 'New project', icon: <FilePlus2 />, onSelect: () => undefined },
            { id: 'duplicate', label: 'Duplicate', onSelect: () => undefined },
            { id: 'export', label: 'Export…', onSelect: () => undefined },
          ],
        },
        {
          label: 'View',
          items: [
            { id: 'density', label: 'Toggle density', onSelect: () => undefined },
            { id: 'reload', label: 'Reload data', onSelect: () => undefined },
          ],
        },
      ]}
    />
  )
}
