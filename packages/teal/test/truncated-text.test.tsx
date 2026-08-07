import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TruncatedText } from '../src/TruncatedText'

const longText = 'A very long piece of text that will not fit inside the constrained container width'

describe('TruncatedText', () => {
  it('renders the text without a toggle when it fits', () => {
    render(<TruncatedText text="short text" />)

    expect(screen.getByText('short text')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('offers a show more toggle with a title tooltip when truncated', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)

    render(<TruncatedText text={longText} />)

    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(longText)).toHaveAttribute('title', longText)
  })

  it('expands and collapses the text with the toggle', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
    const user = userEvent.setup()

    render(<TruncatedText text={longText} />)

    await user.click(screen.getByRole('button', { name: 'Show more' }))

    const collapse = screen.getByRole('button', { name: 'Show less' })
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(longText)).not.toHaveAttribute('title')

    await user.click(collapse)
    expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument()
  })

  it('uses custom toggle labels', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)

    render(<TruncatedText text={longText} lines={3} showMoreLabel="Read more" showLessLabel="Read less" />)

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument()
  })
})
