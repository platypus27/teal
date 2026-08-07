import { act, render, screen } from '@testing-library/react'
import { Reveal } from '../src/Reveal'

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  callback: ObserverCallback
  disconnected = false

  constructor(callback: ObserverCallback) {
    this.callback = callback
    IntersectionObserverMock.instances.push(this)
  }

  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting }])
  }
}

describe('Reveal', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  it('starts hidden and reveals when scrolled into view', () => {
    mockObserver()
    render(
      <Reveal>
        <p>lazy content</p>
      </Reveal>,
    )

    const region = screen.getByText('lazy content').parentElement as HTMLElement
    expect(region).toHaveAttribute('data-state', 'hidden')

    act(() => IntersectionObserverMock.instances[0]?.trigger(true))
    expect(region).toHaveAttribute('data-state', 'visible')
  })

  it('stops observing after the first reveal when once is set', () => {
    mockObserver()
    render(
      <Reveal once>
        <p>lazy content</p>
      </Reveal>,
    )

    const observer = IntersectionObserverMock.instances[0]
    act(() => observer?.trigger(true))
    expect(observer?.disconnected).toBe(true)

    const region = screen.getByText('lazy content').parentElement as HTMLElement
    act(() => observer?.trigger(false))
    expect(region).toHaveAttribute('data-state', 'visible')
  })

  it('hides again when the element leaves the viewport and once is false', () => {
    mockObserver()
    render(
      <Reveal once={false}>
        <p>lazy content</p>
      </Reveal>,
    )

    const observer = IntersectionObserverMock.instances[0]
    const region = screen.getByText('lazy content').parentElement as HTMLElement

    act(() => observer?.trigger(true))
    expect(region).toHaveAttribute('data-state', 'visible')

    act(() => observer?.trigger(false))
    expect(region).toHaveAttribute('data-state', 'hidden')
    expect(observer?.disconnected).toBe(false)
  })

  it('shows content immediately when IntersectionObserver is unavailable', () => {
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
    render(
      <Reveal>
        <p>lazy content</p>
      </Reveal>,
    )

    const region = screen.getByText('lazy content').parentElement as HTMLElement
    expect(region).toHaveAttribute('data-state', 'visible')
  })
})
