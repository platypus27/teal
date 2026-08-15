import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../src/Input'

describe('Input clearable/loading', () => {
  it('associates its label and description with the input', () => {
    render(<Input label="Search projects" description="Matches project names" clearable />)

    const input = screen.getByRole('textbox', { name: 'Search projects' })
    expect(input).toHaveAccessibleDescription('Matches project names')
  })

  it('reports typed text through onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Input label="Search" clearable onValueChange={onValueChange} />)

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'ab')

    expect(onValueChange).toHaveBeenLastCalledWith('ab')
  })

  it('shows a clear button for non-empty values and clears on click', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const onValueChange = vi.fn()
    render(<Input label="Search" clearable defaultValue="roadmap" onClear={onClear} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Clear input' }))

    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('')
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull()
  })

  it('replaces the clear button with a spinner in the SAME slot while loading (fix 1.8)', () => {
    const { container, rerender } = render(<Input label="Search" clearable defaultValue="roadmap" />)
    expect(container.querySelector('.teal-u-right-1')).toBeInTheDocument()

    rerender(<Input label="Search" clearable defaultValue="roadmap" loading />)

    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull()
    const status = screen.getByRole('status')
    expect(status).toHaveClass('teal-u-right-1') // no right-3 → right-1 jump
  })

  it('does not show a clear button when empty or disabled', () => {
    const { rerender } = render(<Input label="Search" clearable />)
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull()

    rerender(<Input label="Search" clearable defaultValue="x" disabled />)
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull()
  })
})

describe('Input password reveal', () => {
  it('renders as a password field by default', () => {
    render(<Input label="Password" type="password" />)

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('toggles the input type and aria-pressed with the visibility button', async () => {
    const user = userEvent.setup()
    render(<Input label="Password" type="password" />)

    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('reports value changes and supports a controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(<Input label="Password" type="password" onValueChange={onValueChange} />)
    await user.type(screen.getByLabelText('Password'), 's3cret')
    expect(onValueChange).toHaveBeenLastCalledWith('s3cret')

    rerender(<Input label="Password" type="password" value="hunter2" onValueChange={onValueChange} />)
    expect(screen.getByLabelText('Password')).toHaveValue('hunter2')
  })

  it('disables the input and the toggle together', () => {
    render(<Input label="Password" type="password" disabled />)

    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled()
  })
})
