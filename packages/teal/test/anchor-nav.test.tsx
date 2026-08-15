import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { AnchorNav } from '../src/AnchorNav'

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  callback: ObserverCallback
  options: IntersectionObserverInit | undefined
  observed: Element[] = []

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
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

describe('AnchorNav nested items', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  const nestedItems = [
    { id: 'install', label: 'Install' },
    {
      id: 'usage',
      label: 'Usage',
      children: [
        { id: 'npm', label: 'npm' },
        { id: 'pnpm', label: 'pnpm' },
      ],
    },
  ]

  it('renders child items in a nested indented list', () => {
    render(<AnchorNav items={nestedItems} />)

    const pnpm = screen.getByRole('link', { name: 'pnpm' })
    expect(pnpm.closest('ul')).toHaveClass('teal-u-pl-4')
    expect(screen.getByRole('link', { name: 'Install' }).closest('ul')).not.toHaveClass('teal-u-pl-4')
  })

  it('tracks nested section ids with the scroll spy', () => {
    mockObserver()
    const onActiveChange = vi.fn()
    render(
      <div>
        <AnchorNav items={nestedItems} onActiveChange={onActiveChange} />
        <section id="install" />
        <section id="usage" />
        <section id="npm" />
        <section id="pnpm" />
      </div>,
    )

    const observer = IntersectionObserverMock.instances[0]!
    expect(observer.observed).toHaveLength(4)
    act(() => {
      observer.trigger([{ isIntersecting: true, target: document.getElementById('pnpm')! }])
    })
    expect(screen.getByRole('link', { name: 'pnpm' })).toHaveAttribute('aria-current', 'location')
  })
})

describe('AnchorNav container scoping', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  function ContainerHarness() {
    const containerRef = useRef<HTMLDivElement>(null)
    return (
      <div>
        <section id="shared" /> {/* duplicate id OUTSIDE the container */}
        <div data-testid="scroll-area" ref={containerRef}>
          <section id="inside" />
          <section id="shared" /> {/* the in-container twin */}
          <AnchorNav
            containerRef={containerRef}
            items={[
              { id: 'inside', label: 'inside' },
              { id: 'shared', label: 'shared' },
            ]}
          />
        </div>
      </div>
    )
  }

  it('only observes sections inside the container, uses it as the observer root, and scrolls it instead of ancestors', async () => {
    mockObserver()
    const user = userEvent.setup()
    const scrollTo = vi.fn()
    const { OriginalScrollTo } = { OriginalScrollTo: HTMLElement.prototype.scrollTo }
    HTMLElement.prototype.scrollTo = scrollTo
    render(<ContainerHarness />)

    const observer = IntersectionObserverMock.instances[0]!
    expect(observer.observed).toHaveLength(2) // both sections inside the container
    expect(observer.options?.root).toBe(screen.getByTestId('scroll-area'))

    await user.click(screen.getByRole('link', { name: 'inside' }))
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }))

    HTMLElement.prototype.scrollTo = OriginalScrollTo
  })
})
