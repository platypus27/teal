import { render, screen } from '@testing-library/react'
import { Input } from '../src/Input'
import { InputAddon, InputGroup } from '../src/InputGroup'

describe('InputGroup', () => {
  it('renders leading and trailing addons around the input', () => {
    render(
      <InputGroup>
        <InputAddon position="leading">$</InputAddon>
        <Input aria-label="Price" />
        <InputAddon position="trailing">.00</InputAddon>
      </InputGroup>,
    )

    const input = screen.getByRole('textbox', { name: 'Price' })
    const leading = screen.getByText('$')
    const trailing = screen.getByText('.00')
    expect(leading.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(input.compareDocumentPosition(trailing) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('removes input rounding on attached sides', () => {
    const { container } = render(
      <InputGroup>
        <InputAddon position="leading">https://</InputAddon>
        <Input aria-label="Domain" />
      </InputGroup>,
    )

    const group = container.firstElementChild
    expect(group?.className).toContain('[&_input]:teal-u-rounded-l-none')
    expect(group?.className).not.toContain('[&_input]:teal-u-rounded-r-none')
  })

  it('keeps input rounding when there are no addons', () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Plain" />
      </InputGroup>,
    )

    const group = container.firstElementChild
    expect(group?.className).not.toContain('rounded-l-none')
    expect(group?.className).not.toContain('rounded-r-none')
  })
})
