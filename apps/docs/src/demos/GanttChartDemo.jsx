import { GanttChart } from '@kryv/teal'

export function GanttChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <GanttChart
        label="Team availability"
        startDate="2025-06-02"
        endDate="2025-06-20"
        today="2025-06-10"
        tasks={[
          { id: 'ana', label: 'Ana', start: '2025-06-02', end: '2025-06-13' },
          { id: 'lee', label: 'Lee', start: '2025-06-09', end: '2025-06-20' },
          { id: 'sam', label: 'Sam', start: '2025-06-02', end: '2025-06-06' },
        ]}
      />
    )
  }

  return (
    <GanttChart
      label="Release plan"
      today="2025-03-10"
      tasks={[
        { id: 'design', label: 'Design', start: '2025-03-03', end: '2025-03-07' },
        { id: 'build', label: 'Build', start: '2025-03-10', end: '2025-03-19' },
        { id: 'docs', label: 'Docs', start: '2025-03-12', end: '2025-03-21' },
        { id: 'ship', label: 'Ship', start: '2025-03-24', end: '2025-03-25' },
      ]}
    />
  )
}
