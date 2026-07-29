import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagsInput } from '../src/TagsInput'

describe('TagsInput', () => {
  it('renders existing tags as chips', () => {
    render(<TagsInput value={['alpha', 'beta']} onChange={() => {}} />)

    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
  })

  it('adds a trimmed tag on Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagsInput value={['alpha']} onChange={onChange} placeholder="Add tag" />)

    await user.type(screen.getByLabelText('Add tag'), '  beta  {Enter}')

    expect(onChange).toHaveBeenCalledWith(['alpha', 'beta'])
  })

  it('adds a tag on comma and ignores duplicates', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagsInput value={['alpha']} onChange={onChange} />)

    const input = screen.getByLabelText('Add tag')
    await user.type(input, 'gamma,')
    expect(onChange).toHaveBeenCalledWith(['alpha', 'gamma'])

    onChange.mockClear()
    await user.type(input, 'alpha,')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes the last tag on Backspace when the input is empty', () => {
    const onChange = vi.fn()
    render(<TagsInput value={['alpha', 'beta']} onChange={onChange} />)

    fireEvent.keyDown(screen.getByLabelText('Add tag'), { key: 'Backspace' })

    expect(onChange).toHaveBeenCalledWith(['alpha'])
  })

  it('removes a tag via its chip remove button', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagsInput value={['alpha', 'beta']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove alpha' }))

    expect(onChange).toHaveBeenCalledWith(['beta'])
  })

  it('ignores new tags once max is reached', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagsInput value={['alpha', 'beta']} max={2} onChange={onChange} />)

    await user.type(screen.getByLabelText('Add tag'), 'gamma{Enter}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
