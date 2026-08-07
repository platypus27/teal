import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './cn'

export interface TransferListOption {
  /** Prevents the option from being selected or moved. */
  disabled?: boolean
  /** Visible label of the option. */
  label: string
  /** Value reported while the option sits in the target list. */
  value: string
}

export interface TransferListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name for the whole transfer group. */
  'aria-label'?: string
  /** Initial target values when uncontrolled. */
  defaultValue?: string[]
  /** Called with the full list of target values whenever items move. */
  onValueChange?: (values: string[]) => void
  /** All options; those listed in `value` render in the target list. */
  options: TransferListOption[]
  /** Accessible name of the source list. */
  sourceLabel?: string
  /** Accessible name of the target list. */
  targetLabel?: string
  /** Controlled target values. */
  value?: string[]
}

type Side = 'source' | 'target'

function otherSide(side: Side): Side {
  return side === 'source' ? 'target' : 'source'
}

/**
 * Dual listbox: two multi-selectable lists with buttons and keyboard commands
 * that move selected options between the source and the target list.
 */
export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList(
  {
    'aria-label': ariaLabel = 'Transfer list',
    className,
    defaultValue,
    onValueChange,
    options,
    sourceLabel = 'Available',
    targetLabel = 'Selected',
    value,
    ...props
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? [])
  const targetValues = value !== undefined ? value : internalValue
  const targetSet = new Set(targetValues)

  const sourceOptions = options.filter((option) => !targetSet.has(option.value))
  const targetOptions = options.filter((option) => targetSet.has(option.value))

  const [selected, setSelected] = useState<Record<Side, string[]>>({ source: [], target: [] })
  const [focusValues, setFocusValues] = useState<Record<Side, string | undefined>>({ source: undefined, target: undefined })

  const optionRefs = useRef(new Map<string, HTMLLIElement>())
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    const key = pendingFocus.current
    if (key === null) return
    pendingFocus.current = null
    optionRefs.current.get(key)?.focus()
  })

  function optionsFor(side: Side) {
    return side === 'source' ? sourceOptions : targetOptions
  }

  function optionKey(side: Side, optionValue: string) {
    return `${side}:${optionValue}`
  }

  // The tab stop falls back to the first option when the tracked one moved away.
  function tabStopFor(side: Side) {
    const list = optionsFor(side)
    const tracked = focusValues[side]
    if (tracked !== undefined && list.some((option) => option.value === tracked)) return tracked
    return list[0]?.value
  }

  function commit(nextTarget: string[]) {
    if (value === undefined) setInternalValue(nextTarget)
    onValueChange?.(nextTarget)
  }

  function focusOption(side: Side, optionValue: string) {
    setFocusValues((current) => ({ ...current, [side]: optionValue }))
    pendingFocus.current = optionKey(side, optionValue)
  }

  function toggleSelection(side: Side, optionValue: string) {
    setSelected((current) => ({
      ...current,
      [side]: current[side].includes(optionValue)
        ? current[side].filter((entry) => entry !== optionValue)
        : [...current[side], optionValue],
    }))
  }

  /** Moves the given option values of `side` to the opposite list. */
  function moveValues(side: Side, values: string[]) {
    const movable = optionsFor(side)
      .filter((option) => values.includes(option.value) && !option.disabled)
      .map((option) => option.value)
    if (movable.length === 0) return
    const destination = otherSide(side)
    commit(destination === 'target' ? [...targetValues, ...movable] : targetValues.filter((entry) => !movable.includes(entry)))
    setSelected({ source: [], target: destination === 'target' ? movable : [] })
    const firstMoved = movable[0]
    if (firstMoved !== undefined) focusOption(destination, firstMoved)
  }

  /** Moves every selected, enabled option of `side` to the opposite list. */
  function move(side: Side) {
    moveValues(side, selected[side])
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLLIElement>, side: Side, option: TransferListOption) {
    const list = optionsFor(side)
    const index = list.findIndex((candidate) => candidate.value === option.value)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      let nextIndex = index + delta
      while (nextIndex >= 0 && nextIndex < list.length && list[nextIndex]?.disabled) nextIndex += delta
      const next = list[nextIndex]
      if (next) focusOption(side, next.value)
    } else if (event.key === 'Home') {
      event.preventDefault()
      const first = list.find((candidate) => !candidate.disabled)
      if (first) focusOption(side, first.value)
    } else if (event.key === 'End') {
      event.preventDefault()
      const last = [...list].reverse().find((candidate) => !candidate.disabled)
      if (last) focusOption(side, last.value)
    } else if (event.key === ' ') {
      event.preventDefault()
      if (!option.disabled) toggleSelection(side, option.value)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (option.disabled) return
      if (selected[side].includes(option.value)) move(side)
      else moveValues(side, [option.value])
    }
  }

  function renderList(side: Side, listLabel: string) {
    const list = optionsFor(side)
    const tabStop = tabStopFor(side)
    return (
      <div className="teal-u-grid teal-u-min-w-0 teal-u-flex-1 teal-u-gap-1.5">
        <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{listLabel}</span>
        <ul
          role="listbox"
          aria-label={listLabel}
          aria-multiselectable="true"
          className="teal-u-grid teal-u-max-h-60 teal-u-min-h-24 teal-u-content-start teal-u-gap-0.5 teal-u-overflow-y-auto teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-p-1"
        >
          {list.length === 0 ? (
            <li
              role="option"
              aria-disabled="true"
              aria-selected={false}
              className="teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface-variant"
            >
              No options
            </li>
          ) : (
            list.map((option) => {
              const isSelected = selected[side].includes(option.value)
              return (
                <li
                  key={option.value}
                  ref={(node) => {
                    if (node) optionRefs.current.set(optionKey(side, option.value), node)
                    else optionRefs.current.delete(optionKey(side, option.value))
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={option.value === tabStop ? 0 : -1}
                  className={cn(
                    'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high aria-[disabled=true]:teal-u-pointer-events-none aria-[disabled=true]:teal-u-opacity-45',
                    isSelected && 'teal-u-bg-primary/10 teal-u-font-semibold teal-u-text-primary hover:teal-u-bg-primary/10',
                  )}
                  onClick={() => {
                    if (option.disabled) return
                    setFocusValues((current) => ({ ...current, [side]: option.value }))
                    toggleSelection(side, option.value)
                  }}
                  onKeyDown={(event) => handleOptionKeyDown(event, side, option)}
                >
                  <span className="teal-u-truncate">{option.label}</span>
                </li>
              )
            })
          )}
        </ul>
      </div>
    )
  }

  return (
    <div ref={ref} role="group" aria-label={ariaLabel} className={cn('teal-u-flex teal-u-items-center teal-u-gap-3', className)} {...props}>
      {renderList('source', sourceLabel)}
      <div className="teal-u-grid teal-u-shrink-0 teal-u-gap-2">
        <button
          type="button"
          aria-label={`Move selected to ${targetLabel}`}
          disabled={selected.source.length === 0}
          onClick={() => move('source')}
          className="teal-focus-ring teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-on-surface hover:teal-u-bg-surface-container-high disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-45"
        >
          <ChevronRight aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
        </button>
        <button
          type="button"
          aria-label={`Move selected to ${sourceLabel}`}
          disabled={selected.target.length === 0}
          onClick={() => move('target')}
          className="teal-focus-ring teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-on-surface hover:teal-u-bg-surface-container-high disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-45"
        >
          <ChevronLeft aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
        </button>
      </div>
      {renderList('target', targetLabel)}
    </div>
  )
})
