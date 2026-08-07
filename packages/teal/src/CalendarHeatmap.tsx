import { forwardRef, type SVGAttributes } from 'react'
import { cn } from './cn'

export interface CalendarHeatmapDay {
  /** ISO date string, e.g. "2026-03-14". */
  date: string
  /** Intensity level from 0 (empty) to 4 (highest). */
  level: number
  /** Tooltip text; falls back to "Level N on <date>". */
  label?: string
}

export interface CalendarHeatmapProps extends Omit<SVGAttributes<SVGSVGElement>, 'aria-label'> {
  /** Accessible description of the calendar, applied as aria-label. */
  'aria-label': string
  /** Year to render. */
  year?: number
  /** Activity entries keyed by date; missing dates render as level 0. */
  data?: CalendarHeatmapDay[]
  /** Cell edge length in pixels. */
  cellSize?: number
  /** Gap between cells in pixels. */
  cellGap?: number
}

const CELL_FILL = 'var(--teal-color-primary)'
const EMPTY_FILL = 'var(--teal-color-surface-container-high)'
const TEXT_COLOR = 'var(--teal-color-on-surface-variant)'

const LEVEL_OPACITY = [0, 0.25, 0.45, 0.7, 1]

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAY_ROWS: Array<[number, string]> = [
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
]

const LEFT_PAD = 30
const TOP_PAD = 16

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export const CalendarHeatmap = forwardRef<SVGSVGElement, CalendarHeatmapProps>(function CalendarHeatmap(
  { 'aria-label': ariaLabel, className, year = new Date().getFullYear(), data = [], cellSize = 12, cellGap = 3, ...props },
  ref,
) {
  const byDate = new Map(data.map((entry) => [entry.date, entry]))

  const firstDay = new Date(Date.UTC(year, 0, 1))
  const startWeekday = firstDay.getUTCDay()
  const daysInYear = Math.round((Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86400000)
  const weekCount = Math.ceil((startWeekday + daysInYear) / 7)

  const pitch = cellSize + cellGap
  const width = LEFT_PAD + weekCount * pitch
  const height = TOP_PAD + 7 * pitch

  const days = Array.from({ length: daysInYear }, (_, offset) => {
    const date = new Date(Date.UTC(year, 0, 1 + offset))
    const iso = toISODate(date)
    const entry = byDate.get(iso)
    const level = Math.min(4, Math.max(0, Math.round(entry?.level ?? 0)))
    return {
      iso,
      month: date.getUTCMonth(),
      dayOfMonth: date.getUTCDate(),
      week: Math.floor((startWeekday + offset) / 7),
      weekday: (startWeekday + offset) % 7,
      level,
      label: entry?.label ?? `Level ${level} on ${iso}`,
    }
  })

  const monthLabels = days
    .filter((day) => day.dayOfMonth === 1)
    .map((day) => ({ week: day.week, name: MONTH_NAMES[day.month] }))

  const activeCount = data.filter((entry) => entry.level > 0).length
  const summary = `${activeCount} active day${activeCount === 1 ? '' : 's'} in ${year}`

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
        {monthLabels.map((month, index) => (
          <text key={index} x={LEFT_PAD + month.week * pitch} y={TOP_PAD - 6} fontSize={10} fill={TEXT_COLOR}>
            {month.name}
          </text>
        ))}
        {WEEKDAY_ROWS.map(([row, name]) => (
          <text
            key={name}
            x={LEFT_PAD - 6}
            y={TOP_PAD + row * pitch + cellSize / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={9}
            fill={TEXT_COLOR}
          >
            {name}
          </text>
        ))}
        {days.map((day) => (
          <rect
            key={day.iso}
            x={LEFT_PAD + day.week * pitch}
            y={TOP_PAD + day.weekday * pitch}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={day.level === 0 ? EMPTY_FILL : CELL_FILL}
            fillOpacity={day.level === 0 ? 1 : LEVEL_OPACITY[day.level]}
          >
            <title>{day.label}</title>
          </rect>
        ))}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </>
  )
})
