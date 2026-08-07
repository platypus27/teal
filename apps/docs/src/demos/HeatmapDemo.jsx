import { Heatmap } from '@kryv/teal'

const weekdayRows = [
  { label: 'Mon', values: [12, 30, 44, 18] },
  { label: 'Tue', values: [20, 36, 40, 22] },
  { label: 'Wed', values: [16, 28, 52, 30] },
  { label: 'Thu', values: [24, 34, 48, 26] },
  { label: 'Fri', values: [10, 22, 38, 12] },
]

const deployRows = [
  { label: 'api', values: [2, 5, 9, 4] },
  { label: 'web', values: [6, 3, 7, 8] },
  { label: 'worker', values: [1, 1, 3, 2] },
]

export function HeatmapDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <Heatmap
          aria-label="Deploys per service by quarter"
          rows={deployRows}
          columnLabels={['Q1', 'Q2', 'Q3', 'Q4']}
          cellSize={36}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <Heatmap
        aria-label="Support tickets by weekday and time of day"
        rows={weekdayRows}
        columnLabels={['Morning', 'Midday', 'Afternoon', 'Evening']}
      />
    </div>
  )
}
