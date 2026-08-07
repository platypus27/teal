import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurrencyInput } from '../src/CurrencyInput'

describe('CurrencyInput', () => {
  it('renders a labeled textbox with the currency symbol', () => {
    render(<CurrencyInput label="Invoice total" />)

    expect(screen.getByRole('textbox', { name: 'Invoice total' })).toBeInTheDocument()
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('shows the symbol for the requested currency and locale', () => {
    render(<CurrencyInput label="Price" currency="EUR" locale="de-DE" />)

    expect(screen.getByText('€')).toBeInTheDocument()
  })

  it('emits the parsed numeric amount while typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CurrencyInput label="Amount" onChange={onChange} />)

    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '1234.5')

    expect(onChange).toHaveBeenLastCalledWith(1234.5)
  })

  it('emits undefined when the field is emptied', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CurrencyInput label="Amount" defaultValue={10} onChange={onChange} />)

    await user.clear(screen.getByRole('textbox', { name: 'Amount' }))

    expect(onChange).toHaveBeenLastCalledWith(undefined)
  })

  it('formats the amount with Intl.NumberFormat on blur', async () => {
    const user = userEvent.setup()
    render(<CurrencyInput label="Amount" />)

    const input = screen.getByRole('textbox', { name: 'Amount' })
    await user.type(input, '1234.5')
    fireEvent.blur(input)

    expect(input).toHaveValue('1,234.50')
  })

  it('clamps to min and max on blur', () => {
    const onChange = vi.fn()
    render(<CurrencyInput label="Amount" min={5} max={100} onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Amount' })
    fireEvent.change(input, { target: { value: '250' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenLastCalledWith(100)
    expect(input).toHaveValue('100.00')
  })

  it('renders the controlled value formatted and keeps draft edits local', () => {
    render(<CurrencyInput label="Amount" value={42} onChange={() => {}} />)

    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue('42.00')
  })
})
