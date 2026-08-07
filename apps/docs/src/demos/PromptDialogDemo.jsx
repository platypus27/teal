import { useState } from 'react'
import { Button, PromptDialog } from '@kryv/teal'

export function PromptDialogDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  return (
    <>
      <Button onClick={() => setOpen(true)}>{exampleIndex ? 'Create folder' : 'Rename report'}</Button>
      {value ? <p className="mt-3 text-sm text-teal-on-surface-variant">Submitted: {value}</p> : null}
      <PromptDialog
        open={open}
        onOpenChange={setOpen}
        title={exampleIndex ? 'Create folder' : 'Rename report'}
        description={
          exampleIndex ? 'The folder is created inside the current workspace.' : 'The new name appears everywhere the report is shared.'
        }
        label={exampleIndex ? 'Folder name' : 'Report name'}
        defaultValue={exampleIndex ? '' : 'Q3 revenue'}
        placeholder={exampleIndex ? 'e.g. Board materials' : undefined}
        confirmLabel={exampleIndex ? 'Create' : 'Rename'}
        onSubmit={(next) => setValue(next)}
      />
    </>
  )
}
