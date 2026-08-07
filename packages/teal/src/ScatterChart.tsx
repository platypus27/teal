import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface ScatterPoint {
  /** X value on the horizontal axis. */
  x: number
  /** Y value on the vertical axis. */
  y: number
  /** Optional magnitude mapped to the dot radius when `sizeEncoding` is on. */
  size?: number
  /** Tooltip text for the point; falls back to "x, y". */
  label?: string
}

export interface ScatterSeries {
  /** Series name used in the accessible summary and point tooltips. */
  name: string
  /** Points to plot. */
  data: ScatterPoint[]
  /** Dot color; defaults to a palette slot by series index. */
  color?: string
}

export interface ScatterChartProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the chart, applied as aria-label. */
  'aria-label': string
  /** Data series to plot. */
  series: ScatterSeries[]
  /** SVG width in pixels. */
  width?: number
  /** SVG height in pixels. */
  height?: number
  /** Caption rendered under the x axis. */
  xAxisLabel?: string
  /** Caption rendered alongside the y axis. */
  yAxisLabel?: string
  /** Maps each point's `size` value to the dot radius. */
  sizeEncoding?: boolean
}

const PALETTE = [
  'var(--teal-color-primary)',
  'var(--teal-color-tertiary)',
  'var(--teal-color-error)',
  'var(--teal-color-secondary)',
]

const AXIS_COLOR = 'var(--teal-color-outline-variant)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const PAD = { top: 12, right: 12, bottom: 32, left: 44 }

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

export const ScatterChart = forwardRef<SVGSVGElement, ScatterChartProps>(function ScatterChart(
  {
    'aria-label': ariaLabel,
    className,
    series,
    width = 360,
    height = 240,
    xAxisLabel,
    yAxisLabel,
    sizeEncoding = false,
    ...props
  },
  ref,
) {
  const allPoints = series.flatMap((entry) => entry.data)
  const xs = allPoints.map((point) => point.x)
  const ys = allPoints.map((point) => point.y)
  const xMin = xs.length > 0 ? Math.min(...xs) : 0
  const xMax = xs.length > 0 ? Math.max(...xs) : 1
  const yMin = ys.length > 0 ? Math.min(...ys) : 0
  const yMax = ys.length > 0 ? Math.max(...ys) : 1
  const xRange = xMax - xMin || 1
  const yRange = yMax - yMin || 1

  const plotWidth = width - PAD.left - PAD.right
  const plotHeight = height - PAD.top - PAD.bottom

  function xAt(x: number) {
    return PAD.left + ((x - xMin) / xRange) * plotWidth
  }

  function yAt(y: number) {
    return PAD.top + (1 - (y - yMin) / yRange) * plotHeight
  }

  const sizes = sizeEncoding ? allPoints.map((point) => point.size ?? 0) : []
  const sizeMin = sizes.length > 0 ? Math.min(...sizes) : 0
  const sizeMax = sizes.length > 0 ? Math.max(...sizes) : 1
  const sizeRange = sizeMax - sizeMin || 1

  function radiusOf(point: ScatterPoint) {
    if (!sizeEncoding) return 4
    return 2 + ((point.size ?? 0) - sizeMin) / sizeRange * 8
  }

  const summary =
    series.length === 0
      ? 'No data'
      : series.map((entry) => `${entry.name}: ${entry.data.length} points`).join(', ')

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
        <line
          x1={PAD.left}
          y1={height - PAD.bottom}
          x2={width - PAD.right}
          y2={height - PAD.bottom}
          stroke={AXIS_COLOR}
        />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={height - PAD.bottom} stroke={AXIS_COLOR} />
        <text x={PAD.left - 6} y={yAt(yMax)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill={TEXT_COLOR}>
          {formatNumber(yMax)}
        </text>
        <text x={PAD.left - 6} y={yAt(yMin)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill={TEXT_COLOR}>
          {formatNumber(yMin)}
        </text>
        <text x={xAt(xMin)} y={height - PAD.bottom + 14} textAnchor="middle" fontSize={10} fill={TEXT_COLOR}>
          {formatNumber(xMin)}
        </text>
        <text x={xAt(xMax)} y={height - PAD.bottom + 14} textAnchor="middle" fontSize={10} fill={TEXT_COLOR}>
          {formatNumber(xMax)}
        </text>
        {xAxisLabel ? (
          <text x={PAD.left + plotWidth / 2} y={height - 4} textAnchor="middle" fontSize={11} fill={TEXT_COLOR}>
            {xAxisLabel}
          </text>
        ) : null}
        {yAxisLabel ? (
          <text
            x={10}
            y={PAD.top + plotHeight / 2}
            textAnchor="middle"
            fontSize={11}
            fill={TEXT_COLOR}
            transform={`rotate(-90 10 ${PAD.top + plotHeight / 2})`}
          >
            {yAxisLabel}
          </text>
        ) : null}
        {series.map((entry, seriesIndex) =>
          entry.data.map((point, pointIndex) => (
            <circle
              key={`${seriesIndex}-${pointIndex}`}
              cx={xAt(point.x)}
              cy={yAt(point.y)}
              r={radiusOf(point)}
              fill={entry.color ?? PALETTE[seriesIndex % PALETTE.length]}
              fillOpacity={0.85}
            >
              <title>
                {point.label ?? `${entry.name}: ${formatNumber(point.x)}, ${formatNumber(point.y)}`}
              </title>
            </circle>
          )),
        )}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
