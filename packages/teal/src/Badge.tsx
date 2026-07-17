import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-container-high text-on-surface-variant',
        info: 'bg-primary/10 text-primary',
        success: 'bg-tertiary/10 text-tertiary',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-error/10 text-error',
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
