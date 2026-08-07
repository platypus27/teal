import { useState } from 'react'
import { MonthPicker } from '@kryv/teal'

export function MonthPickerDemo({ exampleIndex = 0 }) {
  const [billing, setBilling] = useState(/** @type {Date | undefined} */ (undefined))
  const [quarter, setQuarter] = useState(new Date())

  if (exampleIndex === 1) {
    const rangeStart = new Date()
    rangeStart.setMonth(rangeStart.getMonth() - 3, 1)
    const rangeEnd = new Date()
    rangeEnd.setMonth(rangeEnd.getMonth() + 9, 1)
    return (
      <div className="w-full max-w-xs">
        <MonthPicker
          label="Report month"
          description="Limited to the current planning window"
          value={quarter}
          onValueChange={setQuarter}
          minDate={rangeStart}
          maxDate={rangeEnd}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <MonthPicker
        label="Billing month"
        description="Invoices are grouped by calendar month"
        value={billing}
        onValueChange={setBilling}
      />
    </div>
  )
}
