import { fireEvent, render, screen } from '@testing-library/react'
import { MonthGrid } from '../src/MonthGrid'
import { addMonths, dateKey, monthFormatter } from '../src/date-utils'

const june2025 = new Date(2025, 5, 15)

describe('MonthGrid', () => {
  it('renders the month header and navigates months from the arrow buttons', () => {
    const onMonthChange = vi.fn()
    render(<MonthGrid month={june2025} isDayDisabled={() => false} onMonthChange={onMonthChange} onSelect={() => undefined} />)

    expect(screen.getByText(monthFormatter.format(june2025))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(onMonthChange).toHaveBeenLastCalledWith(addMonths(june2025, -1))

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(onMonthChange).toHaveBeenLastCalledWith(addMonths(june2025, 1))
  })

  it('selects a day on click and marks it pressed', () => {
    const onSelect = vi.fn()
    render(
      <MonthGrid month={june2025} selected={new Date(2025, 5, 16)} isDayDisabled={() => false} onMonthChange={() => undefined} onSelect={onSelect} />,
    )

    fireEvent.click(screen.getByRole('button', { name: '16' }))
    expect(onSelect).toHaveBeenCalledWith(new Date(2025, 5, 16))
    expect(screen.getByRole('button', { name: '16' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('disables days the picker reports as disabled', () => {
    render(
      <MonthGrid month={june2025} isDayDisabled={(day) => day.getDay() === 0} onMonthChange={() => undefined} onSelect={() => undefined} />,
    )

    // June 15 2025 is a Sunday.
    expect(screen.getByRole('button', { name: '15' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '16' })).toBeEnabled()
  })

  it('marks today with aria-current', () => {
    const { container } = render(
      <MonthGrid month={new Date()} isDayDisabled={() => false} onMonthChange={() => undefined} onSelect={() => undefined} />,
    )

    expect(container.querySelector('button[aria-current="date"]')).toBeInTheDocument()
  })

  it('renders a range as pressed endpoints inside band cells', () => {
    const { container } = render(
      <MonthGrid
        month={june2025}
        range={{ from: new Date(2025, 5, 20), to: new Date(2025, 5, 25) }}
        isDayDisabled={() => false}
        onMonthChange={() => undefined}
        onSelect={() => undefined}
      />,
    )

    expect(screen.getByRole('button', { name: '20' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '25' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '22' })).not.toHaveAttribute('aria-pressed')
    const bandCell = container.querySelector(`[data-date-cell="${dateKey(new Date(2025, 5, 22))}"]`)
    expect(bandCell).toHaveClass('teal-u-bg-primary/10')
  })

  it('wires roving tabindex and focus reporting when keyboard mode is on', () => {
    const onFocusDay = vi.fn()
    render(
      <MonthGrid
        month={june2025}
        keyboard
        focusedDate={new Date(2025, 5, 16)}
        isDayDisabled={() => false}
        onMonthChange={() => undefined}
        onSelect={() => undefined}
        onFocusDay={onFocusDay}
      />,
    )

    const focused = screen.getByRole('button', { name: '16' })
    expect(focused).toHaveAttribute('data-date', dateKey(new Date(2025, 5, 16)))
    expect(focused).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: '17' })).toHaveAttribute('tabindex', '-1')

    fireEvent.focus(focused)
    expect(onFocusDay).toHaveBeenCalledWith(new Date(2025, 5, 16))
  })
})
