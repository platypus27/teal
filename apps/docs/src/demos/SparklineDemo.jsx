import { Sparkline } from '@kryv/teal'

export function SparklineDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-8">
        <Sparkline aria-label="Daily deployments, eight per day at most" data={[2, 5, 3, 8, 4, 7, 6]} variant="bar" width={140} height={40} />
        <Sparkline aria-label="Queue depth falling" data={[14, 12, 13, 9, 10, 6, 4]} variant="area" width={140} height={40} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-8">
      <Sparkline aria-label="Sign-ups trending up" data={[4, 8, 6, 12, 9, 14]} variant="line" />
      <Sparkline aria-label="Revenue trending up" data={[4, 8, 6, 12, 9, 14]} variant="area" />
      <Sparkline aria-label="Deploys per day" data={[4, 8, 6, 12, 9, 14]} variant="bar" />
    </div>
  )
}
