import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonthPicker } from '../src/MonthPicker'

const shortMonth = new Intl.DateTimeFormat(undefined, { month: 'short' })
const longMonth = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })

function monthName(month: number) {
  return shortMonth.format(new Date(2024, month, 1))
}

describe('MonthPicker', () => {
  it('renders the label and placeholder with the popover closed', () => {
    render(<MonthPicker label="Billing month" />)

    const input = screen.getByRole('textbox', { name: 'Billing month' })
    expect(input).toHaveAttribute('placeholder', 'Pick a month')
    expect(input).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('button', { name: 'Next year' })).not.toBeInTheDocument()
  })

  it('opens on click showing twelve months of the selected year', async () => {
    const user = userEvent.setup()
    render(<MonthPicker label="Billing month" defaultValue={new Date(2024, 5, 1)} />)

    await user.click(screen.getByRole('textbox', { name: 'Billing month' }))

    expect(await screen.findByText('2024')).toBeInTheDocument()
    const june = await screen.findByRole('button', { name: monthName(5) })
    expect(june).toHaveAttribute('aria-pressed', 'true')
    expect(june).toHaveFocus()
    expect(screen.getByRole('group', { name: 'Months' })).toBeInTheDocument()
  })

  it('steps the year with the header buttons', async () => {
    const user = userEvent.setup()
    render(<MonthPicker label="Billing month" defaultValue={new Date(2024, 5, 1)} />)

    await user.click(screen.getByRole('textbox', { name: 'Billing month' }))
    await user.click(await screen.findByRole('button', { name: 'Next year' }))
    expect(screen.getByText('2025')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous year' }))
    await user.click(screen.getByRole('button', { name: 'Previous year' }))
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('selects a month, reports the first day, and closes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MonthPicker label="Billing month" defaultValue={new Date(2024, 5, 1)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Billing month' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: monthName(2) }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 1))
    expect(input).toHaveValue(longMonth.format(new Date(2024, 2, 1)))
    expect(screen.queryByRole('button', { name: 'Next year' })).not.toBeInTheDocument()
  })

  it('moves focus with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MonthPicker label="Billing month" defaultValue={new Date(2024, 5, 1)} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Billing month' }))
    expect(await screen.findByRole('button', { name: monthName(5) })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: monthName(6) })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: monthName(9) })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: monthName(0) })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: monthName(11) })).toHaveFocus()

    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(screen.getByRole('button', { name: monthName(5) })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 5, 1))
  })

  it('clamps arrow-key movement at January and December', async () => {
    const user = userEvent.setup()
    render(<MonthPicker label="Billing month" defaultValue={new Date(2024, 0, 1)} />)

    await user.click(screen.getByRole('textbox', { name: 'Billing month' }))
    expect(await screen.findByRole('button', { name: monthName(0) })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('button', { name: monthName(0) })).toHaveFocus()
  })

  it('does not change the displayed value when controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MonthPicker label="Billing month" value={new Date(2024, 5, 1)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Billing month' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: monthName(2) }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 2, 1))
    expect(input).toHaveValue(longMonth.format(new Date(2024, 5, 1)))
  })

  it('disables months outside the min/max range', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MonthPicker
        label="Billing month"
        defaultValue={new Date(2024, 5, 1)}
        minDate={new Date(2024, 2, 1)}
        maxDate={new Date(2024, 8, 1)}
        onValueChange={onValueChange}
      />,
    )

    await user.click(screen.getByRole('textbox', { name: 'Billing month' }))
    expect(await screen.findByRole('button', { name: monthName(1) })).toBeDisabled()
    expect(screen.getByRole('button', { name: monthName(10) })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: monthName(1) }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
