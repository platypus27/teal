import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface GaugeThreshold {
  /** Value at which this zone ends; the last zone always extends to `max`. */
  upTo: number
  /** Zone color; defaults to a palette slot by index. */
  color?: string
  /** Zone name used in the accessible summary. */
  label?: string
}

export interface GaugeChartProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the gauge, applied as aria-label. */
  'aria-label': string
  /** Current value; the arc is clamped to the min–max range. */
  value: number
  /** Lower bound of the scale. */
  min?: number
  /** Upper bound of the scale. */
  max?: number
  /** Threshold zones drawn along the arc. */
  thresholds?: GaugeThreshold[]
  /** Caption rendered under the center value. */
  label?: string
  /** SVG width in pixels. */
  width?: number
  /** SVG height in pixels. */
  height?: number
}

const ZONE_PALETTE = ['var(--teal-color-tertiary)', 'var(--teal-color-primary)', 'var(--teal-color-error)']
const FILL_FALLBACK = 'var(--teal-color-primary)'
const TRACK_COLOR = 'var(--teal-color-surface-container-high)'
const VALUE_COLOR = 'var(--teal-color-on-surface)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const STROKE_WIDTH = 14

export const GaugeChart = forwardRef<SVGSVGElement, GaugeChartProps>(function GaugeChart(
  {
    'aria-label': ariaLabel,
    className,
    value,
    min = 0,
    max = 100,
    thresholds = [],
    label,
    width = 220,
    height = 140,
    ...props
  },
  ref,
) {
  const centerX = width / 2
  const centerY = height - 22
  const radius = Math.max(Math.min(centerX, centerY) - STROKE_WIDTH, 1)
  const range = max - min || 1
  const fraction = Math.min(1, Math.max(0, (value - min) / range))

  function pointAt(frac: number) {
    const angle = Math.PI - frac * Math.PI
    return { x: centerX + radius * Math.cos(angle), y: centerY - radius * Math.sin(angle) }
  }

  function arcPath(from: number, to: number) {
    const start = pointAt(from)
    const end = pointAt(to)
    const largeArc = to - from > 0.5 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const defaultZone = { from: min, to: max, color: ZONE_PALETTE[1] ?? FILL_FALLBACK, label: undefined as string | undefined }
  const zones =
    thresholds.length > 0
      ? thresholds.map((zone, index) => ({
          from: index === 0 ? min : (thresholds[index - 1]?.upTo ?? min),
          to: Math.min(zone.upTo, max),
          color: zone.color ?? ZONE_PALETTE[index % ZONE_PALETTE.length] ?? FILL_FALLBACK,
          label: zone.label,
        }))
      : [defaultZone]

  const activeZone =
    zones.find((zone) => value <= zone.to || zone === zones[zones.length - 1]) ??
    zones[zones.length - 1] ??
    defaultZone

  const zoneSummary = thresholds.length > 0 ? `; zones: ${zones.map((z) => z.label ?? `${z.from}–${z.to}`).join(', ')}` : ''
  const summary = `Value ${value} between ${min} and ${max}${zoneSummary}`

  return (
    <>
      <svg
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn('teal-u-block', className)}
        {...props}
      >
        {thresholds.length === 0 ? (
          <path d={arcPath(0, 1)} fill="none" stroke={TRACK_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        ) : (
          zones.map((zone, index) => {
            const from = Math.max(0, (zone.from - min) / range)
            const to = Math.min(1, (zone.to - min) / range)
            if (to <= from) return null
            return (
              <path
                key={index}
                d={arcPath(from, to)}
                fill="none"
                stroke={zone.color}
                strokeOpacity={0.3}
                strokeWidth={STROKE_WIDTH}
              />
            )
          })
        )}
        {fraction > 0 ? (
          <path
            d={arcPath(0, fraction)}
            fill="none"
            stroke={activeZone.color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        ) : null}
        <text x={centerX - radius - STROKE_WIDTH / 2} y={centerY + 16} textAnchor="start" fontSize={10} fill={TEXT_COLOR}>
          {min}
        </text>
        <text x={centerX + radius + STROKE_WIDTH / 2} y={centerY + 16} textAnchor="end" fontSize={10} fill={TEXT_COLOR}>
          {max}
        </text>
        <text x={centerX} y={centerY - 6} textAnchor="middle" fontSize={22} fontWeight={600} fill={VALUE_COLOR}>
          {value}
        </text>
        {label ? (
          <text x={centerX} y={centerY + 6} textAnchor="middle" dominantBaseline="hanging" fontSize={11} fill={TEXT_COLOR}>
            {label}
          </text>
        ) : null}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
