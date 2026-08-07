import { forwardRef, useState, type HTMLAttributes, type ReactNode, type SVGAttributes } from 'react'
import { cn } from './cn'

/** Default categorical palette for chart series, built from teal tokens. */
export const chartColors = [
  'var(--teal-color-primary)',
  'var(--teal-color-tertiary)',
  'var(--teal-color-error)',
  'var(--teal-color-secondary)',
  'var(--teal-color-outline)',
]

/** Resolves the palette color for a series or segment index. */
export function chartColorAt(index: number): string {
  return chartColors[index % chartColors.length] ?? 'var(--teal-color-primary)'
}

/** Picks round tick values spanning `[min, max]` for an axis. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0]
  if (min === max) return min === 0 ? [0, 1] : [Math.min(0, min), Math.max(0, min)]
  const span = max - min
  const rawStep = span / Math.max(1, count - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  const step = (residual >= 5 ? 5 : residual >= 2 ? 2 : 1) * magnitude
  const start = Math.ceil(min / step) * step
  const ticks: number[] = []
  for (let value = start; value <= max + step * 1e-9; value += step) {
    ticks.push(Number(value.toFixed(10)))
  }
  return ticks.length > 0 ? ticks : [0]
}

export interface ChartDataColumn {
  /** Key of the value in each data row. */
  key: string
  /** Column header shown in the data table. */
  label: string
}

