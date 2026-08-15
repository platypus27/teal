import { LineChart } from '@kryv/teal'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const finances = [
  { name: 'Revenue', data: [42, 55, 48, 61, 66, 72] },
  { name: 'Costs', data: [30, 34, 32, 38, 41, 44] },
]

const signups = [{ name: 'Signups', data: [12, 18, 15, 24, 30, 28] }]

const channels = [
  { name: 'Organic', data: [80, 95, 90, 110, 125, 120] },
  { name: 'Referral', data: [30, 45, 38, 52, 60, 58] },
  { name: 'Paid', data: [20, 25, 22, 30, 35, 33] },
]

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

  if (exampleIndex === 2) {
    return (
      <LineChart
        type="area"
        label="Signups per month, January through June"
        labels={months}
        series={signups}
      />
    )
  }

  if (exampleIndex === 3) {
    return (
      <LineChart
        type="area"
        label="Stacked sessions by acquisition channel per month"
        labels={months}
        series={channels}
        stacked
        opacity={0.5}
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
