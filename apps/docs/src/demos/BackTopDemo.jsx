import { BackTop } from '@kryv/teal'

export function BackTopDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid gap-2">
        <p className="text-sm text-teal-on-surface-variant">
          A low threshold keeps the control visible even on shorter pages.
        </p>
        {/* Negative threshold forces the demo to render without scrolling. */}
        <BackTop threshold={-1} label="Back to top of reports" />
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm text-teal-on-surface-variant">
        Scroll this page and the button floats in at the bottom-right corner.
      </p>
      {/* Negative threshold forces the demo to render without scrolling. */}
      <BackTop threshold={-1} />
    </div>
  )
}
