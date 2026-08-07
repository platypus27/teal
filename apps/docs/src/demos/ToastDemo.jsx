import { Button, toast } from '@kryv/teal'

export function ToastDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Report failed to save',
            description: 'Check your connection, then try saving again.',
            variant: 'danger',
          })
        }
      >
        Show failure toast
      </Button>
    )
  }
  if (exampleIndex === 2) {
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Report archived',
            description: 'The report moved to the archive.',
            variant: 'success',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        Show undo toast
      </Button>
    )
  }
  return (
    <Button
      onClick={() =>
        toast({ title: 'Changes saved', description: 'Your settings are up to date.', variant: 'success' })
      }
    >
      Show toast
    </Button>
  )
}
