import { useState } from 'react'
import { NumberInput } from '@kryv/teal'

export function NumberInputDemo({ exampleIndex = 0 }) {
  const [teamSize, setTeamSize] = useState(4)
  const [velocity, setVelocity] = useState(20)

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <NumberInput
          label="Sprint velocity"
          description="Story points, in steps of 5 (0–100)"
          value={velocity}
          onValueChange={setVelocity}
          min={0}
          max={100}
          step={5}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <NumberInput
        label="Team size"
        description="How many people join this workspace"
        value={teamSize}
        onValueChange={setTeamSize}
        min={1}
        max={20}
      />
    </div>
  )
}
