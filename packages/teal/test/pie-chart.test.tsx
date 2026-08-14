import { fireEvent, render, screen, within } from '@testing-library/react'
import { PieChart } from '../src/PieChart'

const data = [
  { name: 'Desktop', value: 50 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 20 },
]

describe('PieChart', () => {
  it('renders an accessible chart with focusable segments', () => {
    render(<PieChart label="Traffic by device" data={data} />)

    expect(screen.getByRole('img', { name: 'Traffic by device' })).toBeInTheDocument()
    expect(screen.getByLabelText('Desktop: 50 (50%)')).toBeInTheDocument()
    expect(screen.getByLabelText('Mobile: 30 (30%)')).toHaveAttribute('tabindex', '0')
  })

  it('renders percentage labels and legend entries', () => {
    const { container } = render(<PieChart label="Traffic by device" data={data} />)

    const svgTexts = Array.from(container.querySelectorAll('svg text')).map((node) => node.textContent)
    expect(svgTexts).toContain('50%')
    expect(svgTexts).toContain('30%')
    const legend = within(screen.getByRole('list'))
    expect(legend.getByText('Desktop')).toBeInTheDocument()
    expect(legend.getByText('Tablet')).toBeInTheDocument()
  })

  it('moves focus between segments with arrow keys', () => {
    render(<PieChart label="Traffic by device" data={data} />)

    const desktop = screen.getByLabelText('Desktop: 50 (50%)')
    const mobile = screen.getByLabelText('Mobile: 30 (30%)')

    fireEvent.keyDown(desktop, { key: 'ArrowRight' })
    expect(mobile).toHaveFocus()

    fireEvent.keyDown(mobile, { key: 'ArrowLeft' })
    expect(desktop).toHaveFocus()
  })

  it('wraps focus and supports Home and End', () => {
    render(<PieChart label="Traffic by device" data={data} />)

    const desktop = screen.getByLabelText('Desktop: 50 (50%)')
    const tablet = screen.getByLabelText('Tablet: 20 (20%)')

    fireEvent.keyDown(desktop, { key: 'End' })
    expect(tablet).toHaveFocus()

    fireEvent.keyDown(tablet, { key: 'ArrowRight' })
    expect(desktop).toHaveFocus()

    fireEvent.keyDown(tablet, { key: 'Home' })
    expect(desktop).toHaveFocus()
  })

  it('renders a donut when innerRadius is set', () => {
    const { container } = render(<PieChart label="Traffic by device" data={data} innerRadius={0.6} />)

    // Donut segments draw an outer and an inner arc: two arc commands per path.
    const segment = container.querySelector('path')
    expect(segment?.getAttribute('d')?.match(/A/g)).toHaveLength(2)
  })

  it('renders a single-value pie without crashing and shows 100%', () => {
    const { container } = render(<PieChart label="Traffic by device" data={[{ name: 'Desktop', value: 42 }]} />)

    expect(screen.getByLabelText('Desktop: 42 (100%)')).toBeInTheDocument()
    const svgTexts = Array.from(container.querySelectorAll('svg text')).map((node) => node.textContent)
    expect(svgTexts).toContain('100%')
  })

  it('builds a hidden data table with value shares', () => {
    render(<PieChart label="Traffic by device" data={data} />)

    expect(screen.getByRole('columnheader', { name: 'Share' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '30%' })).toBeInTheDocument()
  })

  it('renders percentage labels without a halo stroke', () => {
    const { container } = render(<PieChart label="Traffic by device" data={data} />)

    const label = Array.from(container.querySelectorAll('svg text')).find((node) => node.textContent === '50%')
    expect(label).toBeDefined()
    expect(label).not.toHaveAttribute('stroke')
    expect(label).not.toHaveAttribute('stroke-width')
    expect(label).not.toHaveAttribute('paint-order')
    expect(label).toHaveAttribute('fill', 'var(--teal-color-on-surface)')
  })
})
