import { useState } from 'react'
import { BlockingOverlay } from '@kryv/teal'

export function BlockingOverlayDemo({ exampleIndex = 0 }) {
  const [busy, setBusy] = useState(false)

  if (exampleIndex === 1) {
    return (
      <div className="flex w-full max-w-md flex-col items-start gap-3">
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
          onClick={() => {
            setBusy(true)
            setTimeout(() => setBusy(false), 2000)
          }}
        >
          Simulate save
        </button>
        <BlockingOverlay visible={busy} label="Saving changes" className="w-full rounded-xl border">
          <div className="grid gap-2 p-6 text-sm">
            <p>Form content that cannot be edited while the save is in flight.</p>
            <div className="h-4 w-2/3 rounded bg-black/10" />
            <div className="h-4 w-1/2 rounded bg-black/10" />
          </div>
        </BlockingOverlay>
      </div>
    )
  }

  return (
    <BlockingOverlay visible label="Loading report" className="w-full max-w-md rounded-xl border">
      <div className="grid gap-2 p-6">
        <div className="h-4 w-2/3 rounded bg-black/10" />
        <div className="h-4 w-1/2 rounded bg-black/10" />
        <div className="h-4 w-1/3 rounded bg-black/10" />
      </div>
    </BlockingOverlay>
  )
}
