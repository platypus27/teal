import { render, screen } from '@testing-library/react'
import { ProgressCircle } from '../src/ProgressCircle'

describe('ProgressCircle', () => {
  it('exposes progressbar semantics with value bounds when determinate', () => {
    render(<ProgressCircle value={64} label="Upload progress" />)

    const bar = screen.getByRole('progressbar', { name: 'Upload progress' })
    expect(bar).toHaveAttribute('aria-valuenow', '64')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders the rounded value text when determinate', () => {
    render(<ProgressCircle value={42.4} />)

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('clamps out-of-range values', () => {
    render(<ProgressCircle value={140} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('omits aria-valuenow and spins when indeterminate', () => {
    const { container } = render(<ProgressCircle label="Loading" />)

    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(container.querySelector('svg')).toHaveClass('teal-progress-spin')
    expect(container.querySelector('.teal-progress-dash')).toBeInTheDocument()
  })

  it('respects size and strokeWidth props', () => {
    const { container } = render(<ProgressCircle value={50} size={80} strokeWidth={8} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '80')
    const circles = container.querySelectorAll('circle')
    expect(circles[0]).toHaveAttribute('stroke-width', '8')
    expect(circles[0]).toHaveAttribute('r', '36')
  })
})
