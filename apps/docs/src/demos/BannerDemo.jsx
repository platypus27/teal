import { Banner, Button } from '@kryv/teal'

export function BannerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Banner
        variant="warning"
        title="Trial ends in 7 days"
        action={<Button size="sm">Upgrade plan</Button>}
        onDismiss={() => undefined}
        className="max-w-2xl"
      >
        Upgrade to keep unlimited projects and priority support for the whole workspace.
      </Banner>
    )
  }

  return (
    <div className="grid w-full max-w-2xl gap-3">
      <Banner variant="info" title="Scheduled maintenance">
        The workspace will be read-only on Sunday from 02:00 to 03:00 UTC.
      </Banner>
      <Banner variant="success" title="Migration complete">
        All projects were moved to the new region without downtime.
      </Banner>
      <Banner variant="danger" title="Storage limit reached" onDismiss={() => undefined}>
        New uploads are paused until you free up space or upgrade the plan.
      </Banner>
    </div>
  )
}
