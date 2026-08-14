import { forwardRef, useEffect, useRef, type HTMLAttributes, type KeyboardEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from './cn'

export interface BlockingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Shows the overlay and blocks interaction with the wrapped content while true. */
  visible?: boolean
  /** Accessible label announced while the overlay is visible; also rendered under the spinner. */
  label?: string
}

export const BlockingOverlay = forwardRef<HTMLDivElement, BlockingOverlayProps>(function BlockingOverlay(
  { children, className, label = 'Loading', visible = false, ...props },
  ref,
) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Move focus into the overlay while it is visible and restore it afterwards.
  useEffect(() => {
    if (!visible) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    overlayRef.current?.focus()
    return () => previous?.focus()
  }, [visible])

  // Keep Tab cycling inside the overlay so the blocked content stays unreachable.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return
    const overlay = overlayRef.current
    if (!overlay) return
    const focusables = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) {
      event.preventDefault()
      overlay.focus()
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === overlay)) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <div ref={ref} aria-busy={visible} className={cn('teal-u-relative', className)} {...props}>
      {children}
      {visible ? (
        <div
          ref={overlayRef}
          role="status"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="teal-u-absolute teal-u-inset-0 teal-u-z-10 teal-u-flex teal-u-flex-col teal-u-items-center teal-u-justify-center teal-u-gap-3 teal-u-bg-surface/80 teal-u-backdrop-blur-sm"
        >
          <LoaderCircle
            aria-hidden="true"
            className="teal-u-size-[var(--teal-icon-xl)] teal-u-animate-spin teal-u-text-primary motion-reduce:teal-u-animate-none"
          />
          <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{label}</span>
        </div>
      ) : null}
    </div>
  )
})
