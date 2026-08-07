import { render, screen } from '@testing-library/react'
import { Columns } from '../src/Columns'

describe('Columns', () => {
  it('renders a grid with three collapsing columns by default', () => {
    render(
      <Columns data-testid="columns">
        <span>First</span>
        <span>Second</span>
      </Columns>,
    )

    const columns = screen.getByTestId('columns')
    expect(columns.className).toContain('teal-u-grid')
    expect(columns.className).toContain('lg:teal-u-grid-cols-3')
    expect(columns.className).toContain('teal-u-grid-cols-1')
    expect(columns).toContainElement(screen.getByText('First'))
  })

  it('switches the column count', () => {
    render(<Columns data-testid="columns" columns={4} />)
    expect(screen.getByTestId('columns').className).toContain('lg:teal-u-grid-cols-4')
  })

  it('maps a numeric gap to the Tailwind spacing scale', () => {
    render(<Columns data-testid="columns" gap={4} />)
    expect(screen.getByTestId('columns').style.gap).toBe('1rem')
  })

  it('passes a string gap through untouched', () => {
    render(<Columns data-testid="columns" gap="var(--custom-gap)" />)
    expect(screen.getByTestId('columns').style.gap).toBe('var(--custom-gap)')
  })

  it('renders as a different element via the as prop', () => {
    render(<Columns data-testid="columns" as="ul" />)
    expect(screen.getByTestId('columns').tagName).toBe('UL')
  })

  it('merges a caller className', () => {
    render(<Columns data-testid="columns" className="teal-u-mt-4" />)
    expect(screen.getByTestId('columns').className).toContain('teal-u-mt-4')
  })
})
