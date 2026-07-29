import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordInput } from '../src/PasswordInput'

describe('PasswordInput', () => {
  it('renders as a password field by default', () => {
    render(<PasswordInput label="Password" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('toggles the input type and aria-pressed with the visibility button', async () => {
    const user = userEvent.setup()
    render(<PasswordInput label="Password" />)

    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports value changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<PasswordInput label="Password" onValueChange={onValueChange} />)

    await user.type(screen.getByLabelText('Password'), 's3cret')
    expect(onValueChange).toHaveBeenLastCalledWith('s3cret')
  })

  it('supports a controlled value', () => {
    render(<PasswordInput label="Password" value="hunter2" onValueChange={() => undefined} />)
    expect(screen.getByLabelText('Password')).toHaveValue('hunter2')
  })

  it('disables the input and the toggle together', () => {
    render(<PasswordInput label="Password" disabled />)
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled()
  })

  it('connects its description for assistive technology', () => {
    render(<PasswordInput label="Password" description="Use at least 12 characters" />)
    expect(screen.getByLabelText('Password')).toHaveAccessibleDescription('Use at least 12 characters')
  })
})
