import { BarChart } from '@kryv/teal'

const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

const finances = [
  { name: 'Revenue', data: [42, 55, 48, 61] },
  { name: 'Costs', data: [30, 34, 32, 38] },
]

const headcount = [{ name: 'Headcount', data: [18, 22, 27, 31] }]

export function BarChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <BarChart
        label="Headcount per quarter"
        labels={quarters}
        series={headcount}
        orientation="horizontal"
        showValues
        showLegend={false}
      />
    )
  }

  return (
    <BarChart
      label="Revenue and costs per quarter"
      labels={quarters}
      series={finances}
      showValues
    />
  )
}
