import { RadarChart } from '@kryv/teal'

const skillAxes = ['Frontend', 'Backend', 'Testing', 'DevOps', 'Design', 'Docs']

const skillSeries = [
  { name: 'Ada', values: [5, 3, 4, 2, 4, 3] },
  { name: 'Grace', values: [3, 5, 4, 4, 2, 5] },
]

const productAxes = ['Speed', 'Quality', 'Cost', 'Scope']

export function RadarChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <RadarChart
          aria-label="Release readiness profile"
          axes={productAxes}
          series={[{ name: 'Current release', values: [4, 3, 2, 5] }]}
          max={5}
          rings={5}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <RadarChart aria-label="Skill profiles of two engineers" axes={skillAxes} series={skillSeries} />
    </div>
  )
}
