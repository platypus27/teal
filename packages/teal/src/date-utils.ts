/** Two-digit zero-padding for time fields. */
export function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

/** Stable `data-date` key, e.g. 2024-0-15 (month is 0-based). */
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

/** Six weeks covering the visible month, starting on Sunday. */
export function getMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/** Arrow-key day deltas for a 7-column day grid. */
export const arrowDeltas: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })

export const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

// 2024-01-07 is a Sunday; formatting one week yields localized weekday names.
export const weekdayNames = Array.from({ length: 7 }, (_, i) =>
  weekdayFormatter.format(addDays(new Date(2024, 0, 7), i)),
)
