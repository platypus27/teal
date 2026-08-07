import { act, render, screen } from '@testing-library/react'
import { StickyHeader } from '../src/StickyHeader'

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  callback: ObserverCallback
  options: { rootMargin?: string } | undefined
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(callback: ObserverCallback, options?: { rootMargin?: string }) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting }])
  }
}

describe('StickyHeader', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    MockIntersectionObserver.instances = []
  })

  it('renders a sticky header without a shadow while at the top', () => {
    render(<StickyHeader data-testid="header">Title</StickyHeader>)

    const header = screen.getByTestId('header')
    expect(header.className).toContain('teal-u-sticky')
    expect(header.className).not.toContain('teal-u-shadow-overlay')
    expect(header).toHaveAttribute('data-stuck', 'false')
    expect(header).toHaveTextContent('Title')
  })

  it('gains a shadow when the sentinel leaves the viewport', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    render(<StickyHeader data-testid="header">Title</StickyHeader>)

    const observer = MockIntersectionObserver.instances[0] as MockIntersectionObserver
    expect(observer.observe).toHaveBeenCalled()

    act(() => observer.trigger(false))

    const header = screen.getByTestId('header')
    expect(header).toHaveAttribute('data-stuck', 'true')
    expect(header.className).toContain('teal-u-shadow-overlay')

    act(() => observer.trigger(true))
    expect(header).toHaveAttribute('data-stuck', 'false')
    expect(header.className).not.toContain('teal-u-shadow-overlay')
  })

  it('positions the sticky header at the given offset', () => {
    render(<StickyHeader data-testid="header" offset={56} />)
    expect(screen.getByTestId('header').style.top).toBe('56px')
  })

  it('accounts for the offset in the observer root margin', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    render(<StickyHeader offset={56} />)

    const observer = MockIntersectionObserver.instances[0] as MockIntersectionObserver
    expect(observer.options?.rootMargin).toBe('-57px 0px 0px 0px')
  })

  it('merges a caller className', () => {
    render(<StickyHeader data-testid="header" className="teal-u-px-4" />)
    expect(screen.getByTestId('header').className).toContain('teal-u-px-4')
  })
})
