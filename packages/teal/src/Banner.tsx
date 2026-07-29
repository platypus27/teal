import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const bannerVariants = cva(
  'teal-u-flex teal-u-w-full teal-u-items-start teal-u-gap-3 teal-u-rounded-2xl teal-u-border teal-u-border-l-4 teal-u-p-4 teal-u-text-sm sm:teal-u-p-5',
  {
    variants: {
      variant: {
        info: 'teal-u-border-primary/40 teal-u-border-l-primary teal-u-bg-primary/10 teal-u-text-on-surface',
        success: 'teal-u-border-tertiary/40 teal-u-border-l-tertiary teal-u-bg-tertiary/10 teal-u-text-on-surface',
        warning: 'teal-u-border-warning/40 teal-u-border-l-warning teal-u-bg-warning/10 teal-u-text-on-surface',
        danger: 'teal-u-border-error/40 teal-u-border-l-error teal-u-bg-error/10 teal-u-text-on-surface',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof bannerVariants> {
  /** Bold leading text of the banner. */
  title?: ReactNode
  /** Optional action (for example a Button) rendered at the trailing edge of the strip. */
  action?: ReactNode
  /** Renders a dismiss button and calls this when it is pressed. */
  onDismiss?: () => void
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { action, children, className, onDismiss, title, variant, ...props },
  ref,
) {
  const resolvedVariant = variant ?? 'info'
  return (
    <div
      ref={ref}
      role={resolvedVariant === 'danger' ? 'alert' : 'status'}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      <div className="teal-u-min-w-0 teal-u-flex-1">
        {title ? <p className="teal-u-font-headline teal-u-font-bold">{title}</p> : null}
        {children ? (
          <div className={cn('teal-u-leading-relaxed teal-u-text-on-surface-variant', title && 'teal-u-mt-0.5')}>
            {children}
          </div>
        ) : null}
      </div>
      {action ? <div className="teal-u-shrink-0">{action}</div> : null}
      {onDismiss ? (
        <IconButton label="Dismiss" size="sm" variant="ghost" className="-teal-u-mr-1 -teal-u-mt-1" onClick={onDismiss}>
          <X />
        </IconButton>
      ) : null}
    </div>
  )
})

export { bannerVariants }
