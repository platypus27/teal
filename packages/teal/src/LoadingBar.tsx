import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface LoadingBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value between 0 and `max`. Omit for indeterminate mode. */
  value?: number
  /** Maximum value. */
  max?: number
  /** Accessible label announced by screen readers. */
  label?: string
}

export const LoadingBar = forwardRef<HTMLDivElement, LoadingBarProps>(function LoadingBar(
  { className, label = 'Loading', max = 100, value, ...props },
  ref,
) {
  const determinate = value !== undefined
  const clamped = determinate ? Math.min(max, Math.max(0, value)) : undefined
  const percentage = clamped !== undefined && max > 0 ? (clamped / max) * 100 : 0

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      {...(clamped !== undefined ? { 'aria-valuenow': Math.round(clamped), 'aria-valuemin': 0, 'aria-valuemax': max } : {})}
      className={cn('teal-u-fixed teal-u-inset-x-0 teal-u-top-0 teal-u-z-50 teal-u-h-0.5 teal-u-overflow-hidden teal-u-bg-primary/15', className)}
      {...props}
    >
      <div
        className={cn(
          'teal-u-h-full teal-u-rounded-full teal-u-bg-primary',
          determinate
            ? 'teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none'
            : 'teal-u-w-1/3 teal-u-animate-pulse motion-reduce:teal-u-animate-none',
        )}
        style={determinate ? { width: `${percentage}%` } : undefined}
      />
    </div>
  )
})
