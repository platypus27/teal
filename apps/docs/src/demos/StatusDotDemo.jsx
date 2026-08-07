import { StatusDot } from '@kryv/teal'

export function StatusDotDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col gap-3">
        <StatusDot variant="success" label="Deployment healthy" />
        <StatusDot variant="warning" label="Approaching quota" />
        <StatusDot variant="danger" label="Build failed" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <StatusDot variant="success" label="Online" />
      <StatusDot variant="neutral" label="Idle" />
      <StatusDot variant="info" label="Syncing" />
    </div>
  )
}
