import { render, screen } from '@testing-library/react'
import { FunnelChart } from '../src/FunnelChart'

const stages = [
  { name: 'Visited', value: 1000 },
  { name: 'Signed up', value: 400 },
  { name: 'Activated', value: 200 },
  { name: 'Paid', value: 50 },
]

describe('FunnelChart', () => {
  it('renders an img with the accessible label', () => {
    render(<FunnelChart aria-label="Signup funnel" stages={stages} />)

    expect(screen.getByRole('img', { name: 'Signup funnel' })).toBeInTheDocument()
  })

  it('renders one band per stage with its name and value', () => {
    const { container } = render(<FunnelChart aria-label="funnel" stages={stages} />)

    expect(container.querySelectorAll('polygon')).toHaveLength(4)
    expect(screen.getByText('Visited · 1000')).toBeInTheDocument()
    expect(screen.getByText('Paid · 50')).toBeInTheDocument()
  })

  it('shows conversion percentages between consecutive stages', () => {
    render(<FunnelChart aria-label="funnel" stages={stages} />)

    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('hides conversion percentages when showPercentages is off', () => {
    render(<FunnelChart aria-label="funnel" stages={stages} showPercentages={false} />)

    expect(screen.queryByText('40%')).not.toBeInTheDocument()
  })

  it('narrows bands as values shrink', () => {
    const { container } = render(<FunnelChart aria-label="funnel" stages={stages} />)

    const polygons = Array.from(container.querySelectorAll('polygon'))
    const topWidthOf = (polygon: Element) => {
      const [leftTop = '0,0', rightTop = '0,0'] = (polygon.getAttribute('points') ?? '').split(' ')
      return Number(rightTop.split(',')[0]) - Number(leftTop.split(',')[0])
    }
    expect(topWidthOf(polygons[0]!)).toBeGreaterThan(topWidthOf(polygons[3]!))
  })

  it('handles stages with zero value without division errors', () => {
    render(
      <FunnelChart
        aria-label="funnel"
        stages={[
          { name: 'A', value: 0 },
          { name: 'B', value: 0 },
        ]}
      />,
    )

    expect(screen.getByRole('img', { name: 'funnel' })).toBeInTheDocument()
  })
})
