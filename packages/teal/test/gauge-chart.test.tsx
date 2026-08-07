import { render, screen } from '@testing-library/react'
import { GaugeChart } from '../src/GaugeChart'

describe('GaugeChart', () => {
  it('renders an img with the accessible label', () => {
    render(<GaugeChart aria-label="CPU utilization" value={64} />)

    expect(screen.getByRole('img', { name: 'CPU utilization' })).toBeInTheDocument()
  })

  it('renders the center value, label, and min/max ticks', () => {
    render(<GaugeChart aria-label="gauge" value={64} label="CPU" />)

    expect(screen.getByText('64')).toBeInTheDocument()
    expect(screen.getByText('CPU')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('respects a custom min and max', () => {
    render(<GaugeChart aria-label="gauge" value={3} min={-10} max={10} />)

    expect(screen.getByText('-10')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('draws one zone arc per threshold plus the value arc', () => {
    const { container } = render(
      <GaugeChart
        aria-label="gauge"
        value={70}
        thresholds={[{ upTo: 50, label: 'ok' }, { upTo: 80, label: 'warn' }, { upTo: 100, label: 'danger' }]}
      />,
    )

    expect(container.querySelectorAll('path')).toHaveLength(4)
  })

  it('draws a track and a value arc without thresholds', () => {
    const { container } = render(<GaugeChart aria-label="gauge" value={40} />)

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('clamps an out-of-range value to a full arc', () => {
    const { container } = render(<GaugeChart aria-label="gauge" value={250} min={0} max={100} />)

    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'gauge' })).toBeInTheDocument()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('omits the value arc at the minimum value', () => {
    const { container } = render(<GaugeChart aria-label="gauge" value={0} />)

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })
})
