import { fireEvent, render, screen } from '@testing-library/react'
import { AutosizeTextarea } from '../src/AutosizeTextarea'

function stubScrollHeight(element: HTMLElement, height: number) {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: height })
}

describe('AutosizeTextarea', () => {
  it('renders a labeled textarea', () => {
    render(<AutosizeTextarea label="Bio" />)

    expect(screen.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument()
  })

  it('links its description for assistive technology', () => {
    render(<AutosizeTextarea label="Bio" description="Markdown is supported" />)

    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAccessibleDescription('Markdown is supported')
  })

  it('grows with the content height', () => {
    render(<AutosizeTextarea label="Bio" />)

    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    stubScrollHeight(textarea, 120)
    fireEvent.change(textarea, { target: { value: 'a few\nlines\nof\ntext' } })

    expect(textarea.style.height).toBe('120px')
    expect(textarea.style.overflowY).toBe('hidden')
  })

  it('shrinks back down when content is removed', () => {
    render(<AutosizeTextarea label="Bio" defaultValue="x" />)

    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    stubScrollHeight(textarea, 120)
    fireEvent.change(textarea, { target: { value: 'lots\nof\ntext\nhere' } })
    expect(textarea.style.height).toBe('120px')

    stubScrollHeight(textarea, 40)
    fireEvent.change(textarea, { target: { value: 'ok' } })
    expect(textarea.style.height).toBe('40px')
  })

  it('caps growth at maxRows and scrolls beyond it', () => {
    render(<AutosizeTextarea label="Bio" maxRows={3} />)

    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    // jsdom reports no layout, so the line-height fallback is 20px: 3 rows = 60px.
    stubScrollHeight(textarea, 200)
    fireEvent.change(textarea, { target: { value: 'line\n'.repeat(20) } })

    expect(textarea.style.height).toBe('60px')
    expect(textarea.style.overflowY).toBe('auto')
  })

  it('passes change events through', () => {
    const onChange = vi.fn()
    render(<AutosizeTextarea label="Bio" onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), { target: { value: 'hello' } })

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
