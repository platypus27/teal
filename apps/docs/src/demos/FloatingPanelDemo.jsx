import { useState } from 'react'
import { Button, FloatingPanel } from '@kryv/teal'

export function FloatingPanelDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(true)
  const anchor = exampleIndex ? 'top-left' : 'bottom-right'
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {exampleIndex ? 'Open top-left panel' : 'Open floating panel'}
      </Button>
      <FloatingPanel
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        title={exampleIndex ? 'Keyboard shortcuts' : 'Clipboard history'}
        footer={
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Dismiss
          </Button>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          {exampleIndex
            ? 'Panels can anchor to any viewport corner while the page stays fully interactive.'
            : 'A non-modal panel floats above the page without trapping focus or dimming the content behind it.'}
        </p>
      </FloatingPanel>
    </>
  )
}
