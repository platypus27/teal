import { ImageViewer } from '@kryv/teal'

function diagram() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='540'><rect width='960' height='540' fill='#134e4a'/><g fill='none' stroke='#5eead4' stroke-width='2'><circle cx='480' cy='270' r='180'/><circle cx='480' cy='270' r='120'/><circle cx='480' cy='270' r='60'/><path d='M0 270h960M480 0v540'/></g><text x='480' y='520' font-family='sans-serif' font-size='24' fill='#99f6e4' text-anchor='middle'>Coverage map</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function ImageViewerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xl">
        <ImageViewer
          src={diagram()}
          alt="Coverage map diagram"
          label="Coverage map viewer"
          defaultZoom={1.5}
          maxZoom={3}
          zoomStep={0.25}
          className="h-80"
        />
        <p className="mt-2 text-sm text-teal-on-surface-variant">Starts zoomed in with finer zoom steps and a lower cap.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl">
      <ImageViewer src={diagram()} alt="Coverage map diagram" label="Coverage map viewer" className="h-80" />
      <p className="mt-2 text-sm text-teal-on-surface-variant">Use + and − to zoom, 0 to reset, and drag to pan while zoomed.</p>
    </div>
  )
}
