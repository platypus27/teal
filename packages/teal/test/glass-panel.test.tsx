import { render, screen } from '@testing-library/react'
import { GlassPanel } from '../src/GlassPanel'

describe('GlassPanel', () => {
  it('renders its children', () => {
    render(<GlassPanel>Frosted content</GlassPanel>)

    expect(screen.getByText('Frosted content')).toBeInTheDocument()
  })

  it('applies the frosted-glass treatment', () => {
    render(<GlassPanel data-testid="glass">Frosted content</GlassPanel>)

    const panel = screen.getByTestId('glass')
    expect(panel).toHaveClass('teal-u-bg-surface/70')
    expect(panel).toHaveClass('teal-u-backdrop-blur-xl')
    expect(panel).toHaveClass('teal-u-border')
  })

  it('merges a custom className', () => {
    render(
      <GlassPanel data-testid="glass" className="custom-class">
        Frosted content
      </GlassPanel>,
    )

    expect(screen.getByTestId('glass')).toHaveClass('custom-class')
    expect(screen.getByTestId('glass')).toHaveClass('teal-u-backdrop-blur-xl')
  })

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<GlassPanel ref={ref}>Frosted content</GlassPanel>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
