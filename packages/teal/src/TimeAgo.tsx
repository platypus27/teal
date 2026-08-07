import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface TimeAgoProps extends HTMLAttributes<HTMLTimeElement> {
  /** Point in time to describe, past or future. */
  date: Date | number | string
  /** Locale used for the relative label and the absolute title. */
  locale?: string
  /** How often the label refreshes, in milliseconds. */
  updateInterval?: number
}

const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

function formatRelative(dateMs: number, nowMs: number, locale: string) {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  let duration = (dateMs - nowMs) / 1000
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) return formatter.format(Math.round(duration), division.unit)
    duration /= division.amount
  }
  return formatter.format(Math.round(duration), 'year')
}

function toMs(date: Date | number | string) {
  return date instanceof Date ? date.getTime() : new Date(date).getTime()
}

export const TimeAgo = forwardRef<HTMLTimeElement, TimeAgoProps>(function TimeAgo(
  { className, date, locale = 'en', updateInterval = 60000, ...props },
  ref,
) {
  const dateMs = toMs(date)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), updateInterval)
    return () => clearInterval(id)
  }, [updateInterval])

  return (
    <time
      ref={ref}
      dateTime={new Date(dateMs).toISOString()}
      title={new Date(dateMs).toLocaleString(locale)}
      className={cn(className)}
      {...props}
    >
      {formatRelative(dateMs, now, locale)}
    </time>
  )
})
