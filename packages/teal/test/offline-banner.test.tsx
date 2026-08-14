import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OfflineBanner } from '../src/OfflineBanner'

describe('OfflineBanner', () => {
  it('renders nothing while online', () => {
    const { container } = render(<OfflineBanner />)

    expect(container.firstChild).toBeNull()
  })

  it('appears as a polite live region when the browser goes offline', () => {
    render(<OfflineBanner />)

    fireEvent(window, new Event('offline'))

    const banner = screen.getByRole('status')
    expect(banner).toHaveAttribute('aria-live', 'polite')
    expect(banner).toHaveTextContent('You are offline')
  })

  it('disappears again when the connection returns', () => {
    render(<OfflineBanner />)

    fireEvent(window, new Event('offline'))
    expect(screen.getByRole('status')).toBeInTheDocument()

    fireEvent(window, new Event('online'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('is dismissible and calls onDismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<OfflineBanner onDismiss={onDismiss} />)

    fireEvent(window, new Event('offline'))
    await user.click(screen.getByRole('button', { name: 'Dismiss offline notification' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('reappears on the next offline event after being dismissed', async () => {
    const user = userEvent.setup()
    render(<OfflineBanner />)

    fireEvent(window, new Event('offline'))
    await user.click(screen.getByRole('button', { name: 'Dismiss offline notification' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    fireEvent(window, new Event('online'))
    fireEvent(window, new Event('offline'))
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('supports a custom message', () => {
    render(<OfflineBanner message="Connection lost — retrying" />)

    fireEvent(window, new Event('offline'))

    expect(screen.getByRole('status')).toHaveTextContent('Connection lost — retrying')
  })

  it('uses warning-emphasis tokens instead of a low-emphasis surface', () => {
    render(<OfflineBanner />)

    fireEvent(window, new Event('offline'))

    const banner = screen.getByRole('status')
    expect(banner.className).toContain('color-mix(in_srgb,var(--teal-color-warning)_14%,var(--teal-color-surface))')
    expect(banner.className).toContain('teal-u-text-on-surface')
    expect(banner.className).not.toContain('teal-u-bg-surface-container-high')
  })
})
