import { useState } from 'react'
import { Button, Drawer } from '@kryv/teal'

export function DrawerDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const side = exampleIndex ? 'left' : 'right'
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {exampleIndex ? 'Open left drawer' : 'Open drawer'}
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        title="Project details"
        description="Orion workspace — updated 2 hours ago"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          Manage members, integrations, and archive rules for this project without leaving the current page.
        </p>
      </Drawer>
    </>
  )
}
