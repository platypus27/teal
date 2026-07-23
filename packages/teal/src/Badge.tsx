import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'teal-u-box-border teal-u-inline-flex teal-u-items-center teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-px-[calc(0.625rem-1px)] teal-u-py-[calc(0.25rem-1px)] teal-u-text-xs teal-u-font-semibold teal-u-leading-none',
  {
    variants: {
      variant: {
        neutral: 'teal-u-border-outline-variant/55 teal-u-bg-surface-container-high teal-u-text-on-surface-variant',
        info: 'teal-u-border-primary/25 teal-u-bg-primary/10 teal-u-text-primary',
        success: 'teal-u-border-tertiary/25 teal-u-bg-tertiary/10 teal-u-text-tertiary',
        warning: 'teal-u-border-warning/25 teal-u-bg-warning/10 teal-u-text-warning',
        danger: 'teal-u-border-error/25 teal-u-bg-error/10 teal-u-text-error',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, variant, ...props }, ref) {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
})

export { badgeVariants }
