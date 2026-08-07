import { render, screen, within } from '@testing-library/react'
import { BarChart } from '../src/BarChart'

const labels = ['Q1', 'Q2', 'Q3']
const series = [
  { name: 'Revenue', data: [10, 14, 12] },
  { name: 'Costs', data: [6, 8, 7] },
]

describe('BarChart', () => {
  it('renders an accessible grouped vertical bar chart', () => {
    const { container } = render(<BarChart label="Quarterly finances" labels={labels} series={series} />)

    expect(screen.getByRole('img', { name: 'Quarterly finances' })).toBeInTheDocument()
    expect(container.querySelectorAll('rect')).toHaveLength(6)
    const legend = within(screen.getByRole('list'))
    expect(legend.getByText('Revenue')).toBeInTheDocument()
    expect(legend.getByText('Costs')).toBeInTheDocument()
  })

  it('adds a title tooltip to every bar', () => {
    render(<BarChart label="Quarterly finances" labels={labels} series={series} />)

    const bar = screen.getByLabelText('Revenue, Q2: 14')
    expect(bar.tagName).toBe('rect')
    expect(bar.querySelector('title')).toHaveTextContent('Revenue, Q2: 14')
    expect(screen.getByLabelText('Costs, Q3: 7').querySelector('title')).toHaveTextContent('Costs, Q3: 7')
  })

  it('renders value labels when showValues is set', () => {
    const { container } = render(<BarChart label="Quarterly finances" labels={labels} series={[{ name: 'Revenue', data: [10, 14, 12] }]} showValues />)

    const valueLabels = Array.from(container.querySelectorAll('svg text[aria-hidden="true"]')).filter(
      (node) => node.textContent === '14',
    )
    expect(valueLabels).toHaveLength(1)
  })

  it('renders horizontal bars when orientation is horizontal', () => {
    const { container } = render(
      <BarChart label="Quarterly finances" labels={labels} series={series} orientation="horizontal" />,
    )

    const bars = container.querySelectorAll('rect')
    expect(bars).toHaveLength(6)
    // Horizontal bars share the fixed bar thickness as their height.
    expect(Number(bars[0]?.getAttribute('height'))).toBeLessThanOrEqual(32)
    expect(Number(bars[0]?.getAttribute('width'))).toBeGreaterThan(0)
  })

  it('builds a hidden data table from the series', () => {
    render(<BarChart label="Quarterly finances" labels={labels} series={series} />)

    expect(screen.getByRole('columnheader', { name: 'Revenue' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Q2' })).toBeInTheDocument()
  })
})
