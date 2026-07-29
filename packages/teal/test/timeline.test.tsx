import { render, screen } from '@testing-library/react'
import { Timeline } from '../src/Timeline'

const items = [
  { id: '1', title: 'Build started', timestamp: '09:41', tone: 'neutral' as const },
  { id: '2', title: 'Deploy finished', description: 'Release 2.4.0 is live', timestamp: '09:52', tone: 'success' as const },
  { id: '3', title: 'Rollback triggered', timestamp: '10:03', tone: 'danger' as const },
]

describe('Timeline', () => {
  it('renders each item with its title, description, and timestamp', () => {
    render(<Timeline items={items} />)

    expect(screen.getByText('Build started')).toBeInTheDocument()
    expect(screen.getByText('Deploy finished')).toBeInTheDocument()
    expect(screen.getByText('Release 2.4.0 is live')).toBeInTheDocument()
    expect(screen.getByText('Rollback triggered')).toBeInTheDocument()
    expect(screen.getByText('09:41')).toBeInTheDocument()
    expect(screen.getByText('10:03')).toBeInTheDocument()
  })

  it('applies the tone class to each dot', () => {
    const { container } = render(<Timeline items={items} />)

    expect(container.querySelector('.teal-u-bg-outline')).toBeInTheDocument()
    expect(container.querySelector('.teal-u-bg-emerald-500')).toBeInTheDocument()
    expect(container.querySelector('.teal-u-bg-error')).toBeInTheDocument()
  })

  it('defaults to the neutral tone', () => {
    const { container } = render(<Timeline items={[{ id: '1', title: 'Queued', timestamp: '08:00' }]} />)

    expect(container.querySelector('.teal-u-bg-outline')).toBeInTheDocument()
  })

  it('renders a connector after every item except the last', () => {
    const { container } = render(<Timeline items={items} />)

    const connectors = container.querySelectorAll('.teal-u-w-px.teal-u-flex-1')
    expect(connectors).toHaveLength(items.length - 1)
  })

  it('merges className onto the list root', () => {
    const { container } = render(<Timeline items={items} className="custom-timeline" />)

    expect(container.querySelector('ol')).toHaveClass('custom-timeline')
  })
})
