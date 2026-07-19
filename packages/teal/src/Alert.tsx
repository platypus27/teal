import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const alertVariants = cva('teal-raised-surface flex items-start gap-3 border p-4 text-sm shadow-none', {
  variants: {
    variant: {
      neutral: 'border-outline-variant/70 bg-surface-container-high text-on-surface',
      info: 'border-primary/40 bg-primary/10 text-on-surface',
      success: 'border-tertiary/40 bg-tertiary/10 text-on-surface',
      warning: 'border-warning/40 bg-warning/10 text-on-surface',
      danger: 'border-error/40 bg-error/10 text-on-surface',
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
  neutral: 'text-on-surface-variant',
  info: 'text-primary',
  success: 'text-tertiary',
  warning: 'text-warning',
  danger: 'text-error',
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
      <span aria-hidden="true" className={cn('mt-0.5 shrink-0 [&_svg]:size-5', variantIconClasses[resolvedVariant])}>
        {icon ?? <VariantIcon />}
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn('leading-relaxed text-on-surface-variant', title && 'mt-0.5')}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <IconButton label="Dismiss" size="sm" variant="ghost" className="-mr-1 -mt-1" onClick={onDismiss}>
          <X />
        </IconButton>
      ) : null}
    </div>
  )
})

export { alertVariants }
