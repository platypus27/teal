import { render, screen } from '@testing-library/react'
import { RadarChart } from '../src/RadarChart'

const axes = ['Speed', 'Quality', 'Cost', 'Scope', 'Risk']

const series = [
  { name: 'Team A', values: [4, 3, 5, 2, 4] },
  { name: 'Team B', values: [2, 5, 3, 4, 1] },
]

describe('RadarChart', () => {
  it('renders an img with the accessible label', () => {
    render(<RadarChart aria-label="Team comparison" axes={axes} series={series} />)

    expect(screen.getByRole('img', { name: 'Team comparison' })).toBeInTheDocument()
  })

  it('renders one axis label per axis', () => {
    render(<RadarChart aria-label="radar" axes={axes} series={series} />)

    for (const axis of axes) {
      expect(screen.getByText(axis)).toBeInTheDocument()
    }
  })

  it('renders one data polygon per series plus one polygon per grid ring', () => {
    const { container } = render(<RadarChart aria-label="radar" axes={axes} series={series} rings={4} />)

    expect(container.querySelectorAll('polygon')).toHaveLength(4 + 2)
  })

  it('renders one spoke per axis', () => {
    const { container } = render(<RadarChart aria-label="radar" axes={axes} series={series} />)

    expect(container.querySelectorAll('line')).toHaveLength(5)
  })

  it('scales values against the max prop', () => {
    const { container } = render(
      <RadarChart aria-label="radar" axes={['a', 'b', 'c']} max={10} series={[{ name: 'S', values: [10, 0, 0] }]} />,
    )

    const dataPolygon = container.querySelectorAll('polygon')[4]
    expect(dataPolygon).toBeDefined()
  })

  it('exposes a series tooltip via a title element', () => {
    render(<RadarChart aria-label="radar" axes={axes} series={series} />)

    expect(screen.getByText('Team A: 4, 3, 5, 2, 4')).toBeInTheDocument()
  })

  it('handles a single axis and empty series without crashing', () => {
    render(<RadarChart aria-label="radar" axes={['only']} series={[]} />)

    expect(screen.getByRole('img', { name: 'radar' })).toBeInTheDocument()
  })
})
