import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkipLink } from '../src/SkipLink'

describe('SkipLink', () => {
  it('renders a link to the main content', () => {
    render(<SkipLink />)

    const link = screen.getByRole('link', { name: 'Skip to content' })
    expect(link).toHaveAttribute('href', '#main')
  })

  it('is visually hidden until focused', () => {
    render(<SkipLink />)

    const link = screen.getByRole('link', { name: 'Skip to content' })
    expect(link.className).toContain('teal-u--top-16')
    expect(link.className).toContain('focus:teal-u-top-4')
  })

  it('is the first tab stop', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <SkipLink />
        <a href="#other">Other link</a>
      </div>,
    )

    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus()
  })

  it('supports a custom href and label', () => {
    render(<SkipLink href="#content">Skip to main content</SkipLink>)

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#content')
  })
})
