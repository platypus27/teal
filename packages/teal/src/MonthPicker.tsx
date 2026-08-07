import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { Input } from './Input'

export interface MonthPickerProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial selected month when uncontrolled; the day is always the first. */
  defaultValue?: Date
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Latest selectable month (inclusive). */
  maxDate?: Date
  /** Earliest selectable month (inclusive). */
  minDate?: Date
  /** Called with the first day of the selected month. */
  onValueChange?: (date: Date | undefined) => void
  /** Text shown when no month is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled selected month; only the year and month are significant. */
  value?: Date
}

const monthShortFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' })
const monthYearFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const monthNames = Array.from({ length: 12 }, (_, index) => monthShortFormatter.format(new Date(2024, index, 1)))

const arrowDeltas: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -3,
  ArrowDown: 3,
}

function monthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth()
}

export const MonthPicker = forwardRef<HTMLInputElement, MonthPickerProps>(function MonthPicker(
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
    placeholder = 'Pick a month',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-month-picker',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const popoverId = `${semantics.controlId}-popover`

  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const selected = value !== undefined ? value : internalValue

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => (selected ?? new Date()).getFullYear())
  const [focusedMonth, setFocusedMonth] = useState(() => (selected ?? new Date()).getMonth())
  const shouldFocusMonth = useRef(false)
  const suppressFocusOpen = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function setInputRef(node: HTMLInputElement | null) {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  useEffect(() => {
    if (!open || !shouldFocusMonth.current) return
    shouldFocusMonth.current = false
    queueMicrotask(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-month="${focusedMonth}"]`)?.focus()
    })
  }, [open, focusedMonth, viewYear])

  function isMonthDisabled(month: number) {
    const index = viewYear * 12 + month
    if (minDate !== undefined && index < monthIndex(minDate)) return true
    if (maxDate !== undefined && index > monthIndex(maxDate)) return true
    return false
  }

  function openPicker() {
    if (disabled) return
    const base = selected ?? new Date()
    setViewYear(base.getFullYear())
    setFocusedMonth(base.getMonth())
    shouldFocusMonth.current = true
    setOpen(true)
  }

  function selectMonth(month: number) {
    if (isMonthDisabled(month)) return
    const next = new Date(viewYear, month, 1)
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
    setOpen(false)
    suppressFocusOpen.current = true
    inputRef.current?.focus()
  }

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number | undefined
    const delta = arrowDeltas[event.key]
    if (delta !== undefined) next = Math.min(11, Math.max(0, focusedMonth + delta))
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = 11
    if (next === undefined) return
    event.preventDefault()
    setFocusedMonth(next)
    shouldFocusMonth.current = true
  }

  const today = new Date()

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
              value={selected ? monthYearFormatter.format(selected) : ''}
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
              <IconButton label="Previous year" size="sm" onClick={() => setViewYear(viewYear - 1)}>
                <ChevronLeft aria-hidden="true" />
              </IconButton>
              <span aria-live="polite" className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
                {viewYear}
              </span>
              <IconButton label="Next year" size="sm" onClick={() => setViewYear(viewYear + 1)}>
                <ChevronRight aria-hidden="true" />
              </IconButton>
            </div>
            <div ref={gridRef} role="group" aria-label="Months" onKeyDown={handleGridKeyDown} className="teal-u-grid teal-u-grid-cols-3 teal-u-gap-1">
              {monthNames.map((name, month) => {
                const isSelected = selected !== undefined && selected.getFullYear() === viewYear && selected.getMonth() === month
                const isCurrent = today.getFullYear() === viewYear && today.getMonth() === month
                const isDisabled = isMonthDisabled(month)
                return (
                  <button
                    key={name}
                    type="button"
                    data-month={month}
                    tabIndex={month === focusedMonth ? 0 : -1}
                    disabled={isDisabled}
                    aria-pressed={isSelected || undefined}
                    aria-current={isCurrent ? 'date' : undefined}
                    onFocus={() => setFocusedMonth(month)}
                    onClick={() => selectMonth(month)}
                    className={cn(
                      'teal-focus-ring teal-u-inline-flex teal-u-h-9 teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-px-3 teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40',
                      !isSelected && 'teal-u-text-on-surface',
                      isCurrent && 'teal-u-border teal-u-border-solid teal-u-border-primary',
                      isSelected && 'teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90',
                    )}
                  >
                    {name}
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
