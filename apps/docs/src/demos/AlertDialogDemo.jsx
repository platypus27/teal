import { AlertDialog, Button } from '@kryv/teal'

export function AlertDialogDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <AlertDialog
        trigger={<Button variant="secondary">Export analytics</Button>}
        title="Export analytics?"
        description="Choose a format. The export covers every workspace you can access."
        actions={
          <>
            <Button variant="secondary" onClick={() => undefined}>
              Not now
            </Button>
            <Button variant="secondary" onClick={() => undefined}>
              Export CSV
            </Button>
            <Button onClick={() => undefined}>Export PDF</Button>
          </>
        }
      />
    )
  }

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
