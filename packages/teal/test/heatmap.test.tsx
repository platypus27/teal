import { render, screen } from '@testing-library/react'
import { Heatmap } from '../src/Heatmap'

const rows = [
  { label: 'Mon', values: [1, 4, 7] },
  { label: 'Tue', values: [2, 5, 8] },
  { label: 'Wed', values: [3, 6, 9] },
]

const columnLabels = ['Morning', 'Afternoon', 'Evening']

describe('Heatmap', () => {
  it('renders an img with the accessible label', () => {
    render(<Heatmap aria-label="Requests by day and time" rows={rows} columnLabels={columnLabels} />)

    expect(screen.getByRole('img', { name: 'Requests by day and time' })).toBeInTheDocument()
  })

  it('renders one cell per row value', () => {
    const { container } = render(
      <Heatmap aria-label="matrix" rows={rows} columnLabels={columnLabels} />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(9)
  })

  it('renders row and column labels', () => {
    render(<Heatmap aria-label="matrix" rows={rows} columnLabels={columnLabels} />)

    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Afternoon')).toBeInTheDocument()
  })

  it('exposes cell tooltips via title elements', () => {
    render(<Heatmap aria-label="matrix" rows={rows} columnLabels={columnLabels} />)

    expect(screen.getByText('Tue, Evening: 8')).toBeInTheDocument()
    expect(screen.getByText('Mon, Morning: 1')).toBeInTheDocument()
  })

  it('maps the value range to increasing cell opacity', () => {
    const { container } = render(
      <Heatmap aria-label="matrix" rows={[{ label: 'Row', values: [0, 5, 10] }]} columnLabels={['a', 'b', 'c']} />,
    )

    const opacities = Array.from(container.querySelectorAll('rect')).map((cell) =>
      Number(cell.getAttribute('fill-opacity')),
    )
    expect(opacities[0]!).toBeLessThan(opacities[1]!)
    expect(opacities[1]!).toBeLessThan(opacities[2]!)
  })

  it('handles a single-value matrix without a zero range crash', () => {
    const { container } = render(
      <Heatmap aria-label="matrix" rows={[{ label: 'Row', values: [3] }]} columnLabels={['only']} />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(1)
  })
})
