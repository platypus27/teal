import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the trend, applied as aria-label. */
  'aria-label': string
  /** Values to plot, in order. */
  data: number[]
  /** SVG height in pixels. */
  height?: number
  /** Chart style: line, filled area, or bars. */
  variant?: 'line' | 'area' | 'bar'
  /** SVG width in pixels. */
  width?: number
}

const STROKE = 'var(--teal-color-primary)'

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { 'aria-label': ariaLabel, className, data, height = 32, variant = 'line', width = 120, ...props },
  ref,
) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const last = data.length > 0 ? data[data.length - 1] : undefined
  // Leave a small vertical inset so the stroke is never clipped at the edges.
  const pad = 2
  const usableHeight = height - pad * 2

  function xAt(index: number) {
    return data.length > 1 ? (index / (data.length - 1)) * width : width / 2
  }

  function yAt(value: number) {
    const ratio = range === 0 ? 0.5 : (value - min) / range
    return pad + (1 - ratio) * usableHeight
  }

  const linePoints = data.map((value, index) => `${xAt(index)},${yAt(value)}`).join(' ')
  const areaPoints = data.length > 0 ? `0,${height} ${linePoints} ${width},${height}` : ''

  const summary = `Min ${Number.isFinite(min) ? min : 0}, max ${Number.isFinite(max) ? max : 0}, last ${last ?? 0}`

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
        {variant !== 'bar' && data.length > 1 ? (
          <>
            {variant === 'area' ? (
              <polygon points={areaPoints} fill={STROKE} opacity={0.15} />
            ) : null}
            <polyline
              points={linePoints}
              fill="none"
              stroke={STROKE}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : null}
        {variant === 'bar'
          ? data.map((value, index) => {
              const barWidth = width / data.length
              const barHeight = range === 0 ? usableHeight / 2 : ((value - min) / range) * usableHeight
              return (
                <rect
                  key={index}
                  x={index * barWidth + 0.5}
                  y={height - Math.max(barHeight, 1)}
                  width={Math.max(barWidth - 1, 0.5)}
                  height={Math.max(barHeight, 1)}
                  rx={1}
                  fill={STROKE}
                />
              )
            })
          : null}
        {data.length === 1 ? <circle cx={width / 2} cy={height / 2} r={2} fill={STROKE} /> : null}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
