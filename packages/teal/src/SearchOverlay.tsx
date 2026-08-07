import { forwardRef, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Search, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface SearchOverlayRenderState {
  /** Index of the keyboard-highlighted result, or -1 when there are no results. */
  activeIndex: number
  /** Id the caller should put on the result container referenced by `aria-controls`. */
  listId: string
  /** Stable id for the result at `index`; put it on the result element to enable `aria-activedescendant`. */
  optionId: (index: number) => string
  /** Current query text of the search input. */
  query: string
  /** Moves the keyboard highlight, e.g. from a hover handler. */
  setActiveIndex: (index: number) => void
}

export interface SearchOverlayProps {
  className?: string
  /** Results rendered below the input; receives the query and highlight state. */
  children: (state: SearchOverlayRenderState) => ReactNode
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Accessible name of the search dialog. */
  label?: string
  /** Called when the overlay opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Called with the latest query whenever the input changes. */
  onQueryChange?: (query: string) => void
  /** Called with the highlighted result's index when Enter is pressed. */
  onSelect?: (index: number) => void
  /** Controlled open state. */
  open?: boolean
  /** Placeholder of the search input. */
  placeholder?: string
  /** Number of results currently rendered; arrow keys cycle within this range. */
  resultCount: number
}

/**
 * Full-screen search overlay. The caller renders the results via a render
 * prop; the overlay owns the query input and the keyboard highlight
 * (Arrow Up/Down cycle, Enter selects, Escape closes).
 */
export const SearchOverlay = forwardRef<HTMLDivElement, SearchOverlayProps>(function SearchOverlay(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    label = 'Search',
    onOpenChange,
    onQueryChange,
    onSelect,
    open,
    placeholder = 'Search…',
    resultCount,
  },
  ref,
) {
  return (
    <DialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-flex-col teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <DialogPrimitive.Title className="teal-u-sr-only">{label}</DialogPrimitive.Title>
          {/* Radix unmounts closed dialog content, so query and highlight
              state reset to fresh values on every open. */}
          <SearchOverlayPanel
            closeLabel={closeLabel}
            label={label}
            onQueryChange={onQueryChange}
            onSelect={onSelect}
            placeholder={placeholder}
            resultCount={resultCount}
          >
            {children}
          </SearchOverlayPanel>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})

interface SearchOverlayPanelProps {
  children: (state: SearchOverlayRenderState) => ReactNode
  closeLabel: string
  label: string
  onQueryChange?: ((query: string) => void) | undefined
  onSelect?: ((index: number) => void) | undefined
  placeholder: string
  resultCount: number
}

function SearchOverlayPanel({
  children,
  closeLabel,
  label,
  onQueryChange,
  onSelect,
  placeholder,
  resultCount,
}: SearchOverlayPanelProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = `teal-search-overlay-${useId().replaceAll(':', '')}`

  const active = resultCount > 0 ? Math.min(resultCount - 1, activeIndex) : -1

  function optionId(index: number) {
    return `${listId}-option-${index}`
  }

  function moveActive(step: 1 | -1) {
    if (resultCount === 0) return
    setActiveIndex((active + step + resultCount) % resultCount)
    document.getElementById(optionId((active + step + resultCount) % resultCount))?.scrollIntoView({ block: 'nearest' })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActive(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (active >= 0) onSelect?.(active)
    }
  }

  return (
    <>
      <div className="teal-u-mx-auto teal-u-flex teal-u-w-full teal-u-max-w-3xl teal-u-items-center teal-u-gap-3 teal-u-px-4 teal-u-pt-[12vh]">
        <div className="teal-u-flex teal-u-flex-1 teal-u-items-center teal-u-gap-3 teal-u-rounded-2xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-5 teal-u-shadow-overlay">
          <Search aria-hidden="true" className="teal-u-size-[var(--teal-icon-md)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label={label}
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
              onQueryChange?.(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            className="teal-u-h-16 teal-u-w-full teal-u-bg-transparent teal-u-text-lg teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant teal-u-outline-none"
          />
        </div>
        <DialogPrimitive.Close asChild>
          <IconButton label={closeLabel} variant="secondary">
            <X />
          </IconButton>
        </DialogPrimitive.Close>
      </div>
      <div className="teal-u-mx-auto teal-u-w-full teal-u-max-w-3xl teal-u-flex-1 teal-u-overflow-y-auto teal-u-px-4 teal-u-py-6">
        {children({ activeIndex: active, listId, optionId, query, setActiveIndex })}
      </div>
    </>
  )
}
