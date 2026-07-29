import {
  Children,
  forwardRef,
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefAttributes,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  /** Slide content. */
  children: ReactNode
}

interface InternalSlideProps extends CarouselSlideProps {
  _index?: number
  _total?: number
}

const CarouselSlideImpl = forwardRef<HTMLDivElement, InternalSlideProps>(function CarouselSlide(
  { _index, _total, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={_index !== undefined && _total !== undefined ? `${_index + 1} of ${_total}` : undefined}
      className={cn('teal-u-w-full teal-u-shrink-0 teal-u-snap-start', className)}
      {...props}
    />
  )
})

/** A single slide inside a Carousel; Carousel wraps plain children in one automatically. */
export const CarouselSlide = CarouselSlideImpl as React.ForwardRefExoticComponent<
  CarouselSlideProps & RefAttributes<HTMLDivElement>
>

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible label describing the carousel region. */
  label: string
  /** Wraps from the last slide back to the first (and vice versa) when true; otherwise prev/next disable at the ends. */
  loop?: boolean
  /** Slides; plain children are wrapped in a CarouselSlide automatically. */
  children: ReactNode
}

/** A scroll-snap carousel with previous/next buttons, dot indicators and arrow-key support. */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { children, className, label, loop = false, ...props },
  ref,
) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const slides = Children.toArray(children)
  const count = slides.length
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    const slide = track?.children[index] as HTMLElement | undefined
    if (!track || !slide) return
    track.scrollTo({ left: slide.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      const clamped = clamp(index, 0, count - 1)
      scrollToIndex(clamped)
      setActive(clamped)
    },
    [count, scrollToIndex],
  )

  const goPrev = useCallback(() => {
    if (active > 0) goTo(active - 1)
    else if (loop && count > 0) goTo(count - 1)
  }, [active, count, goTo, loop])

  const goNext = useCallback(() => {
    if (active < count - 1) goTo(active + 1)
    else if (loop && count > 0) goTo(0)
  }, [active, count, goTo, loop])

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    let best = 0
    let bestDistance = Infinity
    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    setActive(best)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('teal-u-relative', className)}
      {...props}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="teal-focus-ring teal-u-flex teal-u-overflow-x-auto teal-u-snap-x teal-u-snap-mandatory teal-u-rounded-lg"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((slide, index) => (
          <CarouselSlideImpl key={index} _index={index} _total={count}>
            {slide}
          </CarouselSlideImpl>
        ))}
      </div>
      <IconButton
        variant="secondary"
        size="sm"
        label="Previous slide"
        disabled={!loop && active === 0}
        onClick={goPrev}
        className="teal-u-absolute teal-u-left-2 teal-u-top-1/2 -teal-u-translate-y-1/2"
      >
        <ChevronLeft aria-hidden="true" />
      </IconButton>
      <IconButton
        variant="secondary"
        size="sm"
        label="Next slide"
        disabled={!loop && active >= count - 1}
        onClick={goNext}
        className="teal-u-absolute teal-u-right-2 teal-u-top-1/2 -teal-u-translate-y-1/2"
      >
        <ChevronRight aria-hidden="true" />
      </IconButton>
      {count > 1 ? (
        <div className="teal-u-mt-3 teal-u-flex teal-u-justify-center teal-u-gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active ? true : undefined}
              onClick={() => goTo(index)}
              className={cn(
                'teal-focus-ring teal-u-size-2 teal-u-rounded-full teal-u-transition-colors teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
                index === active ? 'teal-u-bg-primary' : 'teal-u-bg-outline-variant hover:teal-u-bg-outline',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
})
