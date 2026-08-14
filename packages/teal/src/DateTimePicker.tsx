import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Calendar } from 'lucide-react'
import { Button } from './Button'
import { cn } from './cn'
import { addDays, addMonths, arrowDeltas, dateKey, pad, startOfDay } from './date-utils'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { Input } from './Input'
import { MonthGrid } from './MonthGrid'
import { TimePicker } from './TimePicker'

export interface DateTimePickerProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial selected date and time when uncontrolled. */
  defaultValue?: Date
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** 12 shows a 1–12 hour field with an AM/PM toggle; 24 shows a 0–23 hour field. */
  hourCycle?: 12 | 24
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Latest selectable date (inclusive); applies to the date portion only. */
  maxDate?: Date
  /** Earliest selectable date (inclusive); applies to the date portion only. */
  minDate?: Date
  /** Called with the combined date and time whenever either part changes. */
  onValueChange?: (date: Date | undefined) => void
  /** Text shown when no date and time is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled selected date and time. */
  value?: Date
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    hourCycle = 24,
    id,
    label,
    maxDate,
    minDate,
    onValueChange,
    placeholder = 'Pick a date and time',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-date-time-picker',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const popoverId = `${semantics.controlId}-popover`

  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const selected = value !== undefined ? value : internalValue

  // Draft time used before any date is chosen; a picked day keeps this time.
  const [draftTime, setDraftTime] = useState(() => {
    const base = selected ?? new Date()
    return { hour: base.getHours(), minute: base.getMinutes() }
  })
  const time = selected ? { hour: selected.getHours(), minute: selected.getMinutes() } : draftTime

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
    const timeMs = startOfDay(day).getTime()
    if (minDate !== undefined && timeMs < startOfDay(minDate).getTime()) return true
    if (maxDate !== undefined && timeMs > startOfDay(maxDate).getTime()) return true
    return false
  }

  function commit(date: Date) {
    if (value === undefined) setInternalValue(date)
    onValueChange?.(date)
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
    // The popover stays open so the time can be adjusted before Done.
    commit(new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hour, time.minute))
  }

  function handleTimeChange(raw: string) {
    const match = /^(\d{2}):(\d{2})$/.exec(raw)
    if (!match) return
    const hour = Number(match[1])
    const minute = Number(match[2])
    setDraftTime({ hour, minute })
    if (selected) {
      commit(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), hour, minute))
    }
  }

  function closePicker() {
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
              value={selected ? selected.toLocaleString() : ''}
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
            <div ref={gridRef}>
              <MonthGrid
                keyboard
                month={viewMonth}
                onMonthChange={setViewMonth}
                onSelect={selectDay}
                selected={selected ?? null}
                focusedDate={focusedDate}
                onFocusDay={setFocusedDate}
                onKeyDown={handleGridKeyDown}
                isDayDisabled={isDayDisabled}
              />
            </div>
            <div className="teal-u-mt-3 teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-3 teal-u-border-t teal-u-border-solid teal-u-border-outline-variant/30 teal-u-pt-3">
              <TimePicker
                label="Time"
                hourCycle={hourCycle}
                value={`${pad(time.hour)}:${pad(time.minute)}`}
                onChange={handleTimeChange}
              />
              <Button variant="secondary" size="sm" onClick={closePicker}>
                Done
              </Button>
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
