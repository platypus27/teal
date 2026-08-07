import { useState } from 'react'
import { DateTimePicker } from '@kryv/teal'

export function DateTimePickerDemo({ exampleIndex = 0 }) {
  const [meeting, setMeeting] = useState(/** @type {Date | undefined} */ (undefined))
  const [publish, setPublish] = useState(new Date())

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <DateTimePicker
          label="Publish at"
          description="Shown in your local time, 12-hour clock"
          hourCycle={12}
          value={publish}
          onValueChange={setPublish}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <DateTimePicker
        label="Meeting start"
        description="Pick a day, then set the time and press Done"
        value={meeting}
        onValueChange={setMeeting}
      />
    </div>
  )
}
