import { DateRangePicker } from '@kryv/teal'

export function DateRangePickerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6
    return (
      <div className="w-full max-w-xs">
        <DateRangePicker
          label="Maintenance window"
          isDateDisabled={isWeekend}
          placeholder="Weekdays only"
          onChange={() => undefined}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <DateRangePicker label="Report period" onChange={() => undefined} />
    </div>
  )
}
