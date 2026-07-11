import { useState } from 'react'
import { Select } from '@kryv/teal'

export function SelectDemo() {
  const [role, setRole] = useState('viewer')
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
