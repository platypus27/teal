import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react'
import { cn } from './cn'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface FloatingToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the toolbar. */
  'aria-label'?: string
  /** Renders nothing when false; pair it with selection or focus state. */
  open?: boolean
}

export const FloatingToolbar = forwardRef<HTMLDivElement, FloatingToolbarProps>(function FloatingToolbar(
  { 'aria-label': ariaLabel = 'Contextual actions', className, onFocusCapture, onKeyDown, open = true, ...props },
  ref,
) {
  const internalRef = useRef<HTMLDivElement | null>(null)

  function controls(): HTMLElement[] {
    return Array.from(internalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
  }

  // Roving tabindex: exactly one control stays in the tab order.
  function makeTabbable(target: HTMLElement) {
    for (const control of controls()) control.tabIndex = control === target ? 0 : -1
  }

  function handleFocusCapture(event: React.FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    if (target !== internalRef.current && controls().includes(target)) makeTabbable(target)
    onFocusCapture?.(event)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const all = controls()
    const index = all.indexOf(event.target as HTMLElement)
    if (index !== -1) {
      let next: number | null = null
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % all.length
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + all.length) % all.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = all.length - 1
      if (next !== null) {
        event.preventDefault()
        all[next]?.focus()
      }
    }
    onKeyDown?.(event)
  }

  if (!open) return null

  return (
    <div
      ref={(node) => {
        internalRef.current = node
        assignRef(ref, node)
        // Initialize the roving tabindex each time the toolbar opens.
        if (node) {
          const all = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))
          all.forEach((control, index) => {
            control.tabIndex = index === 0 ? 0 : -1
          })
        }
      }}
      role="toolbar"
      aria-label={ariaLabel}
      onFocusCapture={handleFocusCapture}
      onKeyDown={handleKeyDown}
      className={cn(
        'teal-u-absolute teal-u-z-[var(--teal-z-tooltip)] teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest teal-u-p-1 teal-u-shadow-overlay',
        className,
      )}
      {...props}
    />
  )
})
