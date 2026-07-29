import { HoverCard } from '@kryv/teal'

export function HoverCardDemo({ exampleIndex = 0 }) {
  const person = exampleIndex
    ? { handle: '@blake', name: 'Blake Moreno', role: 'Engineering — Platform team' }
    : { handle: '@avery', name: 'Avery Stone', role: 'Design lead — Workspace team' }
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
