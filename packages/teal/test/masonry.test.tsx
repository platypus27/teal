import { render, screen } from '@testing-library/react'
import { Masonry } from '../src/Masonry'

describe('Masonry', () => {
  it('lays children out in two CSS columns by default', () => {
    render(
      <Masonry data-testid="masonry">
        <span>First</span>
        <span>Second</span>
      </Masonry>,
    )

    const masonry = screen.getByTestId('masonry')
    expect(masonry.style.columnCount).toBe('2')
    expect(masonry.style.columnGap).toBe('1rem')
    expect(masonry).toContainElement(screen.getByText('First'))
  })

  it('respects a fixed column count', () => {
    render(<Masonry data-testid="masonry" columns={4} />)
    expect(screen.getByTestId('masonry').style.columnCount).toBe('4')
  })

  it('switches to a minimum column width for responsive filling', () => {
    render(<Masonry data-testid="masonry" minColumnWidth={240} columns={4} />)
    const masonry = screen.getByTestId('masonry')
    expect(masonry.style.columnWidth).toBe('240px')
    expect(masonry.style.columnCount).toBe('')
  })

  it('wraps each child so items avoid column breaks and keep the gap', () => {
    render(
      <Masonry data-testid="masonry" gap={2}>
        <p>Card</p>
      </Masonry>,
    )

    const wrapper = screen.getByText('Card').parentElement as HTMLElement
    expect(wrapper.className).toContain('teal-u-break-inside-avoid')
    expect(wrapper.style.marginBottom).toBe('0.5rem')
    expect(screen.getByTestId('masonry').style.columnGap).toBe('0.5rem')
  })

  it('renders as a different element via the as prop', () => {
    render(<Masonry data-testid="masonry" as="ul" />)
    expect(screen.getByTestId('masonry').tagName).toBe('UL')
  })
})
