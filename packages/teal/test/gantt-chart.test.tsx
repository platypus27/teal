import { render, screen } from '@testing-library/react'
import { GanttChart, type GanttTask } from '../src/GanttChart'

const tasks: GanttTask[] = [
  { id: 'design', label: 'Design', start: '2025-03-03', end: '2025-03-05' },
  { id: 'build', label: 'Build', start: '2025-03-06', end: '2025-03-12' },
]

describe('GanttChart', () => {
  it('renders an SVG with an accessible name and one bar per task', () => {
    render(<GanttChart tasks={tasks} label="Release plan" today="2025-03-04" />)

    const chart = screen.getByRole('img', { name: 'Release plan' })
    expect(chart).toBeInTheDocument()
    expect(chart.querySelectorAll('rect')).toHaveLength(2)
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
  })

  it('sizes each bar to its day span', () => {
    render(<GanttChart tasks={tasks} today="2025-03-04" />)

    const bars = screen.getByRole('img').querySelectorAll('rect')
    // Design spans 3 days at 28px per day; Build spans 7 days.
    expect(bars[0]).toHaveAttribute('width', '84')
    expect(bars[1]).toHaveAttribute('width', '196')
  })

  it('derives the axis from the task dates unless startDate and endDate are given', () => {
    render(<GanttChart tasks={tasks} startDate="2025-03-01" endDate="2025-03-07" today="2025-03-04" />)

    const chart = screen.getByRole('img')
    // 7 days at 28px each plus the 160px label column.
    expect(chart).toHaveAttribute('width', '356')
  })

  it('shows a today marker only when today falls inside the axis', () => {
    const { rerender } = render(<GanttChart tasks={tasks} today="2025-03-04" />)
    expect(screen.getByTestId('today-marker')).toBeInTheDocument()

    rerender(<GanttChart tasks={tasks} today="2025-04-01" />)
    expect(screen.queryByTestId('today-marker')).not.toBeInTheDocument()
  })

  it('exposes a text summary of the tasks for screen readers', () => {
    render(<GanttChart tasks={tasks} label="Release plan" today="2025-03-04" />)

    expect(screen.getByText('Design: 2025-03-03 to 2025-03-05. Build: 2025-03-06 to 2025-03-12')).toBeInTheDocument()
  })
})
