import { PulseDot } from '@kryv/teal'

export function PulseDotDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <PulseDot label="Recording" variant="danger" />
        <PulseDot label="Away" variant="warning" />
        <PulseDot label="Idle" variant="neutral" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <PulseDot label="3 editors online" />
        <span className="text-sm">3 editors online</span>
      </div>
      <div className="flex items-center gap-2">
        <PulseDot label="Live stream" variant="info" size="lg" />
        <span className="text-sm">Live</span>
      </div>
    </div>
  )
}
