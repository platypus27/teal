import { useState } from 'react'
import { ActionSheet, Button } from '@kryv/teal'

export function ActionSheetDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {exampleIndex ? 'Open destructive actions' : 'Open action sheet'}
      </Button>
      <ActionSheet
        open={open}
        onOpenChange={setOpen}
        title="Report options"
        description={exampleIndex ? 'Deleting a report cannot be undone.' : undefined}
        actions={
          exampleIndex
            ? [
                { label: 'Archive report', onSelect: () => setOpen(false) },
                { label: 'Delete report', destructive: true, onSelect: () => setOpen(false) },
              ]
            : [
                { label: 'Duplicate', onSelect: () => setOpen(false) },
                { label: 'Share', onSelect: () => setOpen(false) },
                { label: 'Export as PDF', onSelect: () => setOpen(false) },
              ]
        }
      />
    </>
  )
}
