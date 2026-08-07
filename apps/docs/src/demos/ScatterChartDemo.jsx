import { ScatterChart } from '@kryv/teal'

const latencySeries = [
  {
    name: 'Baseline',
    data: [
      { x: 12, y: 40 },
      { x: 24, y: 55 },
      { x: 48, y: 92 },
      { x: 96, y: 150 },
      { x: 128, y: 210 },
    ],
  },
  {
    name: 'Optimized',
    data: [
      { x: 12, y: 32 },
      { x: 24, y: 44 },
      { x: 48, y: 70 },
      { x: 96, y: 110 },
      { x: 128, y: 145 },
    ],
  },
]

const trafficSeries = [
  {
    name: 'Campaigns',
    data: [
      { x: 8, y: 120, size: 420 },
      { x: 14, y: 240, size: 900 },
      { x: 22, y: 180, size: 640 },
      { x: 31, y: 320, size: 1250 },
      { x: 45, y: 260, size: 780 },
    ],
  },
]

export function ScatterChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <ScatterChart
          aria-label="Conversions by spend, bubble size shows impressions"
          series={trafficSeries}
          xAxisLabel="Spend (k$)"
          yAxisLabel="Conversions"
          sizeEncoding
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <ScatterChart
        aria-label="Latency by payload size for two builds"
        series={latencySeries}
        xAxisLabel="Payload (KB)"
        yAxisLabel="Latency (ms)"
      />
    </div>
  )
}
