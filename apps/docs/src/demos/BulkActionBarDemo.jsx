import { useState } from 'react'
import { BulkActionBar, Button } from '@kryv/teal'

export function BulkActionBarDemo({ exampleIndex = 0 }) {
  const [count, setCount] = useState(3)

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xl">
        <BulkActionBar count={count} onClear={() => setCount(0)}>
          <Button variant="secondary" size="sm">
            Archive
          </Button>
          <Button variant="secondary" size="sm">
            Assign
          </Button>
        </BulkActionBar>
        {count === 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setCount(3)}>
            Select 3 rows again
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl">
      <BulkActionBar count={5} onClear={() => {}}>
        <Button variant="secondary" size="sm">
          Download
        </Button>
        <Button variant="danger" size="sm">
          Delete
        </Button>
      </BulkActionBar>
    </div>
  )
}
