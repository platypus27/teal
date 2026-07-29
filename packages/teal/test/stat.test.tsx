import { render, screen } from '@testing-library/react'
import { Stat } from '../src/Stat'

describe('Stat', () => {
  it('renders the label and value', () => {
    render(<Stat label="Monthly revenue" value="$48,290" />)

    expect(screen.getByText('Monthly revenue')).toBeInTheDocument()
    expect(screen.getByText('$48,290')).toBeInTheDocument()
  })

  it('defaults an up delta to the success tone', () => {
    render(<Stat label="Signups" value="1,204" delta={{ direction: 'up', value: '+12.4%' }} />)

    const delta = screen.getByText('+12.4%')
    expect(delta).toHaveClass('teal-u-text-tertiary')
  })

  it('defaults a down delta to the danger tone', () => {
    render(<Stat label="Churn" value="3.1%" delta={{ direction: 'down', value: '+0.4%' }} />)

    const delta = screen.getByText('+0.4%')
    expect(delta).toHaveClass('teal-u-text-error')
  })

  it('honors an explicit delta tone override', () => {
    render(<Stat label="Latency" value="142ms" delta={{ direction: 'down', value: '-18ms', tone: 'success' }} />)

    const delta = screen.getByText('-18ms')
    expect(delta).toHaveClass('teal-u-text-tertiary')
  })

  it('defaults a flat delta to the neutral tone', () => {
    render(<Stat label="Uptime" value="99.99%" delta={{ direction: 'flat', value: '0.0%' }} />)

    const delta = screen.getByText('0.0%')
    expect(delta).toHaveClass('teal-u-text-on-surface-variant')
  })

  it('renders the description and children slot', () => {
    render(
      <Stat label="Active users" value="8,412" description="Across all regions">
        <div data-testid="sparkline" />
      </Stat>,
    )

    expect(screen.getByText('Across all regions')).toBeInTheDocument()
    expect(screen.getByTestId('sparkline')).toBeInTheDocument()
  })
})
