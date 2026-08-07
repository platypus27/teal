import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

const variantClasses = {
  success: 'teal-u-bg-tertiary',
  warning: 'teal-u-bg-warning',
  danger: 'teal-u-bg-error',
  neutral: 'teal-u-bg-on-surface-variant',
  info: 'teal-u-bg-primary',
}

const sizeClasses = {
  sm: 'teal-u-size-1.5',
  md: 'teal-u-size-2',
  lg: 'teal-u-size-2.5',
}

export interface PulseDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Accessible label describing the live state, for example "3 editors online". */
  label?: string
  /** Size of the dot. */
  size?: 'sm' | 'md' | 'lg'
  /** Semantic color of the dot. */
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info'
}

export const PulseDot = forwardRef<HTMLSpanElement, PulseDotProps>(function PulseDot(
  { className, label = 'Live', size = 'md', variant = 'success', ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn('teal-u-relative teal-u-inline-flex teal-u-items-center teal-u-justify-center', sizeClasses[size], className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'teal-u-absolute teal-u-inline-flex teal-u-h-full teal-u-w-full teal-u-rounded-full teal-u-opacity-60 teal-u-animate-ping motion-reduce:teal-u-animate-none',
          variantClasses[variant],
        )}
      />
      <span
        aria-hidden="true"
        className={cn('teal-u-relative teal-u-inline-flex teal-u-h-full teal-u-w-full teal-u-rounded-full', variantClasses[variant])}
      />
    </span>
  )
})
