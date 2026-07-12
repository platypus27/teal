import { Button, Checkbox, Popover } from '@kryv/teal'
import { Filter } from 'lucide-react'

export function PopoverDemo({ exampleIndex = 0 }) {
  return (
    <Popover
      trigger={
        <Button variant="secondary">
          <Filter /> {exampleIndex ? 'Refine projects' : 'Filters'}
        </Button>
      }
      align="start"
    >
      <div className="grid gap-3">
        <h3 className="font-headline font-bold">Filter projects</h3>
        <Checkbox label="Active only" defaultChecked />
        <Button size="sm">Apply filters</Button>
      </div>
    </Popover>
  )
}
