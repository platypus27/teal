import { useState } from 'react'
import { Chip } from '@kryv/teal'

const initialTags = ['Design', 'Research', 'Planning']

export function ChipDemo({ exampleIndex = 0 }) {
  const [tags, setTags] = useState(initialTags)

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} onRemove={() => setTags((current) => current.filter((t) => t !== tag))} />
        ))}
        <Chip label="Locked" onRemove={() => undefined} disabled />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip label="In progress" />
      <Chip label="Active filter" selected />
      <Chip label="Featured" variant="primary" />
      <Chip label="Archived" disabled />
    </div>
  )
}
