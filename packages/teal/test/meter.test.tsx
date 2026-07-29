import { render, screen } from '@testing-library/react'
import { Meter } from '../src/Meter'

describe('Meter', () => {
  it('exposes meter semantics with value bounds and label', () => {
    render(<Meter label="Disk usage" value={64} />)

    const meter = screen.getByRole('meter', { name: 'Disk usage' })
    expect(meter).toHaveAttribute('aria-valuenow', '64')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
    expect(meter).toHaveAttribute('aria-valuetext', '64')
  })

  it('renders the formatted value text', () => {
    render(<Meter label="Storage" value={42.4} formatValue={(v) => `${v.toFixed(1)} GB`} />)

    expect(screen.getByText('42.4 GB')).toBeInTheDocument()
  })

  it('clamps out-of-range values', () => {
    render(<Meter label="Disk usage" value={140} min={10} max={90} />)

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '90')
  })

  it('colors the fill by the optimum zone when thresholds are given', () => {
    const { container, rerender } = render(<Meter label="Load" value={80} low={20} high={60} optimum={100} />)
    expect(container.querySelector('.teal-u-bg-tertiary')).toBeInTheDocument()

    rerender(<Meter label="Load" value={40} low={20} high={60} optimum={100} />)
    expect(container.querySelector('.teal-u-bg-warning')).toBeInTheDocument()

    rerender(<Meter label="Load" value={10} low={20} high={60} optimum={100} />)
    expect(container.querySelector('.teal-u-bg-error')).toBeInTheDocument()
  })

  it('falls back to the primary fill without thresholds', () => {
    const { container } = render(<Meter label="Load" value={50} />)

    expect(container.querySelector('.teal-u-bg-primary')).toBeInTheDocument()
    expect(container.querySelector('.teal-u-bg-tertiary')).not.toBeInTheDocument()
  })
})
