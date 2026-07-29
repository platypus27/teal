import { render, screen } from '@testing-library/react'
import { Sparkline } from '../src/Sparkline'

const data = [3, 7, 4, 9, 6, 12]

describe('Sparkline', () => {
  it('renders an accessible image with the given label', () => {
    render(<Sparkline aria-label="Revenue trend" data={data} />)

    expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeInTheDocument()
  })

  it('renders a visually hidden summary of min, max and last', () => {
    render(<Sparkline aria-label="Revenue trend" data={data} />)

    expect(screen.getByText('Min 3, max 12, last 12')).toBeInTheDocument()
  })

  it('defaults to the line variant with a polyline', () => {
    const { container } = render(<Sparkline aria-label="Trend" data={data} />)

    expect(container.querySelector('polyline')).toBeInTheDocument()
    expect(container.querySelector('polygon')).not.toBeInTheDocument()
    expect(container.querySelector('rect')).not.toBeInTheDocument()
  })

  it('renders a low-opacity fill in the area variant', () => {
    const { container } = render(<Sparkline aria-label="Trend" data={data} variant="area" />)

    const polygon = container.querySelector('polygon')
    expect(polygon).toBeInTheDocument()
    expect(polygon).toHaveAttribute('opacity', '0.15')
    expect(container.querySelector('polyline')).toBeInTheDocument()
  })

  it('renders one rect per value in the bar variant', () => {
    const { container } = render(<Sparkline aria-label="Trend" data={data} variant="bar" />)

    expect(container.querySelectorAll('rect')).toHaveLength(data.length)
    expect(container.querySelector('polyline')).not.toBeInTheDocument()
  })

  it('applies custom dimensions', () => {
    render(<Sparkline aria-label="Trend" data={data} width={200} height={48} />)

    const svg = screen.getByRole('img', { name: 'Trend' })
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '48')
  })

  it('handles flat data without collapsing', () => {
    const { container } = render(<Sparkline aria-label="Flat trend" data={[5, 5, 5]} />)

    expect(container.querySelector('polyline')).toBeInTheDocument()
    expect(screen.getByText('Min 5, max 5, last 5')).toBeInTheDocument()
  })
})
