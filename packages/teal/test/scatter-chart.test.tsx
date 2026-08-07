import { render, screen } from '@testing-library/react'
import { ScatterChart } from '../src/ScatterChart'

const series = [
  {
    name: 'Alpha',
    data: [
      { x: 1, y: 2 },
      { x: 2, y: 5 },
      { x: 3, y: 3 },
    ],
  },
  {
    name: 'Beta',
    data: [
      { x: 1, y: 4 },
      { x: 4, y: 1 },
    ],
  },
]

describe('ScatterChart', () => {
  it('renders an img with the accessible label', () => {
    render(<ScatterChart aria-label="Latency by payload size" series={series} />)

    expect(screen.getByRole('img', { name: 'Latency by payload size' })).toBeInTheDocument()
  })

  it('renders one dot per point across all series', () => {
    const { container } = render(<ScatterChart aria-label="chart" series={series} />)

    expect(container.querySelectorAll('circle')).toHaveLength(5)
  })

  it('exposes point tooltips via title elements', () => {
    render(<ScatterChart aria-label="chart" series={series} />)

    expect(screen.getByText('Alpha: 1, 2')).toBeInTheDocument()
    expect(screen.getByText('Beta: 4, 1')).toBeInTheDocument()
  })

  it('uses a custom point label when provided', () => {
    render(
      <ScatterChart
        aria-label="chart"
        series={[{ name: 'Alpha', data: [{ x: 1, y: 2, label: 'Outlier' }] }]}
      />,
    )

    expect(screen.getByText('Outlier')).toBeInTheDocument()
  })

  it('renders axis captions and min/max tick labels', () => {
    render(
      <ScatterChart aria-label="chart" series={series} xAxisLabel="Payload" yAxisLabel="Latency" />,
    )

    expect(screen.getByText('Payload')).toBeInTheDocument()
    expect(screen.getByText('Latency')).toBeInTheDocument()
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('scales dot radii from the size value when sizeEncoding is on', () => {
    const { container } = render(
      <ScatterChart
        aria-label="chart"
        sizeEncoding
        series={[
          {
            name: 'Alpha',
            data: [
              { x: 1, y: 1, size: 10 },
              { x: 2, y: 2, size: 110 },
            ],
          },
        ]}
      />,
    )

    const radii = Array.from(container.querySelectorAll('circle')).map((dot) => Number(dot.getAttribute('r')))
    expect(radii[0]!).toBeLessThan(radii[1]!)
  })

  it('keeps a uniform radius when sizeEncoding is off', () => {
    const { container } = render(
      <ScatterChart
        aria-label="chart"
        series={[
          {
            name: 'Alpha',
            data: [
              { x: 1, y: 1, size: 10 },
              { x: 2, y: 2, size: 110 },
            ],
          },
        ]}
      />,
    )

    const radii = Array.from(container.querySelectorAll('circle')).map((dot) => dot.getAttribute('r'))
    expect(new Set(radii).size).toBe(1)
  })

  it('renders without crashing for an empty series list', () => {
    const { container } = render(<ScatterChart aria-label="empty chart" series={[]} />)

    expect(screen.getByRole('img', { name: 'empty chart' })).toBeInTheDocument()
    expect(container.querySelectorAll('circle')).toHaveLength(0)
  })
})
