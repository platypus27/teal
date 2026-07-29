import { VisuallyHidden } from '@kryv/teal'
import { Trash2 } from 'lucide-react'

export function VisuallyHiddenDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <p className="text-sm">
        <a href="#" className="text-teal-primary underline">
          Status page
          <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
        </a>
        <span className="text-teal-on-surface-variant"> — the parenthetical note is announced, not shown.</span>
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-lg border border-teal-outline-variant/50 hover:bg-teal-surface-container-high"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        <VisuallyHidden>Delete report</VisuallyHidden>
      </button>
      <span className="text-sm text-teal-on-surface-variant">
        The button shows only an icon; screen readers hear “Delete report”.
      </span>
    </div>
  )
}
