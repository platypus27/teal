import { LoadingBar } from '@kryv/teal'

export function LoadingBarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col gap-2 text-sm">
        <LoadingBar label="Loading page" />
        <p className="text-black/60">Indeterminate mode — shown while the route loads.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <LoadingBar value={65} label="Loading assets" />
      <p className="text-black/60">Determinate mode at 65% — pinned to the top of the page.</p>
    </div>
  )
}
