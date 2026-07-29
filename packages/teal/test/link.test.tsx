import { render, screen } from '@testing-library/react'
import { Link } from '../src/Link'

describe('Link', () => {
  it('renders an inline link with its href', () => {
    render(<Link href="/projects">View projects</Link>)

    const link = screen.getByRole('link', { name: 'View projects' })
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveClass('teal-u-underline')
  })

  it('renders the standalone variant without underline', () => {
    render(
      <Link href="/docs" variant="standalone">
        Read the docs
      </Link>,
    )

    expect(screen.getByRole('link', { name: 'Read the docs' })).toHaveClass('teal-u-no-underline')
  })

  it('adds new-tab semantics and an indicator for external links', () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Status page
      </Link>,
    )

    const link = screen.getByRole('link', { name: 'Status page' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('composes onto a single child when rendered asChild', () => {
    render(
      <Link asChild variant="standalone">
        <a href="/settings">Open settings</a>
      </Link>,
    )

    const link = screen.getByRole('link', { name: 'Open settings' })
    expect(link).toHaveAttribute('href', '/settings')
    expect(link).toHaveClass('teal-u-no-underline')
  })
})
