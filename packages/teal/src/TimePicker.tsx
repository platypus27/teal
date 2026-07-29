import { forwardRef, useState, type FocusEvent, type HTMLAttributes } from 'react'
import { cn } from './cn'
import { fieldVariants } from './Input'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function parseTime(value: string | undefined) {
  if (value === undefined) return undefined
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return undefined
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return undefined
  return { hour, minute }
}

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Initial time in "HH:mm" (24h) when uncontrolled. Defaults to "00:00". */
  defaultValue?: string
  /** Prevents interaction with every field. */
  disabled?: boolean
  /** 12 shows a 1–12 hour field with an AM/PM toggle; 24 shows a 0–23 hour field. */
  hourCycle?: 12 | 24
  /** Accessible name for the time field group. */
  label?: string
  /** Called with the 24-hour "HH:mm" value after every valid edit. */
  onChange?: (value: string) => void
  /** Controlled time in "HH:mm" (24h). */
  value?: string
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  { className, defaultValue, disabled = false, hourCycle = 24, label = 'Time', onChange, value, ...props },
  ref,
) {
  const [internalTime, setInternalTime] = useState(() => parseTime(defaultValue) ?? { hour: 0, minute: 0 })
  const time = (value !== undefined ? parseTime(value) : undefined) ?? internalTime
  const [hourDraft, setHourDraft] = useState<string | null>(null)
  const [minuteDraft, setMinuteDraft] = useState<string | null>(null)

  const is12h = hourCycle === 12
  const period = time.hour < 12 ? 'AM' : 'PM'
  const displayHour = is12h ? time.hour % 12 || 12 : time.hour

  function commit(hour: number, minute: number) {
    if (value === undefined) setInternalTime({ hour, minute })
    onChange?.(`${pad(hour)}:${pad(minute)}`)
  }

  function handleHourChange(raw: string) {
    if (!/^\d*$/.test(raw)) return
    if (raw === '') {
      setHourDraft('')
      return
    }
    const maxHour = is12h ? 12 : 23
    const typed = Math.min(maxHour, Number(raw))
    setHourDraft(String(typed))
    const hour24 = is12h ? (period === 'AM' ? typed % 12 : (typed % 12) + 12) : typed
    commit(hour24, time.minute)
  }

  function handleMinuteChange(raw: string) {
    if (!/^\d*$/.test(raw)) return
    if (raw === '') {
      setMinuteDraft('')
      return
    }
    const minute = Math.min(59, Number(raw))
    setMinuteDraft(String(minute))
    commit(time.hour, minute)
  }

  function handlePeriod(next: 'AM' | 'PM') {
    if (next === period) return
    commit(next === 'AM' ? time.hour - 12 : time.hour + 12, time.minute)
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    event.currentTarget.select()
  }

  const fieldClasses = cn(fieldVariants(), 'teal-u-w-14 teal-u-min-h-10 teal-u-px-2 teal-u-text-center teal-u-tabular-nums')

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-2', className)}
      {...props}
    >
      <input
        type="text"
        inputMode="numeric"
        aria-label="Hour"
        disabled={disabled}
        value={hourDraft ?? pad(displayHour)}
        onChange={(event) => handleHourChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={() => setHourDraft(null)}
        className={fieldClasses}
      />
      <span aria-hidden="true" className="teal-u-font-semibold teal-u-text-on-surface-variant">
        :
      </span>
      <input
        type="text"
        inputMode="numeric"
        aria-label="Minutes"
        disabled={disabled}
        value={minuteDraft ?? pad(time.minute)}
        onChange={(event) => handleMinuteChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={() => setMinuteDraft(null)}
        className={fieldClasses}
      />
      {is12h ? (
        <div role="group" aria-label="Period" className="teal-u-inline-flex teal-u-items-center teal-u-gap-1">
          {(['AM', 'PM'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={period === option}
              disabled={disabled}
              onClick={() => handlePeriod(option)}
              className={cn(
                'teal-focus-ring teal-u-rounded-xl teal-u-px-3 teal-u-py-1.5 teal-u-text-xs teal-u-font-semibold disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-55',
                period === option
                  ? 'teal-u-bg-primary teal-u-text-on-primary'
                  : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
})
