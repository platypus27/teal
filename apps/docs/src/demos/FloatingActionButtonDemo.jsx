import { FilePlus, FolderPlus, Pencil, Upload } from 'lucide-react'
import { FloatingActionButton } from '@kryv/teal'

export function FloatingActionButtonDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <FloatingActionButton
        label="Compose message"
        extendedLabel="Compose"
        icon={<Pencil aria-hidden />}
        position="bottom-left"
      />
    )
  }

  if (exampleIndex === 2) {
    return (
      <FloatingActionButton
        label="Create actions"
        position="bottom-right"
        actions={[
          { label: 'New file', icon: <FilePlus aria-hidden /> },
          { label: 'New folder', icon: <FolderPlus aria-hidden /> },
          { label: 'Upload', icon: <Upload aria-hidden /> },
        ]}
      />
    )
  }

  return <FloatingActionButton label="Create item" tooltip="Add a new item" position="bottom-right" />
}
