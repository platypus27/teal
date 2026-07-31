import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '../src/Calendar'

// A fixed month keeps the grid deterministic: June 2025 starts on a Sunday.
const june2025 = new Date(2025, 5, 10)
const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(june2025)

describe('Calendar', () => {
  it('renders the month heading and a full six-week grid', () => {
    render(<Calendar value={null} onSelect={vi.fn()} visibleMonth={june2025} />)

    expect(screen.getByText(monthLabel)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^\d+$/ })).toHaveLength(42)
  })

  it('renders a seven-column weekday header', () => {
    const { container } = render(<Calendar value={null} onSelect={vi.fn()} visibleMonth={june2025} />)

    const grid = container.querySelector('.teal-u-grid-cols-7')
    expect(grid).toBeInTheDocument()
  })

  it('marks the selected date with aria-pressed and primary styling', () => {
    render(<Calendar value={new Date(2025, 5, 15)} onSelect={vi.fn()} visibleMonth={june2025} />)

    const selected = screen.getByRole('button', { name: '15' })
    expect(selected).toHaveAttribute('aria-pressed', 'true')
    expect(selected).toHaveClass('teal-u-bg-primary', 'teal-u-text-on-primary')
    expect(selected).not.toHaveClass('teal-u-text-on-surface')
  })

  it('marks today with aria-current="date"', () => {
    render(<Calendar value={null} onSelect={vi.fn()} />)

    const candidates = screen.getAllByRole('button', { name: String(new Date().getDate()) })
    expect(candidates.find((day) => day.getAttribute('aria-current') === 'date')).toBeDefined()
  })

  it('dims days outside the visible month', () => {
    render(<Calendar value={null} onSelect={vi.fn()} visibleMonth={june2025} />)

    // June 2025 ends Monday the 30th, so the grid's trailing July 1 is outside the month.
    const julyFirst = screen.getAllByRole('button', { name: '1' }).find((day) => day.className.includes('teal-u-text-on-surface-variant/50'))
    expect(julyFirst).toBeDefined()
  })

  it('calls onSelect with the clicked date', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Calendar value={null} onSelect={onSelect} visibleMonth={june2025} />)

    await user.click(screen.getByRole('button', { name: '20' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2025, 5, 20))
  })

  it('navigates months with the chevron buttons', async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    render(<Calendar value={null} onSelect={vi.fn()} visibleMonth={june2025} onMonthChange={onMonthChange} />)

    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 6, 1))

    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 4, 1))
  })

  it('changes the visible month internally when uncontrolled', async () => {
    const user = userEvent.setup()
    render(<Calendar value={june2025} onSelect={vi.fn()} />)

    expect(screen.getByText(monthLabel)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next month' }))

    const julyLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(2025, 6, 1))
    expect(screen.getByText(julyLabel)).toBeInTheDocument()
  })

  it('disables dates via the disabledDates predicate', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        value={null}
        onSelect={onSelect}
        visibleMonth={june2025}
        disabledDates={(date) => date.getDate() === 20 && date.getMonth() === 5}
      />,
    )

    const day20 = screen.getByRole('button', { name: '20' })
    expect(day20).toBeDisabled()
    await user.click(day20)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('disables dates outside the min/max range', () => {
    render(
      <Calendar
        value={null}
        onSelect={vi.fn()}
        visibleMonth={june2025}
        min={new Date(2025, 5, 14)}
        max={new Date(2025, 5, 20)}
      />,
    )

    expect(screen.getByRole('button', { name: '13' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '21' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '15' })).toBeEnabled()
  })
})
