import { Pencil } from 'lucide-react'
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

  return <FloatingActionButton label="Create item" tooltip="Add a new item" position="bottom-right" />
}
