import { useState } from 'react'
import { Checkbox } from '@kryv/teal'

const rows = [
  { id: 'orion', name: 'Project Orion', owner: 'Avery Chen' },
  { id: 'atlas', name: 'Project Atlas', owner: 'Morgan Lee' },
  { id: 'nova', name: 'Project Nova', owner: 'Riley Singh' },
]

export function CheckboxBulkDemo() {
  const [selected, setSelected] = useState(['orion'])
  const allSelected = selected.length === rows.length
  const partiallySelected = selected.length > 0 && !allSelected
  function toggle(id) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }
  return (
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-outline-variant/30">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 bg-surface-container-high px-4 py-3">
        <Checkbox label="Select all projects" visuallyHiddenLabel checked={allSelected ? true : partiallySelected ? 'indeterminate' : false} onCheckedChange={(value) => setSelected(value ? rows.map((row) => row.id) : [])} />
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Project</span>
        <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Owner</span>
      </div>
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-3 border-b border-outline-variant/20 bg-surface-container px-4 py-3 last:border-b-0">
          <Checkbox label={row.name} visuallyHiddenLabel checked={selected.includes(row.id)} onCheckedChange={() => toggle(row.id)} />
          <span className="text-sm text-on-surface">{row.name}</span>
          <span className="ml-auto text-sm text-on-surface-variant">{row.owner}</span>
        </div>
      ))}
    </div>
  )
}
