import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MentionInput } from '../src/MentionInput'

const options = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'alan', label: 'Alan Turing' },
  { value: 'grace', label: 'Grace Hopper' },
]

describe('MentionInput', () => {
  it('renders a labelled textarea', () => {
    render(<MentionInput label="Comment" placeholder="Write something" options={options} />)

    expect(screen.getByRole('textbox', { name: 'Comment' })).toBeInTheDocument()
  })

  it('opens the mention popup when @ is typed and filters by query', async () => {
    const user = userEvent.setup()
    render(<MentionInput label="Comment" options={options} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' })

    await user.type(textarea, '@')
    expect(await screen.findByRole('listbox', { name: 'Mentions' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)

    await user.type(textarea, 'ala')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'Alan Turing' })).toBeInTheDocument()
  })

  it('inserts the highlighted mention as a plain text token', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onMentionSelect = vi.fn()
    render(<MentionInput label="Comment" options={options} onChange={onChange} onMentionSelect={onMentionSelect} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement

    await user.type(textarea, 'Thanks @')
    await screen.findByRole('listbox', { name: 'Mentions' })
    await user.keyboard('{ArrowDown}{Enter}')

    expect(textarea.value).toBe('Thanks @Alan Turing ')
    expect(onChange).toHaveBeenLastCalledWith('Thanks @Alan Turing ')
    expect(onMentionSelect).toHaveBeenCalledWith({ value: 'alan', label: 'Alan Turing' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('keeps focus in the textarea and exposes aria-activedescendant', async () => {
    const user = userEvent.setup()
    render(<MentionInput label="Comment" options={options} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' })

    await user.type(textarea, '@gra')
    await screen.findByRole('listbox', { name: 'Mentions' })

    expect(textarea).toHaveFocus()
    expect(textarea).toHaveAttribute('aria-controls', screen.getByRole('listbox', { name: 'Mentions' }).id)
    expect(textarea).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Grace Hopper' }).id)
  })

  it('dismisses the popup with Escape without changing the text', async () => {
    const user = userEvent.setup()
    render(<MentionInput label="Comment" options={options} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement

    await user.type(textarea, '@ad')
    await screen.findByRole('listbox', { name: 'Mentions' })
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(textarea.value).toBe('@ad')
    expect(textarea).not.toHaveAttribute('aria-controls')
    expect(textarea).not.toHaveAttribute('aria-activedescendant')
  })

  it('does not open the popup for an @ inside a word', async () => {
    const user = userEvent.setup()
    render(<MentionInput label="Comment" options={options} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' })

    await user.type(textarea, 'mail@ada')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('supports the controlled value', async () => {
    const onChange = vi.fn()
    render(<MentionInput label="Comment" options={options} value="draft" onChange={onChange} />)
    const textarea = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement

    expect(textarea.value).toBe('draft')
    fireEvent.change(textarea, { target: { value: 'draft @', selectionStart: 7 } })
    expect(onChange).toHaveBeenCalledWith('draft @')
    expect(textarea.value).toBe('draft')
  })
})
