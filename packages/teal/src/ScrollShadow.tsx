import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
  type UIEvent,
} from 'react'
import { cn } from './cn'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export interface ScrollShadowProps extends HTMLAttributes<HTMLDivElement> {
  /** Height of the fade shadows in pixels. */
  shadowSize?: number
}

export const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(function ScrollShadow(
  { children, className, onScroll, shadowSize = 24, ...props },
  ref,
) {
  const [showTop, setShowTop] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const update = useCallback(() => {
    const node = scrollerRef.current
    if (!node) return
    setShowTop(node.scrollTop > 1)
    setShowBottom(node.scrollTop + node.clientHeight < node.scrollHeight - 1)
  }, [])

  useEffect(() => {
    update()
    const node = scrollerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [update])

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    update()
    onScroll?.(event)
  }

  return (
    <div className="teal-u-relative">
      <div
        ref={(node) => {
          scrollerRef.current = node
          assignRef(ref, node)
        }}
        onScroll={handleScroll}
        tabIndex={0}
        className={cn('teal-focus-ring teal-u-overflow-y-auto', className)}
        {...props}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        data-shadow="top"
        data-visible={showTop}
        className={cn(
          'teal-u-pointer-events-none teal-u-absolute teal-u-inset-x-0 teal-u-top-0 teal-u-transition-opacity',
          showTop ? 'teal-u-opacity-100' : 'teal-u-opacity-0',
        )}
        style={{
          height: shadowSize,
          background: 'linear-gradient(to bottom, var(--teal-color-surface), transparent)',
        }}
      />
      <div
        aria-hidden="true"
        data-shadow="bottom"
        data-visible={showBottom}
        className={cn(
          'teal-u-pointer-events-none teal-u-absolute teal-u-inset-x-0 teal-u-bottom-0 teal-u-transition-opacity',
          showBottom ? 'teal-u-opacity-100' : 'teal-u-opacity-0',
        )}
        style={{
          height: shadowSize,
          background: 'linear-gradient(to top, var(--teal-color-surface), transparent)',
        }}
      />
    </div>
  )
})
