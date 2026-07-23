import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const alertVariants = cva('teal-raised-surface teal-u-flex teal-u-items-start teal-u-gap-3 teal-u-border teal-u-p-4 teal-u-text-sm teal-u-shadow-none', {
  variants: {
    variant: {
      neutral: 'teal-u-border-outline-variant/70 teal-u-bg-surface-container-high teal-u-text-on-surface',
      info: 'teal-u-border-primary/40 teal-u-bg-primary/10 teal-u-text-on-surface',
      success: 'teal-u-border-tertiary/40 teal-u-bg-tertiary/10 teal-u-text-on-surface',
      warning: 'teal-u-border-warning/40 teal-u-bg-warning/10 teal-u-text-on-surface',
      danger: 'teal-u-border-error/40 teal-u-bg-error/10 teal-u-text-on-surface',
    },
  },
  defaultVariants: { variant: 'info' },
})

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

const variantIcons: Record<AlertVariant, typeof Info> = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: CircleAlert,
}

const variantIconClasses: Record<AlertVariant, string> = {
  neutral: 'teal-u-text-on-surface-variant',
  info: 'teal-u-text-primary',
  success: 'teal-u-text-tertiary',
  warning: 'teal-u-text-warning',
  danger: 'teal-u-text-error',
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  /** Icon override; defaults to the variant's standard icon. Always hidden from assistive technology. */
  icon?: ReactNode
  /** Renders a dismiss button and calls this when it is pressed. */
  onDismiss?: () => void
  /** Bold leading text of the alert. */
  title?: ReactNode
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { children, className, icon, onDismiss, title, variant, ...props },
  ref,
) {
  const resolvedVariant = variant ?? 'info'
  const VariantIcon = variantIcons[resolvedVariant]
  return (
    <div
      ref={ref}
      role={resolvedVariant === 'danger' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span aria-hidden="true" className={cn('teal-u-mt-0.5 teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-md)]', variantIconClasses[resolvedVariant])}>
        {icon ?? <VariantIcon />}
      </span>
      <div className="teal-u-min-w-0 teal-u-flex-1">
        {title ? <p className="teal-u-font-semibold">{title}</p> : null}
        {children ? <div className={cn('teal-u-leading-relaxed teal-u-text-on-surface-variant', title && 'teal-u-mt-0.5')}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <IconButton label="Dismiss" size="sm" variant="ghost" className="-teal-u-mr-1 -teal-u-mt-1" onClick={onDismiss}>
          <X />
        </IconButton>
      ) : null}
    </div>
  )
})

export { alertVariants }
