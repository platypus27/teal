import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransferList } from '../src/TransferList'

const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ops', label: 'Operations' },
]

describe('TransferList', () => {
  it('renders two multi-selectable listboxes with all options in the source', () => {
    render(<TransferList options={options} sourceLabel="Available teams" targetLabel="Chosen teams" />)

    const source = screen.getByRole('listbox', { name: 'Available teams' })
    const target = screen.getByRole('listbox', { name: 'Chosen teams' })
    expect(source).toHaveAttribute('aria-multiselectable', 'true')
    expect(target).toHaveAttribute('aria-multiselectable', 'true')
    expect(within(source).getAllByRole('option')).toHaveLength(4)
    expect(within(target).getByRole('option', { name: 'No options' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('moves clicked selections to the target with the move button', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TransferList options={options} onValueChange={onValueChange} />)

    const source = screen.getByRole('listbox', { name: 'Available' })
    await user.click(within(source).getByRole('option', { name: 'Design' }))
    expect(within(source).getByRole('option', { name: 'Design' })).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('button', { name: 'Move selected to Selected' }))
    expect(onValueChange).toHaveBeenCalledWith(['design'])

    const target = screen.getByRole('listbox', { name: 'Selected' })
    expect(within(source).queryByRole('option', { name: 'Design' })).not.toBeInTheDocument()
    expect(within(target).getByRole('option', { name: 'Design' })).toBeInTheDocument()
  })

  it('moves items back to the source', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TransferList options={options} defaultValue={['design', 'ops']} onValueChange={onValueChange} />)

    const target = screen.getByRole('listbox', { name: 'Selected' })
    expect(within(target).getAllByRole('option')).toHaveLength(2)

    await user.click(within(target).getByRole('option', { name: 'Operations' }))
    await user.click(screen.getByRole('button', { name: 'Move selected to Available' }))

    expect(onValueChange).toHaveBeenCalledWith(['design'])
    expect(within(target).queryByRole('option', { name: 'Operations' })).not.toBeInTheDocument()
  })

  it('moves the focused option with Enter and navigates with arrows', () => {
    const onValueChange = vi.fn()
    render(<TransferList options={options} onValueChange={onValueChange} />)

    const source = screen.getByRole('listbox', { name: 'Available' })
    const design = within(source).getByRole('option', { name: 'Design' })

    fireEvent.keyDown(design, { key: 'ArrowDown' })
    const engineering = within(source).getByRole('option', { name: 'Engineering' })
    expect(engineering).toHaveFocus()

    fireEvent.keyDown(engineering, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith(['engineering'])

    const target = screen.getByRole('listbox', { name: 'Selected' })
    expect(within(target).getByRole('option', { name: 'Engineering' })).toHaveFocus()
  })

  it('toggles selection with Space and moves every selected option with Enter', () => {
    const onValueChange = vi.fn()
    render(<TransferList options={options} onValueChange={onValueChange} />)

    const source = screen.getByRole('listbox', { name: 'Available' })
    const design = within(source).getByRole('option', { name: 'Design' })
    const engineering = within(source).getByRole('option', { name: 'Engineering' })

    fireEvent.keyDown(design, { key: ' ' })
    fireEvent.keyDown(engineering, { key: ' ' })
    expect(design).toHaveAttribute('aria-selected', 'true')
    expect(engineering).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(engineering, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith(['design', 'engineering'])
  })

  it('does not move disabled options', () => {
    const onValueChange = vi.fn()
    render(<TransferList options={[{ value: 'locked', label: 'Locked', disabled: true }, ...options]} onValueChange={onValueChange} />)

    const source = screen.getByRole('listbox', { name: 'Available' })
    const locked = within(source).getByRole('option', { name: 'Locked' })
    expect(locked).toHaveAttribute('aria-disabled', 'true')

    fireEvent.keyDown(locked, { key: 'Enter' })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('respects the controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TransferList options={options} value={['design']} onValueChange={onValueChange} />)

    const source = screen.getByRole('listbox', { name: 'Available' })
    await user.click(within(source).getByRole('option', { name: 'Marketing' }))
    await user.click(screen.getByRole('button', { name: 'Move selected to Selected' }))

    expect(onValueChange).toHaveBeenCalledWith(['design', 'marketing'])
    expect(within(source).getByRole('option', { name: 'Marketing' })).toBeInTheDocument()
  })
})
