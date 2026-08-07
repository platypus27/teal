import { useState } from 'react'
import { Button, Tour } from '@kryv/teal'

export function TourDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)

  if (exampleIndex === 2) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Replay the placement tip
        </Button>
        <div className="flex h-32 w-full max-w-md items-end rounded-lg border border-teal-outline-variant/30 p-3">
          <span id="tour-demo-dock" className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">
            Shortcut dock
          </span>
        </div>
        <Tour
          open={open}
          onOpenChange={setOpen}
          steps={[
            {
              target: '#tour-demo-dock',
              placement: 'top',
              title: 'Shortcuts dock here',
              content: 'The dock sits near the bottom edge, so this step opens above it.',
            },
          ]}
        />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Replay the hint
        </Button>
        <span id="tour-demo-anchor" className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">
          Usage metrics
        </span>
        <Tour
          open={open}
          onOpenChange={setOpen}
          steps={[
            {
              target: '#tour-demo-anchor',
              placement: 'top',
              title: 'Metrics move here',
              content: 'Weekly usage moved into this panel during the redesign.',
            },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Start tour</Button>
      <span id="tour-demo-search" className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">
        Search field
      </span>
      <span id="tour-demo-filters" className="rounded-lg border border-teal-outline-variant/50 px-3 py-2 text-sm">
        Filters
      </span>
      <Tour
        open={open}
        onOpenChange={setOpen}
        onFinish={() => undefined}
        steps={[
          { target: '#tour-demo-search', title: 'Search everything', content: 'Find projects, people, and reports from one field.' },
          { target: '#tour-demo-filters', title: 'Narrow results', content: 'Combine filters to focus the current view.' },
        ]}
      />
    </div>
  )
}
