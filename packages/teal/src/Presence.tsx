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

export interface PresenceProps extends HTMLAttributes<HTMLDivElement> {
  /** Called after the exit transition finishes and the children unmount. */
  onExitComplete?: () => void
  /** Whether the children should be shown. */
  present?: boolean
  /** Content kept mounted through its exit transition. */
  children?: ReactNode
}

export const Presence = forwardRef<HTMLDivElement, PresenceProps>(function Presence(
  { children, className, onExitComplete, present = false, ...props },
  ref,
) {
  const [mounted, setMounted] = useState(present)
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const onExitCompleteRef = useRef(onExitComplete)
  onExitCompleteRef.current = onExitComplete

  useEffect(() => {
    if (present) {
      setMounted(true)
      return
    }

    const node = nodeRef.current
    if (!node) {
      setMounted(false)
      return
    }

    // No (or zero-length) transition — jsdom and reduced-motion users land
    // here, so unmount immediately instead of waiting for transitionend.
    const duration = parseFloat(getComputedStyle(node).transitionDuration) || 0
    if (duration <= 0) {
      setMounted(false)
      onExitCompleteRef.current?.()
      return
    }

    function handleTransitionEnd(event: TransitionEvent) {
      if (event.target !== node) return
      setMounted(false)
      onExitCompleteRef.current?.()
    }

    const fallback = window.setTimeout(() => {
      setMounted(false)
      onExitCompleteRef.current?.()
    }, duration * 1000 + 50)

    node.addEventListener('transitionend', handleTransitionEnd)
    return () => {
      window.clearTimeout(fallback)
      node.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [present])

  if (!mounted) return null

  return (
    <div
      ref={(node) => {
        nodeRef.current = node
        assignRef(ref, node)
      }}
      data-state={present ? 'open' : 'closed'}
      className={cn(
        'teal-u-transition-opacity teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none',
        present ? 'teal-u-opacity-100' : 'teal-u-opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
