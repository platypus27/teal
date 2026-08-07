import { act, fireEvent, render, screen } from '@testing-library/react'
import { TableOfContents } from '../src/TableOfContents'

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

const headings = [
  { id: 'install', level: 2, title: 'Installation' },
  { id: 'npm', level: 3, title: 'With npm' },
  { id: 'pnpm', level: 3, title: 'With pnpm' },
  { id: 'usage', level: 2, title: 'Usage' },
  { id: 'deep', level: 4, title: 'Advanced options' },
]

function renderWithHeadings(props = {}) {
  return render(
    <div>
      <TableOfContents headings={headings} {...props} />
      {headings.map((heading) => (
        <section key={heading.id} id={heading.id}>
          {heading.title}
        </section>
      ))}
    </div>,
  )
}

describe('TableOfContents', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  it('renders a navigation landmark with a link per heading', () => {
    renderWithHeadings()

    expect(screen.getByRole('navigation', { name: 'Table of contents' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Installation' })).toHaveAttribute('href', '#install')
    expect(screen.getByRole('link', { name: 'Advanced options' })).toHaveAttribute('href', '#deep')
  })

  it('nests links by heading level', () => {
    renderWithHeadings()

    const nested = screen.getByRole('link', { name: 'With npm' }).closest('ul')
    expect(nested?.className).toContain('teal-u-pl-4')
    // A level-4 heading under a level-2 heading still nests beneath it.
    const deep = screen.getByRole('link', { name: 'Advanced options' }).closest('ul')
    expect(deep?.className).toContain('teal-u-pl-4')

    const topLevel = screen.getByRole('link', { name: 'Installation' }).closest('ul')
    expect(topLevel?.className).not.toContain('teal-u-pl-4')
  })

  it('marks the active heading with aria-current="location"', () => {
    renderWithHeadings({ defaultActiveId: 'pnpm' })

    expect(screen.getByRole('link', { name: 'With pnpm' })).toHaveAttribute('aria-current', 'location')
    expect(screen.getByRole('link', { name: 'Installation' })).not.toHaveAttribute('aria-current')
  })

  it('activates the clicked heading and smooth-scrolls to it', () => {
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
    const onActiveChange = vi.fn()
    renderWithHeadings({ onActiveChange })

    fireEvent.click(screen.getByRole('link', { name: 'Usage' }))

    expect(onActiveChange).toHaveBeenCalledWith('usage')
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(screen.getByRole('link', { name: 'Usage' })).toHaveAttribute('aria-current', 'location')
  })

  it('highlights the heading in view via IntersectionObserver', () => {
    mockObserver()
    renderWithHeadings()

    const observer = IntersectionObserverMock.instances[0]
    expect(observer?.observed).toHaveLength(5)

    act(() => observer?.trigger([{ isIntersecting: true, target: document.getElementById('pnpm') as Element }]))

    expect(screen.getByRole('link', { name: 'With pnpm' })).toHaveAttribute('aria-current', 'location')
  })

  it('respects a controlled activeId', () => {
    renderWithHeadings({ activeId: 'deep' })

    fireEvent.click(screen.getByRole('link', { name: 'Usage' }))
    expect(screen.getByRole('link', { name: 'Advanced options' })).toHaveAttribute('aria-current', 'location')
  })
})
