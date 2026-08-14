import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const alertVariants = cva('teal-u-flex teal-u-items-start teal-u-gap-3 teal-u-border teal-u-text-sm', {
  variants: {
    variant: {
      neutral: '',
      info: '',
      success: '',
      warning: '',
      danger: '',
    },
    appearance: {
      surface: 'teal-raised-surface teal-u-p-4 teal-u-shadow-none',
      banner: 'teal-u-w-full teal-u-rounded-xl teal-u-p-4 sm:teal-u-p-5',
      callout: 'teal-u-rounded-2xl teal-u-p-4 teal-u-text-on-surface',
    },
  },
  compoundVariants: [
    {
      appearance: ['surface', 'banner'],
      variant: 'neutral',
      class: 'teal-u-border-outline-variant teal-u-bg-surface-container-high teal-u-text-on-surface',
    },
    {
      appearance: ['surface', 'banner'],
      variant: 'info',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-primary)_40%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-primary)_12%,var(--teal-color-surface))] teal-u-text-on-surface',
    },
    {
      appearance: ['surface', 'banner'],
      variant: 'success',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-tertiary)_40%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-tertiary)_12%,var(--teal-color-surface))] teal-u-text-on-surface',
    },
    {
      appearance: ['surface', 'banner'],
      variant: 'warning',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-warning)_45%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-warning)_14%,var(--teal-color-surface))] teal-u-text-on-surface',
    },
    {
      appearance: ['surface', 'banner'],
      variant: 'danger',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-error)_40%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-error)_12%,var(--teal-color-surface))] teal-u-text-on-surface',
    },
    {
      appearance: 'callout',
      variant: 'neutral',
      class: 'teal-u-border-outline-variant teal-u-bg-surface-container-high',
    },
    {
      appearance: 'callout',
      variant: 'info',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-primary)_25%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-primary)_8%,var(--teal-color-surface))]',
    },
    {
      appearance: 'callout',
      variant: 'success',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-tertiary)_25%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-tertiary)_8%,var(--teal-color-surface))]',
    },
    {
      appearance: 'callout',
      variant: 'warning',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-warning)_30%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-warning)_10%,var(--teal-color-surface))]',
    },
    {
      appearance: 'callout',
      variant: 'danger',
      class: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-error)_25%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-error)_8%,var(--teal-color-surface))]',
    },
  ],
  defaultVariants: { variant: 'info', appearance: 'surface' },
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

const variantAccentClasses: Record<AlertVariant, string> = {
  neutral: 'teal-u-border-l-outline-variant',
  info: 'teal-u-border-l-primary',
  success: 'teal-u-border-l-tertiary',
  warning: 'teal-u-border-l-warning',
  danger: 'teal-u-border-l-error',
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  /** Optional action (for example a Button) rendered at the trailing edge, before the dismiss button. */
  action?: ReactNode
  /** Shows the variant-colored left accent bar. Defaults to true for the callout appearance, off otherwise. */
  accent?: boolean
  /** Icon override; defaults to the variant's standard icon. Always hidden from assistive technology. Not rendered for the banner appearance. */
  icon?: ReactNode
  /** Renders a dismiss button and calls this when it is pressed. */
  onDismiss?: () => void
  /** Bold leading text of the alert. */
  title?: ReactNode
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { accent, action, appearance, children, className, icon, onDismiss, title, variant, ...props },
  ref,
) {
  const resolvedVariant = variant ?? 'info'
  const resolvedAppearance = appearance ?? 'surface'
  const resolvedAccent = accent ?? resolvedAppearance === 'callout'
  const VariantIcon = variantIcons[resolvedVariant]
  return (
    <div
      ref={ref}
      role={resolvedAppearance === 'callout' ? undefined : resolvedVariant === 'danger' ? 'alert' : 'status'}
      className={cn(
        alertVariants({ appearance: resolvedAppearance, variant: resolvedVariant }),
        resolvedAccent && cn('teal-u-border-l-4', variantAccentClasses[resolvedVariant]),
        className,
      )}
      {...props}
    >
      {resolvedAppearance === 'banner' ? null : (
        <span aria-hidden="true" className={cn('teal-u-mt-0.5 teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-md)]', variantIconClasses[resolvedVariant])}>
          {icon ?? <VariantIcon />}
        </span>
      )}
      <div className="teal-u-min-w-0 teal-u-flex-1">
        {title ? <p className="teal-u-font-semibold">{title}</p> : null}
        {children ? <div className={cn('teal-u-leading-relaxed teal-u-text-on-surface-variant', title && 'teal-u-mt-0.5')}>{children}</div> : null}
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

export { alertVariants }
