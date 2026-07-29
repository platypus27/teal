import { forwardRef, useId, type HTMLAttributes } from 'react'
import { cn } from './cn'

type MeterZone = 'neutral' | 'success' | 'warning' | 'danger'

const zoneClasses: Record<MeterZone, string> = {
  neutral: 'teal-u-bg-primary',
  success: 'teal-u-bg-tertiary',
  warning: 'teal-u-bg-warning',
  danger: 'teal-u-bg-error',
}

/** Maps a value onto the HTML meter optimum/sub-optimal/sub-sub-optimal zones. */
function getZone(value: number, low: number | undefined, high: number | undefined, optimum: number | undefined): MeterZone {
  if (low === undefined || high === undefined || optimum === undefined) return 'neutral'
  if (optimum < low) {
    if (value < low) return 'success'
    if (value <= high) return 'warning'
    return 'danger'
  }
  if (optimum > high) {
    if (value > high) return 'success'
    if (value >= low) return 'warning'
    return 'danger'
  }
  if (value < low || value > high) return 'warning'
  return 'success'
}

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Formats the visible value text. Defaults to the rounded raw value. */
  formatValue?: (value: number) => string
  /** Upper boundary of the middle range; used with `low` and `optimum` to color the fill. */
  high?: number
  /** Accessible name describing what the meter measures. */
  label: string
  /** Lower boundary of the middle range; used with `high` and `optimum` to color the fill. */
  low?: number
  /** Largest value the meter can show. */
  max?: number
  /** Smallest value the meter can show. */
  min?: number
  /** The value considered ideal; determines whether low or high readings are good. */
  optimum?: number
  /** Current value; clamped between `min` and `max`. */
  value: number
}

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { className, formatValue = (v) => String(Math.round(v)), high, label, low, max = 100, min = 0, optimum, value, ...props },
  ref,
) {
  const labelId = useId()
  const clamped = Math.min(max, Math.max(min, value))
  const percentage = max > min ? ((clamped - min) / (max - min)) * 100 : 0
  const zone = getZone(clamped, low, high, optimum)
  const formatted = formatValue(clamped)

  return (
    <div ref={ref} className={cn('teal-u-grid teal-u-gap-1.5', className)} {...props}>
      <div className="teal-u-flex teal-u-items-baseline teal-u-justify-between teal-u-gap-4">
        <span id={labelId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </span>
        <span className="teal-u-text-sm teal-u-tabular-nums teal-u-text-on-surface-variant">{formatted}</span>
      </div>
      <div
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={formatted}
        className="teal-u-h-2 teal-u-overflow-hidden teal-u-rounded-full teal-u-bg-surface-container-high"
      >
        <div
          className={cn(
            'teal-u-h-full teal-u-rounded-full teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
            zoneClasses[zone],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
})
