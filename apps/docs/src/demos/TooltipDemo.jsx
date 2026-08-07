import { useEffect, useRef, useState } from 'react'
import { Button, IconButton, Input, Tooltip } from '@kryv/teal'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'

export function TooltipDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <Tooltip content="Older reports" side="left">
          <IconButton label="Older reports">
            <ArrowLeft />
          </IconButton>
        </Tooltip>
        <span className="text-sm text-teal-on-surface-variant">Q3 2025</span>
        <Tooltip content="Newer reports" side="right">
          <IconButton label="Newer reports">
            <ArrowRight />
          </IconButton>
        </Tooltip>
        <Tooltip content="Jump to the latest quarter" side="bottom">
          <Button variant="secondary" size="sm">
            Latest
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div
      className={`relative flex items-center transition-[width] duration-200 ease-out motion-reduce:transition-none ${
        open ? 'w-64' : 'w-10'
      }`}
    >
      {open ? (
        <div className="flex h-10 w-full items-center gap-1 rounded-full border border-teal-outline-variant/40 bg-teal-surface pl-3 pr-1 shadow-sm">
          <Search aria-hidden="true" className="size-4 shrink-0 text-teal-on-surface-variant" />
          <Input
            ref={inputRef}
            aria-label="Search"
            placeholder="Search..."
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
            }}
            className="h-10 min-h-0 flex-1 rounded-none border-transparent bg-transparent px-2 py-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
          />
          <IconButton label="Close search" size="sm" onClick={() => setOpen(false)}>
            <X />
          </IconButton>
        </div>
      ) : (
        <Tooltip content="Search" delayDuration={0}>
          <IconButton label="Open search" onClick={() => setOpen(true)}>
            <Search />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
