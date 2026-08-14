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

  it('draws a track, one zone arc per threshold, and the value arc', () => {
    const { container } = render(
      <GaugeChart
        aria-label="gauge"
        value={70}
        thresholds={[{ upTo: 50, label: 'ok' }, { upTo: 80, label: 'warn' }, { upTo: 100, label: 'danger' }]}
      />,
    )

    expect(container.querySelectorAll('path')).toHaveLength(5)
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

  it('draws full-opacity zones with rounded caps over a track', () => {
    const { container } = render(
      <GaugeChart
        aria-label="gauge"
        value={70}
        thresholds={[{ upTo: 50 }, { upTo: 80 }, { upTo: 100 }]}
      />,
    )

    const paths = Array.from(container.querySelectorAll('path'))
    expect(paths[0]).toHaveAttribute('stroke', 'var(--teal-color-surface-container-high)')
    for (const zone of paths.slice(1, 4)) {
      expect(zone).not.toHaveAttribute('stroke-opacity')
      expect(zone).toHaveAttribute('stroke-linecap', 'round')
    }
  })

  it('keeps the min and max labels inside a narrow layout', () => {
    render(<GaugeChart aria-label="gauge" value={5} min={0} max={100} width={120} height={90} />)

    expect(Number(screen.getByText('0').getAttribute('x'))).toBeGreaterThanOrEqual(2)
    expect(Number(screen.getByText('100').getAttribute('x'))).toBeLessThanOrEqual(118)
  })
})
