import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../src/Checkbox'

describe('Checkbox', () => {
  it('reports changes as booleans', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Include archived" onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Include archived' }))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})

describe('Checkbox card variant', () => {
  it('renders a checkbox named by its label', () => {
    render(<Checkbox variant="card" label="Email digest" description="Weekly summary" />)

    const card = screen.getByRole('checkbox', { name: /Email digest/ })
    expect(card).toHaveAttribute('aria-checked', 'false')
    // Card markup owns its content: the description lives inside the button,
    // unlike the default variant where it renders in a sibling element.
    expect(card).toHaveTextContent('Weekly summary')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox variant="card" label="Email digest" onCheckedChange={onCheckedChange} />)
    const card = screen.getByRole('checkbox', { name: /Email digest/ })

    await user.click(card)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(card).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox variant="card" label="Email digest" onCheckedChange={onCheckedChange} />)

    screen.getByRole('checkbox', { name: /Email digest/ }).focus()
    await user.keyboard(' ')

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('supports a controlled checked state', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox variant="card" label="Email digest" checked={false} onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox', { name: /Email digest/ }))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox', { name: /Email digest/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('does not toggle when disabled and works independently in groups', async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    render(
      <>
        <Checkbox variant="card" label="Email digest" disabled onCheckedChange={first} />
        <Checkbox variant="card" label="SMS alerts" onCheckedChange={second} />
      </>,
    )

    const email = screen.getByRole('checkbox', { name: /Email digest/ })
    expect(email).toBeDisabled()
    await user.click(email)
    expect(first).not.toHaveBeenCalled()

    await user.click(screen.getByRole('checkbox', { name: /SMS alerts/ }))
    expect(second).toHaveBeenCalledWith(true)
  })
})
