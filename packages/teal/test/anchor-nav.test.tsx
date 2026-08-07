import { act, fireEvent, render, screen } from '@testing-library/react'
import { AnchorNav } from '../src/AnchorNav'

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  callback: ObserverCallback
  observed: Element[] = []

  constructor(callback: ObserverCallback) {
    this.callback = callback
    IntersectionObserverMock.instances.push(this)
  }

  observe(node: Element) {
    this.observed.push(node)
  }

  unobserve() {}

  disconnect() {}

  trigger(entries: Array<Partial<IntersectionObserverEntry>>) {
    this.callback(entries)
  }
}

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'usage', label: 'Usage' },
  { id: 'api', label: 'API' },
]

function renderWithSections(navProps = {}) {
  return render(
    <div>
      <AnchorNav items={items} {...navProps} />
      <section id="overview">Overview section</section>
      <section id="usage">Usage section</section>
      <section id="api">API section</section>
    </div>,
  )
}

describe('AnchorNav', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  it('renders a navigation landmark linking to each section', () => {
    renderWithSections()

    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '#overview')
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('href', '#api')
  })

  it('marks the first item active by default and honors defaultActiveId', () => {
    renderWithSections({ defaultActiveId: 'usage' })

    expect(screen.getByRole('link', { name: 'Usage' })).toHaveAttribute('aria-current', 'location')
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current')
  })

  it('activates the clicked item and smooth-scrolls to its section', () => {
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
    const onActiveChange = vi.fn()
    renderWithSections({ onActiveChange })

    fireEvent.click(screen.getByRole('link', { name: 'API' }))

    expect(onActiveChange).toHaveBeenCalledWith('api')
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location')
  })

  it('highlights the section in view via IntersectionObserver', () => {
    mockObserver()
    renderWithSections()

    const observer = IntersectionObserverMock.instances[0]
    expect(observer?.observed).toHaveLength(3)

    act(() => observer?.trigger([{ isIntersecting: true, target: document.getElementById('usage') as Element }]))

    expect(screen.getByRole('link', { name: 'Usage' })).toHaveAttribute('aria-current', 'location')
  })

  it('respects a controlled activeId', () => {
    mockObserver()
    renderWithSections({ activeId: 'api' })

    act(() =>
      IntersectionObserverMock.instances[0]?.trigger([
        { isIntersecting: true, target: document.getElementById('overview') as Element },
      ]),
    )

    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location')
  })

  it('renders without IntersectionObserver support', () => {
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
    renderWithSections()

    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument()
  })
})
