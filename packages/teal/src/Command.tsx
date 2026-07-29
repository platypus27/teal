import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
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

export interface CommandProps {
  /** Message shown when no item matches the query. */
  emptyMessage?: ReactNode
  /** Groups of commands rendered in the palette. */
  groups: CommandGroup[]
  /** Called when the palette opens or closes. */
  onOpenChange: (open: boolean) => void
  /** Controlled open state. */
  open: boolean
  /** Placeholder of the search input. */
  placeholder?: string
}

const hintKeyClasses =
  'teal-u-inline-flex teal-u-items-center teal-u-rounded teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-1.5 teal-u-py-0.5 teal-u-font-mono teal-u-text-[0.75em] teal-u-font-semibold teal-u-text-on-surface-variant teal-u-shadow-sm'

/**
 * Command palette dialog: a filterable list of actions grouped by section,
 * driven entirely from the keyboard or by clicking.
 */
export function Command({ emptyMessage = 'No results', groups, onOpenChange, open, placeholder = 'Type a command…' }: CommandProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content className="teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-[20%] teal-u-z-[var(--teal-z-dialog)] teal-u-w-[min(32rem,calc(100vw-2rem))] -teal-u-translate-x-1/2 teal-u-overflow-hidden teal-u-border teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none">
          <DialogPrimitive.Title className="teal-u-sr-only">Command palette</DialogPrimitive.Title>
          {/* Radix unmounts closed dialog content, so the panel's filter and
              highlight state reset to fresh values on every open. */}
          <CommandPanel
            emptyMessage={emptyMessage}
            groups={groups}
            onOpenChange={onOpenChange}
            placeholder={placeholder}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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
