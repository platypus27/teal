import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface HeatmapRow {
  /** Label rendered on the left of the row. */
  label: string
  /** Cell values in column order. */
  values: number[]
}

export interface HeatmapProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the matrix, applied as aria-label. */
  'aria-label': string
  /** Rows of the matrix, top to bottom. */
  rows: HeatmapRow[]
  /** Column labels rendered above the grid. */
  columnLabels: string[]
  /** Cell edge length in pixels. */
  cellSize?: number
  /** Gap between cells in pixels. */
  cellGap?: number
}

const CELL_FILL = 'var(--teal-color-primary)'
const EMPTY_FILL = 'var(--teal-color-surface-container-high)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const ROW_LABEL_WIDTH = 96
const COLUMN_LABEL_HEIGHT = 20

export const Heatmap = forwardRef<SVGSVGElement, HeatmapProps>(function Heatmap(
  { 'aria-label': ariaLabel, className, rows, columnLabels, cellSize = 28, cellGap = 4, ...props },
  ref,
) {
  const allValues = rows.flatMap((row) => row.values)
  const min = allValues.length > 0 ? Math.min(...allValues) : 0
  const max = allValues.length > 0 ? Math.max(...allValues) : 1
  const range = max - min || 1

  const width = ROW_LABEL_WIDTH + columnLabels.length * (cellSize + cellGap)
  const height = COLUMN_LABEL_HEIGHT + rows.length * (cellSize + cellGap)

  function cellFill(value: number) {
    const ratio = (value - min) / range
    if (ratio === 0 && min === max) return EMPTY_FILL
    return CELL_FILL
  }

  function cellOpacity(value: number) {
    if (allValues.length === 0) return 1
    const ratio = (value - min) / range
    return 0.15 + ratio * 0.85
  }

  const summary =
    rows.length === 0
      ? 'No data'
      : `Min ${min}, max ${max}; ` +
        rows.map((row) => `${row.label}: ${row.values.join(', ')}`).join('; ')

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
        {columnLabels.map((column, columnIndex) => (
          <text
            key={columnIndex}
            x={ROW_LABEL_WIDTH + columnIndex * (cellSize + cellGap) + cellSize / 2}
            y={COLUMN_LABEL_HEIGHT - 8}
            textAnchor="middle"
            fontSize={10}
            fill={TEXT_COLOR}
          >
            {column}
          </text>
        ))}
        {rows.map((row, rowIndex) => (
          <g key={rowIndex}>
            <text
              x={ROW_LABEL_WIDTH - 8}
              y={COLUMN_LABEL_HEIGHT + rowIndex * (cellSize + cellGap) + cellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={11}
              fill={TEXT_COLOR}
            >
              {row.label}
            </text>
            {row.values.map((value, columnIndex) => (
              <rect
                key={columnIndex}
                x={ROW_LABEL_WIDTH + columnIndex * (cellSize + cellGap)}
                y={COLUMN_LABEL_HEIGHT + rowIndex * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                rx={4}
                fill={cellFill(value)}
                fillOpacity={cellOpacity(value)}
              >
                <title>{`${row.label}, ${columnLabels[columnIndex] ?? columnIndex}: ${value}`}</title>
              </rect>
            ))}
          </g>
        ))}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
