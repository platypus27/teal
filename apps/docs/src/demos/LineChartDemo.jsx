import { LineChart } from '@kryv/teal'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const finances = [
  { name: 'Revenue', data: [42, 55, 48, 61, 66, 72] },
  { name: 'Costs', data: [30, 34, 32, 38, 41, 44] },
]

const signups = [{ name: 'Signups', data: [12, 18, 15, 24, 30, 28] }]

export function LineChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <LineChart
        label="Signups grew from 12 in January to 28 in June"
        labels={months}
        series={signups}
        renderTooltip={(point) => (
          <span>
            <strong>{point.value}</strong> signups in {point.label}
          </span>
        )}
      />
    )
  }

  return (
    <LineChart
      label="Revenue and costs per month, January through June"
      labels={months}
      series={finances}
    />
  )
}
