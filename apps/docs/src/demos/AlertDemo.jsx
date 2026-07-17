import { Alert } from '@kryv/teal'

export function AlertDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Alert
        variant="warning"
        title="Payment method expiring"
        onDismiss={() => undefined}
        className="w-full max-w-lg"
      >
        The workspace card ends in 04/25. Update billing details to avoid interruption.
      </Alert>
    )
  }
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert variant="success" title="Report published">
        The quarterly security report is now available to all workspace members.
      </Alert>
      <Alert variant="danger" title="Sign-in blocked">
        We stopped a sign-in attempt from an unrecognized device.
      </Alert>
    </div>
  )
}
