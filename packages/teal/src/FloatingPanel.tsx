import { forwardRef, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const anchorClasses = {
  'top-left': 'teal-u-left-4 teal-u-top-4',
  'top-right': 'teal-u-right-4 teal-u-top-4',
  'bottom-left': 'teal-u-bottom-4 teal-u-left-4',
  'bottom-right': 'teal-u-bottom-4 teal-u-right-4',
}

export interface FloatingPanelProps {
  /** Viewport corner the panel is anchored to. */
  anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Body content of the panel. */
  children: ReactNode
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Action area rendered at the bottom of the panel. */
  footer?: ReactNode
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Title rendered in the header; also the accessible name of the panel. */
  title: ReactNode
  /** Width of the panel surface. */
  width?: string
}

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(function FloatingPanel(
  {
    anchor = 'bottom-right',
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    footer,
    onOpenChange,
    open,
    title,
    width = 'min(22rem,calc(100vw - 2rem))',
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isOpen = open !== undefined ? open : internalOpen
  const titleId = useId()

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
    }
  }

  if (!isOpen) return null

  // Non-modal panel: the page stays interactive and focus is not trapped.
  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      data-anchor={anchor}
      onKeyDown={handleKeyDown}
      style={{ width }}
      className={cn(
        'teal-u-fixed teal-u-z-[var(--teal-z-overlay)] teal-u-flex teal-u-max-h-[calc(100dvh-2rem)] teal-u-flex-col teal-u-rounded-2xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-overlay teal-u-text-on-surface',
        anchorClasses[anchor],
        className,
      )}
    >
      <div className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-border-b teal-u-border-[color:var(--teal-border-subtle)] teal-u-py-3 teal-u-pl-4 teal-u-pr-2">
        <h2 id={titleId} className="teal-u-font-headline teal-u-text-sm teal-u-font-bold teal-u-text-on-surface">
          {title}
        </h2>
        <IconButton label={closeLabel} size="sm" onClick={() => setOpen(false)}>
          <X />
        </IconButton>
      </div>
      <div className="teal-u-flex-1 teal-u-overflow-y-auto teal-u-p-4">{children}</div>
      {footer ? (
        <div className="teal-u-flex teal-u-shrink-0 teal-u-flex-col-reverse teal-u-gap-2 teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-4 sm:teal-u-flex-row sm:teal-u-justify-end">
          {footer}
        </div>
      ) : null}
    </div>
  )
})
