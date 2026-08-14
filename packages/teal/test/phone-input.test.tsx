import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from '../src/PhoneInput'

describe('PhoneInput', () => {
  it('renders a country dropdown and a number input', () => {
    render(<PhoneInput label="Phone" />)

    expect(screen.getByRole('combobox', { name: 'Country calling code' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument()
  })

  it('emits an E.164-ish string as the national number is typed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PhoneInput label="Phone" onChange={onChange} />)

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '4155552671')

    expect(onChange).toHaveBeenLastCalledWith('+14155552671')
  })

  it('switches the dialing prefix from the country dropdown', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PhoneInput label="Phone" defaultValue="+14155552671" onChange={onChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Country calling code' }))
    await user.click(await screen.findByRole('option', { name: 'United Kingdom (+44)' }))

    expect(onChange).toHaveBeenLastCalledWith('+444155552671')
  })

  it('emits undefined when the number is emptied', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PhoneInput label="Phone" defaultValue="+14155552671" onChange={onChange} />)

    await user.clear(screen.getByRole('textbox', { name: 'Phone' }))

    expect(onChange).toHaveBeenLastCalledWith(undefined)
  })

  it('strips non-digit characters from the national number', () => {
    const onChange = vi.fn()
    render(<PhoneInput label="Phone" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Phone' })
    fireEvent.change(input, { target: { value: '(415) 555-2671' } })

    expect(onChange).toHaveBeenLastCalledWith('+14155552671')
    expect(input).toHaveValue('4155552671')
  })

  it('parses the controlled value into country and national number', () => {
    render(<PhoneInput label="Phone" value="+442071234567" onChange={() => {}} />)

    expect(screen.getByRole('combobox', { name: 'Country calling code' })).toHaveTextContent('+44')
    expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveValue('2071234567')
  })

  it('renders the country list on the shared popover surface', async () => {
    const user = userEvent.setup()
    render(<PhoneInput label="Phone" />)

    await user.click(screen.getByRole('combobox', { name: 'Country calling code' }))

    await screen.findByRole('listbox')
    expect(document.querySelector('.teal-popper-content.teal-overlay-surface')).not.toBeNull()
    expect(screen.getByRole('option', { name: 'Germany (+49)' })).toBeInTheDocument()
  })
})
