import { act, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme, type ThemeContextValue } from '../src/ThemeProvider'
import { ThemeToggle } from '../src/ThemeToggle'

type MediaQuery = {
  matches: boolean
  media: string
  addEventListener: (type: string, listener: (event: { matches: boolean }) => void) => void
  removeEventListener: (type: string, listener: (event: { matches: boolean }) => void) => void
  setMatches: (matches: boolean) => void
}

function mockMatchMedia(initial: boolean): MediaQuery {
  const listeners = new Set<(event: { matches: boolean }) => void>()
  const query: MediaQuery = {
    matches: initial,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
    setMatches: (matches) => {
      query.matches = matches
      listeners.forEach((listener) => listener({ matches }))
    },
  }
  Object.defineProperty(window, 'matchMedia', { value: () => query, configurable: true, writable: true })
  return query
}

function unmockMatchMedia() {
  delete (window as { matchMedia?: unknown }).matchMedia
}

function ThemeState({ onState }: { onState?: (value: ThemeContextValue) => void }) {
  const theme = useTheme()
  onState?.(theme)
  return (
    <output data-testid="state">
      {theme.choice}:{theme.resolved}
    </output>
  )
}

afterEach(() => {
  document.documentElement.classList.remove('dark')
  window.localStorage.clear()
  unmockMatchMedia()
})

describe('ThemeProvider', () => {
  it('defaults to system and resolves against prefers-color-scheme', () => {
    mockMatchMedia(true)
    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('state')).toHaveTextContent('system:dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('prefers a stored choice over the system preference and defaultChoice', () => {
    mockMatchMedia(true)
    window.localStorage.setItem('kryv:theme', 'light')
    render(
      <ThemeProvider defaultChoice="dark">
        <ThemeState />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('state')).toHaveTextContent('light:light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('ignores a stored value that is not a valid choice', () => {
    mockMatchMedia(false)
    window.localStorage.setItem('kryv:theme', 'sepia')
    render(
      <ThemeProvider defaultChoice="dark">
        <ThemeState />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('state')).toHaveTextContent('dark:dark')
  })

  it('setChoice applies the theme to the document root and persists it', () => {
    mockMatchMedia(false)
    let state: ThemeContextValue | undefined
    render(
      <ThemeProvider>
        <ThemeState onState={(value) => { state = value }} />
      </ThemeProvider>,
    )

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    act(() => state!.setChoice('dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('kryv:theme')).toBe('dark')
  })

  it('honors a custom storageKey', () => {
    mockMatchMedia(false)
    window.localStorage.setItem('photos:theme', 'dark')
    render(
      <ThemeProvider storageKey="photos:theme">
        <ThemeState />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('state')).toHaveTextContent('dark:dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('tracks system changes while the choice is system', () => {
    const query = mockMatchMedia(false)
    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('state')).toHaveTextContent('system:light')

    act(() => query.setMatches(true))
    expect(screen.getByTestId('state')).toHaveTextContent('system:dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('renders without matchMedia (older engines and SSR-like environments)', () => {
    unmockMatchMedia()
    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('state')).toHaveTextContent('system:light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('useTheme throws outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const Bare = () => {
      useTheme()
      return null
    }
    expect(() => render(<Bare />)).toThrow('useTheme must be used within a ThemeProvider')
  })
})

describe('ThemeToggle inside a ThemeProvider', () => {
  it('becomes controlled: it flips the provider choice instead of touching the document directly', () => {
    mockMatchMedia(false)
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <ThemeState />
        <ThemeToggle onChange={onChange} />
      </ThemeProvider>,
    )
    const button = screen.getByRole('button', { name: 'Toggle dark mode' })

    fireEvent.click(button)
    expect(screen.getByTestId('state')).toHaveTextContent('dark:dark')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('kryv:theme')).toBe('dark')
    expect(onChange).toHaveBeenCalledWith('dark')

    fireEvent.click(button)
    expect(screen.getByTestId('state')).toHaveTextContent('light:light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(onChange).toHaveBeenCalledWith('light')
  })

  it('resolves an explicit choice from a dark system preference', () => {
    mockMatchMedia(true)
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    const button = screen.getByRole('button', { name: 'Toggle dark mode' })
    expect(button).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(window.localStorage.getItem('kryv:theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
