import { useState } from 'react'
import { TimePicker } from '@kryv/teal'

export function TimePickerDemo({ exampleIndex = 0 }) {
  const [value, setValue] = useState('09:30')

  if (exampleIndex === 1) {
    return (
      <div className="grid gap-2">
        <TimePicker label="Reminder time" defaultValue="18:45" hourCycle={12} />
        <span className="text-sm text-teal-on-surface-variant">The 12-hour cycle adds an AM/PM toggle.</span>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <TimePicker label="Start time" value={value} onChange={setValue} />
      <span className="text-sm text-teal-on-surface-variant">Current value: {value}</span>
    </div>
  )
}
