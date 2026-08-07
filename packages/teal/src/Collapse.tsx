import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Content shown or hidden by the collapse. */
  children?: ReactNode
  /** Whether the region is expanded. */
  open?: boolean
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  { children, className, open = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'teal-u-grid teal-u-transition-[grid-template-rows] teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none',
        open ? 'teal-u-grid-rows-[1fr]' : 'teal-u-grid-rows-[0fr]',
        className,
      )}
      {...props}
    >
      <div className="teal-u-min-h-0 teal-u-overflow-hidden">{children}</div>
    </div>
  )
})
