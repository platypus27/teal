import { AlertDialog, Button } from '@kryv/teal'

export function AlertDialogDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <AlertDialog
        trigger={<Button variant="secondary">Publish report</Button>}
        title="Publish report?"
        description="The quarterly security report becomes visible to all workspace members."
        confirmText="Publish"
        onConfirm={() => undefined}
      />
    )
  }

  return (
    <AlertDialog
      trigger={<Button variant="danger">Delete project</Button>}
      title="Delete project?"
      description="This removes Orion and its reports permanently. This action cannot be undone."
      tone="danger"
      confirmText="Delete"
      onConfirm={() => undefined}
    />
  )
}
