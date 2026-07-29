import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from './cn'

export interface StatDelta {
  /** Trend direction; picks the icon and the default tone (up = success, down = danger, flat = neutral). */
  direction: 'up' | 'down' | 'flat'
  /** Color override for the delta. */
  tone?: 'success' | 'danger' | 'neutral'
  /** Delta text, e.g. '+12.4%'. */
  value: string
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional extra content rendered below the value, e.g. a Sparkline. */
  children?: ReactNode
  /** Change indicator rendered next to the value. */
  delta?: StatDelta
  /** Supporting text rendered below the value. */
  description?: ReactNode
  /** Name of the metric. */
  label: ReactNode
  /** Metric value, rendered large. */
  value: ReactNode
}

const deltaIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const

const deltaDefaultTones = {
  up: 'success',
  down: 'danger',
  flat: 'neutral',
} as const

const deltaToneClasses = {
  success: 'teal-u-text-tertiary',
  danger: 'teal-u-text-error',
  neutral: 'teal-u-text-on-surface-variant',
} as const

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { children, className, delta, description, label, value, ...props },
  ref,
) {
  const DeltaIcon = delta ? deltaIcons[delta.direction] : null
  const deltaTone = delta ? delta.tone ?? deltaDefaultTones[delta.direction] : null

  return (
    <div ref={ref} className={cn('teal-u-flex teal-u-flex-col teal-u-gap-1', className)} {...props}>
      <span className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface-variant">{label}</span>
      <span className="teal-u-flex teal-u-flex-wrap teal-u-items-baseline teal-u-gap-x-2">
        <span className="teal-u-font-headline teal-u-text-3xl teal-u-font-bold teal-u-tabular-nums teal-u-text-on-surface">{value}</span>
        {delta && DeltaIcon && deltaTone ? (
          <span className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-text-sm teal-u-font-semibold', deltaToneClasses[deltaTone])}>
            <DeltaIcon aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            <span className="teal-u-sr-only">{delta.direction === 'flat' ? 'no change:' : delta.direction === 'up' ? 'up:' : 'down:'}</span>
            {delta.value}
          </span>
        ) : null}
      </span>
      {description ? <span className="teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">{description}</span> : null}
      {children ? <div className="teal-u-mt-2">{children}</div> : null}
    </div>
  )
})
