import { useState } from 'react'
import { Button, Portal } from '@kryv/teal'

export function PortalDemo({ exampleIndex = 0 }) {
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState(null)

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Button onClick={() => setShow((value) => !value)}>{show ? 'Remove banner' : 'Add banner'}</Button>
        <div ref={setTarget} className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          Portal target container
          {show && target ? (
            <Portal container={target}>
              <p className="mt-2 rounded-lg bg-teal-50 p-3 text-sm font-medium text-teal-900">Rendered inside the dashed box through a portal.</p>
            </Portal>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setShow((value) => !value)}>{show ? 'Dismiss notice' : 'Show notice'}</Button>
      {show ? (
        <Portal>
          <div className="fixed bottom-4 right-4 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            Fixed notice portalled to document.body
          </div>
        </Portal>
      ) : null}
    </div>
  )
}
