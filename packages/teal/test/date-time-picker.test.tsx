import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateTimePicker } from '../src/DateTimePicker'

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date)
}

describe('DateTimePicker', () => {
  it('renders the label and placeholder with the popover closed', () => {
    render(<DateTimePicker label="Starts at" />)

    const input = screen.getByRole('textbox', { name: 'Starts at' })
    expect(input).toHaveAttribute('placeholder', 'Pick a date and time')
    expect(input).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('button', { name: 'Next month' })).not.toBeInTheDocument()
  })

  it('opens on click showing the calendar and time fields', async () => {
    const user = userEvent.setup()
    render(<DateTimePicker label="Starts at" defaultValue={new Date(2024, 0, 15, 9, 30)} />)

    await user.click(screen.getByRole('textbox', { name: 'Starts at' }))

    expect(await screen.findByText(monthLabel(new Date(2024, 0, 1)))).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Hour' })).toHaveValue('09')
    expect(screen.getByRole('textbox', { name: 'Minutes' })).toHaveValue('30')
    expect(await screen.findByRole('button', { name: '15' })).toHaveFocus()
  })

  it('selects a day keeping the time, then closes with Done', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DateTimePicker label="Starts at" defaultValue={new Date(2024, 0, 15, 9, 30)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Starts at' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '20' }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 20, 9, 30))
    // The popover stays open so the time can be adjusted.
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
    expect(input).toHaveValue(new Date(2024, 0, 20, 9, 30).toLocaleString())

    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('button', { name: 'Next month' })).not.toBeInTheDocument()
  })

  it('editing the time commits the merged date', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DateTimePicker label="Starts at" defaultValue={new Date(2024, 0, 15, 9, 30)} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Starts at' }))
    fireEvent.change(await screen.findByRole('textbox', { name: 'Hour' }), { target: { value: '14' } })

    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 15, 14, 30))
  })

  it('supports arrow-key navigation across month boundaries', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DateTimePicker label="Starts at" defaultValue={new Date(2024, 0, 30, 9, 30)} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Starts at' }))
    expect(await screen.findByRole('button', { name: '30' })).toHaveFocus()
    await user.keyboard('{ArrowRight}{ArrowRight}')

    expect(await screen.findByText(monthLabel(new Date(2024, 1, 1)))).toBeInTheDocument()
    // February 1 shares its label with March 1 in the grid, so check the focused date key.
    expect(document.activeElement).toHaveAttribute('data-date', '2024-1-1')
    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 1, 1, 9, 30))
  })

  it('does not change the displayed value when controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<DateTimePicker label="Starts at" value={new Date(2024, 0, 15, 9, 30)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Starts at' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '20' }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 20, 9, 30))
    expect(input).toHaveValue(new Date(2024, 0, 15, 9, 30).toLocaleString())
  })

  it('disables days outside the min/max range', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DateTimePicker
        label="Starts at"
        defaultValue={new Date(2024, 0, 15, 9, 30)}
        minDate={new Date(2024, 0, 12)}
        maxDate={new Date(2024, 0, 18)}
        onValueChange={onValueChange}
      />,
    )

    await user.click(screen.getByRole('textbox', { name: 'Starts at' }))
    expect(await screen.findByRole('button', { name: '11' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '20' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '11' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
