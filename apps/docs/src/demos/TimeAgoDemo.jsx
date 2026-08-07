import { TimeAgo } from '@kryv/teal'

const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour

const now = Date.now()

const events = [
  { label: 'Deploy finished', offset: 5 * minute },
  { label: 'Alert resolved', offset: 2 * hour },
  { label: 'Quarter started', offset: 26 * day },
]

export function TimeAgoDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <p className="text-sm text-gray-700">
        Next status sync <TimeAgo date={now + 12 * minute} updateInterval={10000} className="font-medium" />.
      </p>
    )
  }

  return (
    <ul className="grid gap-2 text-sm">
      {events.map((event) => (
        <li key={event.label} className="flex items-center justify-between gap-8">
          <span>{event.label}</span>
          <TimeAgo date={now - event.offset} className="text-gray-500" />
        </li>
      ))}
    </ul>
  )
}
