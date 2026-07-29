import { render, screen } from '@testing-library/react'
import { Stack } from '../src/Stack'

describe('Stack', () => {
  it('renders children in a column flex container by default', () => {
    render(
      <Stack data-testid="stack">
        <span>First</span>
        <span>Second</span>
      </Stack>,
    )

    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('teal-u-flex')
    expect(stack.className).toContain('teal-u-flex-col')
    expect(stack).toContainElement(screen.getByText('First'))
    expect(stack).toContainElement(screen.getByText('Second'))
  })

  it('switches to a row direction', () => {
    render(<Stack data-testid="stack" direction="row" />)
    expect(screen.getByTestId('stack').className).toContain('teal-u-flex-row')
  })

  it('maps a numeric gap to the Tailwind spacing scale', () => {
    render(<Stack data-testid="stack" gap={4} />)
    expect(screen.getByTestId('stack').style.gap).toBe('1rem')
  })

  it('passes a string gap through untouched', () => {
    render(<Stack data-testid="stack" gap="var(--custom-gap)" />)
    expect(screen.getByTestId('stack').style.gap).toBe('var(--custom-gap)')
  })

  it('applies alignment, distribution and wrapping', () => {
    render(<Stack data-testid="stack" align="center" justify="between" wrap />)
    const stack = screen.getByTestId('stack')
    expect(stack.style.alignItems).toBe('center')
    expect(stack.style.justifyContent).toBe('space-between')
    expect(stack.className).toContain('teal-u-flex-wrap')
  })

  it('renders as a different element via the as prop', () => {
    render(<Stack data-testid="stack" as="section" />)
    expect(screen.getByTestId('stack').tagName).toBe('SECTION')
  })

  it('merges a caller className and style', () => {
    render(<Stack data-testid="stack" className="teal-u-mt-4" style={{ padding: 8 }} />)
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('teal-u-mt-4')
    expect(stack.style.padding).toBe('8px')
  })
})
