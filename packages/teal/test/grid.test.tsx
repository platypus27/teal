import { render, screen } from '@testing-library/react'
import { Grid } from '../src/Grid'

describe('Grid', () => {
  it('renders children in a grid container', () => {
    render(
      <Grid data-testid="grid">
        <span>Cell</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')
    expect(grid.className).toContain('teal-u-grid')
    expect(grid).toContainElement(screen.getByText('Cell'))
  })

  it('renders a fixed column count as equal tracks', () => {
    render(<Grid data-testid="grid" columns={3} />)
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  it('enables auto-fit columns when minChildWidth is a string', () => {
    render(<Grid data-testid="grid" minChildWidth="16rem" />)
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(16rem, 1fr))')
  })

  it('treats a numeric minChildWidth as pixels', () => {
    render(<Grid data-testid="grid" minChildWidth={240} />)
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(240px, 1fr))')
  })

  it('maps a numeric gap to the Tailwind spacing scale', () => {
    render(<Grid data-testid="grid" gap={2} />)
    expect(screen.getByTestId('grid').style.gap).toBe('0.5rem')
  })

  it('renders as a different element via the as prop and merges className', () => {
    render(<Grid data-testid="grid" as="ul" className="teal-u-mt-2" columns={2} />)
    const grid = screen.getByTestId('grid')
    expect(grid.tagName).toBe('UL')
    expect(grid.className).toContain('teal-u-mt-2')
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))')
  })
})
