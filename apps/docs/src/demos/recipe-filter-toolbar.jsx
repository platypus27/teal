import { Button, Card, Input, Select } from '@kryv/teal'
import { Filter, RotateCcw, Search } from 'lucide-react'

export function FilterToolbarRecipe() {
  return (
    <Card className="w-full max-w-3xl p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <Input aria-label="Search projects" placeholder="Search projects" className="pl-9" />
        </div>
        <Select aria-label="Project status" placeholder="Status" options={[{ value: 'all', label: 'All statuses' }, { value: 'ready', label: 'Ready' }, { value: 'review', label: 'In review' }]} />
        <Button variant="secondary" size="sm"><Filter /> Filter</Button>
        <Button variant="ghost" size="sm"><RotateCcw /> Reset</Button>
      </div>
    </Card>
  )
}
