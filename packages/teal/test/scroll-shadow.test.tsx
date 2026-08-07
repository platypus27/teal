import { fireEvent, render, screen } from '@testing-library/react'
import { ScrollShadow } from '../src/ScrollShadow'

function setScrollMetrics(node: HTMLElement, { scrollTop, clientHeight, scrollHeight }: { scrollTop: number; clientHeight: number; scrollHeight: number }) {
  Object.defineProperty(node, 'scrollTop', { configurable: true, value: scrollTop, writable: true })
  Object.defineProperty(node, 'clientHeight', { configurable: true, value: clientHeight })
  Object.defineProperty(node, 'scrollHeight', { configurable: true, value: scrollHeight })
}

describe('ScrollShadow', () => {
  it('renders children in a vertical scroll container', () => {
    render(
      <ScrollShadow data-testid="scroller">
        <p>Row one</p>
      </ScrollShadow>,
    )

    const scroller = screen.getByTestId('scroller')
    expect(scroller.className).toContain('teal-u-overflow-y-auto')
    expect(scroller).toHaveTextContent('Row one')
  })

  it('shows no shadows when the content fits', () => {
    render(<ScrollShadow data-testid="scroller">Short</ScrollShadow>)

    expect(document.querySelector('[data-shadow="top"]')).toHaveAttribute('data-visible', 'false')
    expect(document.querySelector('[data-shadow="bottom"]')).toHaveAttribute('data-visible', 'false')
  })

  it('shows the bottom shadow when more content exists below', () => {
    render(<ScrollShadow data-testid="scroller">Long content</ScrollShadow>)
    const scroller = screen.getByTestId('scroller')
    setScrollMetrics(scroller, { scrollTop: 0, clientHeight: 100, scrollHeight: 400 })

    fireEvent.scroll(scroller)

    expect(document.querySelector('[data-shadow="top"]')).toHaveAttribute('data-visible', 'false')
    expect(document.querySelector('[data-shadow="bottom"]')).toHaveAttribute('data-visible', 'true')
  })

  it('shows both shadows mid-scroll and none at the end', () => {
    render(<ScrollShadow data-testid="scroller">Long content</ScrollShadow>)
    const scroller = screen.getByTestId('scroller')
    setScrollMetrics(scroller, { scrollTop: 150, clientHeight: 100, scrollHeight: 400 })

    fireEvent.scroll(scroller)
    expect(document.querySelector('[data-shadow="top"]')).toHaveAttribute('data-visible', 'true')
    expect(document.querySelector('[data-shadow="bottom"]')).toHaveAttribute('data-visible', 'true')

    setScrollMetrics(scroller, { scrollTop: 300, clientHeight: 100, scrollHeight: 400 })
    fireEvent.scroll(scroller)
    expect(document.querySelector('[data-shadow="top"]')).toHaveAttribute('data-visible', 'true')
    expect(document.querySelector('[data-shadow="bottom"]')).toHaveAttribute('data-visible', 'false')
  })

  it('keeps the shadows out of the accessibility tree and pointer events', () => {
    render(<ScrollShadow>Content</ScrollShadow>)

    const top = document.querySelector('[data-shadow="top"]') as HTMLElement
    expect(top).toHaveAttribute('aria-hidden', 'true')
    expect(top.className).toContain('teal-u-pointer-events-none')
  })

  it('calls a consumer onScroll after updating', () => {
    const onScroll = vi.fn()
    render(<ScrollShadow data-testid="scroller" onScroll={onScroll}>Content</ScrollShadow>)

    fireEvent.scroll(screen.getByTestId('scroller'))
    expect(onScroll).toHaveBeenCalledTimes(1)
  })

  it('sizes the shadows with shadowSize', () => {
    render(<ScrollShadow shadowSize={40}>Content</ScrollShadow>)
    const top = document.querySelector('[data-shadow="top"]') as HTMLElement
    expect(top.style.height).toBe('40px')
  })
})
