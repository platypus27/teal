import { fireEvent, render, screen } from '@testing-library/react'
import { Carousel, CarouselSlide } from '../src/Carousel'

beforeAll(() => {
  // jsdom does not implement element scrollTo.
  window.HTMLElement.prototype.scrollTo = vi.fn()
})

function renderCarousel(props?: { loop?: boolean }) {
  return render(
    <Carousel label="Featured products" {...props}>
      <div>Slide one</div>
      <div>Slide two</div>
      <div>Slide three</div>
    </Carousel>,
  )
}

describe('Carousel', () => {
  it('renders a labelled carousel region with slides', () => {
    renderCarousel()

    const region = screen.getByRole('region', { name: 'Featured products' })
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')

    const slides = screen.getAllByRole('group')
    expect(slides).toHaveLength(3)
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide')
    expect(slides[0]).toHaveAttribute('aria-label', '1 of 3')
    expect(slides[2]).toHaveAttribute('aria-label', '3 of 3')
    expect(screen.getByText('Slide two')).toBeInTheDocument()
  })

  it('marks the first dot as current and disables prev at the start', () => {
    renderCarousel()

    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled()
  })

  it('moves to the next and previous slides via the buttons', () => {
    renderCarousel()

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true')
  })

  it('scrolls the track when navigating', () => {
    renderCarousel()
    const track = screen.getByRole('region', { name: 'Featured products' }).querySelector('[tabindex="0"]')

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(track && track.scrollTo).toHaveBeenCalled()
  })

  it('jumps to a slide when a dot is clicked', () => {
    renderCarousel()

    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true')
  })

  it('supports arrow-key navigation on the track', () => {
    renderCarousel()
    const track = screen.getByRole('region', { name: 'Featured products' }).querySelector('[tabindex="0"]')
    expect(track).not.toBeNull()

    fireEvent.keyDown(track as HTMLElement, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true')

    fireEvent.keyDown(track as HTMLElement, { key: 'ArrowLeft' })
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveAttribute('aria-current', 'true')
  })

  it('wraps around at the ends when loop is enabled', () => {
    renderCarousel({ loop: true })

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveAttribute('aria-current', 'true')
  })

  it('exports CarouselSlide for explicit slide composition', () => {
    render(
      <Carousel label="Gallery">
        <CarouselSlide>
          <div>Custom slide</div>
        </CarouselSlide>
      </Carousel>,
    )

    expect(screen.getByText('Custom slide')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '1 of 1' })).toBeInTheDocument()
  })
})
