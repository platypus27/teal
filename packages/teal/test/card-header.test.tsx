import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '../src/Button'
import { Card } from '../src/Card'

describe('Card title/actions header', () => {
  it('renders children without a header when no title is given', () => {
    render(<Card>Body</Card>)

    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('renders the title as a heading with the requested level', () => {
    render(<Card title="Usage summary" titleAs="h4">Body</Card>)

    expect(screen.getByRole('heading', { level: 4, name: 'Usage summary' })).toBeInTheDocument()
  })

  it('renders actions next to the title, and the header when only actions are provided', () => {
    const { rerender } = render(
      <Card title="Members" actions={<Button size="sm">Invite</Button>}>Body</Card>,
    )
    expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()

    rerender(<Card actions={<Button size="sm">Invite</Button>}>Body</Card>)
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()
  })
})

describe('Card glass variant', () => {
  it('applies the frosted-glass treatment with on-surface text (fix 1.9)', () => {
    const { container } = render(<Card variant="glass">Body</Card>)

    expect(container.firstChild).toHaveClass(
      'teal-u-bg-surface/80',
      'teal-u-backdrop-blur-xl',
      'teal-u-shadow-overlay',
      'teal-u-text-on-surface',
    )
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card variant="glass" ref={ref}>Body</Card>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
