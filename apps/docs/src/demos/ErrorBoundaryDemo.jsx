import { useState } from 'react'
import { ErrorBoundary } from '@kryv/teal'

function MaybeBroken({ broken }) {
  if (broken) throw new Error('The report could not be rendered.')
  return <p className="text-sm">Report content rendered normally.</p>
}

export function ErrorBoundaryDemo({ exampleIndex = 0 }) {
  const [broken, setBroken] = useState(true)

  if (exampleIndex === 1) {
    return (
      <ErrorBoundary fallback={<div className="rounded-xl border p-4 text-sm">This section failed to load.</div>}>
        <MaybeBroken broken />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary
      onError={(error) => console.error('Caught by boundary:', error.message)}
      fallback={(error, reset) => (
        <div className="flex flex-col items-start gap-2 rounded-xl border p-4 text-sm">
          <p>{error.message}</p>
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
            onClick={() => {
              setBroken(false)
              reset()
            }}
          >
            Retry
          </button>
        </div>
      )}
    >
      <MaybeBroken broken={broken} />
    </ErrorBoundary>
  )
}
