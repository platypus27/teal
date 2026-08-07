import { useState } from 'react'
import { Button, FullscreenDialog } from '@kryv/teal'

export function FullscreenDialogDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>{exampleIndex ? 'Open settings' : 'Open editor'}</Button>
      <FullscreenDialog
        open={open}
        onOpenChange={setOpen}
        title={exampleIndex ? 'Workspace settings' : 'Edit report'}
        description={
          exampleIndex ? 'Manage members, billing, and integrations.' : 'Changes are saved when you leave this screen.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>{exampleIndex ? 'Save settings' : 'Save changes'}</Button>
          </>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          {exampleIndex
            ? 'A fullscreen dialog gives dense settings forms the entire viewport to breathe.'
            : 'The dialog occupies the full viewport, with a sticky header, scrollable body, and footer actions.'}
        </p>
      </FullscreenDialog>
    </>
  )
}
