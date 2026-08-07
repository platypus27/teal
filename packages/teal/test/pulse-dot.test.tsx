import { render, screen } from '@testing-library/react'
import { PulseDot } from '../src/PulseDot'

describe('PulseDot', () => {
  it('renders a status with a default accessible label', () => {
    render(<PulseDot />)

    expect(screen.getByRole('status', { name: 'Live' })).toBeInTheDocument()
  })

  it('uses a custom accessible label', () => {
    render(<PulseDot label="3 editors online" variant="info" />)

    expect(screen.getByRole('status', { name: '3 editors online' })).toBeInTheDocument()
  })

  it('marks the animated layers as hidden and disables animation under reduced motion', () => {
    const { container } = render(<PulseDot />)

    const ping = container.querySelector('.teal-u-animate-ping')
    expect(ping).toHaveAttribute('aria-hidden', 'true')
    expect(ping).toHaveClass('motion-reduce:teal-u-animate-none')
  })

  it('applies the variant color', () => {
    const { container } = render(<PulseDot variant="danger" />)

    expect(container.querySelector('.teal-u-bg-error')).toBeInTheDocument()
  })
})
