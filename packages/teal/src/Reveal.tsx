import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from './cn'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Content revealed when it scrolls into view. */
  children?: ReactNode
  /** Reveal only the first time the element enters the viewport. */
  once?: boolean
  /** Portion of the element that must be visible before it reveals, from 0 to 1. */
  threshold?: number
}

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  { children, className, once = true, threshold = 0.25, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    // No IntersectionObserver (very old browsers, some test environments):
    // show the content rather than hide it forever.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once, threshold])

  return (
    <div
      ref={(node) => {
        nodeRef.current = node
        assignRef(ref, node)
      }}
      data-state={visible ? 'visible' : 'hidden'}
      className={cn(
        'teal-u-transition-all teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none motion-reduce:teal-u-transform-none',
        visible ? 'teal-u-translate-y-0 teal-u-opacity-100' : 'teal-u-translate-y-4 teal-u-opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
