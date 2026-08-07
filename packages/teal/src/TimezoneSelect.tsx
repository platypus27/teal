import { forwardRef, type ReactNode } from 'react'
import { Combobox, type ComboboxOption } from './Combobox'

/** Curated set of common IANA zones covering every populated UTC offset. */
const zoneIds = [
  'Pacific/Auckland',
  'Australia/Sydney',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Jerusalem',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Europe/Athens',
  'Europe/Stockholm',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/London',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Johannesburg',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Mexico_City',
  'America/Bogota',
  'America/Toronto',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Vancouver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'UTC',
]

function formatOffset(timeZone: string, date: Date) {
  if (timeZone === 'UTC') return 'UTC±00:00'
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(date)
  const raw = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT'
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(raw)
  if (!match) return 'UTC±00:00'
  const sign = match[1] ?? '+'
  const hours = (match[2] ?? '0').padStart(2, '0')
  const minutes = match[3] ?? '00'
  return `UTC${sign}${hours}:${minutes}`
}

function cityName(zoneId: string) {
  const last = zoneId.split('/').pop() ?? zoneId
  return last.replaceAll('_', ' ')
}

// Offsets are computed once against the current date, so zones observe their
// daylight-saving offset for the day the page loaded.
const now = new Date()
const options: ComboboxOption[] = zoneIds.map((zoneId) => ({
  value: zoneId,
  label: `${cityName(zoneId)} (${formatOffset(zoneId, now)})`,
}))

export interface TimezoneSelectProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial IANA zone id when uncontrolled. */
  defaultValue?: string
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Message shown when no timezone matches the typed text. */
  emptyMessage?: ReactNode
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the IANA zone id of the selected timezone. */
  onValueChange?: (value: string) => void
  /** Text shown when no timezone is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled IANA zone id, e.g. "America/New_York". */
  value?: string
}

export const TimezoneSelect = forwardRef<HTMLInputElement, TimezoneSelectProps>(function TimezoneSelect(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    emptyMessage = 'No matching time zones',
    id,
    label,
    onValueChange,
    placeholder = 'Select a time zone',
    required,
    value,
  },
  ref,
) {
  return (
    <Combobox
      ref={ref}
      {...(describedBy !== undefined ? { 'aria-describedby': describedBy } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(invalid !== undefined ? { 'aria-invalid': invalid } : {})}
      {...(className !== undefined ? { className } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(description !== undefined ? { description } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
      {...(id !== undefined ? { id } : {})}
      {...(label !== undefined ? { label } : {})}
      {...(onValueChange !== undefined ? { onValueChange } : {})}
      {...(required !== undefined ? { required } : {})}
      {...(value !== undefined ? { value } : {})}
      emptyMessage={emptyMessage}
      options={options}
      placeholder={placeholder}
    />
  )
})
