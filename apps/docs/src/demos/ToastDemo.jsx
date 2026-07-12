import { Button, toast } from '@kryv/teal'

export function ToastDemo({ exampleIndex = 0 }) {
  return (
    <Button
      onClick={() =>
      toast({ title: exampleIndex ? 'Review saved' : 'Changes saved', description: 'Your settings are up to date.', tone: 'success' })
      }
    >
      {exampleIndex ? 'Show review toast' : 'Show toast'}
    </Button>
  )
}
