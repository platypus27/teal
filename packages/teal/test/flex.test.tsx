import { render, screen } from '@testing-library/react'
import { Flex } from '../src/Flex'

describe('Flex', () => {
  it('renders children in a row flex container by default', () => {
    render(
      <Flex data-testid="flex">
        <span>First</span>
        <span>Second</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('teal-u-flex')
    expect(flex.className).toContain('teal-u-flex-row')
    expect(flex).toContainElement(screen.getByText('First'))
    expect(flex).toContainElement(screen.getByText('Second'))
  })

  it('supports reverse and column directions', () => {
    render(<Flex data-testid="flex" direction="column-reverse" />)
    expect(screen.getByTestId('flex').className).toContain('teal-u-flex-col-reverse')
  })

  it('maps a numeric gap to the Tailwind spacing scale', () => {
    render(<Flex data-testid="flex" gap={4} />)
    expect(screen.getByTestId('flex').style.gap).toBe('1rem')
  })

  it('applies alignment, distribution and wrapping', () => {
    render(<Flex data-testid="flex" align="center" justify="between" wrap />)
    const flex = screen.getByTestId('flex')
    expect(flex.style.alignItems).toBe('center')
    expect(flex.style.justifyContent).toBe('space-between')
    expect(flex.className).toContain('teal-u-flex-wrap')
  })

  it('renders inline when inline is set', () => {
    render(<Flex data-testid="flex" inline />)
    expect(screen.getByTestId('flex').className).toContain('teal-u-inline-flex')
  })

  it('renders as a different element via the as prop', () => {
    render(<Flex data-testid="flex" as="nav" />)
    expect(screen.getByTestId('flex').tagName).toBe('NAV')
  })

  it('merges a caller className and style', () => {
    render(<Flex data-testid="flex" className="teal-u-mt-4" style={{ padding: 8 }} />)
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('teal-u-mt-4')
    expect(flex.style.padding).toBe('8px')
  })
})
