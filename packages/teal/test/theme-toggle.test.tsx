import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeToggle } from '../src/ThemeToggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('renders unpressed in light mode by default', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles the dark class on the document root and reports the theme', () => {
    const onChange = vi.fn()
    render(<ThemeToggle onChange={onChange} />)
    const button = screen.getByRole('button', { name: 'Toggle dark mode' })

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(onChange).toHaveBeenCalledWith('dark')

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(onChange).toHaveBeenCalledWith('light')
  })

  it('initialises from an existing dark class on the document root', () => {
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('works without an onChange callback and merges className', () => {
    render(<ThemeToggle className="teal-u-mt-2" />)
    const button = screen.getByRole('button', { name: 'Toggle dark mode' })

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(button.className).toContain('teal-u-mt-2')
  })
})
