import { ChartAxis, ChartContainer, ChartGrid, ChartLegend } from '@kryv/teal'

const columns = [
  { key: 'day', label: 'Day' },
  { key: 'visits', label: 'Visits' },
]
const rows = [
  { day: 'Mon', visits: 120 },
  { day: 'Tue', visits: 180 },
  { day: 'Wed', visits: 150 },
]

export function ChartContainerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ChartContainer
        label="Visits per weekday"
        width={420}
        height={220}
        columns={columns}
        data={rows}
        legend={<ChartLegend items={[{ name: 'Visits', color: 'var(--teal-color-primary)' }]} />}
      >
        <ChartGrid positions={[40, 90, 140, 190]} start={44} end={404} />
        <ChartAxis
          orientation="y"
          offset={44}
          start={16}
          end={190}
          ticks={[
            { position: 190, label: '0' },
            { position: 140, label: '60' },
            { position: 90, label: '120' },
            { position: 40, label: '180' },
          ]}
        />
        <ChartAxis
          orientation="x"
          offset={190}
          start={44}
          end={404}
          ticks={rows.map((row, index) => ({ position: 104 + index * 120, label: row.day }))}
        />
        <polyline
          points="104,140 224,40 344,90"
          fill="none"
          stroke="var(--teal-color-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </ChartContainer>
    )
  }

  return (
    <ChartContainer label="Visits per weekday" width={420} height={220} columns={columns} data={rows}>
      <polyline
        points="40,140 200,40 360,90"
        fill="none"
        stroke="var(--teal-color-primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={40} cy={140} r={3.5} fill="var(--teal-color-primary)" />
      <circle cx={200} cy={40} r={3.5} fill="var(--teal-color-primary)" />
      <circle cx={360} cy={90} r={3.5} fill="var(--teal-color-primary)" />
    </ChartContainer>
  )
}
