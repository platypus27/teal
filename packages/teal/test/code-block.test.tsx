import { act, fireEvent, render, screen } from '@testing-library/react'
import { CodeBlock } from '../src/CodeBlock'

const code = 'npm install @kryv/teal\nnpm run dev'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}

describe('CodeBlock', () => {
  it('renders the code and language label', () => {
    const { container } = render(<CodeBlock code={code} language="bash" />)

    expect(container.querySelector('pre code')).toHaveTextContent('npm install @kryv/teal')
    expect(container.querySelector('pre')).toHaveAttribute('tabindex', '0')
    expect(container.querySelector('pre')).toHaveClass('teal-focus-ring')
    expect(container.querySelector('pre code')).toHaveTextContent('npm run dev')
    expect(screen.getByText('bash')).toBeInTheDocument()
  })

  it('falls back to a generic label when no language is given', () => {
    render(<CodeBlock code={code} />)

    expect(screen.getByText('code')).toBeInTheDocument()
  })

  it('renders one line number per line when showLineNumbers is set', () => {
    const { container } = render(<CodeBlock code={code} showLineNumbers />)

    const numbers = container.querySelectorAll('pre [aria-hidden="true"]')
    expect(numbers).toHaveLength(2)
    expect(numbers[0]).toHaveTextContent('1')
    expect(numbers[1]).toHaveTextContent('2')
    expect(screen.getByText('npm install @kryv/teal')).toBeInTheDocument()
  })

  it('copies the code to the clipboard and swaps the icon back after 2s', async () => {
    vi.useFakeTimers()
    const writeText = mockClipboard()
    render(<CodeBlock code={code} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    await act(async () => {})

    expect(writeText).toHaveBeenCalledWith(code)
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('still shows feedback when clipboard access fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<CodeBlock code={code} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    await act(async () => {})

    expect(writeText).toHaveBeenCalledWith(code)
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })
})
