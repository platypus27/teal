import { render, screen } from '@testing-library/react'
import { LoadingBar } from '../src/LoadingBar'

describe('LoadingBar', () => {
  it('renders a labeled progressbar in indeterminate mode by default', () => {
    render(<LoadingBar />)

    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
  })

  it('reports determinate progress with aria value attributes', () => {
    render(<LoadingBar value={60} />)

    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '60')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('respects a custom max', () => {
    render(<LoadingBar value={5} max={10} />)

    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuemax', '10')
    expect(bar).toHaveAttribute('aria-valuenow', '5')
  })

  it('clamps out-of-range values', () => {
    render(<LoadingBar value={250} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('scales the determinate fill to the value', () => {
    const { container } = render(<LoadingBar value={25} />)

    expect(container.querySelector('[style]')).toHaveStyle({ width: '25%' })
  })
})
