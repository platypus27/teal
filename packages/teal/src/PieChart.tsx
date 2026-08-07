import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { ChartContainer, ChartLegend, chartColorAt } from './ChartContainer'

export interface PieChartDatum {
  /** Segment color; defaults to the chart palette. */
  color?: string
  /** Segment name used in the legend, labels, and data table. */
  name: string
  /** Segment value; non-positive values are skipped. */
  value: number
}

export interface PieChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Segments of the pie. */
  data: PieChartDatum[]
  /** Inner radius as a fraction (0–0.95) of the outer radius; values above 0 render a donut. */
  innerRadius?: number
  /** Accessible chart summary, applied as the SVG aria-label. */
  label: string
  /** Shows percentage labels on segments large enough to fit them. */
  showLabels?: boolean
  /** Shows a legend below the chart. */
  showLegend?: boolean
  /** Chart size in pixels (both width and height). */
  size?: number
}

const FULL_CIRCLE = Math.PI * 2

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(function PieChart(
  { className, data, innerRadius = 0, label, showLabels = true, showLegend = true, size = 280, ...props },
  ref,
) {
  const segmentRefs = useRef<Array<SVGPathElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const center = size / 2
  const outerRadius = size / 2 - 8
  const holeRadius = outerRadius * Math.min(0.95, Math.max(0, innerRadius))
  const total = data.reduce((sum, datum) => sum + Math.max(0, datum.value), 0)

  function colorAt(index: number) {
    return data[index]?.color ?? chartColorAt(index)
  }

  function polar(radius: number, angle: number) {
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`
  }

  function segmentPath(startAngle: number, endAngle: number) {
    // Cap just below a full turn; SVG arcs cannot connect identical start/end points.
    const span = Math.min(endAngle - startAngle, FULL_CIRCLE - 1e-4)
    const a1 = startAngle + span
    const largeArc = span > Math.PI ? 1 : 0
    if (holeRadius <= 0) {
      return `M${center},${center} L${polar(outerRadius, startAngle)} A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${polar(outerRadius, a1)} Z`
    }
    return [
      `M${polar(outerRadius, startAngle)}`,
      `A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${polar(outerRadius, a1)}`,
      `L${polar(holeRadius, a1)}`,
      `A${holeRadius},${holeRadius} 0 ${largeArc} 0 ${polar(holeRadius, startAngle)}`,
      'Z',
    ].join(' ')
  }

  // Only positive values get a segment; angles sweep clockwise from the top.
  const segments: Array<{ datum: PieChartDatum; index: number; startAngle: number; endAngle: number }> = []
  let angle = -Math.PI / 2
  data.forEach((datum, index) => {
    if (datum.value <= 0 || total <= 0) return
    const span = (Math.max(0, datum.value) / total) * FULL_CIRCLE
    segments.push({ datum, index, startAngle: angle, endAngle: angle + span })
    angle += span
  })

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, segmentIndex: number) {
    const count = segments.length
    let next: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (segmentIndex + 1) % count
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (segmentIndex - 1 + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    if (next === undefined) return
    event.preventDefault()
    segmentRefs.current[next]?.focus()
  }

  const columns = [
    { key: 'name', label: 'Segment' },
    { key: 'value', label: 'Value' },
    { key: 'share', label: 'Share' },
  ]
  const rows = data.map((datum) => ({
    name: datum.name,
    value: datum.value,
    share: total > 0 ? `${Math.round((Math.max(0, datum.value) / total) * 100)}%` : '0%',
  }))

  return (
    <ChartContainer
      ref={ref}
      label={label}
      width={size}
      height={size}
      columns={columns}
      data={rows}
      legend={showLegend ? <ChartLegend items={data.map((datum, index) => ({ name: datum.name, color: colorAt(index) }))} /> : undefined}
      className={className}
      {...props}
    >
      {segments.map((segment, segmentIndex) => {
        const percent = Math.round((Math.max(0, segment.datum.value) / total) * 100)
        const midAngle = (segment.startAngle + segment.endAngle) / 2
        const labelRadius = holeRadius > 0 ? (holeRadius + outerRadius) / 2 : outerRadius * 0.65
        const labelX = center + labelRadius * Math.cos(midAngle)
        const labelY = center + labelRadius * Math.sin(midAngle)
        return (
          <g key={segment.datum.name}>
            <path
              ref={(node) => {
                segmentRefs.current[segmentIndex] = node
              }}
              d={segmentPath(segment.startAngle, segment.endAngle)}
              fill={colorAt(segment.index)}
              tabIndex={0}
              role="img"
              aria-label={`${segment.datum.name}: ${segment.datum.value} (${percent}%)`}
              stroke={focusedIndex === segmentIndex ? 'var(--teal-color-on-surface)' : 'none'}
              strokeWidth={2}
              className="teal-u-outline-none"
              onKeyDown={(event) => handleKeyDown(event, segmentIndex)}
              onFocus={() => setFocusedIndex(segmentIndex)}
              onBlur={() => setFocusedIndex(null)}
            >
              <title>{`${segment.datum.name}: ${segment.datum.value} (${percent}%)`}</title>
            </path>
            {showLabels && percent >= 5 ? (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fill="var(--teal-color-on-surface)"
                stroke="var(--teal-color-surface)"
                strokeWidth={3}
                paintOrder="stroke"
                aria-hidden="true"
              >
                {percent}%
              </text>
            ) : null}
          </g>
        )
      })}
    </ChartContainer>
  )
})
