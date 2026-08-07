import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface StickyHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Distance in pixels from the top of the scrolling container where the header sticks. */
  offset?: number
}

export const StickyHeader = forwardRef<HTMLDivElement, StickyHeaderProps>(function StickyHeader(
  { children, className, offset = 0, style, ...props },
  ref,
) {
  const [stuck, setStuck] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    // No IntersectionObserver (very old browsers, some test environments):
    // the header still sticks, it just never gains the stuck shadow.
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setStuck(!entry.isIntersecting)
      },
      { rootMargin: `-${offset + 1}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [offset])

  // The sentinel and the header are siblings so the header sticks
  // within the consumer's own scrolling container.
  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 0 }} />
      <div
        ref={ref}
        data-stuck={stuck}
        className={cn(
          'teal-u-sticky teal-u-z-30 teal-u-bg-surface teal-u-transition-shadow',
          stuck && 'teal-u-shadow-overlay',
          className,
        )}
        style={{ top: offset, ...style }}
        {...props}
      >
        {children}
      </div>
    </>
  )
})
