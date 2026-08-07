import { useState } from 'react'
import { TransferList } from '@kryv/teal'

const skills = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'research', label: 'Research' },
]

export function TransferListDemo({ exampleIndex = 0 }) {
  const [chosen, setChosen] = useState(['engineering'])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-lg">
        <TransferList
          aria-label="Team skill picker"
          sourceLabel="Available skills"
          targetLabel="Covered by the team"
          value={chosen}
          onValueChange={setChosen}
          options={skills}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <TransferList options={skills} />
    </div>
  )
}