export interface ChartContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible chart summary, applied as the SVG aria-label. */
  label: string
  /** Chart content rendered inside the SVG frame. */
  children?: ReactNode
  /** Rows shown in the hidden data table. */
  data?: Array<Record<string, string | number>>
  /** Columns of the hidden data table; required together with `data` to enable the table. */
  columns?: ChartDataColumn[]
  /** Initial visibility of the data table when uncontrolled. */
  defaultShowDataTable?: boolean
  /** SVG height in pixels. */
  height?: number
  /** Content rendered between the chart and the data-table toggle, typically a ChartLegend. */
  legend?: ReactNode
  /** Called when the data table visibility changes. */
  onShowDataTableChange?: (show: boolean) => void
  /** Controlled visibility of the data table. */
  showDataTable?: boolean
  /** SVG width in pixels. */
  width?: number
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer(
  {
    children,
    className,
    columns,
    data,
    defaultShowDataTable = false,
    height = 300,
    label,
    legend,
    onShowDataTableChange,
    showDataTable,
    width = 560,
    ...props
  },
  ref,
) {
  const [internalShow, setInternalShow] = useState(defaultShowDataTable)
  const show = showDataTable !== undefined ? showDataTable : internalShow
  const hasTable = columns !== undefined && data !== undefined && columns.length > 0

  function toggle() {
    if (showDataTable === undefined) setInternalShow(!show)
    onShowDataTableChange?.(!show)
  }

  return (
    <div ref={ref} className={cn('teal-u-relative teal-u-inline-block', className)} {...props}>
      <svg
        role="img"
        aria-label={label}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="teal-u-block teal-u-h-auto teal-u-max-w-full"
      >
        {children}
      </svg>
      {legend}
      {hasTable ? (
        <>
          <button
            type="button"
            aria-expanded={show}
            onClick={toggle}
            className="teal-focus-ring teal-u-mt-2 teal-u-inline-flex teal-u-items-center teal-u-rounded-lg teal-u-px-2 teal-u-py-1 teal-u-text-sm teal-u-text-primary hover:teal-u-bg-surface-container-high"
          >
            {show ? 'Hide data table' : 'Show data table'}
          </button>
          <table
            className={cn(
              'teal-u-mt-2 teal-u-w-full teal-u-border-collapse teal-u-text-left teal-u-text-sm',
              !show && 'teal-u-sr-only',
            )}
          >
            <caption className="teal-u-sr-only">{label}</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="teal-u-border-b teal-u-border-outline-variant/30 teal-u-py-1 teal-u-pr-4 teal-u-font-medium teal-u-text-on-surface"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="teal-u-border-b teal-u-border-outline-variant/30 teal-u-py-1 teal-u-pr-4 teal-u-text-on-surface-variant"
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  )
})

export interface ChartAxisTick {
  /** Coordinate of the tick along the axis direction. */
  position: number
  /** Label rendered next to the tick. */
  label: string
}

export interface ChartAxisProps extends SVGAttributes<SVGGElement> {
  /** End coordinate of the axis line along its direction. */
  end: number
  /** Cross-axis coordinate of the axis line (y for an x axis, x for a y axis). */
  offset: number
  /** Axis orientation. */
  orientation: 'x' | 'y'
  /** Start coordinate of the axis line along its direction. */
  start: number
  /** Ticks drawn along the axis. */
  ticks: ChartAxisTick[]
}

export const ChartAxis = forwardRef<SVGGElement, ChartAxisProps>(function ChartAxis(
  { className, end, offset, orientation, start, ticks, ...props },
  ref,
) {
  return (
    <g ref={ref} aria-hidden="true" className={className} {...props}>
      {orientation === 'x' ? (
        <line x1={start} y1={offset} x2={end} y2={offset} stroke="var(--teal-color-outline-variant)" />
      ) : (
        <line x1={offset} y1={start} x2={offset} y2={end} stroke="var(--teal-color-outline-variant)" />
      )}
      {ticks.map((tick, index) =>
        orientation === 'x' ? (
          <g key={index}>
            <line x1={tick.position} y1={offset} x2={tick.position} y2={offset + 4} stroke="var(--teal-color-outline-variant)" />
            <text
              x={tick.position}
              y={offset + 16}
              textAnchor="middle"
              fontSize={11}
              fill="var(--teal-color-on-surface-variant)"
            >
              {tick.label}
            </text>
          </g>
        ) : (
          <g key={index}>
            <line x1={offset - 4} y1={tick.position} x2={offset} y2={tick.position} stroke="var(--teal-color-outline-variant)" />
            <text
              x={offset - 8}
              y={tick.position}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={11}
              fill="var(--teal-color-on-surface-variant)"
            >
              {tick.label}
            </text>
          </g>
        ),
      )}
    </g>
  )
})

export interface ChartGridProps extends SVGAttributes<SVGGElement> {
  /** End coordinate of each grid line along its direction. */
  end: number
  /** Line direction: horizontal lines (default) or vertical lines. */
  orientation?: 'horizontal' | 'vertical'
  /** Coordinate of each grid line along the cross axis. */
  positions: number[]
  /** Start coordinate of each grid line along its direction. */
  start: number
}

export const ChartGrid = forwardRef<SVGGElement, ChartGridProps>(function ChartGrid(
  { className, end, orientation = 'horizontal', positions, start, ...props },
  ref,
) {
  return (
    <g ref={ref} aria-hidden="true" className={className} {...props}>
      {positions.map((position, index) =>
        orientation === 'horizontal' ? (
          <line
            key={index}
            x1={start}
            y1={position}
            x2={end}
            y2={position}
            stroke="var(--teal-color-outline-variant)"
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        ) : (
          <line
            key={index}
            x1={position}
            y1={start}
            x2={position}
            y2={end}
            stroke="var(--teal-color-outline-variant)"
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        ),
      )}
    </g>
  )
})

export interface ChartLegendItem {
  /** Swatch color. */
  color: string
  /** Series or segment name. */
  name: string
}

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {
  /** Entries shown in the legend. */
  items: ChartLegendItem[]
}

export const ChartLegend = forwardRef<HTMLUListElement, ChartLegendProps>(function ChartLegend(
  { className, items, ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
      className={cn('teal-u-mt-2 teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-x-4 teal-u-gap-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <li key={item.name} className="teal-u-inline-flex teal-u-items-center teal-u-gap-1.5 teal-u-text-sm teal-u-text-on-surface-variant">
          <span
            aria-hidden="true"
            className="teal-u-inline-block teal-u-size-2.5 teal-u-rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  )
})
