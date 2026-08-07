import { act, fireEvent, render, screen } from '@testing-library/react'
import { LazyImage } from '../src/LazyImage'

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

describe('LazyImage', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  it('renders the placeholder without requesting the image initially', () => {
    mockObserver()
    const { container } = render(<LazyImage src="/chart.png" alt="Quarterly chart" width={320} height={180} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-state', 'idle')
  })

  it('loads the image when it nears the viewport and fades it in on load', () => {
    mockObserver()
    const { container } = render(<LazyImage src="/chart.png" alt="Quarterly chart" width={320} height={180} />)

    act(() => IntersectionObserverMock.instances[0]?.trigger(true))

    const image = screen.getByRole('img', { name: 'Quarterly chart' })
    expect(image).toHaveAttribute('src', '/chart.png')
    expect(container.firstElementChild).toHaveAttribute('data-state', 'loading')

    fireEvent.load(image)
    expect(container.firstElementChild).toHaveAttribute('data-state', 'loaded')
  })

  it('stops observing once loading starts', () => {
    mockObserver()
    render(<LazyImage src="/chart.png" alt="Quarterly chart" />)

    const observer = IntersectionObserverMock.instances[0]
    act(() => observer?.trigger(true))
    expect(observer?.disconnected).toBe(true)
  })

  it('renders a custom placeholder until the image loads', () => {
    mockObserver()
    render(<LazyImage src="/map.png" alt="Coverage map" placeholder={<p>Map on its way</p>} />)

    expect(screen.getByText('Map on its way')).toBeInTheDocument()

    act(() => IntersectionObserverMock.instances[0]?.trigger(true))
    fireEvent.load(screen.getByRole('img', { name: 'Coverage map' }))
    expect(screen.queryByText('Map on its way')).not.toBeInTheDocument()
  })

  it('loads immediately when IntersectionObserver is unavailable', () => {
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
    render(<LazyImage src="/chart.png" alt="Quarterly chart" />)

    expect(screen.getByRole('img', { name: 'Quarterly chart' })).toHaveAttribute('src', '/chart.png')
  })
})
