import { useState } from 'react'
import { MultiSelect } from '@kryv/teal'

export function MultiSelectDemo({ exampleIndex = 0 }) {
  const [roles, setRoles] = useState(['editor'])
  const [labels, setLabels] = useState([])

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <MultiSelect
          label="Filter by label"
          description="Cards matching any selected label are shown"
          placeholder="Select labels…"
          value={labels}
          onValueChange={setLabels}
          options={[
            { value: 'bug', label: 'Bug' },
            { value: 'design', label: 'Design' },
            { value: 'docs', label: 'Documentation' },
            { value: 'infra', label: 'Infrastructure', disabled: true },
            { value: 'research', label: 'Research' },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <MultiSelect
        label="Project roles"
        placeholder="Select roles…"
        value={roles}
        onValueChange={setRoles}
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'editor', label: 'Editor' },
          { value: 'reviewer', label: 'Reviewer' },
          { value: 'viewer', label: 'Viewer' },
        ]}
      />
    </div>
  )
}
