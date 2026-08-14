import { useState } from 'react'
import { DatePicker } from '@kryv/teal'

export function DatePickerDemo({ exampleIndex = 0 }) {
  const [dueDate, setDueDate] = useState(/** @type {Date | undefined} */ (undefined))
  const [sprintStart, setSprintStart] = useState(new Date())
  const [month, setMonth] = useState(new Date())
  const [year, setYear] = useState(new Date())
  const [startsAt, setStartsAt] = useState(new Date())
  const [range, setRange] = useState(/** @type {{ from: Date | null, to: Date | null } | undefined} */ (undefined))

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
          onValueChange={(value) => {
            if (value instanceof Date) setSprintStart(value)
          }}
          minDate={quarterStart}
          maxDate={quarterEnd}
        />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-xs">
        <DatePicker
          label="Billing month"
          mode="month"
          description="Commits the first of the chosen month"
          value={month}
          onValueChange={(value) => {
            if (value instanceof Date) setMonth(value)
          }}
        />
      </div>
    )
  }

  if (exampleIndex === 3) {
    return (
      <div className="w-full max-w-xs">
        <DatePicker
          label="Graduation year"
          mode="year"
          description="Commits January 1 of the chosen year"
          value={year}
          onValueChange={(value) => {
            if (value instanceof Date) setYear(value)
          }}
        />
      </div>
    )
  }

  if (exampleIndex === 4) {
    return (
      <div className="w-full max-w-xs">
        <DatePicker
          label="Starts at"
          mode="datetime"
          description="Day and time in one popover"
          value={startsAt}
          onValueChange={(value) => {
            if (value instanceof Date) setStartsAt(value)
          }}
        />
      </div>
    )
  }

  if (exampleIndex === 5) {
    return (
      <div className="w-full max-w-xs">
        <DatePicker
          label="Report period"
          selection="range"
          description="Two clicks pick the start and end; presets fill common windows"
          value={range}
          onValueChange={(value) => {
            if (value && !(value instanceof Date)) setRange(value)
          }}
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
        onValueChange={(value) => {
          if (value === undefined) setDueDate(undefined)
          else if (value instanceof Date) setDueDate(value)
        }}
      />
    </div>
  )
}
