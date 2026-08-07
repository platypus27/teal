import { StickyHeader } from '@kryv/teal'

const activity = Array.from({ length: 12 }, (_, index) => `Deploy #${104 - index} finished`)

export function StickyHeaderDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div tabIndex={0} className="h-48 w-full overflow-y-auto rounded-xl border border-teal-outline-variant/50">
        <StickyHeader offset={8} className="px-4 py-2">
          <p className="text-sm font-semibold">Sticks 8px from the top with a shadow once stuck</p>
        </StickyHeader>
        <ul className="space-y-2 px-4 py-3 text-sm text-teal-on-surface-variant">
          {activity.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div tabIndex={0} className="h-48 w-full overflow-y-auto rounded-xl border border-teal-outline-variant/50">
      <StickyHeader className="px-4 py-2">
        <p className="text-sm font-semibold">Recent activity</p>
      </StickyHeader>
      <ul className="space-y-2 px-4 py-3 text-sm text-teal-on-surface-variant">
        {activity.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
