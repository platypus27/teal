import { render, screen } from '@testing-library/react'
import { Progress } from '../src/LoadingState'

describe('Progress bar shape', () => {
  it('exposes progressbar semantics with the current value', () => {
    render(<Progress label="Upload progress" value={40} />)

    const bar = screen.getByRole('progressbar', { name: 'Upload progress' })
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })
})

describe('Progress circle shape', () => {
  it('exposes progressbar semantics with value bounds when determinate', () => {
    render(<Progress shape="circle" label="Storage" value={64} />)

    const meter = screen.getByRole('progressbar', { name: 'Storage' })
    expect(meter).toHaveAttribute('aria-valuenow', '64')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders the rounded value text when determinate', () => {
    render(<Progress shape="circle" label="Storage" value={42.4} />)

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('clamps out-of-range values', () => {
    render(<Progress shape="circle" label="Storage" value={140} />)

    expect(screen.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute('aria-valuenow', '100')
  })

  it('omits aria-valuenow and spins when indeterminate', () => {
    const { container } = render(<Progress shape="circle" label="Loading" />)

    expect(screen.getByRole('progressbar', { name: 'Loading' })).not.toHaveAttribute('aria-valuenow')
    expect(container.querySelector('.teal-progress-spin')).toBeInTheDocument()
    expect(container.querySelector('.teal-progress-dash')).toBeInTheDocument()
  })

  it('respects size and strokeWidth props', () => {
    const { container } = render(<Progress shape="circle" label="Storage" value={25} size={80} strokeWidth={8} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '80')
    expect(svg?.querySelector('circle[stroke-width="8"]')).toBeInTheDocument()
  })
})
