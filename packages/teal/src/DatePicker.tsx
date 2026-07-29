import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { Input } from './Input'

export interface DatePickerProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial selected date when uncontrolled. */
  defaultValue?: Date
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Latest selectable date (inclusive). */
  maxDate?: Date
  /** Earliest selectable date (inclusive). */
  minDate?: Date
  /** Called with the selected date. */
  onValueChange?: (date: Date | undefined) => void
  /** Text shown when no date is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled selected date. */
  value?: Date
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

/** Six weeks covering the visible month, starting on Sunday. */
function getMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
// 2024-01-07 is a Sunday, so this yields locale weekday names starting Sunday.
const weekdayNames = Array.from({ length: 7 }, (_, index) =>
  weekdayFormatter.format(addDays(new Date(2024, 0, 7), index)),
)

const arrowDeltas: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
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
    placeholder = 'Pick a date',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-date-picker',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const calendarId = `${semantics.controlId}-calendar`

  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const selected = value !== undefined ? value : internalValue

  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState<Date>(() => selected ?? new Date())
  const [focusedDate, setFocusedDate] = useState<Date>(() => selected ?? new Date())
  const shouldFocusDay = useRef(false)
  const suppressFocusOpen = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function setInputRef(node: HTMLInputElement | null) {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  useEffect(() => {
    if (!open || !shouldFocusDay.current) return
    shouldFocusDay.current = false
    // Defer past the pointer interaction that opened the picker; focusing the
    // day synchronously here is overwritten when the input's focus() completes.
    queueMicrotask(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(focusedDate)}"]`)?.focus()
    })
  }, [open, focusedDate, viewMonth])

  function isDayDisabled(day: Date) {
    const time = startOfDay(day).getTime()
    if (minDate !== undefined && time < startOfDay(minDate).getTime()) return true
    if (maxDate !== undefined && time > startOfDay(maxDate).getTime()) return true
    return false
  }

  function openPicker() {
    if (disabled) return
    const base = selected ?? new Date()
    setViewMonth(addMonths(base, 0))
    setFocusedDate(base)
    shouldFocusDay.current = true
    setOpen(true)
  }

  function selectDay(day: Date) {
    if (isDayDisabled(day)) return
    if (value === undefined) setInternalValue(day)
    onValueChange?.(day)
    setOpen(false)
    suppressFocusOpen.current = true
    inputRef.current?.focus()
  }

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = arrowDeltas[event.key]
    if (delta === undefined) return
    event.preventDefault()
    const next = addDays(focusedDate, delta)
    setFocusedDate(next)
    if (next.getMonth() !== viewMonth.getMonth() || next.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(next)
    }
    shouldFocusDay.current = true
  }

  const days = getMonthGrid(viewMonth)
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
              aria-controls={calendarId}
              aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
              aria-invalid={invalid}
              autoComplete="off"
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              readOnly
              value={selected ? selected.toLocaleDateString() : ''}
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
            id={calendarId}
            align="start"
            side="bottom"
            sideOffset={6}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-3 teal-u-text-on-surface teal-u-outline-none"
          >
            <div ref={gridRef} onKeyDown={handleGridKeyDown}>
              <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
                <IconButton label="Previous month" size="sm" onClick={() => setViewMonth(addMonths(viewMonth, -1))}>
                  <ChevronLeft aria-hidden="true" />
                </IconButton>
                <span aria-live="polite" className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
                  {monthFormatter.format(viewMonth)}
                </span>
                <IconButton label="Next month" size="sm" onClick={() => setViewMonth(addMonths(viewMonth, 1))}>
                  <ChevronRight aria-hidden="true" />
                </IconButton>
              </div>
              <div className="teal-u-grid teal-u-grid-cols-7 teal-u-justify-items-center">
                {weekdayNames.map((name, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className="teal-u-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface-variant"
                  >
                    {name}
                  </span>
                ))}
                {days.map((day) => {
                  const isSelected = selected !== undefined && isSameDay(day, selected)
                  const isToday = isSameDay(day, today)
                  const isOutsideMonth = day.getMonth() !== viewMonth.getMonth()
                  const isDisabled = isDayDisabled(day)
                  return (
                    <button
                      key={dateKey(day)}
                      type="button"
                      data-date={dateKey(day)}
                      tabIndex={isSameDay(day, focusedDate) ? 0 : -1}
                      disabled={isDisabled}
                      aria-pressed={isSelected || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      onFocus={() => setFocusedDate(day)}
                      onClick={() => selectDay(day)}
                      className={cn(
                        'teal-focus-ring teal-u-box-border teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40',
                        isOutsideMonth && 'teal-u-text-on-surface-variant/50',
                        isToday && 'teal-u-border teal-u-border-solid teal-u-border-primary',
                        isSelected && 'teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90',
                      )}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
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
