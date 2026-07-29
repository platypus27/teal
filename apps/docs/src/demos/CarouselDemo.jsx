import { Carousel } from '@kryv/teal'

const slides = [
  { title: 'Q1 security', detail: '14 checks, no critical findings' },
  { title: 'Q2 reliability', detail: '99.98% uptime across services' },
  { title: 'Q3 usage', detail: 'Sign-ups up 12% quarter over quarter' },
]

export function CarouselDemo({ exampleIndex = 0 }) {
  const loop = exampleIndex === 1

  return (
    <div className="w-full max-w-md">
      <Carousel label={loop ? 'Quarterly reports, looping' : 'Quarterly reports'} loop={loop}>
        {slides.map((slide) => (
          <div
            key={slide.title}
            className="flex h-40 flex-col items-center justify-center gap-1 rounded-lg border border-teal-outline-variant/50 bg-teal-surface-container-low"
          >
            <strong className="text-sm">{slide.title}</strong>
            <span className="text-sm text-teal-on-surface-variant">{slide.detail}</span>
          </div>
        ))}
      </Carousel>
      {loop ? (
        <p className="mt-2 text-sm text-teal-on-surface-variant">loop keeps prev and next enabled by wrapping around.</p>
      ) : null}
    </div>
  )
}
