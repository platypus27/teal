import { Bold, Italic, Link, List, ListOrdered, Underline } from 'lucide-react'
import { FloatingToolbar } from '@kryv/teal'

const buttonClass =
  'flex size-8 items-center justify-center rounded-full text-teal-on-surface-variant hover:bg-teal-surface-container-high hover:text-teal-on-surface'

export function FloatingToolbarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="relative flex h-32 w-full items-center justify-center rounded-xl border border-teal-outline-variant/30">
        <p className="text-sm">
          Select this <mark className="rounded bg-teal-primary/20 px-1">quoted phrase</mark> to format it.
        </p>
        <FloatingToolbar aria-label="List formatting" className="left-1/2 top-3 -translate-x-1/2">
          <button type="button" aria-label="Bulleted list" className={buttonClass}>
            <List className="size-4" />
          </button>
          <button type="button" aria-label="Numbered list" className={buttonClass}>
            <ListOrdered className="size-4" />
          </button>
          <button type="button" aria-label="Insert link" className={buttonClass}>
            <Link className="size-4" />
          </button>
        </FloatingToolbar>
      </div>
    )
  }

  return (
    <div className="relative flex h-32 w-full items-center justify-center rounded-xl border border-teal-outline-variant/30">
      <p className="text-sm">
        Select this <mark className="rounded bg-teal-primary/20 px-1">highlighted text</mark> to format it.
      </p>
      <FloatingToolbar className="left-1/2 top-3 -translate-x-1/2">
        <button type="button" aria-label="Bold" className={buttonClass}>
          <Bold className="size-4" />
        </button>
        <button type="button" aria-label="Italic" className={buttonClass}>
          <Italic className="size-4" />
        </button>
        <button type="button" aria-label="Underline" className={buttonClass}>
          <Underline className="size-4" />
        </button>
      </FloatingToolbar>
    </div>
  )
}
