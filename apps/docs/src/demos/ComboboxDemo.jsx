import { useState } from 'react'
import { Combobox } from '@kryv/teal'

export function ComboboxDemo({ exampleIndex = 0 }) {
  const [assignee, setAssignee] = useState('mira')
  const [project, setProject] = useState('')

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <Combobox
          label="Move to project"
          description="Start typing to filter your projects"
          placeholder="Search projects…"
          emptyMessage="No projects match"
          value={project}
          onValueChange={setProject}
          options={[
            { value: 'atlas', label: 'Atlas redesign' },
            { value: 'billing', label: 'Billing migration' },
            { value: 'docs', label: 'Docs overhaul' },
            { value: 'mobile', label: 'Mobile app', disabled: true },
            { value: 'onboarding', label: 'Onboarding revamp' },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <Combobox
        label="Assignee"
        placeholder="Search people…"
        value={assignee}
        onValueChange={setAssignee}
        options={[
          { value: 'mira', label: 'Mira Chen' },
          { value: 'jonas', label: 'Jonas Weber' },
          { value: 'priya', label: 'Priya Nair' },
          { value: 'sam', label: 'Sam Ortiz' },
          { value: 'lena', label: 'Lena Fischer' },
        ]}
      />
    </div>
  )
}
