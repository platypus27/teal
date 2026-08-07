import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '../src/ErrorBoundary'

let shouldThrow = false

function MaybeBroken() {
  if (shouldThrow) throw new Error('boom')
  return <p>All good</p>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = false
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <MaybeBroken />
      </ErrorBoundary>,
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument()
  })

  it('renders a static fallback and calls onError when a child throws', () => {
    shouldThrow = true
    const onError = vi.fn()
    render(
      <ErrorBoundary fallback={<p>Something went wrong</p>} onError={onError}>
        <MaybeBroken />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('All good')).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error)
  })

  it('renders a fallback render prop with the error and resets via the callback', async () => {
    shouldThrow = true
    const user = userEvent.setup()
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p role="alert">{error.message}</p>
            <button type="button" onClick={reset}>
              Retry
            </button>
          </div>
        )}
      >
        <MaybeBroken />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('boom')

    shouldThrow = false
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('resets when a resetKey changes', () => {
    shouldThrow = true
    const { rerender } = render(
      <ErrorBoundary fallback={<p>Fallback</p>} resetKeys={['a']}>
        <MaybeBroken />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Fallback')).toBeInTheDocument()

    shouldThrow = false
    rerender(
      <ErrorBoundary fallback={<p>Fallback</p>} resetKeys={['b']}>
        <MaybeBroken />
      </ErrorBoundary>,
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('keeps the fallback when resetKeys are unchanged', () => {
    shouldThrow = true
    const { rerender } = render(
      <ErrorBoundary fallback={<p>Fallback</p>} resetKeys={['a']}>
        <MaybeBroken />
      </ErrorBoundary>,
    )

    rerender(
      <ErrorBoundary fallback={<p>Fallback</p>} resetKeys={['a']}>
        <MaybeBroken />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Fallback')).toBeInTheDocument()
  })
})
