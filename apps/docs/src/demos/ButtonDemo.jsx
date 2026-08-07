import { Button, IconButton } from '@kryv/teal'
import { Search, Share2 } from 'lucide-react'

export function ButtonDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid justify-items-start gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Publish</Button>
          <Button variant="secondary" disabled>
            Duplicate
          </Button>
          <IconButton label="Share" disabled>
            <Share2 />
          </IconButton>
        </div>
        <p className="text-sm text-teal-on-surface-variant">Publishing unlocks once an editor approves the draft.</p>
      </div>
    )
  }

  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Saving</Button>
      <IconButton label="Search">
        <Search />
      </IconButton>
    </>
  )
}
