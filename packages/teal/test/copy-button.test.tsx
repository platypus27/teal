import { act, fireEvent, render, screen } from '@testing-library/react'
import { CopyButton } from '../src/CopyButton'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}

describe('CopyButton', () => {
  it('renders the default label with a copy icon', () => {
    render(<CopyButton value="npm install @kryv/teal" />)
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument()
  })

  it('copies the value and swaps to the copied feedback for 1.6s', async () => {
    vi.useFakeTimers()
    const writeText = mockClipboard()
    render(<CopyButton value="pnpm add @kryv/teal" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await act(async () => {})

    expect(writeText).toHaveBeenCalledWith('pnpm add @kryv/teal')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1600)
    })
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('announces the feedback in an aria-live region', async () => {
    const { container } = render(<CopyButton value="hello" copiedLabel="Copied to clipboard" />)
    mockClipboard()

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await act(async () => {})

    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion).toHaveTextContent('Copied to clipboard')
  })

  it('still shows feedback when clipboard access fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<CopyButton value="secret" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await act(async () => {})

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('renders an icon-only button with an accessible label', () => {
    render(<CopyButton value="text" iconOnly label="Copy install command" />)

    const button = screen.getByRole('button', { name: 'Copy install command' })
    expect(button).not.toHaveTextContent('Copy install command')
  })

  it('forwards variant and size to the underlying button', () => {
    render(<CopyButton value="text" variant="secondary" size="sm" />)

    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button.className).toContain('teal-u-h-8')
    expect(button.className).toContain('teal-u-bg-surface')
  })
})
