import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RichTextEditor } from '../src/RichTextEditor'

function editor(): HTMLTextAreaElement {
  return screen.getByRole('textbox', { name: 'Body' }) as HTMLTextAreaElement
}

describe('RichTextEditor', () => {
  it('renders a formatting toolbar and a labelled textarea', () => {
    render(<RichTextEditor label="Body" placeholder="Write markdown" />)

    const toolbar = screen.getByRole('toolbar', { name: 'Text formatting' })
    expect(within(toolbar).getAllByRole('button')).toHaveLength(5)
    expect(editor()).toBeInTheDocument()
  })

  it('wraps the selection with bold markers and unwraps it again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue="hello world" onChange={onChange} />)

    editor().setSelectionRange(0, 5)
    await user.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onChange).toHaveBeenLastCalledWith('**hello** world')
    expect(editor().value).toBe('**hello** world')

    editor().setSelectionRange(2, 7)
    await user.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onChange).toHaveBeenLastCalledWith('hello world')
  })

  it('wraps the selection with italic markers', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue="note" onChange={onChange} />)

    editor().setSelectionRange(0, 4)
    await user.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onChange).toHaveBeenLastCalledWith('*note*')
  })

  it('toggles the heading prefix on the selected lines', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue={'Title\nBody line'} onChange={onChange} />)

    editor().setSelectionRange(0, 5)
    await user.click(screen.getByRole('button', { name: 'Heading' }))
    expect(onChange).toHaveBeenLastCalledWith('## Title\nBody line')

    editor().setSelectionRange(0, 8)
    await user.click(screen.getByRole('button', { name: 'Heading' }))
    expect(onChange).toHaveBeenLastCalledWith('Title\nBody line')
  })

  it('toggles list markers on every selected line', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue={'one\ntwo'} onChange={onChange} />)

    editor().setSelectionRange(0, 7)
    await user.click(screen.getByRole('button', { name: 'Bulleted list' }))
    expect(onChange).toHaveBeenLastCalledWith('- one\n- two')
  })

  it('turns the selection into a markdown link and selects the URL', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue="see docs" onChange={onChange} />)

    editor().setSelectionRange(4, 8)
    await user.click(screen.getByRole('button', { name: 'Insert link' }))

    expect(onChange).toHaveBeenLastCalledWith('see [docs](https://)')
    const textarea = editor()
    expect(textarea.selectionStart).toBe(11)
    expect(textarea.selectionEnd).toBe(19)
  })

  it('renders markdown in the preview pane', () => {
    render(<RichTextEditor label="Body" preview defaultValue={'## Quarter plan\n\n- Ship **bold** work\n- Read [the guide](https://example.com)'} />)

    const preview = screen.getByRole('region', { name: 'Preview' })
    expect(within(preview).getByRole('heading', { name: 'Quarter plan' })).toBeInTheDocument()
    expect(within(preview).getAllByRole('listitem')).toHaveLength(2)
    expect(within(preview).getByText('bold').tagName).toBe('STRONG')
    expect(within(preview).getByRole('link', { name: 'the guide' })).toHaveAttribute('href', 'https://example.com')
  })

  it('shows a placeholder in the preview when the text is empty', () => {
    render(<RichTextEditor label="Body" preview />)

    expect(screen.getByRole('region', { name: 'Preview' })).toHaveTextContent('Nothing to preview')
  })

  it('respects the controlled value', () => {
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" value="locked" onChange={onChange} />)

    fireEvent.change(editor(), { target: { value: 'locked!' } })
    expect(onChange).toHaveBeenCalledWith('locked!')
    expect(editor().value).toBe('locked')
  })

  it('applies bold and italic with keyboard shortcuts', () => {
    const onChange = vi.fn()
    render(<RichTextEditor label="Body" defaultValue="hello world" onChange={onChange} />)

    const textarea = editor()
    textarea.setSelectionRange(0, 5)
    fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true })
    expect(onChange).toHaveBeenLastCalledWith('**hello** world')

    textarea.setSelectionRange(10, 15)
    fireEvent.keyDown(textarea, { key: 'i', metaKey: true })
    expect(onChange).toHaveBeenLastCalledWith('**hello** *world*')
    expect(textarea.value).toBe('**hello** *world*')
  })

  it('reports the active wrap format with aria-pressed', async () => {
    const user = userEvent.setup()
    render(<RichTextEditor label="Body" defaultValue="a **bold** word" />)

    const bold = screen.getByRole('button', { name: 'Bold' })
    expect(bold).toHaveAttribute('aria-pressed', 'false')

    const textarea = editor()
    textarea.setSelectionRange(4, 8)
    fireEvent.select(textarea)
    expect(bold).toHaveAttribute('aria-pressed', 'true')

    await user.click(bold)
    expect(bold).toHaveAttribute('aria-pressed', 'false')
    expect(textarea.value).toBe('a bold word')
  })

  it('reports line-prefix formats with aria-pressed', () => {
    render(<RichTextEditor label="Body" defaultValue={'## Title\n- item'} />)

    expect(screen.getByRole('button', { name: 'Heading' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Bulleted list' })).toHaveAttribute('aria-pressed', 'false')

    const textarea = editor()
    textarea.setSelectionRange(9, 13)
    fireEvent.select(textarea)
    expect(screen.getByRole('button', { name: 'Bulleted list' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Heading' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('announces formatting actions to screen readers', async () => {
    const user = userEvent.setup()
    render(<RichTextEditor label="Body" defaultValue="hello" />)

    editor().setSelectionRange(0, 5)
    await user.click(screen.getByRole('button', { name: 'Bold' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Bold applied'))

    await user.click(screen.getByRole('button', { name: 'Bold' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Bold removed'))
  })
})
