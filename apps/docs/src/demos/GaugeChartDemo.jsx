import { GaugeChart } from '@kryv/teal'

const healthThresholds = [
  { upTo: 50, label: 'healthy' },
  { upTo: 80, label: 'degraded' },
  { upTo: 100, label: 'critical' },
]

export function GaugeChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <GaugeChart aria-label="Error budget remaining" value={86} label="Error budget" />
        <GaugeChart aria-label="Queue depth" value={420} min={0} max={1000} label="Queue" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <GaugeChart
        aria-label="API latency score with health zones"
        value={64}
        label="Latency score"
        thresholds={healthThresholds}
      />
    </div>
  )
}
