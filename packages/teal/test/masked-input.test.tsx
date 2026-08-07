import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MaskedInput } from '../src/MaskedInput'

describe('MaskedInput', () => {
  it('renders a labeled textbox with the mask as placeholder', () => {
    render(<MaskedInput label="Expiry date" mask="##/##" />)

    const input = screen.getByRole('textbox', { name: 'Expiry date' })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', '##/##')
  })

  it('inserts mask literals while typing digits', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MaskedInput label="Date" mask="##/##/####" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Date' })
    await user.type(input, '12312024')

    expect(input).toHaveValue('12/31/2024')
    expect(onChange).toHaveBeenLastCalledWith('12/31/2024')
  })

  it('removes the last digit on backspace', () => {
    render(<MaskedInput label="Date" mask="##/##/####" defaultValue="12/31" />)

    const input = screen.getByRole('textbox', { name: 'Date' })
    fireEvent.change(input, { target: { value: '12/3' } })

    expect(input).toHaveValue('12/3')
  })

  it('ignores digits beyond the mask capacity', () => {
    const onChange = vi.fn()
    render(<MaskedInput label="Code" mask="###-###" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Code' })
    fireEvent.change(input, { target: { value: '123456789' } })

    expect(input).toHaveValue('123-456')
    expect(onChange).toHaveBeenLastCalledWith('123-456')
  })

  it('keeps the caret after the last filled slot', () => {
    render(<MaskedInput label="Date" mask="##/##/####" />)

    const input = screen.getByRole('textbox', { name: 'Date' }) as HTMLInputElement
    fireEvent.change(input, { target: { value: '1231' } })

    expect(input).toHaveValue('12/31')
    expect(input.selectionStart).toBe(5)
    expect(input.selectionEnd).toBe(5)
  })

  it('re-masks the controlled value', () => {
    render(<MaskedInput label="Date" mask="##/##/####" value="01022025" onChange={() => {}} />)

    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('01/02/2025')
  })
})
