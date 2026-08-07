import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface ImageViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Alternative text announced for the image. */
  alt: string
  /** Initial zoom factor when uncontrolled. */
  defaultZoom?: number
  /** Accessible name of the viewer region. */
  label?: string
  /** Maximum zoom factor. */
  maxZoom?: number
  /** Minimum zoom factor; at this level panning is disabled. */
  minZoom?: number
  /** Called when the zoom factor changes. */
  onZoomChange?: (zoom: number) => void
  /** Image URL. */
  src: string
  /** Controlled zoom factor where 1 fits the image to the viewport. */
  zoom?: number
  /** Amount added or subtracted per zoom step. */
  zoomStep?: number
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}

/**
 * Inline single-image viewer. Zoom via the toolbar buttons or the `+`/`-`
 * keys; while zoomed in, drag the image to pan. `0` resets the view.
 */
export const ImageViewer = forwardRef<HTMLDivElement, ImageViewerProps>(function ImageViewer(
  {
    alt,
    className,
    defaultZoom = 1,
    label = 'Image viewer',
    maxZoom = 4,
    minZoom = 1,
    onZoomChange,
    src,
    zoom,
    zoomStep = 0.5,
    ...props
  },
  ref,
) {
  const [internalZoom, setInternalZoom] = useState(defaultZoom)
  const currentZoom = Math.min(maxZoom, Math.max(minZoom, zoom !== undefined ? zoom : internalZoom))
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<DragState | null>(null)
  const [dragging, setDragging] = useState(false)

  const pannable = currentZoom > minZoom

  function commit(next: number) {
    const clamped = Math.min(maxZoom, Math.max(minZoom, next))
    if (zoom === undefined) setInternalZoom(clamped)
    onZoomChange?.(clamped)
    if (clamped <= minZoom) setOffset({ x: 0, y: 0 })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      commit(currentZoom + zoomStep)
    } else if (event.key === '-' || event.key === '_') {
      event.preventDefault()
      commit(currentZoom - zoomStep)
    } else if (event.key === '0') {
      event.preventDefault()
      commit(minZoom)
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!pannable || event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragging(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setOffset({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    })
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(
        'teal-u-relative teal-u-flex teal-u-flex-col teal-u-overflow-hidden teal-u-rounded-xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-low',
        className,
      )}
      {...props}
    >
      <div
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={cn(
          'teal-focus-ring teal-u-flex teal-u-min-h-64 teal-u-flex-1 teal-u-items-center teal-u-justify-center teal-u-overflow-hidden teal-u-outline-none',
          pannable && (dragging ? 'teal-u-cursor-grabbing' : 'teal-u-cursor-grab'),
        )}
        style={{ touchAction: pannable ? 'none' : 'auto' }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="teal-u-max-h-full teal-u-max-w-full teal-u-select-none teal-u-object-contain"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${currentZoom})` }}
        />
      </div>
      <div className="teal-u-flex teal-u-items-center teal-u-justify-center teal-u-gap-1 teal-u-border-0 teal-u-border-t teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-p-1.5">
        <IconButton
          label="Zoom out"
          size="sm"
          disabled={currentZoom <= minZoom}
          onClick={() => commit(currentZoom - zoomStep)}
        >
          <ZoomOut />
        </IconButton>
        <span aria-live="polite" className="teal-u-min-w-12 teal-u-text-center teal-u-text-xs teal-u-font-medium teal-u-text-on-surface-variant">
          {Math.round(currentZoom * 100)}%
        </span>
        <IconButton
          label="Zoom in"
          size="sm"
          disabled={currentZoom >= maxZoom}
          onClick={() => commit(currentZoom + zoomStep)}
        >
          <ZoomIn />
        </IconButton>
        <IconButton label="Reset zoom" size="sm" disabled={currentZoom <= minZoom} onClick={() => commit(minZoom)}>
          <RotateCcw />
        </IconButton>
      </div>
    </div>
  )
})
