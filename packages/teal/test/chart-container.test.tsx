import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChartContainer, niceTicks } from '../src/ChartContainer'

const columns = [
  { key: 'month', label: 'Month' },
  { key: 'revenue', label: 'Revenue' },
]
const data = [
  { month: 'Jan', revenue: 10 },
  { month: 'Feb', revenue: 14 },
]

describe('ChartContainer', () => {
  it('renders an SVG with role img and the accessible label', () => {
    render(<ChartContainer label="Revenue trend" />)

    expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeInTheDocument()
  })

  it('exposes a visually hidden data table to screen readers', () => {
    render(<ChartContainer label="Revenue trend" columns={columns} data={data} />)

    const table = screen.getByRole('table', { name: 'Revenue trend' })
    expect(table).toHaveClass('teal-u-sr-only')
    expect(screen.getByRole('columnheader', { name: 'Revenue' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '14' })).toBeInTheDocument()
  })

  it('toggles the data table visibility from the button', async () => {
    const user = userEvent.setup()
    render(<ChartContainer label="Revenue trend" columns={columns} data={data} />)

    const toggle = screen.getByRole('button', { name: 'Show data table' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Hide data table' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('table', { name: 'Revenue trend' })).not.toHaveClass('teal-u-sr-only')
  })

  it('supports controlled data table visibility', () => {
    const onShowDataTableChange = vi.fn()
    render(
      <ChartContainer
        label="Revenue trend"
        columns={columns}
        data={data}
        showDataTable
        onShowDataTableChange={onShowDataTableChange}
      />,
    )

    expect(screen.getByRole('table', { name: 'Revenue trend' })).not.toHaveClass('teal-u-sr-only')

    fireEvent.click(screen.getByRole('button', { name: 'Hide data table' }))
    expect(onShowDataTableChange).toHaveBeenCalledWith(false)
  })

  it('omits the toggle when no columns are provided', () => {
    render(<ChartContainer label="Revenue trend" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('computes round axis ticks with niceTicks', () => {
    expect(niceTicks(0, 40)).toEqual([0, 10, 20, 30, 40])
    expect(niceTicks(0, 0)).toEqual([0, 1])
    expect(niceTicks(3, 3)).toEqual([0, 3])
  })
})
