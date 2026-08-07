import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YearPicker } from '../src/YearPicker'

describe('YearPicker', () => {
  it('renders the label and placeholder with the popover closed', () => {
    render(<YearPicker label="Graduation year" />)

    const input = screen.getByRole('textbox', { name: 'Graduation year' })
    expect(input).toHaveAttribute('placeholder', 'Pick a year')
    expect(input).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('button', { name: 'Next decade' })).not.toBeInTheDocument()
  })

  it('opens on click showing the decade page of the selected year', async () => {
    const user = userEvent.setup()
    render(<YearPicker label="Graduation year" defaultValue={new Date(2024, 0, 1)} />)

    await user.click(screen.getByRole('textbox', { name: 'Graduation year' }))

    expect(await screen.findByText('2016 – 2027')).toBeInTheDocument()
    const selected = await screen.findByRole('button', { name: '2024' })
    expect(selected).toHaveAttribute('aria-pressed', 'true')
    expect(selected).toHaveFocus()
  })

  it('pages decades with the header buttons', async () => {
    const user = userEvent.setup()
    render(<YearPicker label="Graduation year" defaultValue={new Date(2024, 0, 1)} />)

    await user.click(screen.getByRole('textbox', { name: 'Graduation year' }))
    await user.click(await screen.findByRole('button', { name: 'Next decade' }))
    expect(await screen.findByText('2028 – 2039')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous decade' }))
    await user.click(screen.getByRole('button', { name: 'Previous decade' }))
    expect(await screen.findByText('2004 – 2015')).toBeInTheDocument()
  })

  it('selects a year, reports January 1, and closes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<YearPicker label="Graduation year" defaultValue={new Date(2024, 0, 1)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Graduation year' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '2026' }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 1))
    expect(input).toHaveValue('2026')
    expect(screen.queryByRole('button', { name: 'Next decade' })).not.toBeInTheDocument()
  })

  it('moves focus with arrow keys across page boundaries', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<YearPicker label="Graduation year" defaultValue={new Date(2024, 0, 1)} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Graduation year' }))
    expect(await screen.findByRole('button', { name: '2024' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: '2027' })).toHaveFocus()
    // Crossing the page edge shifts the visible range.
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByText('2028 – 2039')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2028' })).toHaveFocus()

    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('button', { name: '2034' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: '2028' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: '2039' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2039, 0, 1))
  })

  it('does not change the displayed value when controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<YearPicker label="Graduation year" value={new Date(2024, 0, 1)} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox', { name: 'Graduation year' })

    await user.click(input)
    await user.click(await screen.findByRole('button', { name: '2026' }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 1))
    expect(input).toHaveValue('2024')
  })

  it('disables years outside the min/max range', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <YearPicker
        label="Graduation year"
        defaultValue={new Date(2024, 0, 1)}
        minDate={new Date(2021, 0, 1)}
        maxDate={new Date(2026, 0, 1)}
        onValueChange={onValueChange}
      />,
    )

    await user.click(screen.getByRole('textbox', { name: 'Graduation year' }))
    expect(await screen.findByRole('button', { name: '2020' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '2027' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '2020' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
