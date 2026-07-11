import { useEffect, useRef, useState } from 'react'
import { IconButton, Input, Tooltip } from '@kryv/teal'
import { Search, X } from 'lucide-react'

export function TooltipDemo() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <div
      className={`relative flex items-center transition-[width] duration-200 ease-out motion-reduce:transition-none ${
        open ? 'w-64' : 'w-10'
      }`}
    >
      {open ? (
        <div className="flex h-10 w-full items-center gap-1 rounded-full border border-outline-variant/40 bg-surface pl-3 pr-1 shadow-sm">
          <Search aria-hidden="true" className="size-4 shrink-0 text-on-surface-variant" />
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
