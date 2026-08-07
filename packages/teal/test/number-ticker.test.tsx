import { act, render, screen } from '@testing-library/react'
import { NumberTicker } from '../src/NumberTicker'

type FrameCallback = (timestamp: number) => void

describe('NumberTicker', () => {
  const originalRaf = globalThis.requestAnimationFrame
  const originalCancel = globalThis.cancelAnimationFrame
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCancel
    window.matchMedia = originalMatchMedia
  })

  function mockRaf() {
    const callbacks: FrameCallback[] = []
    globalThis.requestAnimationFrame = vi.fn((callback: FrameCallback) => {
      callbacks.push(callback)
      return callbacks.length
    }) as unknown as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = vi.fn() as unknown as typeof cancelAnimationFrame
    return callbacks
  }

  function mockReducedMotion() {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia
  }

  it('animates from the start value to the target over the duration', () => {
    const callbacks = mockRaf()
    const onComplete = vi.fn()
    render(<NumberTicker value={100} duration={1000} onComplete={onComplete} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    // Halfway through, ease-out cubic puts the value at 87.5 -> rounded to 88.
    act(() => callbacks[0]?.(0))
    act(() => callbacks[1]?.(500))
    expect(screen.getByText('88')).toBeInTheDocument()

    act(() => callbacks[2]?.(1000))
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('counts to a new target when the value changes', () => {
    const callbacks = mockRaf()
    const { rerender } = render(<NumberTicker value={10} duration={1000} />)

    act(() => callbacks[0]?.(0))
    act(() => callbacks[1]?.(1000))
    expect(screen.getByText('10')).toBeInTheDocument()

    rerender(<NumberTicker value={20} duration={1000} />)
    const pending = callbacks[callbacks.length - 1]
    act(() => pending?.(2000))
    act(() => callbacks[callbacks.length - 1]?.(3000))
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('jumps instantly under reduced motion without using rAF', () => {
    mockReducedMotion()
    const raf = vi.fn()
    globalThis.requestAnimationFrame = raf as unknown as typeof requestAnimationFrame
    const onComplete = vi.fn()

    render(<NumberTicker value={100} onComplete={onComplete} />)

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(raf).not.toHaveBeenCalled()
  })

  it('formats the displayed value with the formatter prop', () => {
    mockReducedMotion()
    render(<NumberTicker value={1234.5} formatter={(value) => `$${Math.round(value)}`} />)

    expect(screen.getByText('$1235')).toBeInTheDocument()
  })

  it('starts the first animation from startValue', () => {
    mockReducedMotion()
    render(<NumberTicker value={50} startValue={50} />)

    expect(screen.getByText('50')).toBeInTheDocument()
  })
})
