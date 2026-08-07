import { useState } from 'react'
import { Button, Dialog, Field, Input } from '@kryv/teal'

export function DialogDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)

  if (exampleIndex === 1) {
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Edit project profile</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          size="lg"
          title="Edit project profile"
          description="Changes apply to everyone in the Orion workspace."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save changes</Button>
            </>
          }
        >
          <div className="grid gap-4">
            <Field label="Project name">
              <Input defaultValue="Orion" />
            </Field>
            <Field label="Owner" description="The owner can manage members and billing.">
              <Input defaultValue="avery@example.com" />
            </Field>
          </div>
        </Dialog>
      </>
    )
  }

  if (exampleIndex === 2) {
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete workspace</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete workspace?"
          description="The Orion workspace can be restored from settings for 30 days."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete workspace
              </Button>
            </>
          }
        >
          <p className="text-sm text-teal-on-surface-variant">
            Reports and members leave the active directory immediately; exports stay available to owners.
          </p>
        </Dialog>
      </>
    )
  }

  if (exampleIndex === 3) {
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Review launch checklist</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          size="lg"
          title="Launch checklist"
          description="Work through every item before the release goes out."
          footer={
            <Button onClick={() => setOpen(false)}>Mark complete</Button>
          }
        >
          <div className="grid max-h-64 gap-3 overflow-y-auto pr-1">
            {Array.from({ length: 12 }, (_, index) => (
              <Field key={index} label={`Checklist item ${index + 1}`}>
                <Input defaultValue={`Verify launch step ${index + 1} with the release owner`} />
              </Field>
            ))}
          </div>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
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
