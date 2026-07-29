import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editable } from '../src/Editable'

describe('Editable', () => {
  it('shows the value in preview mode and switches to an input on click', async () => {
    const user = userEvent.setup()
    render(<Editable defaultValue="hello" />)

    await user.click(screen.getByRole('button', { name: 'hello' }))

    const input = screen.getByRole('textbox', { name: 'text' })
    expect(input).toHaveValue('hello')
    expect(input).toHaveFocus()
  })

  it('commits the draft on Enter and reports it', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onChange = vi.fn()
    render(<Editable defaultValue="hello" onSubmit={onSubmit} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'hello' }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'world{Enter}')

    expect(onChange).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('world')
    expect(screen.getByRole('button', { name: 'world' })).toBeInTheDocument()
  })

  it('commits the draft on blur', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Editable defaultValue="hello" onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'hello' }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'bye')
    fireEvent.blur(input)

    expect(onSubmit).toHaveBeenCalledWith('bye')
    expect(screen.getByRole('button', { name: 'bye' })).toBeInTheDocument()
  })

  it('cancels on Escape without committing', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Editable defaultValue="hello" onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'hello' }))
    await user.type(screen.getByRole('textbox'), 'x{Escape}')

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'hello' })).toBeInTheDocument()
  })

  it('shows the placeholder when the value is empty and opens via the edit button', async () => {
    const user = userEvent.setup()
    render(<Editable placeholder="Click to edit" />)

    expect(screen.getByRole('button', { name: 'Click to edit' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit text' }))
    expect(screen.getByRole('textbox')).toHaveFocus()
  })
})
