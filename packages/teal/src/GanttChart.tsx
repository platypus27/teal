import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface GanttTask {
  /** End date (inclusive) as YYYY-MM-DD. */
  end: string
  /** Stable, unique id for the task. */
  id: string
  /** Task label rendered to the left of its bar. */
  label: string
  /** Start date as YYYY-MM-DD. */
  start: string
}

export interface GanttChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Last day on the axis as YYYY-MM-DD; defaults to the latest task end. */
  endDate?: string
  /** Accessible name for the chart. */
  label?: string
  /** First day on the axis as YYYY-MM-DD; defaults to the earliest task start. */
  startDate?: string
  /** Tasks to plot, top to bottom. */
  tasks: GanttTask[]
  /** Date highlighted with a marker line as YYYY-MM-DD; defaults to the current day. */
  today?: string
}

const DAY_WIDTH = 28
const ROW_HEIGHT = 36
const LABEL_WIDTH = 160
const HEADER_HEIGHT = 28
const BAR_HEIGHT = 16

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDay(value: string): number {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / 86400000
}

function formatDay(dayNumber: number): { day: number; month: string } {
  const date = new Date(dayNumber * 86400000)
  return { day: date.getUTCDate(), month: MONTHS[date.getUTCMonth()] ?? '' }
}

function localToday(): string {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** A read-only SVG Gantt chart: task bars on a day grid with a today marker. */
export const GanttChart = forwardRef<HTMLDivElement, GanttChartProps>(function GanttChart(
  { className, endDate, label = 'Gantt chart', startDate, tasks, today, ...props },
  ref,
) {
  const resolvedToday = today ?? localToday()
  const fallbackDay = parseDay(resolvedToday)
  const rangeStart =
    startDate !== undefined
      ? parseDay(startDate)
      : tasks.length > 0
        ? Math.min(...tasks.map((task) => parseDay(task.start)))
        : fallbackDay
  const rangeEnd =
    endDate !== undefined
      ? parseDay(endDate)
      : tasks.length > 0
        ? Math.max(...tasks.map((task) => parseDay(task.end)))
        : fallbackDay
  const totalDays = Math.max(1, rangeEnd - rangeStart + 1)
  const chartWidth = LABEL_WIDTH + totalDays * DAY_WIDTH
  const chartHeight = HEADER_HEIGHT + tasks.length * ROW_HEIGHT
  const todayDay = parseDay(resolvedToday)
  const showToday = todayDay >= rangeStart && todayDay <= rangeEnd

  const days = Array.from({ length: totalDays }, (_, index) => rangeStart + index)

  const summary = tasks.map((task) => `${task.label}: ${task.start} to ${task.end}`).join('. ')

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        'teal-focus-ring teal-u-overflow-x-auto teal-u-rounded-2xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface-container',
        className,
      )}
      {...props}
    >
      <svg
        role="img"
        aria-label={label}
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="teal-u-block teal-u-text-on-surface"
      >
        {days.map((day, index) => {
          const { day: dayOfMonth, month } = formatDay(day)
          const x = LABEL_WIDTH + index * DAY_WIDTH
          return (
            <g key={day}>
              <line
                x1={x}
                y1={HEADER_HEIGHT - 6}
                x2={x}
                y2={chartHeight}
                stroke="var(--teal-color-outline-variant)"
                strokeWidth={0.5}
              />
              <text x={x + DAY_WIDTH / 2} y={HEADER_HEIGHT - 14} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>
                {dayOfMonth}
              </text>
              {dayOfMonth === 1 || index === 0 ? (
                <text x={x + 2} y={HEADER_HEIGHT - 4} fontSize={9} fontWeight={600} fill="currentColor" opacity={0.7}>
                  {month}
                </text>
              ) : null}
            </g>
          )
        })}
        {tasks.map((task, index) => {
          const startDay = parseDay(task.start)
          const endDay = parseDay(task.end)
          const x = LABEL_WIDTH + (startDay - rangeStart) * DAY_WIDTH
          const width = Math.max(DAY_WIDTH, (endDay - startDay + 1) * DAY_WIDTH)
          const y = HEADER_HEIGHT + index * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2
          return (
            <g key={task.id}>
              <line
                x1={0}
                y1={HEADER_HEIGHT + (index + 1) * ROW_HEIGHT}
                x2={chartWidth}
                y2={HEADER_HEIGHT + (index + 1) * ROW_HEIGHT}
                stroke="var(--teal-color-outline-variant)"
                strokeWidth={0.5}
              />
              <text x={8} y={y + BAR_HEIGHT / 2 + 3.5} fontSize={11} fill="currentColor">
                {task.label}
              </text>
              <rect x={x} y={y} width={width} height={BAR_HEIGHT} rx={3} fill="var(--teal-color-primary)" />
            </g>
          )
        })}
        {showToday ? (
          <g data-testid="today-marker">
            <line
              x1={LABEL_WIDTH + (todayDay - rangeStart) * DAY_WIDTH + DAY_WIDTH / 2}
              y1={HEADER_HEIGHT - 6}
              x2={LABEL_WIDTH + (todayDay - rangeStart) * DAY_WIDTH + DAY_WIDTH / 2}
              y2={chartHeight}
              stroke="var(--teal-color-error)"
              strokeWidth={2}
            />
          </g>
        ) : null}
      </svg>
      <span className="teal-u-sr-only">{summary}</span>
    </div>
  )
})
