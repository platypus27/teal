import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from './cn'
import { VisuallyHidden } from './VisuallyHidden'

export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
  /** Content loaded so far. */
  children?: ReactNode
  /** Message shown once there is nothing left to load. */
  endMessage?: ReactNode
  /** Whether more items can be loaded. */
  hasMore?: boolean
  /** Content shown while the next batch loads. */
  loader?: ReactNode
  /** Whether a batch is currently loading; suppresses further triggers. */
  loading?: boolean
  /** Called when the sentinel enters the viewport and more items can load. */
  onLoadMore?: () => void
  /** Margin around the sentinel at which loading starts, e.g. `'200px'`. */
  rootMargin?: string
  /** Portion of the sentinel that must be visible to trigger loading, from 0 to 1. */
  threshold?: number
}

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(function InfiniteScroll(
  {
    children,
    className,
    endMessage,
    hasMore = true,
    loader,
    loading = false,
    onLoadMore,
    rootMargin = '0px',
    threshold = 0,
    ...props
  },
  ref,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [observerSupported] = useState(() => typeof IntersectionObserver !== 'undefined')

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !observerSupported || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !loading) onLoadMore?.()
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, observerSupported, onLoadMore, rootMargin, threshold])

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
      {hasMore ? (
        <>
          {loading ? (
            (loader ?? (
              <div role="status" className="teal-u-flex teal-u-justify-center teal-u-py-4">
                <LoaderCircle
                  aria-hidden="true"
                  className="teal-u-size-[var(--teal-icon-md)] teal-u-animate-spin teal-u-text-on-surface-variant motion-reduce:teal-u-animate-none"
                />
                <VisuallyHidden>Loading more</VisuallyHidden>
              </div>
            ))
          ) : null}
          {observerSupported ? (
            <div ref={sentinelRef} aria-hidden="true" className="teal-u-h-px" />
          ) : (
            <div className="teal-u-flex teal-u-justify-center teal-u-py-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => onLoadMore?.()}
                className="teal-focus-ring teal-u-rounded-full teal-u-bg-surface-container-high teal-u-px-4 teal-u-py-2 teal-u-text-sm teal-u-font-medium teal-u-text-on-surface hover:teal-u-bg-surface-container-highest disabled:teal-u-opacity-50"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : endMessage !== undefined && endMessage !== null ? (
        <div className="teal-u-py-4 teal-u-text-center teal-u-text-sm teal-u-text-on-surface-variant">{endMessage}</div>
      ) : null}
    </div>
  )
})
