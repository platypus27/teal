import { useEffect, useRef, useState } from 'react'
import { IconButton, Input } from '@kryv/teal'
import { Search, X } from 'lucide-react'

export function DisclosedSearchRecipe() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { if (open) requestAnimationFrame(() => inputRef.current?.focus()) }, [open])
  return open ? (
    <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-teal-outline-variant/40 bg-teal-surface px-3">
      <Search aria-hidden="true" className="size-4 text-teal-on-surface-variant" />
      <Input ref={inputRef} aria-label="Search projects" placeholder="Search projects" className="min-h-10 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }} />
      <IconButton label="Close search" size="sm" onClick={() => setOpen(false)}><X /></IconButton>
    </div>
  ) : <IconButton label="Open project search" onClick={() => setOpen(true)}><Search /></IconButton>
}
