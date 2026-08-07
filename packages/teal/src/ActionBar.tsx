import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the action region. */
  label?: string
  /** Edge of the content the bar sits on; flips the hairline border and sticky offset. */
  position?: 'top' | 'bottom'
  /** Keeps the bar visible while the surrounding content scrolls. */
  sticky?: boolean
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  { children, className, label = 'Actions', position = 'bottom', sticky = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className={cn(
        'teal-u-flex teal-u-items-center teal-u-justify-end teal-u-gap-3 teal-u-border-solid teal-u-bg-surface teal-u-px-4 teal-u-py-3',
        position === 'bottom' ? 'teal-u-border-t' : 'teal-u-border-b',
        'teal-u-border-[color:var(--teal-border-subtle)]',
        sticky && (position === 'bottom' ? 'teal-u-sticky teal-u-bottom-0' : 'teal-u-sticky teal-u-top-0'),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
