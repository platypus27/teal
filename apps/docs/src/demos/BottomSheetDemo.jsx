import { useState } from 'react'
import { BottomSheet, Button } from '@kryv/teal'

export function BottomSheetDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const snap = exampleIndex ? 'full' : 'half'
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {exampleIndex ? 'Open full-height sheet' : 'Open bottom sheet'}
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        snap={snap}
        title="Share report"
        description="Choose how the Q3 revenue report is shared."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Share</Button>
          </>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          {exampleIndex
            ? 'The full snap height suits long content like member pickers and preview panes.'
            : 'The sheet snaps to half the viewport, keeping the page context visible above it.'}
        </p>
      </BottomSheet>
    </>
  )
}
