import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface RadarSeries {
  /** Series name used in the accessible summary. */
  name: string
  /** One value per axis, in axis order. */
  values: number[]
  /** Polygon color; defaults to a palette slot by series index. */
  color?: string
}

export interface RadarChartProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the chart, applied as aria-label. */
  'aria-label': string
  /** Axis names, one per spoke, starting at the top and going clockwise. */
  axes: string[]
  /** Data series drawn as polygons. */
  series: RadarSeries[]
  /** Scale maximum; defaults to the largest value across all series. */
  max?: number
  /** Chart edge length in pixels. */
  size?: number
  /** Number of concentric grid rings. */
  rings?: number
}

const PALETTE = [
  'var(--teal-color-primary)',
  'var(--teal-color-tertiary)',
  'var(--teal-color-error)',
  'var(--teal-color-secondary)',
]

const GRID_COLOR = 'var(--teal-color-outline-variant)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const LABEL_PAD = 40

export const RadarChart = forwardRef<SVGSVGElement, RadarChartProps>(function RadarChart(
  { 'aria-label': ariaLabel, className, axes, series, max, size = 280, rings = 4, ...props },
  ref,
) {
  const axisCount = axes.length
  const center = size / 2
  const radius = Math.max(center - LABEL_PAD, 1)
  const allValues = series.flatMap((entry) => entry.values)
  const scaleMax = max ?? (allValues.length > 0 ? Math.max(...allValues, 1) : 1)

  function axisAngle(index: number) {
    return (-90 + (index / axisCount) * 360) * (Math.PI / 180)
  }

  function pointAt(index: number, fraction: number) {
    const angle = axisAngle(index)
    const r = radius * Math.min(Math.max(fraction, 0), 1)
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) }
  }

  function polygonPoints(indices: number[], fractionAt: (index: number) => number) {
    return indices
      .map((index) => {
        const point = pointAt(index, fractionAt(index))
        return `${point.x},${point.y}`
      })
      .join(' ')
  }

  const ringIndices = Array.from({ length: axisCount }, (_, index) => index)
  const ringLevels = Array.from({ length: rings }, (_, ring) => (ring + 1) / rings)

  const summary =
    series.length === 0
      ? 'No data'
      : series
          .map((entry) => `${entry.name}: ${entry.values.map((value, i) => `${axes[i] ?? i} ${value}`).join(', ')}`)
          .join('; ')

  return (
    <>
      <svg
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn('teal-u-block', className)}
        {...props}
      >
        {ringLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(ringIndices, () => level)}
            fill="none"
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
        ))}
        {ringIndices.map((index) => {
          const end = pointAt(index, 1)
          return <line key={index} x1={center} y1={center} x2={end.x} y2={end.y} stroke={GRID_COLOR} />
        })}
        {series.map((entry, seriesIndex) => {
          const color = entry.color ?? PALETTE[seriesIndex % PALETTE.length]
          return (
            <polygon
              key={seriesIndex}
              points={polygonPoints(ringIndices, (index) => (entry.values[index] ?? 0) / (scaleMax || 1))}
              fill={color}
              fillOpacity={0.15}
              stroke={color}
              strokeWidth={1.5}
              strokeLinejoin="round"
            >
              <title>{`${entry.name}: ${entry.values.join(', ')}`}</title>
            </polygon>
          )
        })}
        {axes.map((axis, index) => {
          const point = pointAt(index, 1)
          const labelPoint = pointAt(index, 1 + 14 / radius)
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={Math.abs(point.x - center) < 1 ? 'middle' : point.x > center ? 'start' : 'end'}
              dominantBaseline="middle"
              fontSize={11}
              fill={TEXT_COLOR}
            >
              {axis}
            </text>
          )
        })}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
