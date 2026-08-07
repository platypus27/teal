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

export function TreeSelectDemo({ exampleIndex = 0 }) {
  const [office, setOffice] = useState('lisbon')

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <TreeSelect
          label="Office"
          description="Regional offices only; hubs are not assignable"
          defaultExpandedValues={['americas']}
          value={office}
          onValueChange={setOffice}
          options={locations}
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
