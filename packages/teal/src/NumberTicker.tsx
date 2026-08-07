import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface NumberTickerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Animation length in milliseconds. */
  duration?: number
  /** Formats the animated value for display. */
  formatter?: (value: number) => string
  /** Called when the animation reaches the target value. */
  onComplete?: () => void
  /** Value the first animation starts from; later animations start from the current value. */
  startValue?: number
  /** Target value to count to. */
  value: number
}

function defaultFormatter(value: number) {
  return Math.round(value).toLocaleString()
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(function NumberTicker(
  { className, duration = 1000, formatter = defaultFormatter, onComplete, startValue = 0, value, ...props },
  ref,
) {
  const [display, setDisplay] = useState(startValue)
  const displayRef = useRef(startValue)

  function updateDisplay(next: number) {
    displayRef.current = next
    setDisplay(next)
  }

  useEffect(() => {
    const from = displayRef.current
    if (from === value) return

    if (duration <= 0 || prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
      updateDisplay(value)
      onComplete?.()
      return
    }

    let start: number | null = null
    let frame = 0
    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min(1, (timestamp - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      updateDisplay(from + (value - from) * eased)
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      } else {
        updateDisplay(value)
        onComplete?.()
      }
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // displayRef tracks the animated value; re-run only when the target or timing changes.
  }, [value, duration, onComplete])

  return (
    <span ref={ref} className={cn('teal-u-tabular-nums', className)} {...props}>
      {formatter(display)}
    </span>
  )
})
