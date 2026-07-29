import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinInput } from '../src/PinInput'

describe('PinInput', () => {
  it('renders one accessibly labelled input per cell', () => {
    render(<PinInput />)

    expect(screen.getByRole('group', { name: 'One-time code' })).toBeInTheDocument()
    expect(screen.getAllByLabelText(/^Digit \d of 6$/)).toHaveLength(6)
    expect(screen.getByLabelText('Digit 1 of 6')).toBeInTheDocument()
  })

  it('auto-advances while typing and completes when every cell is filled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onComplete = vi.fn()
    render(<PinInput onChange={onChange} onComplete={onComplete} />)

    await user.type(screen.getByLabelText('Digit 1 of 6'), '123456')

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith('123456')
    expect(onChange).toHaveBeenLastCalledWith('123456')
    expect(screen.getByLabelText('Digit 6 of 6')).toHaveValue('6')
  })

  it('filters out non-numeric input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PinInput onChange={onChange} />)

    const first = screen.getByLabelText('Digit 1 of 6')
    await user.type(first, 'a')

    expect(first).toHaveValue('')
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('moves to the previous cell on Backspace in an empty cell', async () => {
    const user = userEvent.setup()
    render(<PinInput />)

    await user.type(screen.getByLabelText('Digit 1 of 6'), '1')
    expect(screen.getByLabelText('Digit 2 of 6')).toHaveFocus()

    await user.keyboard('{Backspace}')
    expect(screen.getByLabelText('Digit 1 of 6')).toHaveFocus()
  })

  it('distributes pasted digits across cells', () => {
    const onComplete = vi.fn()
    render(<PinInput onComplete={onComplete} />)

    fireEvent.paste(screen.getByLabelText('Digit 1 of 6'), {
      clipboardData: { getData: () => '4 5 6789' },
    })

    expect(screen.getByLabelText('Digit 1 of 6')).toHaveValue('4')
    expect(screen.getByLabelText('Digit 6 of 6')).toHaveValue('9')
    expect(onComplete).toHaveBeenCalledWith('456789')
  })

  it('masks the cells when masked is set', () => {
    render(<PinInput masked length={4} />)

    const cells = screen.getAllByLabelText(/^Digit \d of 4$/)
    expect(cells).toHaveLength(4)
    for (const cell of cells) {
      expect(cell).toHaveAttribute('type', 'password')
    }
  })
})
