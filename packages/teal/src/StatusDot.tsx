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

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {
  /** Optional text rendered next to the dot. */
  label?: ReactNode
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { className, label, size, variant, ...props },
  ref,
) {
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
