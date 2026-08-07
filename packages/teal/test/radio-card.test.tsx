import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioCard } from '../src/RadioCard'

const plans = [
  { value: 'starter', title: 'Starter', description: 'For side projects' },
  { value: 'pro', title: 'Pro', description: 'For growing teams' },
  { value: 'enterprise', title: 'Enterprise', description: 'For large orgs' },
]

describe('RadioCard', () => {
  it('renders a radiogroup with one radio per card', () => {
    render(<RadioCard label="Choose a plan" options={plans} />)

    expect(screen.getByRole('radiogroup', { name: 'Choose a plan' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: /Pro/ })).toBeInTheDocument()
  })

  it('selects a card on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioCard label="Choose a plan" options={plans} defaultValue="starter" onChange={onChange} />)

    const pro = screen.getByRole('radio', { name: /Pro/ })
    await user.click(pro)

    expect(onChange).toHaveBeenCalledWith('pro')
    expect(pro).toHaveAttribute('aria-checked', 'true')
  })

  it('moves selection and focus with arrow keys', () => {
    const onChange = vi.fn()
    render(<RadioCard label="Choose a plan" options={plans} defaultValue="starter" onChange={onChange} />)

    const starter = screen.getByRole('radio', { name: /Starter/ })
    starter.focus()
    fireEvent.keyDown(starter, { key: 'ArrowDown' })

    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveFocus()
    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('aria-checked', 'true')
  })

  it('wraps around at the bounds and skips disabled cards', () => {
    const onChange = vi.fn()
    render(
      <RadioCard
        label="Choose a plan"
        defaultValue="enterprise"
        onChange={onChange}
        options={[
          { value: 'starter', title: 'Starter', description: 'For side projects' },
          { value: 'pro', title: 'Pro', description: 'For growing teams', disabled: true },
          { value: 'enterprise', title: 'Enterprise', description: 'For large orgs' },
        ]}
      />,
    )

    const enterprise = screen.getByRole('radio', { name: /Enterprise/ })
    enterprise.focus()
    fireEvent.keyDown(enterprise, { key: 'ArrowRight' })

    // Wrapping past the end lands on Starter, jumping over disabled Pro.
    expect(onChange).toHaveBeenCalledWith('starter')
    expect(screen.getByRole('radio', { name: /Starter/ })).toHaveFocus()
    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('jumps to the first and last card with Home and End', () => {
    const onChange = vi.fn()
    render(<RadioCard label="Choose a plan" options={plans} defaultValue="pro" onChange={onChange} />)

    const pro = screen.getByRole('radio', { name: /Pro/ })
    pro.focus()
    fireEvent.keyDown(pro, { key: 'End' })
    expect(screen.getByRole('radio', { name: /Enterprise/ })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('radio', { name: /Enterprise/ }), { key: 'Home' })
    expect(onChange).toHaveBeenCalledWith('starter')
    expect(screen.getByRole('radio', { name: /Starter/ })).toHaveFocus()
  })

  it('keeps the selected card as the only tab stop', () => {
    render(<RadioCard label="Choose a plan" options={plans} defaultValue="pro" />)

    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('tabIndex', '0')
    expect(screen.getByRole('radio', { name: /Starter/ })).toHaveAttribute('tabIndex', '-1')
    expect(screen.getByRole('radio', { name: /Enterprise/ })).toHaveAttribute('tabIndex', '-1')
  })

  it('supports a controlled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioCard label="Choose a plan" options={plans} value="starter" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: /Pro/ }))

    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: /Starter/ })).toHaveAttribute('aria-checked', 'true')
  })
})
