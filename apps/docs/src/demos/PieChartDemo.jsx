import { PieChart } from '@kryv/teal'

const devices = [
  { name: 'Desktop', value: 52 },
  { name: 'Mobile', value: 38 },
  { name: 'Tablet', value: 10 },
]

const budget = [
  { name: 'Engineering', value: 45 },
  { name: 'Design', value: 20 },
  { name: 'Marketing', value: 25 },
  { name: 'Operations', value: 10 },
]

export function PieChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <PieChart
        label="Budget share per department"
        data={budget}
        innerRadius={0.6}
      />
    )
  }

  return (
    <PieChart
      label="Traffic share by device type"
      data={devices}
    />
  )
}
