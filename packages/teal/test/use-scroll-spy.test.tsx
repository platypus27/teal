import { act, render } from '@testing-library/react'
import { useScrollSpy } from '../src/use-scroll-spy'

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []
  observed: Element[] = []
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    IntersectionObserverMock.instances.push(this)
  }
  observe(el: Element) {
    this.observed.push(el)
  }
  unobserve() {}
  disconnect() {}
  trigger(entries: Array<{ isIntersecting: boolean; target: Element }>) {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

function Harness({ onActive }: { onActive: (id: string) => void }) {
  useScrollSpy('one two', onActive)
  return null
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    IntersectionObserverMock.instances = []
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('observes the elements for the space-separated ids and reports the first intersecting one', () => {
    const onActive = vi.fn()
    render(
      <div>
        <section id="one" />
        <section id="two" />
        <Harness onActive={onActive} />
      </div>,
    )
    const observer = IntersectionObserverMock.instances[0]
    expect(observer?.observed).toHaveLength(2)
    act(() => {
      observer?.trigger([{ isIntersecting: true, target: document.getElementById('two')! }])
    })
    expect(onActive).toHaveBeenCalledWith('two')
  })

  it('does nothing when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const onActive = vi.fn()
    render(<Harness onActive={onActive} />)
    expect(onActive).not.toHaveBeenCalled()
  })
})
