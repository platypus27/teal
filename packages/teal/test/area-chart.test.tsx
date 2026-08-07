import { fireEvent, render, screen } from '@testing-library/react'
import { AreaChart } from '../src/AreaChart'

const labels = ['Jan', 'Feb', 'Mar']
const series = [
  { name: 'Signups', data: [10, 14, 12] },
  { name: 'Upgrades', data: [4, 6, 5] },
]

describe('AreaChart', () => {
  it('renders an accessible chart with filled areas', () => {
    const { container } = render(<AreaChart label="Growth" labels={labels} series={series} />)

    expect(screen.getByRole('img', { name: 'Growth' })).toBeInTheDocument()
    const areas = container.querySelectorAll('path[fill-opacity]')
    expect(areas).toHaveLength(2)
    expect(areas[0]).toHaveAttribute('fill-opacity', '0.25')
  })

  it('respects the opacity prop', () => {
    const { container } = render(<AreaChart label="Growth" labels={labels} series={series} opacity={0.5} />)

    expect(container.querySelector('path[fill-opacity]')).toHaveAttribute('fill-opacity', '0.5')
  })

  it('keeps raw values in tooltips and the data table when stacked', () => {
    render(<AreaChart label="Growth" labels={labels} series={series} stacked />)

    const point = screen.getByLabelText('Upgrades, Feb: 6')
    expect(point.querySelector('title')).toHaveTextContent('Upgrades, Feb: 6')
    expect(screen.getByRole('cell', { name: '14' })).toBeInTheDocument()
  })

  it('lifts stacked points above the ones below them', () => {
    render(<AreaChart label="Growth" labels={labels} series={series} stacked />)

    const stackedTop = screen.getByLabelText('Upgrades, Jan: 4')
    const stackedBottom = screen.getByLabelText('Signups, Jan: 10')

    // Stacked, Upgrades sits on top of Signups, so its cy is higher (smaller).
    expect(Number(stackedTop.getAttribute('cy'))).toBeLessThan(Number(stackedBottom.getAttribute('cy')))
  })

  it('shows a custom tooltip for the focused point', () => {
    render(
      <AreaChart
        label="Growth"
        labels={labels}
        series={series}
        renderTooltip={(point) => `${point.series.name}: ${point.value}`}
      />,
    )

    fireEvent.focus(screen.getByLabelText('Signups, Mar: 12'))

    expect(screen.getByRole('status')).toHaveTextContent('Signups: 12')
  })
})
