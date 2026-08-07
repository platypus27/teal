import { render, screen } from '@testing-library/react'
import { Center } from '../src/Center'

describe('Center', () => {
  it('centers children on both axes', () => {
    render(<Center data-testid="center">Middle</Center>)

    const center = screen.getByTestId('center')
    expect(center.className).toContain('teal-u-flex')
    expect(center.className).toContain('teal-u-items-center')
    expect(center.className).toContain('teal-u-justify-center')
    expect(center).toHaveTextContent('Middle')
  })

  it('renders inline when inline is set', () => {
    render(<Center data-testid="center" inline />)
    expect(screen.getByTestId('center').className).toContain('teal-u-inline-flex')
  })

  it('merges a caller className', () => {
    render(<Center data-testid="center" className="teal-u-h-40" />)
    expect(screen.getByTestId('center').className).toContain('teal-u-h-40')
  })
})
