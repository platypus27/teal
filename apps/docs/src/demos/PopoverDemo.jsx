import { Button, Checkbox, Popover } from '@kryv/teal'
import { Filter } from 'lucide-react'

export function PopoverDemo({ exampleIndex = 0 }) {
  return (
    <Popover
      label="Filter projects"
      trigger={
        <Button variant="secondary">
          <Filter /> {exampleIndex ? 'Refine projects' : 'Filters'}
        </Button>
      }
      align="start"
    >
      <div className="grid gap-3">
        <h3 className="font-teal-headline font-bold">Filter projects</h3>
        <Checkbox label="Active only" defaultChecked />
        <Button size="sm">Apply filters</Button>
      </div>
    </Popover>
  )
}
