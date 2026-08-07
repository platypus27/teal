import { HoverCard } from '@kryv/teal'

export function HoverCardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <ul className="w-80 divide-y divide-teal-outline-variant/40 rounded-xl border border-teal-outline-variant/40">
        <li className="flex items-center justify-between px-4 py-2.5">
          <HoverCard
            trigger={
              <button type="button" className="font-semibold text-teal-primary underline underline-offset-2">
                @casey
              </button>
            }
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-teal-on-surface">Casey Nguyen</p>
              <p className="text-sm text-teal-on-surface-variant">Product manager — Growth team</p>
              <p className="text-sm text-teal-on-surface-variant">8 shared projects · Toronto</p>
            </div>
          </HoverCard>
          <span className="text-xs text-teal-on-surface-variant">Product</span>
        </li>
        <li className="flex items-center justify-between px-4 py-2.5">
          <span className="text-sm text-teal-on-surface">Devon Patel</span>
          <span className="text-xs text-teal-on-surface-variant">Engineering</span>
        </li>
        <li className="flex items-center justify-between px-4 py-2.5">
          <span className="text-sm text-teal-on-surface">Emery Kim</span>
          <span className="text-xs text-teal-on-surface-variant">Design</span>
        </li>
      </ul>
    )
  }

  if (exampleIndex === 1) {
    return (
      <HoverCard
        openDelay={100}
        closeDelay={200}
        side="right"
        align="start"
        trigger={
          <button type="button" className="font-semibold text-teal-primary underline underline-offset-2">
            @blake
          </button>
        }
      >
        <div className="space-y-1">
          <p className="text-sm font-bold text-teal-on-surface">Blake Moreno</p>
          <p className="text-sm text-teal-on-surface-variant">Engineering — Platform team</p>
          <p className="text-sm text-teal-on-surface-variant">12 shared projects · Berlin</p>
        </div>
      </HoverCard>
    )
  }

  const person = { handle: '@avery', name: 'Avery Stone', role: 'Design lead — Workspace team' }
  return (
    <HoverCard
      trigger={
        <button type="button" className="font-semibold text-teal-primary underline underline-offset-2">
          {person.handle}
        </button>
      }
    >
      <div className="space-y-1">
        <p className="text-sm font-bold text-teal-on-surface">{person.name}</p>
        <p className="text-sm text-teal-on-surface-variant">{person.role}</p>
      </div>
    </HoverCard>
  )
}
