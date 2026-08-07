import { render, screen } from '@testing-library/react'
import { Box } from '../src/Box'

describe('Box', () => {
  it('renders children in a plain div by default', () => {
    render(<Box data-testid="box">Content</Box>)

    const box = screen.getByTestId('box')
    expect(box.tagName).toBe('DIV')
    expect(box).toHaveTextContent('Content')
  })

  it('maps numeric spacing to the Tailwind spacing scale', () => {
    render(<Box data-testid="box" p={4} m={2} />)
    const box = screen.getByTestId('box')
    expect(box.style.padding).toBe('1rem')
    expect(box.style.margin).toBe('0.5rem')
  })

  it('lets axis spacing override the all-sides value', () => {
    render(<Box data-testid="box" p={4} px={8} py={1} m={2} mx={0} />)
    const box = screen.getByTestId('box')
    expect(box.style.paddingInline).toBe('2rem')
    expect(box.style.paddingBlock).toBe('0.25rem')
    expect(box.style.marginInline).toBe('0rem')
    expect(box.style.marginBlock).toBe('')
  })

  it('passes string spacing values through untouched', () => {
    render(<Box data-testid="box" p="var(--custom-pad)" />)
    expect(screen.getByTestId('box').style.padding).toBe('var(--custom-pad)')
  })

  it('renders as a different element via the as prop', () => {
    render(<Box data-testid="box" as="article" />)
    expect(screen.getByTestId('box').tagName).toBe('ARTICLE')
  })

  it('passes surface tokens through className and merges style', () => {
    render(<Box data-testid="box" className="teal-u-bg-surface-container" style={{ opacity: 0.5 }} />)
    const box = screen.getByTestId('box')
    expect(box.className).toContain('teal-u-bg-surface-container')
    expect(box.style.opacity).toBe('0.5')
  })
})
