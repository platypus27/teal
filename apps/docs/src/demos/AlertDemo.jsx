import { Alert, Button } from '@kryv/teal'

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
  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-2xl gap-3">
        <Alert appearance="banner" variant="info" title="Scheduled maintenance">
          The workspace will be read-only on Sunday from 02:00 to 03:00 UTC.
        </Alert>
        <Alert
          appearance="banner"
          variant="warning"
          title="Trial ends in 7 days"
          action={<Button size="sm">Upgrade plan</Button>}
          onDismiss={() => undefined}
        >
          Upgrade to keep unlimited projects and priority support for the whole workspace.
        </Alert>
      </div>
    )
  }
  if (exampleIndex === 3) {
    return (
      <div className="flex w-full max-w-xl flex-col gap-4">
        <Alert appearance="callout" title="Heads up">
          New pricing starts next month. Your current plan is locked in until the end of the billing cycle.
        </Alert>
        <Alert appearance="callout" accent={false} variant="warning" title="Trial ending soon">
          Your trial ends in 5 days. Add a payment method to keep your workspace active.
        </Alert>
      </div>
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
