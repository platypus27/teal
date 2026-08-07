import { useState } from 'react'
import { Button, Lightbox } from '@kryv/teal'

function artwork(label, from, to) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='960' height='600' fill='url(#g)'/><text x='480' y='310' font-family='sans-serif' font-size='44' fill='rgba(255,255,255,0.9)' text-anchor='middle'>${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const images = [
  { src: artwork('Aurora study', '#0f766e', '#22d3ee'), alt: 'Aurora study artwork', caption: 'Aurora study — gradient draft' },
  { src: artwork('Canyon dusk', '#9a3412', '#f59e0b'), alt: 'Canyon dusk artwork' },
  { src: artwork('Tide pools', '#1d4ed8', '#67e8f9'), alt: 'Tide pools artwork', caption: 'Tide pools, exported at 960×600' },
]

export function LightboxDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {images.map((image, i) => (
          <button
            key={image.alt}
            type="button"
            aria-label={`Open ${image.alt}`}
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
            className="overflow-hidden rounded-lg border border-teal-outline-variant/50"
          >
            <img src={image.src} alt="" className="h-16 w-24 object-cover" />
          </button>
        ))}
        <Lightbox open={open} onOpenChange={setOpen} images={images} index={index} onIndexChange={setIndex} label="Artwork gallery" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => setOpen(true)}>View gallery</Button>
      <span className="text-sm text-teal-on-surface-variant">Arrow keys move between images, Escape closes.</span>
      <Lightbox open={open} onOpenChange={setOpen} images={images} label="Artwork gallery" />
    </div>
  )
}
