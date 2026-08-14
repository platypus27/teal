import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

  it('owns the border, rounding and focus-within highlight as one box', () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Price" />
      </InputGroup>,
    )

    const group = container.firstElementChild
    expect(group?.className).toContain('teal-input-group')
    expect(group?.className).toContain('teal-u-rounded-xl')
    expect(group?.className).toContain('teal-u-border-[color:var(--teal-border-subtle)]')
    expect(group?.className).toContain('focus-within:teal-u-border-primary')
  })

  it('strips the inner input of its own border, background and focus ring', () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Price" />
      </InputGroup>,
    )

    const group = container.firstElementChild
    expect(group?.className).toContain('[&_input]:teal-u-border-0')
    expect(group?.className).toContain('[&_input]:teal-u-bg-transparent')
    expect(group?.className).toContain('[&_input]:focus-visible:teal-u-shadow-none')
  })

  it('renders addons borderless with a hairline separator on the inner side', () => {
    render(
      <InputGroup>
        <InputAddon position="leading">$</InputAddon>
        <Input aria-label="Price" />
        <InputAddon position="trailing">.00</InputAddon>
      </InputGroup>,
    )

    const leading = screen.getByText('$')
    const trailing = screen.getByText('.00')
    expect(leading.className).toContain('teal-u-border-r')
    expect(leading.className).not.toContain('teal-u-border-l')
    expect(trailing.className).toContain('teal-u-border-l')
    expect(trailing.className).not.toContain('teal-u-border-r')
    expect(leading.className).not.toContain('teal-u-rounded')
    expect(trailing.className).not.toContain('teal-u-rounded')
  })

  it('highlights the whole group when the inner input is invalid', () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Price" aria-invalid="true" />
      </InputGroup>,
    )

    const group = container.firstElementChild
    expect(group?.className).toContain('[&:has(input[aria-invalid=true])]:teal-u-border-error')
    expect(group?.className).toContain('[&:has(input[aria-invalid=true])]:teal-u-shadow-')
  })

  it('gives the group the same ring, outline and forced-colors treatment as a standalone input', () => {
    const css = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8')

    const rule = /\.teal-input-group:focus-within\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(rule).toContain('box-shadow: var(--teal-focus-ring)')
    expect(rule).toContain('outline: 2px solid transparent')
    expect(rule).toContain('outline-offset: 2px')

    const forced = /@media \(forced-colors: active\)\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? ''
    expect(forced).toContain('.teal-input-group:focus-within')
    expect(forced).toContain('outline-color: Highlight')
  })
})
