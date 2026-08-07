import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { VisuallyHidden } from './VisuallyHidden'

export interface CountdownParts {
  /** Whole days remaining. */
  days: number
  /** Whole hours remaining after the days, 0-23. */
  hours: number
  /** Whole minutes remaining after the hours, 0-59. */
  minutes: number
  /** Whole seconds remaining after the minutes, 0-59. */
  seconds: number
  /** Total milliseconds remaining, clamped at 0. */
  total: number
  /** Whether the target has been reached. */
  completed: boolean
}

export interface CountdownTimerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Custom renderer receiving the remaining time parts; defaults to `HH:MM:SS`. */
  children?: (parts: CountdownParts) => ReactNode
  /** Message announced politely to screen readers when the countdown completes. */
  completionMessage?: string
  /** Update interval in milliseconds. */
  interval?: number
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void
  /** Point in time to count down to. */
  targetDate: Date | number | string
}

function toMs(target: Date | number | string) {
  return target instanceof Date ? target.getTime() : new Date(target).getTime()
}

function getParts(targetMs: number, nowMs: number): CountdownParts {
  const total = Math.max(0, targetMs - nowMs)
  const wholeSeconds = Math.floor(total / 1000)
  const days = Math.floor(wholeSeconds / 86400)
  const hours = Math.floor((wholeSeconds % 86400) / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const seconds = wholeSeconds % 60
  return { days, hours, minutes, seconds, total, completed: total <= 0 }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function defaultFormat(parts: CountdownParts) {
  const time = `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`
  return parts.days > 0 ? `${parts.days}d ${time}` : time
}

export const CountdownTimer = forwardRef<HTMLSpanElement, CountdownTimerProps>(function CountdownTimer(
  { children, className, completionMessage = 'Countdown complete', interval = 1000, onComplete, targetDate, ...props },
  ref,
) {
  const targetMs = toMs(targetDate)
  const [now, setNow] = useState(() => Date.now())
  const completedRef = useRef(false)
  const parts = getParts(targetMs, now)

  // A moved future target re-arms the completion callback.
  useEffect(() => {
    if (targetMs > Date.now()) completedRef.current = false
  }, [targetMs])

  useEffect(() => {
    if (targetMs - Date.now() <= 0) {
      if (!completedRef.current) {
        completedRef.current = true
        setNow(Date.now())
        onComplete?.()
      }
      return
    }

    const id = setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (targetMs - current <= 0) {
        clearInterval(id)
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      }
    }, interval)
    return () => clearInterval(id)
  }, [interval, onComplete, targetMs])

  return (
    <span ref={ref} className={cn('teal-u-tabular-nums', className)} {...props}>
      {children ? children(parts) : defaultFormat(parts)}
      {parts.completed ? <VisuallyHidden role="status">{completionMessage}</VisuallyHidden> : null}
    </span>
  )
})
