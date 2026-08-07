import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckboxCard } from '../src/CheckboxCard'

describe('CheckboxCard', () => {
  it('renders a checkbox named by its title', () => {
    render(<CheckboxCard title="Email digest" description="A weekly summary" />)

    expect(screen.getByRole('checkbox', { name: /Email digest/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<CheckboxCard title="Email digest" onCheckedChange={onCheckedChange} />)

    const card = screen.getByRole('checkbox', { name: /Email digest/ })
    await user.click(card)

    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(card).toHaveAttribute('aria-checked', 'true')

    await user.click(card)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
    expect(card).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<CheckboxCard title="Email digest" onCheckedChange={onCheckedChange} />)

    screen.getByRole('checkbox').focus()
    await user.keyboard(' ')

    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('supports a controlled checked state', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<CheckboxCard title="Email digest" checked={false} onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<CheckboxCard title="Email digest" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))

    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('works independently in groups', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <CheckboxCard title="Design updates" defaultChecked />
        <CheckboxCard title="Research updates" />
      </div>,
    )

    await user.click(screen.getByRole('checkbox', { name: /Research updates/ }))

    expect(screen.getByRole('checkbox', { name: /Design updates/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('checkbox', { name: /Research updates/ })).toHaveAttribute('aria-checked', 'true')
  })
})
