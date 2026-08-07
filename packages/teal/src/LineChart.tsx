import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChartAxis, ChartContainer, ChartGrid, ChartLegend, chartColorAt, niceTicks } from './ChartContainer'

export interface LineChartSeries {
  /** Line color; defaults to the chart palette. */
  color?: string
  /** Values aligned with `labels`. */
  data: number[]
  /** Series name used in the legend, tooltips, and data table. */
  name: string
}

export interface LineChartPoint {
  /** Resolved point color. */
  color: string
  /** X category label of the point. */
  label: string
  /** Point index within the series. */
  pointIndex: number
  /** Series the point belongs to. */
  series: LineChartSeries
  /** Series index. */
  seriesIndex: number
  /** Point value. */
  value: number
  /** X coordinate within the SVG. */
  x: number
  /** Y coordinate within the SVG. */
  y: number
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible chart summary, applied as the SVG aria-label. */
  label: string
  /** X-axis category labels. */
  labels: string[]
  /** Custom tooltip renderer for the hovered or focused point; falls back to a simple SVG title. */
  renderTooltip?: (point: LineChartPoint) => ReactNode
  /** One or more series to plot. */
  series: LineChartSeries[]
  /** SVG height in pixels. */
  height?: number
  /** Shows axes with tick labels. */
  showAxis?: boolean
  /** Shows horizontal grid lines. */
  showGrid?: boolean
  /** Shows a legend below the chart. */
  showLegend?: boolean
  /** Draws focusable point markers at each value. */
  showPoints?: boolean
  /** SVG width in pixels. */
  width?: number
}

const padding = { top: 16, right: 16, bottom: 28, left: 44 }

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  {
    className,
    height = 300,
    label,
    labels,
    renderTooltip,
    series,
    showAxis = true,
    showGrid = true,
    showLegend = true,
    showPoints = true,
    width = 560,
    ...props
  },
  ref,
) {
  const [active, setActive] = useState<{ seriesIndex: number; pointIndex: number } | null>(null)

  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const baseline = padding.top + plotHeight

  const allValues = series.flatMap((entry) => entry.data)
  const rawMin = Math.min(0, ...allValues)
  const rawMax = Math.max(0, ...allValues)
  const yTicks = niceTicks(rawMin, rawMax === rawMin ? rawMax + 1 : rawMax)
  const yMin = yTicks[0] ?? 0
  const yMax = yTicks[yTicks.length - 1] ?? 1

  function xAt(index: number) {
    return padding.left + (labels.length > 1 ? (index / (labels.length - 1)) * plotWidth : plotWidth / 2)
  }

  function yAt(value: number) {
    const ratio = yMax === yMin ? 0.5 : (value - yMin) / (yMax - yMin)
    return padding.top + (1 - ratio) * plotHeight
  }

  function colorAt(seriesIndex: number) {
    return series[seriesIndex]?.color ?? chartColorAt(seriesIndex)
  }

  function pointAt(seriesIndex: number, pointIndex: number): LineChartPoint {
    const entry: LineChartSeries = series[seriesIndex] ?? { name: '', data: [] }
    const value = entry.data[pointIndex] ?? 0
    return {
      color: colorAt(seriesIndex),
      label: labels[pointIndex] ?? String(pointIndex + 1),
      pointIndex,
      series: entry,
      seriesIndex,
      value,
      x: xAt(pointIndex),
      y: yAt(value),
    }
  }

  const activePoint = active ? pointAt(active.seriesIndex, active.pointIndex) : null

  const columns = [
    { key: 'label', label: 'Category' },
    ...series.map((entry) => ({ key: entry.name, label: entry.name })),
  ]
  const rows = labels.map((category, index) => {
    const row: Record<string, string | number> = { label: category }
    series.forEach((entry) => {
      row[entry.name] = entry.data[index] ?? ''
    })
    return row
  })

  return (
    <ChartContainer
      ref={ref}
      label={label}
      width={width}
      height={height}
      columns={columns}
      data={rows}
      legend={showLegend ? <ChartLegend items={series.map((entry, index) => ({ name: entry.name, color: colorAt(index) }))} /> : undefined}
      className={className}
      {...props}
    >
      {showGrid ? <ChartGrid positions={yTicks.map(yAt)} start={padding.left} end={width - padding.right} /> : null}
      {showAxis ? (
        <>
          <ChartAxis
            orientation="y"
            offset={padding.left}
            start={padding.top}
            end={baseline}
            ticks={yTicks.map((tick) => ({ position: yAt(tick), label: String(tick) }))}
          />
          <ChartAxis
            orientation="x"
            offset={baseline}
            start={padding.left}
            end={width - padding.right}
            ticks={labels.map((category, index) => ({ position: xAt(index), label: category }))}
          />
        </>
      ) : null}
      {series.map((entry, seriesIndex) => {
        const points = entry.data.map((value, index) => `${xAt(index)},${yAt(value)}`).join(' ')
        return (
          <polyline
            key={entry.name}
            points={points}
            fill="none"
            stroke={colorAt(seriesIndex)}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
      {showPoints
        ? series.map((entry, seriesIndex) =>
            entry.data.map((value, pointIndex) => {
              const point = pointAt(seriesIndex, pointIndex)
              const isActive = active?.seriesIndex === seriesIndex && active?.pointIndex === pointIndex
              return (
                <circle
                  key={`${seriesIndex}-${pointIndex}`}
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 5 : 3.5}
                  fill={point.color}
                  stroke="var(--teal-color-surface)"
                  strokeWidth={1.5}
                  tabIndex={0}
                  role="img"
                  aria-label={`${entry.name}, ${point.label}: ${value}`}
                  className="teal-u-outline-none"
                  onMouseEnter={() => setActive({ seriesIndex, pointIndex })}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive({ seriesIndex, pointIndex })}
                  onBlur={() => setActive(null)}
                >
                  {renderTooltip ? null : <title>{`${entry.name}, ${point.label}: ${value}`}</title>}
                </circle>
              )
            }),
          )
        : null}
      {activePoint && renderTooltip ? (
        <foreignObject x={0} y={0} width={width} height={height} className="teal-u-pointer-events-none teal-u-overflow-visible">
          <div
            role="status"
            className="teal-u-absolute teal-u-rounded-lg teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface-container-high teal-u-px-2 teal-u-py-1 teal-u-text-xs teal-u-text-on-surface"
            style={{ left: activePoint.x, top: activePoint.y, transform: 'translate(-50%, -120%)' }}
          >
            {renderTooltip(activePoint)}
          </div>
        </foreignObject>
      ) : null}
    </ChartContainer>
  )
})
