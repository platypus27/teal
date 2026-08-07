import { useState } from 'react'
import { Button, Presence } from '@kryv/teal'

export function PresenceDemo({ exampleIndex = 0 }) {
  const [present, setPresent] = useState(true)

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Button onClick={() => setPresent((value) => !value)}>{present ? 'Hide filter' : 'Show filter'}</Button>
        <Presence present={present}>
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-900">
            Active filter: last 30 days
          </span>
        </Presence>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setPresent((value) => !value)}>{present ? 'Hide card' : 'Show card'}</Button>
      <Presence present={present}>
        <div className="w-72 rounded-xl border border-gray-200 p-4">
          <p className="font-medium">Sync complete</p>
          <p className="mt-1 text-sm text-gray-500">This card stays mounted while it fades out.</p>
        </div>
      </Presence>
    </div>
  )
}
