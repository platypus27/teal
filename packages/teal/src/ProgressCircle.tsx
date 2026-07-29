import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface ProgressCircleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Completion percentage between 0 and 100. Omit for an indeterminate spinner. */
  value?: number
  /** Diameter of the circle in pixels. */
  size?: number
  /** Width of the track and fill strokes in pixels. */
  strokeWidth?: number
  /** Accessible name applied as `aria-label`. */
  label?: string
}

export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
  { className, label, size = 48, strokeWidth = 5, value, ...props },
  ref,
) {
  const determinate = value !== undefined
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : undefined
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      {...(clamped !== undefined
        ? { 'aria-valuenow': Math.round(clamped), 'aria-valuemin': 0, 'aria-valuemax': 100 }
        : {})}
      className={cn('teal-u-relative teal-u-inline-flex teal-u-items-center teal-u-justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn('-teal-u-rotate-90', !determinate && 'teal-progress-spin')}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="teal-u-stroke-outline-variant/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          {...(clamped !== undefined
            ? { strokeDasharray: circumference, strokeDashoffset: circumference * (1 - clamped / 100) }
            : { pathLength: 100 })}
          className={
            determinate
              ? 'teal-u-stroke-primary teal-u-transition-[stroke-dashoffset] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none'
              : 'teal-u-stroke-primary teal-progress-dash'
          }
        />
      </svg>
      {clamped !== undefined ? (
        <span
          aria-hidden="true"
          className="teal-u-absolute teal-u-inset-0 teal-u-grid teal-u-place-items-center teal-u-font-headline teal-u-text-xs teal-u-font-bold teal-u-tabular-nums teal-u-text-on-surface"
        >
          {Math.round(clamped)}%
        </span>
      ) : null}
    </div>
  )
})
