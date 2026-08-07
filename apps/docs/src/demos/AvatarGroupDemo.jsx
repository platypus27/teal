import { AvatarGroup } from '@kryv/teal'

const projectTeam = ['Avery Chen', 'Morgan Diaz', 'Priya Nair', 'Sam Okafor', 'June Park', 'Lee Ramos', 'Noor Haddad']

const tableRows = [
  { project: 'Teal docs', members: projectTeam.slice(0, 5) },
  { project: 'Design system', members: projectTeam.slice(2, 6) },
  { project: 'Marketing site', members: projectTeam.slice(4) },
]

export function AvatarGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-3">
        <AvatarGroup names={projectTeam.slice(0, 3)} size="sm" />
        <AvatarGroup names={projectTeam} max={2} size="sm" />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-md divide-y divide-teal-outline-variant/50 rounded-lg border border-teal-outline-variant/50">
        {tableRows.map((row) => (
          <div key={row.project} className="flex items-center justify-between gap-4 px-3 py-2">
            <span className="text-sm">{row.project}</span>
            <AvatarGroup names={row.members} max={3} size="sm" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <AvatarGroup names={projectTeam} />
      <AvatarGroup names={projectTeam.slice(0, 3)} />
    </div>
  )
}
