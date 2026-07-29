import { useState } from 'react'
import { DatePicker } from '@kryv/teal'

export function DatePickerDemo({ exampleIndex = 0 }) {
  const [dueDate, setDueDate] = useState(/** @type {Date | undefined} */ (undefined))
  const [sprintStart, setSprintStart] = useState(new Date())

  if (exampleIndex === 1) {
    const quarterStart = new Date()
    quarterStart.setDate(quarterStart.getDate() - 14)
    const quarterEnd = new Date()
    quarterEnd.setDate(quarterEnd.getDate() + 60)
    return (
      <div className="w-full max-w-xs">
        <DatePicker
          label="Sprint start"
          description="Limited to the current planning window"
          value={sprintStart}
          onValueChange={setSprintStart}
          minDate={quarterStart}
          maxDate={quarterEnd}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <DatePicker
        label="Due date"
        description="Used for the project milestone"
        value={dueDate}
        onValueChange={setDueDate}
      />
    </div>
  )
}
