import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from './cn'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export interface LazyImageProps extends HTMLAttributes<HTMLDivElement> {
  /** Text alternative for the image. */
  alt: string
  /** Height of the image in pixels. */
  height?: number | string
  /** Content shown until the image finishes loading. */
  placeholder?: ReactNode
  /** Margin around the viewport at which loading starts, e.g. `'200px'`. */
  rootMargin?: string
  /** Image URL, requested only once the image nears the viewport. */
  src: string
  /** Portion of the wrapper that must be visible before loading starts, from 0 to 1. */
  threshold?: number
  /** Width of the image in pixels. */
  width?: number | string
}

export const LazyImage = forwardRef<HTMLDivElement, LazyImageProps>(function LazyImage(
  { alt, className, height, placeholder, rootMargin = '200px', src, style, threshold = 0, width, ...props },
  ref,
) {
  const [load, setLoad] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    // No IntersectionObserver (very old browsers, some test environments):
    // load the image rather than never show it.
    if (typeof IntersectionObserver === 'undefined') {
      setLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoad(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  const state = loaded ? 'loaded' : load ? 'loading' : 'idle'

  return (
    <div
      ref={(node) => {
        nodeRef.current = node
        assignRef(ref, node)
      }}
      data-state={state}
      style={{ height, width, ...style } as CSSProperties}
      className={cn('teal-u-relative teal-u-inline-block teal-u-overflow-hidden', className)}
      {...props}
    >
      {!loaded
        ? (placeholder ?? (
            <span
              aria-hidden="true"
              className="teal-u-absolute teal-u-inset-0 teal-u-animate-pulse teal-u-bg-surface-container-high motion-reduce:teal-u-animate-none"
            />
          ))
        : null}
      {load ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={cn(
            'teal-u-block teal-u-h-full teal-u-w-full teal-u-object-cover teal-u-transition-opacity teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
            loaded ? 'teal-u-opacity-100' : 'teal-u-opacity-0',
          )}
        />
      ) : null}
    </div>
  )
})
