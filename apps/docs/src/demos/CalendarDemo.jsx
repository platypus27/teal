import { useState } from 'react'
import { Calendar } from '@kryv/teal'

export function CalendarDemo({ exampleIndex = 0 }) {
  const [date, setDate] = useState(() => new Date())

  if (exampleIndex === 1) {
    const today = new Date()
    const inThirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
    return (
      <div className="grid gap-2">
        <Calendar value={date} onSelect={setDate} min={today} max={inThirtyDays} />
        <span className="text-sm text-teal-on-surface-variant">Bookable for the next thirty days only.</span>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Calendar value={date} onSelect={setDate} />
      <span className="text-sm text-teal-on-surface-variant">Selected: {date.toLocaleDateString()}</span>
    </div>
  )
}
