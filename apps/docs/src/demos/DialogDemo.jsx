import { useState } from 'react'
import { Button, Dialog } from '@kryv/teal'

export function DialogDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>{exampleIndex ? 'Open confirmation dialog' : 'Open dialog'}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Archive project?"
        description="The project can be restored later."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Archive
            </Button>
          </>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          Project Orion and its reports will leave the active workspace.
        </p>
      </Dialog>
    </>
  )
}
