import { Button, Checkbox, Input, Popover } from '@kryv/teal'
import { Filter, Share2 } from 'lucide-react'

export function PopoverDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Popover
        label="Share report"
        side="top"
        trigger={
          <Button variant="secondary">
            <Share2 /> Share
          </Button>
        }
      >
        <div className="grid gap-3">
          <h3 className="font-teal-headline font-bold">Share report</h3>
          <Input aria-label="Report link" defaultValue="https://app.example/reports/q3" readOnly />
          <Button size="sm">Copy link</Button>
        </div>
      </Popover>
    )
  }

  if (exampleIndex === 2) {
    return (
      <Popover
        label="Status filters"
        trigger={
          <Button variant="secondary">
            <Filter /> Status
          </Button>
        }
        align="start"
      >
        <div className="grid gap-3">
          <h3 className="font-teal-headline font-bold">Status</h3>
          <Checkbox label="Active" defaultChecked />
          <Checkbox label="Paused" />
          <Button size="sm">Apply filters</Button>
        </div>
      </Popover>
    )
  }

  if (exampleIndex === 3) {
    return (
      <Popover
        label="Display options"
        trigger={<Button variant="secondary">Display options</Button>}
      >
        <div className="grid gap-3">
          <h3 className="font-teal-headline font-bold">Display</h3>
          <Checkbox label="Compact rows" />
          <Checkbox label="Show avatars" defaultChecked />
          <Button size="sm" variant="secondary">
            Reset to defaults
          </Button>
        </div>
      </Popover>
    )
  }

  return (
    <Popover
      label="Filter projects"
      trigger={
        <Button variant="secondary">
          <Filter /> Filters
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
