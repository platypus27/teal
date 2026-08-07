import { render, screen } from '@testing-library/react'
import { CalendarHeatmap } from '../src/CalendarHeatmap'

describe('CalendarHeatmap', () => {
  it('renders an img with the accessible label', () => {
    render(<CalendarHeatmap aria-label="Commit activity in 2025" year={2025} />)

    expect(screen.getByRole('img', { name: 'Commit activity in 2025' })).toBeInTheDocument()
  })

  it('renders one cell per day of the year', () => {
    const { container: plain } = render(<CalendarHeatmap aria-label="cal" year={2025} />)
    expect(plain.querySelectorAll('rect')).toHaveLength(365)

    const { container: leap } = render(<CalendarHeatmap aria-label="cal" year={2024} />)
    expect(leap.querySelectorAll('rect')).toHaveLength(366)
  })

  it('renders month labels along the top', () => {
    render(<CalendarHeatmap aria-label="cal" year={2025} />)

    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('Jun')).toBeInTheDocument()
    expect(screen.getByText('Dec')).toBeInTheDocument()
  })

  it('renders weekday labels for Mon, Wed, and Fri', () => {
    render(<CalendarHeatmap aria-label="cal" year={2025} />)

    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.queryByText('Sun')).not.toBeInTheDocument()
  })

  it('exposes day tooltips via title elements', () => {
    render(
      <CalendarHeatmap
        aria-label="cal"
        year={2025}
        data={[{ date: '2025-03-14', level: 3 }]}
      />,
    )

    expect(screen.getByText('Level 3 on 2025-03-14')).toBeInTheDocument()
    expect(screen.getByText('Level 0 on 2025-01-01')).toBeInTheDocument()
  })

  it('uses a custom tooltip label when provided', () => {
    render(
      <CalendarHeatmap
        aria-label="cal"
        year={2025}
        data={[{ date: '2025-03-14', level: 4, label: '12 commits on 2025-03-14' }]}
      />,
    )

    expect(screen.getByText('12 commits on 2025-03-14')).toBeInTheDocument()
  })

  it('maps levels to increasing opacity', () => {
    const { container } = render(
      <CalendarHeatmap
        aria-label="cal"
        year={2025}
        data={[
          { date: '2025-01-01', level: 1 },
          { date: '2025-01-02', level: 4 },
        ]}
      />,
    )

    const cells = Array.from(container.querySelectorAll('rect'))
    const jan1 = cells.find((cell) => cell.querySelector('title')?.textContent === 'Level 1 on 2025-01-01')
    const jan2 = cells.find((cell) => cell.querySelector('title')?.textContent === 'Level 4 on 2025-01-02')
    expect(Number(jan1?.getAttribute('fill-opacity'))).toBeLessThan(Number(jan2?.getAttribute('fill-opacity')))
  })

  it('clamps out-of-range levels between 0 and 4', () => {
    render(
      <CalendarHeatmap
        aria-label="cal"
        year={2025}
        data={[{ date: '2025-06-01', level: 9 }]}
      />,
    )

    expect(screen.getByText('Level 4 on 2025-06-01')).toBeInTheDocument()
  })
})
