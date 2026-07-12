import { useState } from 'react'
import { Button, Dialog } from '@kryv/teal'

export function ConfirmationFlowRecipe() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Delete project?" description="This removes the project from the active workspace." footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => setOpen(false)}>Delete project</Button></>}>
        <p className="text-sm text-on-surface-variant">Export the project first if another team still needs the reports.</p>
      </Dialog>
    </>
  )
}
