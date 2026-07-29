import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from '../src/RadioGroup'

const options = [
  { value: 'private', label: 'Private', description: 'Only invited members can view' },
  { value: 'team', label: 'Team' },
  { value: 'public', label: 'Public', disabled: true },
]

describe('RadioGroup', () => {
  it('renders a labeled group with its options and description', () => {
    render(<RadioGroup label="Project visibility" description="Who can open this project" options={options} />)

    const group = screen.getByRole('radiogroup', { name: 'Project visibility' })
    expect(group).toBeInTheDocument()
    expect(group).toHaveAccessibleDescription('Who can open this project')
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('selects an option on click', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<RadioGroup label="Project visibility" options={options} onValueChange={onValueChange} />)

    const radio = screen.getByRole('radio', { name: 'Team' })
    await user.click(radio)
    expect(onValueChange).toHaveBeenCalledWith('team')
    expect(radio).toHaveAttribute('aria-checked', 'true')
  })

  it('selects an option by clicking its label', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<RadioGroup label="Project visibility" options={options} onValueChange={onValueChange} />)

    await user.click(screen.getByText('Private'))
    expect(onValueChange).toHaveBeenCalledWith('private')
    expect(screen.getByRole('radio', { name: 'Private' })).toHaveAttribute('aria-checked', 'true')
  })

  it('moves the selection with arrow keys', async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup label="Project visibility" options={options} defaultValue="private" onValueChange={onValueChange} />,
    )

    // Radix moves roving focus in a timeout after keydown; the keyup must come
    // after focus lands so the newly focused radio still clicks itself.
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Private' }), { key: 'ArrowDown' })
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('team'))
    fireEvent.keyUp(screen.getByRole('radio', { name: 'Team' }), { key: 'ArrowDown' })

    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus()
  })

  it('does not select disabled options', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<RadioGroup label="Project visibility" options={options} onValueChange={onValueChange} />)

    const disabled = screen.getByRole('radio', { name: 'Public' })
    expect(disabled).toBeDisabled()
    await user.click(disabled)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(disabled).toHaveAttribute('aria-checked', 'false')
  })

  it('marks the group required and invalid when requested', () => {
    render(<RadioGroup label="Project visibility" options={options} required aria-invalid="true" />)

    const group = screen.getByRole('radiogroup', { name: 'Project visibility' })
    expect(group).toHaveAttribute('aria-required', 'true')
    expect(group).toHaveAttribute('aria-invalid', 'true')
  })
})
