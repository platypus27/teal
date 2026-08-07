import { CalendarHeatmap } from '@kryv/teal'

function seededActivity(year, seed) {
  const days = []
  let state = seed
  const next = () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const total = isLeap ? 366 : 365
  for (let offset = 0; offset < total; offset += 1) {
    const date = new Date(Date.UTC(year, 0, 1 + offset)).toISOString().slice(0, 10)
    const roll = next()
    if (roll > 0.55) {
      days.push({ date, level: 1 + Math.floor(next() * 4) })
    }
  }
  return days
}

export function CalendarHeatmapDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <CalendarHeatmap
          aria-label="Deploy frequency in 2024"
          year={2024}
          data={seededActivity(2024, 99)}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <CalendarHeatmap
        aria-label="Commit activity in 2025"
        year={2025}
        data={seededActivity(2025, 42)}
      />
    </div>
  )
}
