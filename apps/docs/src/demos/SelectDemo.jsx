import { useState } from 'react'
import { Select } from '@kryv/teal'

export function SelectDemo({ exampleIndex = 0 }) {
  const [role, setRole] = useState('viewer')

  if (exampleIndex === 3) {
    return (
      <div className="w-full max-w-xs">
        <Select
          aria-label="Country"
          placeholder="Choose a country"
          options={[
            { value: 'au', label: 'Australia' },
            { value: 'br', label: 'Brazil' },
            { value: 'ca', label: 'Canada' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
            { value: 'in', label: 'India' },
            { value: 'jp', label: 'Japan' },
            { value: 'nl', label: 'Netherlands' },
            { value: 'sg', label: 'Singapore' },
            { value: 'za', label: 'South Africa' },
            { value: 'gb', label: 'United Kingdom' },
            { value: 'us', label: 'United States' },
          ]}
        />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-xs">
        <Select
          aria-label="Assignee role"
          placeholder="Choose a role"
          options={[
            { value: 'owner', label: 'Owner' },
            { value: 'maintainer', label: 'Maintainer' },
            { value: 'contributor', label: 'Contributor' },
          ]}
        />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <Select
          aria-label="Support plan"
          placeholder="Choose a plan"
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'priority', label: 'Priority' },
            { value: 'dedicated', label: 'Dedicated (enterprise)', disabled: true },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        aria-label="Project role"
        value={role}
        onValueChange={setRole}
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
        ]}
      />
    </div>
  )
}
