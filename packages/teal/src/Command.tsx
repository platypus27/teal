import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Search, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface CommandItem {
  /** Unique identifier for the item. */
  id: string
  /** Visible label of the item; also used for filtering. */
  label: string
  /** Secondary text rendered right-aligned, e.g. a keyboard shortcut. */
  hint?: string
  /** Icon rendered before the label. */
  icon?: ReactNode
  /** Called when the item is chosen; the palette closes afterwards. */
  onSelect: () => void
}

export interface CommandGroup {
  /** Heading rendered above the group's items. */
  label: string
  /** Items rendered under the heading. */
  items: CommandItem[]
}

export interface CommandRenderState {
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

export interface CommandProps {
  /**
   * Results rendered below the input; receives the query and highlight state.
   * Passing a function switches the component into full-screen render-prop
   * mode where the caller owns filtering and result rendering.
   */
  children?: (state: CommandRenderState) => ReactNode
  /** Accessible label for the close button in render-prop mode. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Message shown when no item matches the query. */
  emptyMessage?: ReactNode
  /** Groups of commands rendered in the palette. Required in palette mode; unused in render-prop mode. */
  groups?: CommandGroup[]
  /** Accessible name of the dialog; defaults to `'Search'` in render-prop mode and `'Command palette'` in palette mode. */
  label?: string
  /** Called when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Called with the latest query whenever the input changes in render-prop mode. */
  onQueryChange?: (query: string) => void
  /** Called with the highlighted result's index when Enter is pressed in render-prop mode. */
  onSelect?: (index: number) => void
  /** Controlled open state. */
  open?: boolean
  /** Placeholder of the search input. */
  placeholder?: string
  /** Number of results currently rendered in render-prop mode; arrow keys cycle within this range. */
  resultCount?: number
}

const hintKeyClasses =
  'teal-u-inline-flex teal-u-items-center teal-u-rounded teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-1.5 teal-u-py-0.5 teal-u-font-mono teal-u-text-[0.75em] teal-u-font-semibold teal-u-text-on-surface-variant teal-u-shadow-sm'

/**
 * Command palette dialog: a filterable list of actions grouped by section,
 * driven entirely from the keyboard or by clicking. When `children` is a
 * function, the component renders as a full-screen search overlay instead:
 * the caller renders results via the render prop while the component owns
 * the query input and the keyboard highlight (Arrow Up/Down cycle, Enter
 * selects, Escape closes).
 */
export function Command({
  children,
  closeLabel = 'Close',
  defaultOpen,
  emptyMessage = 'No results',
  groups,
  label,
  onOpenChange,
  onQueryChange,
  onSelect,
  open,
  placeholder,
  resultCount = 0,
}: CommandProps) {
  if (typeof children === 'function') {
    const searchLabel = label ?? 'Search'
    return (
      <DialogPrimitive.Root
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange ? { onOpenChange } : {})}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
          <DialogPrimitive.Content className="teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-flex-col teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none">
            <DialogPrimitive.Title className="teal-u-sr-only">{searchLabel}</DialogPrimitive.Title>
            {/* Radix unmounts closed dialog content, so query and highlight
                state reset to fresh values on every open. */}
            <CommandSearchPanel
              closeLabel={closeLabel}
              label={searchLabel}
              onQueryChange={onQueryChange}
              onSelect={onSelect}
              placeholder={placeholder ?? 'Search…'}
              resultCount={resultCount}
            >
              {children}
            </CommandSearchPanel>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }

