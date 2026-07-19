import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'box-border inline-flex items-center rounded-full border border-solid px-[calc(0.625rem-1px)] py-[calc(0.25rem-1px)] text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        neutral: 'border-outline-variant/55 bg-surface-container-high text-on-surface-variant',
        info: 'border-primary/25 bg-primary/10 text-primary',
        success: 'border-tertiary/25 bg-tertiary/10 text-tertiary',
        warning: 'border-warning/25 bg-warning/10 text-warning',
        danger: 'border-error/25 bg-error/10 text-error',
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
