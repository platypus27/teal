import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from 'lucide-react'
import { cn } from './cn'

const calloutVariants = cva(
  'teal-u-flex teal-u-items-start teal-u-gap-3 teal-u-rounded-2xl teal-u-border teal-u-border-l-4 teal-u-p-4 teal-u-text-sm teal-u-text-on-surface',
  {
    variants: {
      variant: {
        info: 'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-primary)_25%,var(--teal-color-surface))] teal-u-border-l-primary teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-primary)_8%,var(--teal-color-surface))]',
        success:
          'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-tertiary)_25%,var(--teal-color-surface))] teal-u-border-l-tertiary teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-tertiary)_8%,var(--teal-color-surface))]',
        warning:
          'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-warning)_30%,var(--teal-color-surface))] teal-u-border-l-warning teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-warning)_10%,var(--teal-color-surface))]',
        danger:
          'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-error)_25%,var(--teal-color-surface))] teal-u-border-l-error teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-error)_8%,var(--teal-color-surface))]',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

type CalloutVariant = NonNullable<VariantProps<typeof calloutVariants>['variant']>

const variantIcons: Record<CalloutVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: CircleAlert,
}

const variantIconClasses: Record<CalloutVariant, string> = {
  info: 'teal-u-text-primary',
  success: 'teal-u-text-tertiary',
  warning: 'teal-u-text-warning',
  danger: 'teal-u-text-error',
}

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof calloutVariants> {
  /** Icon override; defaults to the variant's standard icon. Always hidden from assistive technology. */
  icon?: ReactNode
  /** Bold leading text of the callout. */
  title?: ReactNode
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  { children, className, icon, title, variant, ...props },
  ref,
) {
  const resolvedVariant = variant ?? 'info'
  const VariantIcon = variantIcons[resolvedVariant]
  return (
    <div ref={ref} className={cn(calloutVariants({ variant }), className)} {...props}>
      <span
        aria-hidden="true"
        className={cn('teal-u-mt-0.5 teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-md)]', variantIconClasses[resolvedVariant])}
      >
        {icon ?? <VariantIcon />}
      </span>
      <div className="teal-u-min-w-0 teal-u-flex-1">
        {title ? <p className="teal-u-font-semibold">{title}</p> : null}
        {children ? (
          <div className={cn('teal-u-leading-relaxed teal-u-text-on-surface-variant', title && 'teal-u-mt-0.5')}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
})

export { calloutVariants }
