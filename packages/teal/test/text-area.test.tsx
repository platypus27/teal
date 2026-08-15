import { fireEvent, render, screen } from '@testing-library/react'
import { TextArea } from '../src/Input'

function stubScrollHeight(element: HTMLElement, value: number) {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value })
}

describe('TextArea', () => {
  it('renders a plain resizable textarea by default', () => {
    render(<TextArea aria-label="Notes" />)

    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveClass('teal-u-min-h-28', 'teal-u-resize-y')
  })

  it('renders the label and description when given', () => {
    render(<TextArea label="Bio" description="Markdown is supported" />)

    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    expect(textarea).toHaveAccessibleDescription('Markdown is supported')
  })
})

describe('TextArea autosize', () => {
  it('grows with the content height', () => {
    render(<TextArea label="Bio" autosize defaultValue="hello" />)
    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    stubScrollHeight(textarea, 120)

    fireEvent.change(textarea, { target: { value: 'hello\nworld' } })

    expect(textarea.style.height).toBe('120px')
    expect(textarea.style.overflowY).toBe('hidden')
  })

  it('shrinks back down when content is removed', () => {
    render(<TextArea label="Bio" autosize defaultValue="hello" />)
    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    stubScrollHeight(textarea, 120)
    fireEvent.change(textarea, { target: { value: 'hello\nworld' } })

    stubScrollHeight(textarea, 40)
    fireEvent.change(textarea, { target: { value: 'hi' } })

    expect(textarea.style.height).toBe('40px')
  })

  it('caps growth at maxRows and scrolls beyond it', () => {
    render(<TextArea label="Bio" autosize maxRows={3} defaultValue="hello" />)
    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    stubScrollHeight(textarea, 400) // 20px line-height fallback → cap is 60px + extras

    fireEvent.change(textarea, { target: { value: 'lots' } })

    expect(textarea.style.height).toBe('60px')
    expect(textarea.style.overflowY).toBe('auto')
  })

  it('passes change events through', () => {
    const onChange = vi.fn()
    render(<TextArea label="Bio" autosize onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), { target: { value: 'x' } })

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
