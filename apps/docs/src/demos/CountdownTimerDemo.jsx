import { CountdownTimer } from '@kryv/teal'

const launch = new Date(Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 7)
const maintenance = new Date(Date.now() + 1000 * 60 * 9 + 1000 * 42)

export function CountdownTimerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <CountdownTimer targetDate={launch} completionMessage="The launch window has opened.">
        {(parts) => (
          <span className="flex items-center gap-2">
            {[
              [parts.days, 'days'],
              [parts.hours, 'hrs'],
              [parts.minutes, 'min'],
              [parts.seconds, 'sec'],
            ].map(([value, unit]) => (
              <span key={unit} className="grid justify-items-center rounded-lg border border-gray-200 px-3 py-2">
                <span className="text-xl font-semibold tabular-nums">{String(value).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500">{unit}</span>
              </span>
            ))}
          </span>
        )}
      </CountdownTimer>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Maintenance starts in</span>
      <CountdownTimer targetDate={maintenance} className="font-semibold" />
    </div>
  )
}
