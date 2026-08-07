import { useState } from 'react'
import { Button, Collapse } from '@kryv/teal'

export function CollapseDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(exampleIndex === 1)

  if (exampleIndex === 1) {
    return (
      <div className="w-80">
        <Button onClick={() => setOpen((value) => !value)}>{open ? 'Hide release notes' : 'Show release notes'}</Button>
        <Collapse open={open}>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Added dark surface tokens.</li>
            <li>Improved focus ring contrast.</li>
            <li>Fixed drawer scroll locking.</li>
          </ul>
        </Collapse>
      </div>
    )
  }

  return (
    <div className="w-80">
      <Button onClick={() => setOpen((value) => !value)}>{open ? 'Hide details' : 'Show details'}</Button>
      <Collapse open={open}>
        <p className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          This region animates its height as it opens and marks its content inert while closed.
        </p>
      </Collapse>
    </div>
  )
}
