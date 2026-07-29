import { AvatarGroup } from '@kryv/teal'

const projectTeam = ['Avery Chen', 'Morgan Diaz', 'Priya Nair', 'Sam Okafor', 'June Park', 'Lee Ramos', 'Noor Haddad']

export function AvatarGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-3">
        <AvatarGroup names={projectTeam.slice(0, 3)} size="sm" />
        <AvatarGroup names={projectTeam} max={2} size="sm" />
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
