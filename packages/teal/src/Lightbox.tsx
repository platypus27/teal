import { forwardRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface LightboxImage {
  /** Image URL. */
  src: string
  /** Alternative text announced for the image. */
  alt: string
  /** Optional caption rendered under the image. */
  caption?: ReactNode
}

export interface LightboxProps {
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial image index when uncontrolled. */
  defaultIndex?: number
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Images shown in gallery order. */
  images: LightboxImage[]
  /** Controlled index of the visible image. */
  index?: number
  /** Accessible name of the gallery dialog. */
  label?: string
  /** Called when the visible image changes. */
  onIndexChange?: (index: number) => void
  /** Called when the lightbox opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
}

/**
 * Full-screen gallery overlay. Arrow keys and the on-screen controls move
 * between images (wrapping at the ends); Escape and backdrop clicks close.
 */
export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(function Lightbox(
  {
    className,
    closeLabel = 'Close',
    defaultIndex = 0,
    defaultOpen,
    images,
    index,
    label = 'Image gallery',
    onIndexChange,
    onOpenChange,
    open,
  },
  ref,
) {
  return (
    <DialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/80 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-items-center teal-u-justify-center teal-u-outline-none',
            className,
          )}
        >
          {/* Radix unmounts closed dialog content, so the uncontrolled index
              resets to `defaultIndex` on every open. */}
          <LightboxPanel
            closeLabel={closeLabel}
            defaultIndex={defaultIndex}
            images={images}
            index={index}
            label={label}
            onIndexChange={onIndexChange}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})

interface LightboxPanelProps {
  closeLabel: string
  defaultIndex: number
  images: LightboxImage[]
  index?: number | undefined
  label: string
  onIndexChange?: ((index: number) => void) | undefined
}

function LightboxPanel({ closeLabel, defaultIndex, images, index, label, onIndexChange }: LightboxPanelProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex)
  const count = images.length
  const current = count === 0 ? 0 : Math.min(count - 1, Math.max(0, index !== undefined ? index : internalIndex))
  const image = images[current]

  function commit(next: number) {
    if (count === 0) return
    const wrapped = (next + count) % count
    if (index === undefined) setInternalIndex(wrapped)
    onIndexChange?.(wrapped)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      commit(current + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      commit(current - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      commit(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      commit(count - 1)
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="teal-u-flex teal-u-h-full teal-u-w-full teal-u-items-center teal-u-justify-center">
      <DialogPrimitive.Title className="teal-u-sr-only">{label}</DialogPrimitive.Title>
      {image ? (
        <figure className="teal-u-m-0 teal-u-flex teal-u-max-h-full teal-u-max-w-[min(64rem,calc(100vw-2rem))] teal-u-flex-col teal-u-items-center teal-u-gap-3 teal-u-px-4">
          <img
            src={image.src}
            alt={image.alt}
            className="teal-u-max-h-[80vh] teal-u-max-w-full teal-u-rounded-xl teal-u-object-contain teal-u-shadow-overlay"
          />
          {image.caption ? (
            <figcaption className="teal-u-text-center teal-u-text-sm teal-u-text-white/80">{image.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
      {count > 1 ? (
        <>
          <IconButton
            label="Previous image"
            variant="secondary"
            onClick={() => commit(current - 1)}
            className="teal-u-absolute teal-u-left-4 teal-u-top-1/2 -teal-u-translate-y-1/2"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            label="Next image"
            variant="secondary"
            onClick={() => commit(current + 1)}
            className="teal-u-absolute teal-u-right-4 teal-u-top-1/2 -teal-u-translate-y-1/2"
          >
            <ChevronRight />
          </IconButton>
          <div
            aria-live="polite"
            className="teal-u-absolute teal-u-bottom-4 teal-u-left-1/2 -teal-u-translate-x-1/2 teal-u-rounded-full teal-u-bg-black/60 teal-u-px-3 teal-u-py-1 teal-u-text-sm teal-u-text-white"
          >
            {current + 1} of {count}
          </div>
        </>
      ) : null}
      <DialogPrimitive.Close asChild>
        <IconButton label={closeLabel} variant="secondary" className="teal-u-absolute teal-u-right-4 teal-u-top-4">
          <X />
        </IconButton>
      </DialogPrimitive.Close>
    </div>
  )
}
