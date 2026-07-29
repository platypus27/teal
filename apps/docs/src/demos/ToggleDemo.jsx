import { useState } from 'react'
import { Toggle } from '@kryv/teal'
import { Bold, Italic, List, Underline } from 'lucide-react'

export function ToggleDemo({ exampleIndex = 0 }) {
  const [formats, setFormats] = useState({ bold: true, italic: false, underline: false })
  const [filters, setFilters] = useState({ starred: false, archived: false })

  const toggleFormat = (key) => setFormats((current) => ({ ...current, [key]: !current[key] }))
  const toggleFilter = (key) => setFilters((current) => ({ ...current, [key]: !current[key] }))

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Toggle size="sm" pressed={filters.starred} onPressedChange={() => toggleFilter('starred')}>
          Starred
        </Toggle>
        <Toggle size="sm" pressed={filters.archived} onPressedChange={() => toggleFilter('archived')}>
          Archived
        </Toggle>
        <Toggle size="sm" disabled>
          Locked
        </Toggle>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Bold" pressed={formats.bold} onPressedChange={() => toggleFormat('bold')}>
        <Bold aria-hidden="true" className="size-4" />
      </Toggle>
      <Toggle aria-label="Italic" pressed={formats.italic} onPressedChange={() => toggleFormat('italic')}>
        <Italic aria-hidden="true" className="size-4" />
      </Toggle>
      <Toggle aria-label="Underline" pressed={formats.underline} onPressedChange={() => toggleFormat('underline')}>
        <Underline aria-hidden="true" className="size-4" />
      </Toggle>
      <Toggle aria-label="Bulleted list">
        <List aria-hidden="true" className="size-4" />
        List
      </Toggle>
    </div>
  )
}
