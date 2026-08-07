import { render, screen } from '@testing-library/react'
import { Container } from '../src/Container'

describe('Container', () => {
  it('centers content in a capped column by default', () => {
    render(<Container data-testid="container">Body</Container>)

    const container = screen.getByTestId('container')
    expect(container.className).toContain('teal-u-mx-auto')
    expect(container.className).toContain('teal-u-max-w-6xl')
    expect(container).toHaveTextContent('Body')
  })

  it('applies responsive horizontal padding', () => {
    render(<Container data-testid="container" />)
    const container = screen.getByTestId('container')
    expect(container.className).toContain('teal-u-px-4')
    expect(container.className).toContain('sm:teal-u-px-6')
    expect(container.className).toContain('lg:teal-u-px-8')
  })

  it('switches the max-width by size', () => {
    render(<Container data-testid="container" size="sm" />)
    expect(screen.getByTestId('container').className).toContain('teal-u-max-w-2xl')
  })

  it('removes the width cap when fluid', () => {
    render(<Container data-testid="container" size="fluid" />)
    expect(screen.getByTestId('container').className).toContain('teal-u-max-w-none')
  })

  it('renders as a different element via the as prop', () => {
    render(<Container data-testid="container" as="main" />)
    expect(screen.getByTestId('container').tagName).toBe('MAIN')
  })

  it('merges a caller className', () => {
    render(<Container data-testid="container" className="teal-u-mt-8" />)
    expect(screen.getByTestId('container').className).toContain('teal-u-mt-8')
  })
})
