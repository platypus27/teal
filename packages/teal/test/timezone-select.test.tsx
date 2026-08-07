import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimezoneSelect } from '../src/TimezoneSelect'

describe('TimezoneSelect', () => {
  it('renders a combobox with the label and placeholder', () => {
    render(<TimezoneSelect label="Time zone" />)

    const input = screen.getByRole('combobox', { name: 'Time zone' })
    expect(input).toHaveAttribute('placeholder', 'Select a time zone')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens on focus listing the curated zones with UTC offsets', async () => {
    const user = userEvent.setup()
    render(<TimezoneSelect label="Time zone" />)

    await user.click(screen.getByRole('combobox', { name: 'Time zone' }))

    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThanOrEqual(30)
    expect(screen.getByRole('option', { name: /Tokyo \(UTC[+-]\d{2}:\d{2}\)/ })).toBeInTheDocument()
  })

  it('filters by the typed text and reports the IANA id on selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimezoneSelect label="Time zone" onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Time zone' })

    await user.click(input)
    await user.type(input, 'york')

    const option = await screen.findByRole('option', { name: /New York \(UTC[+-]\d{2}:\d{2}\)/ })
    expect(screen.getAllByRole('option')).toHaveLength(1)

    await user.click(option)
    expect(onValueChange).toHaveBeenCalledWith('America/New_York')
    expect(input).toHaveValue(option.textContent)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects the highlighted option with the keyboard', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimezoneSelect label="Time zone" onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Time zone' })

    await user.click(input)
    await screen.findByRole('listbox')
    await user.keyboard('{ArrowDown}{Enter}')

    // The highlight starts on the first zone; one ArrowDown lands on Sydney.
    expect(onValueChange).toHaveBeenCalledWith('Australia/Sydney')
  })

  it('shows the selected zone label for an uncontrolled default value', () => {
    render(<TimezoneSelect label="Time zone" defaultValue="Europe/Berlin" />)

    const input = screen.getByRole('combobox', { name: 'Time zone' }) as HTMLInputElement
    expect(input.value).toMatch(/^Berlin \(UTC[+-]\d{2}:\d{2}\)$/)
  })

  it('resolves the controlled value to its zone label', () => {
    render(<TimezoneSelect label="Time zone" value="Asia/Tokyo" onValueChange={vi.fn()} />)

    const input = screen.getByRole('combobox', { name: 'Time zone' }) as HTMLInputElement
    expect(input.value).toMatch(/^Tokyo \(UTC[+-]\d{2}:\d{2}\)$/)
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<TimezoneSelect label="Time zone" />)
    const input = screen.getByRole('combobox', { name: 'Time zone' })

    await user.click(input)
    await user.type(input, 'zzz-no-such-zone')

    expect(await screen.findByText('No matching time zones')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })
})
