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

describe('LineChart area type', () => {
  const series = [
    { name: 'Upgrades', data: [4, 6, 5] },
    { name: 'New', data: [8, 8, 9] },
  ]
  const labels = ['Jan', 'Feb', 'Mar']

  it('renders filled areas with the default opacity', () => {
    const { container } = render(<LineChart label="Sales" labels={labels} series={series} type="area" />)

    const areas = container.querySelectorAll('path[fill-opacity]')
    expect(areas).toHaveLength(2)
    expect(areas[0]).toHaveAttribute('fill-opacity', '0.25')
  })

  it('respects the opacity prop', () => {
    const { container } = render(<LineChart label="Sales" labels={labels} series={series} type="area" opacity={0.5} />)

    expect(container.querySelector('path[fill-opacity]')).toHaveAttribute('fill-opacity', '0.5')
  })

  it('keeps raw values in tooltips and the data table when stacked', () => {
    render(<LineChart label="Sales" labels={labels} series={series} type="area" stacked />)

    const point = screen.getByLabelText('Upgrades, Feb: 6')
    expect(point.querySelector('title')).toHaveTextContent('Upgrades, Feb: 6')
    // Raw New Mar value; the stacked plotted value would be 14.
    expect(screen.getByRole('cell', { name: '9' })).toBeInTheDocument()
    expect(screen.queryByRole('cell', { name: '14' })).not.toBeInTheDocument()
  })

  it('lifts stacked points above the ones below them', () => {
    render(<LineChart label="Sales" labels={labels} series={series} type="area" stacked />)

    const bottom = screen.getByLabelText('Upgrades, Feb: 6')
    const top = screen.getByLabelText('New, Feb: 8')
    expect(Number(top.getAttribute('cy'))).toBeLessThan(Number(bottom.getAttribute('cy')))
  })
})
