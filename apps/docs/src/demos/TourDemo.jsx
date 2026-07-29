import { useState } from 'react'
import { Button, Tour } from '@kryv/teal'

export function TourDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)

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
