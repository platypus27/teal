import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareButton } from '../src/ShareButton'

function mockClipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return writeText
}

describe('ShareButton', () => {
  it('renders a share trigger button', () => {
    render(<ShareButton url="https://example.com/post/1" />)

    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
  })

  it('opens a popover with a copy-link action', async () => {
    const user = userEvent.setup()
    mockClipboard()
    render(<ShareButton url="https://example.com/post/1" />)

    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(await screen.findByRole('button', { name: 'Copy link' })).toBeInTheDocument()
  })

  it('copies the url to the clipboard and shows feedback', async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<ShareButton url="https://example.com/post/1" />)

    await user.click(screen.getByRole('button', { name: 'Share' }))
    await user.click(await screen.findByRole('button', { name: 'Copy link' }))

    expect(writeText).toHaveBeenCalledWith('https://example.com/post/1')
    expect(await screen.findByRole('button', { name: 'Link copied' })).toBeInTheDocument()
  })

  it('still gives feedback when clipboard access fails', async () => {
    const user = userEvent.setup()
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    render(<ShareButton url="https://example.com/post/1" />)

    await user.click(screen.getByRole('button', { name: 'Share' }))
    await user.click(await screen.findByRole('button', { name: 'Copy link' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Link copied' })).toBeInTheDocument())
  })

  it('falls back to the current page URL when url is omitted', async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<ShareButton />)

    await user.click(screen.getByRole('button', { name: 'Share' }))
    await user.click(await screen.findByRole('button', { name: 'Copy link' }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('shows the native share action only when navigator.share exists', async () => {
    const user = userEvent.setup()
    mockClipboard()
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })

    render(<ShareButton url="https://example.com/post/1" title="Post" />)

    await user.click(screen.getByRole('button', { name: 'Share' }))
    await user.click(await screen.findByRole('button', { name: 'Share via…' }))

    expect(share).toHaveBeenCalledWith({ title: 'Post', url: 'https://example.com/post/1' })

    delete (navigator as { share?: unknown }).share
  })
})
