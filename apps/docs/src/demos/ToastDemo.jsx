import { Button, toast } from '@kryv/teal'

export function ToastDemo() {
  return (
    <Button
      onClick={() =>
        toast({ title: 'Changes saved', description: 'Your settings are up to date.', tone: 'success' })
      }
    >
      Show toast
    </Button>
  )
}
