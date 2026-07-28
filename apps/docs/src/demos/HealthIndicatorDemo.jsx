import { HealthIndicator } from '@kryv/teal'

export function HealthIndicatorDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <div className="flex flex-wrap items-center gap-4">
      <HealthIndicator status="stale" label="Photos" />
      <HealthIndicator status="unknown" label="Trict" />
      <HealthIndicator status="loading" label="Yang Operations" />
    </div>
  ) : (
    <div className="flex flex-wrap items-center gap-4">
      <HealthIndicator status="healthy" label="Photos" />
      <HealthIndicator status="degraded" label="Yang Operations" />
      <HealthIndicator status="down" label="Trict" />
    </div>
  )
}
