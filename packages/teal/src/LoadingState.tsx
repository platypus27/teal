import { LoaderCircle } from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from './cn'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Accessible label announced by screen readers. */
  label?: string
  /** Diameter of the spinner. */
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, label = 'Loading', size = 'md', ...props },
  ref,
) {
  return (
    <span ref={ref} role="status" aria-label={label} className={cn('teal-u-inline-flex teal-u-text-primary', className)} {...props}>
      <LoaderCircle
        aria-hidden="true"
        className={cn(
          'teal-u-animate-spin motion-reduce:teal-u-animate-none',
          size === 'sm' && 'teal-u-size-[var(--teal-icon-sm)]',
          size === 'md' && 'teal-u-size-[var(--teal-icon-lg)]',
          size === 'lg' && 'teal-u-size-[var(--teal-icon-xl)]',
        )}
      />
    </span>
  )
})

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible label announced by screen readers while the region is loading. */
  label?: string
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(function LoadingState(
  { className, label = 'Loading', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(
        'teal-raised-surface teal-u-flex teal-u-min-h-60 teal-u-items-center teal-u-justify-center teal-u-border teal-u-bg-surface-container',
        className,
      )}
      {...props}
    >
      <LoaderCircle aria-hidden="true" className="teal-u-size-[var(--teal-icon-xl)] teal-u-animate-spin teal-u-text-primary motion-reduce:teal-u-animate-none" />
    </div>
  )
})

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('teal-u-animate-pulse teal-u-rounded-lg teal-u-bg-surface-container-highest motion-reduce:teal-u-animate-none', className)}
      {...props}
    />
  )
})

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Accessible label describing what the progress bar measures. */
  label: string
  /** Visual treatment: a linear bar, or a radial circle that spins when `value` is omitted. */
  shape?: 'bar' | 'circle'
  /** Diameter of the circle in pixels. Only applies when `shape="circle"`. */
  size?: number
  /** Width of the track and fill strokes in pixels. Only applies when `shape="circle"`. */
  strokeWidth?: number
}

export const Progress = forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(function Progress(
  { className, label, max = 100, value, shape = 'bar', size = 48, strokeWidth = 5, ...props },
  ref,
) {
  if (shape === 'circle') {
    const determinate = value !== undefined && value !== null
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
  }

  const percentage = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))
  return (
    <ProgressPrimitive.Root
      ref={ref}
      aria-label={label}
      max={max}
      value={value ?? 0}
      className={cn('teal-u-relative teal-u-h-2 teal-u-w-full teal-u-overflow-hidden teal-u-rounded-full teal-u-bg-surface-container-high', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="teal-u-h-full teal-u-w-full teal-u-bg-primary teal-u-transition-transform teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
