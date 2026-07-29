import { useState } from 'react'
import { Editable } from '@kryv/teal'

export function EditableDemo({ exampleIndex = 0 }) {
  const [name, setName] = useState('Project Orion')

  if (exampleIndex === 1) {
    return (
      <div className="grid gap-2">
        <Editable label="Short description" placeholder="Add a description" />
        <span className="text-sm text-teal-on-surface-variant">Empty values stay discoverable through the placeholder.</span>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Editable label="Project name" value={name} onSubmit={setName} />
      <span className="text-sm text-teal-on-surface-variant">Click the text to rename; Enter commits, Escape cancels.</span>
    </div>
  )
}
