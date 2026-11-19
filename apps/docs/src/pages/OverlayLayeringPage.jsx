import { useState } from 'react'
import { Button, Dialog, Menu } from '@kryv/teal'

// Test-support surface for the overlay layering contract: a menu opened from
// inside a dialog must render above the dialog surface and stay clickable.
// Playwright drives this page in tests/layering.spec.js.
export function OverlayLayeringPage() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState('none')

  return (
    <main className="teal-u-p-8">
      <h1 className="teal-u-mb-4 teal-u-text-xl teal-u-font-semibold teal-u-text-on-surface">
        Overlay layering probe
      </h1>
      <p className="teal-u-mb-4 teal-u-text-sm teal-u-text-on-surface-variant">
        Last menu action:{' '}
        <span data-testid="last-action" className="teal-u-font-semibold teal-u-text-on-surface">
          {lastAction}
        </span>
      </p>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Layering probe" size="sm">
        <div className="teal-u-flex teal-u-flex-col teal-u-gap-4">
          <p className="teal-u-text-sm teal-u-text-on-surface-variant">
            Open the menu, then activate Rename. The menu must stay above this dialog and its items
            must receive the click.
          </p>
          <Menu
            label="Project actions"
            trigger={
              <Button variant="secondary" className="teal-u-self-start">
                Project actions
              </Button>
            }
            items={[
              { id: 'rename', label: 'Rename', onSelect: () => setLastAction('rename') },
              { id: 'archive', label: 'Archive', onSelect: () => setLastAction('archive') },
            ]}
          />
        </div>
      </Dialog>
    </main>
  )
}
