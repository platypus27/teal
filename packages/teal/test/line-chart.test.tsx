import { fireEvent, render, screen, within } from '@testing-library/react'
import { LineChart } from '../src/LineChart'

const labels = ['Jan', 'Feb', 'Mar']
const series = [
  { name: 'Revenue', data: [10, 14, 12] },
  { name: 'Costs', data: [6, 8, 7] },
]

describe('LineChart', () => {
  it('renders an accessible chart with a legend entry per series', () => {
    render(<LineChart label="Quarterly finances" labels={labels} series={series} />)

    expect(screen.getByRole('img', { name: 'Quarterly finances' })).toBeInTheDocument()
    const legend = within(screen.getByRole('list'))
    expect(legend.getByText('Revenue')).toBeInTheDocument()
    expect(legend.getByText('Costs')).toBeInTheDocument()
  })

  it('renders focusable points with simple title tooltips', () => {
    render(<LineChart label="Quarterly finances" labels={labels} series={series} />)

    const point = screen.getByLabelText('Revenue, Feb: 14')
    expect(point.tagName).toBe('circle')
    expect(point).toHaveAttribute('tabindex', '0')
    expect(point.querySelector('title')).toHaveTextContent('Revenue, Feb: 14')
    expect(screen.getAllByLabelText(/Revenue, /)).toHaveLength(3)
  })

  it('shows a custom tooltip for the focused point', () => {
    render(
      <LineChart
        label="Quarterly finances"
        labels={labels}
        series={series}
        renderTooltip={(point) => `${point.series.name} was ${point.value} in ${point.label}`}
      />,
    )

    fireEvent.focus(screen.getByLabelText('Costs, Jan: 6'))

    expect(screen.getByRole('status')).toHaveTextContent('Costs was 6 in Jan')
    expect(screen.getByLabelText('Costs, Jan: 6').querySelector('title')).toBeNull()
  })

  it('hides the custom tooltip when the point loses focus', () => {
    render(
      <LineChart
        label="Quarterly finances"
        labels={labels}
        series={series}
        renderTooltip={(point) => `${point.value}`}
      />,
    )

    const point = screen.getByLabelText('Revenue, Jan: 10')
    fireEvent.focus(point)
    expect(screen.getByRole('status')).toBeInTheDocument()

    fireEvent.blur(point)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('builds a hidden data table from the series', () => {
    render(<LineChart label="Quarterly finances" labels={labels} series={series} />)

    expect(screen.getByRole('columnheader', { name: 'Costs' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Feb' })).toBeInTheDocument()
  })

  it('can hide points, legend, axes, and grid', () => {
    render(
      <LineChart
        label="Quarterly finances"
        labels={labels}
        series={series}
        showPoints={false}
        showLegend={false}
        showAxis={false}
        showGrid={false}
      />,
    )

    expect(screen.queryByLabelText(/Revenue, /)).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Quarterly finances' })).toBeInTheDocument()
  })
})
