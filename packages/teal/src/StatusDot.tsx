import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const statusDotVariants = cva('teal-u-inline-block teal-u-shrink-0 teal-u-rounded-full', {
  variants: {
    variant: {
      success: 'teal-u-bg-tertiary',
      warning: 'teal-u-bg-warning',
      danger: 'teal-u-bg-error',
      neutral: 'teal-u-bg-on-surface-variant',
      info: 'teal-u-bg-primary',
    },
    size: {
      sm: 'teal-u-size-1.5',
      md: 'teal-u-size-2',
      lg: 'teal-u-size-2.5',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'md' },
})

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

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {
  /** Optional text rendered next to the dot. In pulse mode it becomes the accessible label (default `'Live'`). */
  label?: ReactNode
  /** Render as an animated pulsing dot for live presence or ongoing activity. */
  pulse?: boolean
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { className, label, pulse = false, size, variant, ...props },
  ref,
) {
  if (pulse) {
    const pulseVariant = variant ?? 'success'
    const pulseSize = size ?? 'md'
    return (
      <span
        ref={ref}
        role="status"
        aria-label={typeof label === 'string' ? label : 'Live'}
        className={cn('teal-u-relative teal-u-inline-flex teal-u-items-center teal-u-justify-center', sizeClasses[pulseSize], className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'teal-u-absolute teal-u-inline-flex teal-u-h-full teal-u-w-full teal-u-rounded-full teal-u-opacity-60 teal-u-animate-ping motion-reduce:teal-u-animate-none',
            variantClasses[pulseVariant],
          )}
        />
        <span
          aria-hidden="true"
          className={cn('teal-u-relative teal-u-inline-flex teal-u-h-full teal-u-w-full teal-u-rounded-full', variantClasses[pulseVariant])}
        />
      </span>
    )
  }

  return (
    <span
      ref={ref}
      // Icon-only usage relies on an aria-label, which a roleless span may not carry.
      role={label ? undefined : 'img'}
      className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-1.5 teal-u-text-sm teal-u-text-on-surface', className)}
      {...props}
    >
      <span aria-hidden="true" className={statusDotVariants({ size, variant })} />
      {label ? <span>{label}</span> : null}
    </span>
  )
})

export { statusDotVariants }
