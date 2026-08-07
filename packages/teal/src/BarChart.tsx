import { forwardRef, type HTMLAttributes } from 'react'
import { ChartAxis, ChartContainer, ChartGrid, ChartLegend, chartColorAt, niceTicks } from './ChartContainer'

export interface BarChartSeries {
  /** Bar color; defaults to the chart palette. */
  color?: string
  /** Values aligned with `labels`. */
  data: number[]
  /** Series name used in the legend, tooltips, and data table. */
  name: string
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible chart summary, applied as the SVG aria-label. */
  label: string
  /** Category labels, one per group of bars. */
  labels: string[]
  /** Bar direction. */
  orientation?: 'vertical' | 'horizontal'
  /** One or more series to plot; multiple series render grouped bars. */
  series: BarChartSeries[]
  /** SVG height in pixels. */
  height?: number
  /** Shows axes with tick labels. */
  showAxis?: boolean
  /** Shows grid lines along the value axis. */
  showGrid?: boolean
  /** Shows a legend below the chart. */
  showLegend?: boolean
  /** Renders the value above (or beside) each bar. */
  showValues?: boolean
  /** SVG width in pixels. */
  width?: number
}

const padding = { top: 16, right: 16, bottom: 28, left: 44 }
const barGap = 2

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  {
    className,
    height = 300,
    label,
    labels,
    orientation = 'vertical',
    series,
    showAxis = true,
    showGrid = true,
    showLegend = true,
    showValues = false,
    width = 560,
    ...props
  },
  ref,
) {
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom

  const allValues = series.flatMap((entry) => entry.data)
  const rawMin = Math.min(0, ...allValues)
  const rawMax = Math.max(0, ...allValues)
  const valueTicks = niceTicks(rawMin, rawMax === rawMin ? rawMax + 1 : rawMax)
  const valueMin = valueTicks[0] ?? 0
  const valueMax = valueTicks[valueTicks.length - 1] ?? 1

  function colorAt(seriesIndex: number) {
    return series[seriesIndex]?.color ?? chartColorAt(seriesIndex)
  }

  // Maps a value onto the value axis: vertical charts grow upwards, horizontal rightwards.
  function valueAt(value: number) {
    const ratio = valueMax === valueMin ? 0.5 : (value - valueMin) / (valueMax - valueMin)
    return orientation === 'vertical'
      ? padding.top + (1 - ratio) * plotHeight
      : padding.left + ratio * plotWidth
  }

  const zero = valueAt(Math.max(valueMin, Math.min(valueMax, 0)))
  const bandSize = (orientation === 'vertical' ? plotWidth : plotHeight) / Math.max(1, labels.length)
  const barThickness = Math.min(32, (bandSize * 0.7 - barGap * (series.length - 1)) / Math.max(1, series.length))
  const groupSize = barThickness * series.length + barGap * (series.length - 1)

  function bandStart(index: number) {
    const origin = orientation === 'vertical' ? padding.left : padding.top
    return origin + index * bandSize + (bandSize - groupSize) / 2
  }

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

  const valueAxisTicks = valueTicks.map((tick) => ({ position: valueAt(tick), label: String(tick) }))
  const categoryAxisTicks = labels.map((category, index) => ({
    position: (orientation === 'vertical' ? padding.left : padding.top) + index * bandSize + bandSize / 2,
    label: category,
  }))

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
      {showGrid ? (
        orientation === 'vertical' ? (
          <ChartGrid positions={valueTicks.map(valueAt)} start={padding.left} end={width - padding.right} />
        ) : (
          <ChartGrid
            orientation="vertical"
            positions={valueTicks.map(valueAt)}
            start={padding.top}
            end={height - padding.bottom}
          />
        )
      ) : null}
      {showAxis ? (
        orientation === 'vertical' ? (
          <>
            <ChartAxis
              orientation="y"
              offset={padding.left}
              start={padding.top}
              end={height - padding.bottom}
              ticks={valueAxisTicks}
            />
            <ChartAxis
              orientation="x"
              offset={height - padding.bottom}
              start={padding.left}
              end={width - padding.right}
              ticks={categoryAxisTicks}
            />
          </>
        ) : (
          <>
            <ChartAxis
              orientation="x"
              offset={height - padding.bottom}
              start={padding.left}
              end={width - padding.right}
              ticks={valueAxisTicks}
            />
            <ChartAxis
              orientation="y"
              offset={padding.left}
              start={padding.top}
              end={height - padding.bottom}
              ticks={categoryAxisTicks}
            />
          </>
        )
      ) : null}
      {series.map((entry, seriesIndex) =>
        entry.data.map((value, pointIndex) => {
          const category = labels[pointIndex] ?? String(pointIndex + 1)
          const edge = valueAt(value)
          const thicknessOffset = bandStart(pointIndex) + seriesIndex * (barThickness + barGap)
          const bar = {
            x: orientation === 'vertical' ? thicknessOffset : Math.min(zero, edge),
            y: orientation === 'vertical' ? Math.min(zero, edge) : thicknessOffset,
            width: orientation === 'vertical' ? barThickness : Math.abs(edge - zero),
            height: orientation === 'vertical' ? Math.abs(edge - zero) : barThickness,
          }
          const valueLabel =
            orientation === 'vertical'
              ? { x: bar.x + bar.width / 2, y: Math.min(zero, edge) - 4, textAnchor: 'middle' as const }
              : { x: Math.max(zero, edge) + 4, y: bar.y + bar.height / 2, textAnchor: 'start' as const }
          return (
            <g key={`${seriesIndex}-${pointIndex}`}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx={2}
                fill={colorAt(seriesIndex)}
                role="img"
                aria-label={`${entry.name}, ${category}: ${value}`}
              >
                <title>{`${entry.name}, ${category}: ${value}`}</title>
              </rect>
              {showValues ? (
                <text
                  x={valueLabel.x}
                  y={valueLabel.y}
                  textAnchor={valueLabel.textAnchor}
                  dominantBaseline={orientation === 'horizontal' ? 'central' : undefined}
                  fontSize={10}
                  fill="var(--teal-color-on-surface-variant)"
                  aria-hidden="true"
                >
                  {value}
                </text>
              ) : null}
            </g>
          )
        }),
      )}
    </ChartContainer>
  )
})
