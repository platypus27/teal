import { render, screen } from '@testing-library/react'
import { StatusDot } from '../src/StatusDot'

describe('StatusDot', () => {
  it('renders the text label next to the dot', () => {
    render(<StatusDot variant="success" label="Active" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('hides the dot from assistive technology', () => {
    const { container } = render(<StatusDot variant="danger" label="Failed" />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders only the dot when no label is given', () => {
    const { container } = render(<StatusDot variant="info" aria-label="Syncing" />)

    expect(container.firstChild).toHaveAttribute('aria-label', 'Syncing')
    expect(screen.queryByText('Syncing')).not.toBeInTheDocument()
  })

  it('applies the variant color to the dot', () => {
    const { container } = render(<StatusDot variant="warning" label="Degraded" />)

    expect(container.querySelector('.teal-u-bg-warning')).toBeInTheDocument()
  })
})

describe('StatusDot pulse', () => {
  it('renders a status with a default accessible label', () => {
    render(<StatusDot pulse />)

    expect(screen.getByRole('status', { name: 'Live' })).toBeInTheDocument()
  })

  it('uses a custom accessible label', () => {
    render(<StatusDot pulse label="3 editors online" />)

    expect(screen.getByRole('status', { name: '3 editors online' })).toBeInTheDocument()
  })

  it('marks the animated layers as hidden and disables animation under reduced motion', () => {
    const { container } = render(<StatusDot pulse />)

    const ping = container.querySelector('.teal-u-animate-ping')
    expect(ping).toHaveAttribute('aria-hidden', 'true')
    expect(ping).toHaveClass('motion-reduce:teal-u-animate-none')
  })

  it('applies the variant color', () => {
    const { container } = render(<StatusDot pulse variant="danger" />)

    expect(container.querySelector('.teal-u-bg-error')).toBeInTheDocument()
  })
})
