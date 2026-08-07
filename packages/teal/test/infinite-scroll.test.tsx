import { act, fireEvent, render, screen } from '@testing-library/react'
import { InfiniteScroll } from '../src/InfiniteScroll'

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

describe('InfiniteScroll', () => {
  const originalObserver = globalThis.IntersectionObserver

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    IntersectionObserverMock.instances = []
  })

  function mockObserver() {
    IntersectionObserverMock.instances = []
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  }

  it('calls onLoadMore when the sentinel enters the viewport', () => {
    mockObserver()
    const onLoadMore = vi.fn()
    render(
      <InfiniteScroll hasMore onLoadMore={onLoadMore}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    expect(onLoadMore).not.toHaveBeenCalled()
    act(() => IntersectionObserverMock.instances[0]?.trigger(true))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('does not call onLoadMore when the sentinel leaves or while loading', () => {
    mockObserver()
    const onLoadMore = vi.fn()
    render(
      <InfiniteScroll hasMore loading={false} onLoadMore={onLoadMore}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    act(() => IntersectionObserverMock.instances[0]?.trigger(false))
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('suppresses triggers while a batch is loading', () => {
    mockObserver()
    const onLoadMore = vi.fn()
    render(
      <InfiniteScroll hasMore loading onLoadMore={onLoadMore}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    act(() => IntersectionObserverMock.instances[0]?.trigger(true))
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('shows an accessible default loader while loading', () => {
    mockObserver()
    render(
      <InfiniteScroll hasMore loading onLoadMore={vi.fn()}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading more')).toBeInTheDocument()
  })

  it('renders a custom loader instead of the default', () => {
    mockObserver()
    render(
      <InfiniteScroll hasMore loading loader={<p>Fetching reports</p>} onLoadMore={vi.fn()}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    expect(screen.getByText('Fetching reports')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows the end message and stops observing when hasMore is false', () => {
    mockObserver()
    render(
      <InfiniteScroll hasMore={false} endMessage="All caught up" onLoadMore={vi.fn()}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    expect(screen.getByText('All caught up')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(IntersectionObserverMock.instances).toHaveLength(0)
  })

  it('falls back to a load-more button when IntersectionObserver is unavailable', () => {
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver
    const onLoadMore = vi.fn()
    render(
      <InfiniteScroll hasMore onLoadMore={onLoadMore}>
        <p>row 1</p>
      </InfiniteScroll>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })
})
