import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from './cn'

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export interface FocusTrapProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the trap currently holds focus. */
  active?: boolean
  /** Content whose focusable descendants are trapped while `active`. */
  children?: ReactNode
  /** Return focus to the previously focused element when the trap deactivates or unmounts. */
  restoreFocus?: boolean
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(function FocusTrap(
  { active = true, children, className, onKeyDown, restoreFocus = true, ...props },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active) return
    const node = containerRef.current
    const previous = document.activeElement

    // Move focus inside when the trap activates around an outside focus.
    if (node && (!previous || !node.contains(previous))) {
      getFocusable(node)[0]?.focus()
    }

    return () => {
      if (restoreFocus && previous instanceof HTMLElement && previous.isConnected) {
        previous.focus()
      }
    }
  }, [active, restoreFocus])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || !active || event.key !== 'Tab') return
    const node = containerRef.current
    if (!node) return

    const focusable = getFocusable(node)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) {
      // Nothing to focus: keep Tab from escaping the trap.
      event.preventDefault()
      return
    }

    const current = document.activeElement
    const focusOutside = !current || !node.contains(current)
    if (event.shiftKey) {
      if (focusOutside || current === first) {
        event.preventDefault()
        last.focus()
      }
    } else if (focusOutside || current === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={(node) => {
        containerRef.current = node
        assignRef(ref, node)
      }}
      onKeyDown={handleKeyDown}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
})
