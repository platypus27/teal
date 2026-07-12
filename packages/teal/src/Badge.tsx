import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { glassSurface } from './glass'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
  {
    variants: {
      tone: {
        neutral: 'text-on-surface-variant',
        info: 'text-primary',
        success: 'text-tertiary',
        warning: 'text-warning',
        danger: 'text-error',
      },
      glass: {
        true: glassSurface,
        false: '',
      },
    },
    compoundVariants: [
      { glass: false, tone: 'neutral', className: 'bg-surface-container-high' },
      { glass: false, tone: 'info', className: 'bg-primary/10' },
      { glass: false, tone: 'success', className: 'bg-tertiary/10' },
      { glass: false, tone: 'warning', className: 'bg-warning/10' },
      { glass: false, tone: 'danger', className: 'bg-error/10' },
    ],
    defaultVariants: { tone: 'neutral', glass: false },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, glass, tone, ...props }, ref) {
  return <span ref={ref} className={cn(badgeVariants({ tone, glass }), className)} {...props} />
})

export { badgeVariants }