  return (
    <DialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content className="teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-[20%] teal-u-z-[var(--teal-z-dialog)] teal-u-w-[min(32rem,calc(100vw-2rem))] -teal-u-translate-x-1/2 teal-u-overflow-hidden teal-u-border teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none">
          <DialogPrimitive.Title className="teal-u-sr-only">{label ?? 'Command palette'}</DialogPrimitive.Title>
          {/* Radix unmounts closed dialog content, so the panel's filter and
              highlight state reset to fresh values on every open. */}
          <CommandPanel
            emptyMessage={emptyMessage}
            groups={groups ?? []}
            onOpenChange={onOpenChange ?? (() => undefined)}
            placeholder={placeholder ?? 'Type a command…'}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface CommandSearchPanelProps {
  children: (state: CommandRenderState) => ReactNode
  closeLabel: string
  label: string
  onQueryChange?: ((query: string) => void) | undefined
  onSelect?: ((index: number) => void) | undefined
  placeholder: string
  resultCount: number
}

function CommandSearchPanel({
  children,
  closeLabel,
  label,
  onQueryChange,
  onSelect,
  placeholder,
  resultCount,
}: CommandSearchPanelProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = `teal-command-search-${useId().replaceAll(':', '')}`

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

interface CommandPanelProps {
  emptyMessage: ReactNode
  groups: CommandGroup[]
  onOpenChange: (open: boolean) => void
  placeholder: string
}

function CommandPanel({ emptyMessage, groups, onOpenChange, placeholder }: CommandPanelProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = `teal-command-${useId().replaceAll(':', '')}`
  const listRef = useRef<HTMLDivElement>(null)

  function optionId(index: number) {
    return `${listId}-option-${index}`
  }

  const normalized = query.trim().toLowerCase()
  const filteredGroups = groups
    .map((group) => ({
      label: group.label,
      items: normalized ? group.items.filter((item) => item.label.toLowerCase().includes(normalized)) : group.items,
    }))
    .filter((group) => group.items.length > 0)
  const flatItems = filteredGroups.flatMap((group) => group.items)

  function selectItem(item: CommandItem) {
    item.onSelect()
    onOpenChange(false)
  }

  function moveActive(step: 1 | -1) {
    if (flatItems.length === 0) return
    const next = (activeIndex + step + flatItems.length) % flatItems.length
    setActiveIndex(next)
    listRef.current?.querySelector(`[id="${optionId(next)}"]`)?.scrollIntoView({ block: 'nearest' })
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
      const item = flatItems[activeIndex]
      if (item) selectItem(item)
    }
  }

  let optionIndex = -1

  return (
    <>
      <div className="teal-u-flex teal-u-items-center teal-u-gap-2.5 teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-4">
        <Search aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={flatItems.length > 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          aria-label="Search commands"
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          className="teal-u-h-12 teal-u-w-full teal-u-bg-transparent teal-u-text-sm teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant teal-u-outline-none"
        />
      </div>
      <div ref={listRef} role="listbox" id={listId} aria-label="Commands" className="teal-u-max-h-80 teal-u-overflow-y-auto teal-u-p-1.5">
        {flatItems.length === 0 ? (
          <div className="teal-u-px-3 teal-u-py-8 teal-u-text-center teal-u-text-sm teal-u-text-on-surface-variant">{emptyMessage}</div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.label}>
              <div className="teal-u-px-3 teal-u-pb-1 teal-u-pt-3 teal-u-text-[11px] teal-u-font-semibold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant">
                {group.label}
              </div>
              {group.items.map((item) => {
                optionIndex += 1
                const index = optionIndex
                const isActive = index === activeIndex
                return (
                  <div
                    key={item.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      'teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2.5 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm',
                      isActive ? 'teal-u-bg-primary/10 teal-u-text-primary' : 'teal-u-text-on-surface',
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                  >
                    {item.icon ? (
                      <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{item.icon}</span>
                    ) : null}
                    <span className="teal-u-truncate">{item.label}</span>
                    {item.hint ? <span className="teal-u-ml-auto teal-u-text-xs teal-u-text-on-surface-variant">{item.hint}</span> : null}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
      <div className="teal-u-flex teal-u-items-center teal-u-gap-4 teal-u-border-0 teal-u-border-t teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-4 teal-u-py-2 teal-u-text-xs teal-u-text-on-surface-variant">
        <span className="teal-u-flex teal-u-items-center teal-u-gap-1.5">
          <kbd className={hintKeyClasses}>↑</kbd>
          <kbd className={hintKeyClasses}>↓</kbd>
          Navigate
        </span>
        <span className="teal-u-flex teal-u-items-center teal-u-gap-1.5">
          <kbd className={hintKeyClasses}>↵</kbd>
          Select
        </span>
        <span className="teal-u-flex teal-u-items-center teal-u-gap-1.5">
          <kbd className={hintKeyClasses}>Esc</kbd>
          Close
        </span>
      </div>
    </>
  )
}
