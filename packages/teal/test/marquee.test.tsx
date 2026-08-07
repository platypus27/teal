import { render, screen } from '@testing-library/react'
import { Marquee } from '../src/Marquee'

describe('Marquee', () => {
  it('duplicates the content for a seamless loop and hides the copy', () => {
    const { container } = render(
      <Marquee>
        <span>Status update</span>
      </Marquee>,
    )

    expect(screen.getAllByText('Status update')).toHaveLength(2)
    const copies = container.querySelectorAll('[aria-hidden="true"]')
    expect(copies).toHaveLength(1)
    expect(copies[0]).toHaveTextContent('Status update')
  })

  it('exposes direction and pause-on-hover as data attributes for the CSS animation', () => {
    const { container } = render(
      <Marquee direction="right" pauseOnHover={false}>
        <span>update</span>
      </Marquee>,
    )

    expect(container.firstElementChild).toHaveAttribute('data-direction', 'right')
    expect(container.firstElementChild).toHaveAttribute('data-pause-on-hover', 'false')
  })

  it('pauses on hover by default', () => {
    const { container } = render(<Marquee>{<span>update</span>}</Marquee>)

    expect(container.firstElementChild).toHaveAttribute('data-pause-on-hover', 'true')
  })

  it('applies the duration as a CSS custom property', () => {
    const { container } = render(
      <Marquee duration={5}>
        <span>update</span>
      </Marquee>,
    )

    expect(container.firstElementChild?.getAttribute('style')).toContain('--teal-marquee-duration: 5s')
  })

  it('ships keyframes that disable the animation under reduced motion', () => {
    const { container } = render(
      <Marquee>
        <span>update</span>
      </Marquee>,
    )

    const styleTag = container.querySelector('style')
    expect(styleTag?.textContent).toContain('@keyframes teal-marquee-scroll')
    expect(styleTag?.textContent).toContain('prefers-reduced-motion: reduce')
    expect(styleTag?.textContent).toContain('animation: none')
  })
})
