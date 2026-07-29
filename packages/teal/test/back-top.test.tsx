import { fireEvent, render, screen } from '@testing-library/react'
import { BackTop } from '../src/BackTop'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true })
}

describe('BackTop', () => {
  beforeEach(() => {
    setScrollY(0)
  })

  it('stays hidden below the threshold', () => {
    setScrollY(399)
    render(<BackTop />)
    fireEvent.scroll(window)

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
  })

  it('appears once the window scrolls past the threshold', () => {
    setScrollY(0)
    render(<BackTop />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()

    setScrollY(500)
    fireEvent.scroll(window)
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
  })

  it('honours a custom threshold', () => {
    setScrollY(150)
    render(<BackTop threshold={100} />)
    fireEvent.scroll(window)

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
  })

  it('smooth-scrolls to the top on click', () => {
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo
    setScrollY(800)
    render(<BackTop />)
    fireEvent.scroll(window)

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('uses instant scrolling when the user prefers reduced motion', () => {
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    Object.defineProperty(window, 'matchMedia', { value: matchMedia, configurable: true })
    setScrollY(800)
    render(<BackTop />)
    fireEvent.scroll(window)

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('supports a custom label and className', () => {
    setScrollY(800)
    render(<BackTop label="Back to the start" className="teal-u-bottom-10" />)
    fireEvent.scroll(window)

    const button = screen.getByRole('button', { name: 'Back to the start' })
    expect(button.className).toContain('teal-u-bottom-10')
    expect(button.className).toContain('teal-u-fixed')
  })
})
