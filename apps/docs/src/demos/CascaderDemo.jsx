import { useState } from 'react'
import { Cascader } from '@kryv/teal'

const teams = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'platform', label: 'Platform' },
    ],
  },
  {
    value: 'design',
    label: 'Design',
    children: [
      { value: 'product', label: 'Product Design' },
      { value: 'research', label: 'Research' },
    ],
  },
  { value: 'operations', label: 'Operations' },
]

export function CascaderDemo({ exampleIndex = 0 }) {
  const [path, setPath] = useState(['engineering', 'backend'])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <Cascader
          label="Owning team"
          description="The full path from department to team"
          value={path}
          onValueChange={setPath}
          options={teams}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <Cascader label="Owning team" placeholder="Pick a team…" options={teams} />
    </div>
  )
}
