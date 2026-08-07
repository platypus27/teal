import { AreaChart } from '@kryv/teal'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const traffic = [{ name: 'Sessions', data: [120, 180, 150, 220, 260, 240] }]

const channels = [
  { name: 'Organic', data: [80, 95, 90, 110, 125, 120] },
  { name: 'Referral', data: [30, 45, 38, 52, 60, 58] },
  { name: 'Paid', data: [20, 25, 22, 30, 35, 33] },
]

export function AreaChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <AreaChart
        label="Stacked sessions by acquisition channel per month"
        labels={months}
        series={channels}
        stacked
        opacity={0.5}
      />
    )
  }

  return (
    <AreaChart
      label="Sessions per month, January through June"
      labels={months}
      series={traffic}
    />
  )
}
