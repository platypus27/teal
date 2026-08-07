import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { Input } from './Input'

export interface YearPickerProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial selected year when uncontrolled; the month and day are always January 1. */
  defaultValue?: Date
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Latest selectable year (inclusive). */
  maxDate?: Date
  /** Earliest selectable year (inclusive). */
  minDate?: Date
  /** Called with January 1 of the selected year. */
  onValueChange?: (date: Date | undefined) => void
  /** Text shown when no year is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled selected year; only the year is significant. */
  value?: Date
}

/** Years shown per page; a 3 × 4 grid. Pages align to multiples of PAGE_SIZE so any visible year maps back to the same page. */
const PAGE_SIZE = 12

const arrowDeltas: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -3,
  ArrowDown: 3,
}

function pageStart(year: number) {
  return Math.floor(year / PAGE_SIZE) * PAGE_SIZE
}

export const YearPicker = forwardRef<HTMLInputElement, YearPickerProps>(function YearPicker(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
    maxDate,
    minDate,
    onValueChange,
    placeholder = 'Pick a year',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-year-picker',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const popoverId = `${semantics.controlId}-popover`

  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const selected = value !== undefined ? value : internalValue

  const [open, setOpen] = useState(false)
  const [focusedYear, setFocusedYear] = useState(() => (selected ?? new Date()).getFullYear())
  const shouldFocusYear = useRef(false)
  const suppressFocusOpen = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const startYear = pageStart(focusedYear)
  const years = Array.from({ length: PAGE_SIZE }, (_, index) => startYear + index)

  function setInputRef(node: HTMLInputElement | null) {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  useEffect(() => {
    if (!open || !shouldFocusYear.current) return
    shouldFocusYear.current = false
    queueMicrotask(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-year="${focusedYear}"]`)?.focus()
    })
  }, [open, focusedYear])

  function isYearDisabled(year: number) {
    if (minDate !== undefined && year < minDate.getFullYear()) return true
    if (maxDate !== undefined && year > maxDate.getFullYear()) return true
    return false
  }

  function openPicker() {
    if (disabled) return
    setFocusedYear((selected ?? new Date()).getFullYear())
    shouldFocusYear.current = true
    setOpen(true)
  }

  function selectYear(year: number) {
    if (isYearDisabled(year)) return
    const next = new Date(year, 0, 1)
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
    setOpen(false)
    suppressFocusOpen.current = true
    inputRef.current?.focus()
  }

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number | undefined
    const delta = arrowDeltas[event.key]
    if (delta !== undefined) next = focusedYear + delta
    else if (event.key === 'Home') next = startYear
    else if (event.key === 'End') next = startYear + PAGE_SIZE - 1
    if (next === undefined) return
    event.preventDefault()
    setFocusedYear(next)
    shouldFocusYear.current = true
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) openPicker()
          else setOpen(false)
        }}
      >
        <PopoverPrimitive.Anchor asChild>
          <div className="teal-u-relative">
            <Input
              ref={setInputRef}
              id={semantics.controlId}
              aria-label={ariaLabel}
              aria-haspopup="dialog"
              aria-controls={popoverId}
              aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
              aria-invalid={invalid}
              autoComplete="off"
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              readOnly
              value={selected ? String(selected.getFullYear()) : ''}
              className="teal-u-cursor-pointer teal-u-pr-9"
              onFocus={() => {
                if (suppressFocusOpen.current) {
                  suppressFocusOpen.current = false
                  return
                }
                if (!open) openPicker()
              }}
              onClick={() => {
                if (!open) openPicker()
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && !open) {
                  event.preventDefault()
                  openPicker()
                }
              }}
            />
            <Calendar
              aria-hidden="true"
              className="teal-u-pointer-events-none teal-u-absolute teal-u-right-3 teal-u-top-1/2 teal-u-size-[var(--teal-icon-sm)] teal-u--translate-y-1/2 teal-u-text-on-surface-variant"
            />
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            id={popoverId}
            align="start"
            side="bottom"
            sideOffset={6}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-3 teal-u-text-on-surface teal-u-outline-none"
          >
            <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
              <IconButton label="Previous decade" size="sm" onClick={() => setFocusedYear(focusedYear - 10)}>
                <ChevronLeft aria-hidden="true" />
              </IconButton>
              <span aria-live="polite" className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
                {years[0]} – {years[years.length - 1]}
              </span>
              <IconButton label="Next decade" size="sm" onClick={() => setFocusedYear(focusedYear + 10)}>
                <ChevronRight aria-hidden="true" />
              </IconButton>
            </div>
            <div ref={gridRef} role="group" aria-label="Years" onKeyDown={handleGridKeyDown} className="teal-u-grid teal-u-grid-cols-3 teal-u-gap-1">
              {years.map((year) => {
                const isSelected = selected !== undefined && selected.getFullYear() === year
                const isCurrent = year === currentYear
                const isDisabled = isYearDisabled(year)
                return (
                  <button
                    key={year}
                    type="button"
                    data-year={year}
                    tabIndex={year === focusedYear ? 0 : -1}
                    disabled={isDisabled}
                    aria-pressed={isSelected || undefined}
                    aria-current={isCurrent ? 'date' : undefined}
                    onFocus={() => setFocusedYear(year)}
                    onClick={() => selectYear(year)}
                    className={cn(
                      'teal-focus-ring teal-u-inline-flex teal-u-h-9 teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-px-3 teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40',
                      !isSelected && 'teal-u-text-on-surface',
                      isCurrent && 'teal-u-border teal-u-border-solid teal-u-border-primary',
                      isSelected && 'teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90',
                    )}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
