import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateRangePicker } from '../src/DateRangePicker'

const dayFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const dayWithYearFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

function atMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayOfCurrentMonth(day: number) {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), day)
}

describe('DateRangePicker', () => {
  it('renders the label and placeholder', () => {
    render(<DateRangePicker label="Trip dates" />)

    const input = screen.getByRole('textbox', { name: 'Trip dates' })
    expect(input).toHaveAttribute('placeholder', 'Pick a date range')
    expect(input).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('selects a start then an end date, reports both steps, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Trip dates" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Trip dates' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '15' }))

    const from = dayOfCurrentMonth(15)
    expect(onChange).toHaveBeenLastCalledWith({ from, to: null })
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '20' }))

    const to = dayOfCurrentMonth(20)
    expect(onChange).toHaveBeenLastCalledWith({ from, to })
    expect(screen.queryByRole('button', { name: 'Next month' })).not.toBeInTheDocument()
    expect(input).toHaveValue(`${dayFormatter.format(from)} – ${dayWithYearFormatter.format(to)}`)
  })

  it('restarts the range when the second pick is before the start', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Trip dates" onChange={onChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Trip dates' }))
    await user.click(await screen.findByRole('button', { name: '20' }))
    await user.click(screen.getByRole('button', { name: '12' }))

    expect(onChange).toHaveBeenLastCalledWith({ from: dayOfCurrentMonth(12), to: null })
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })

  it('keeps the selection when reopened', async () => {
    const user = userEvent.setup()
    render(<DateRangePicker label="Trip dates" />)
    const input = screen.getByRole('textbox', { name: 'Trip dates' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '15' }))
    await user.click(screen.getByRole('button', { name: '20' }))

    await user.click(input)
    expect(await screen.findByRole('button', { name: '15' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '20' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('applies the Last 7 days preset ending today', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Trip dates" onChange={onChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Trip dates' }))
    await user.click(await screen.findByRole('button', { name: 'Last 7 days' }))

    const today = atMidnight(new Date())
    const from = new Date(today)
    from.setDate(from.getDate() - 6)
    expect(onChange).toHaveBeenLastCalledWith({ from, to: today })
    expect(screen.queryByRole('button', { name: 'Next month' })).not.toBeInTheDocument()
  })

  it('disables days matched by isDateDisabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DateRangePicker label="Trip dates" isDateDisabled={(date) => date.getDate() === 15} onChange={onChange} />,
    )

    await user.click(screen.getByRole('textbox', { name: 'Trip dates' }))
    const blocked = await screen.findByRole('button', { name: '15' })
    expect(blocked).toBeDisabled()

    await user.click(blocked)
    expect(onChange).not.toHaveBeenCalled()
  })
})
