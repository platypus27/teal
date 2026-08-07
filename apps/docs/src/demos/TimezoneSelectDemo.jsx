import { useState } from 'react'
import { TimezoneSelect } from '@kryv/teal'

export function TimezoneSelectDemo({ exampleIndex = 0 }) {
  const [zone, setZone] = useState('America/New_York')

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs space-y-2">
        <TimezoneSelect
          label="Workspace time zone"
          description="Used for scheduling across the team"
          value={zone}
          onValueChange={setZone}
        />
        <p className="text-sm text-on-surface-variant">Selected: {zone}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <TimezoneSelect
        label="Event time zone"
        description="Type a city name to filter the list"
        defaultValue="Europe/London"
      />
    </div>
  )
}
