import { useState } from 'react'
import { TreeSelect } from '@kryv/teal'

const locations = [
  {
    value: 'emea',
    label: 'EMEA',
    children: [
      { value: 'berlin', label: 'Berlin' },
      { value: 'lisbon', label: 'Lisbon' },
    ],
  },
  {
    value: 'americas',
    label: 'Americas',
    children: [
      { value: 'nyc', label: 'New York' },
      { value: 'sao-paulo', label: 'São Paulo' },
      { value: 'remote', label: 'Remote hub', disabled: true },
    ],
  },
  { value: 'singapore', label: 'Singapore' },
]

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

export function TreeSelectDemo({ exampleIndex = 0 }) {
  const [office, setOffice] = useState('lisbon')
  const [path, setPath] = useState(['engineering', 'backend'])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <TreeSelect
          label="Office"
          description="Regional offices only; hubs are not assignable"
          defaultExpandedValues={['americas']}
          value={office}
          onValueChange={(value) => {
            if (typeof value === 'string') setOffice(value)
          }}
          options={locations}
        />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-xs">
        <TreeSelect
          label="Owning team"
          display="columns"
          description="The full path from department to team"
          value={path}
          onValueChange={(value) => {
            if (Array.isArray(value)) setPath(value)
          }}
          options={teams}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <TreeSelect label="Office" placeholder="Pick an office…" options={locations} />
    </div>
  )
}
