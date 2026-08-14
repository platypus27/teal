import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack direction of the attached buttons. */
  orientation?: 'horizontal' | 'vertical'
}

// Selected children (aria-pressed / data-state="on", e.g. a pressed Toggle) reuse
// Toggle's on-state accent and are raised above the collapsed hairline seams.
const selectedClasses =
  '[&_button[aria-pressed=true]]:teal-u-relative [&_button[aria-pressed=true]]:teal-u-z-10 [&_button[aria-pressed=true]]:teal-u-border-primary/30 [&_button[aria-pressed=true]]:teal-u-bg-primary/10 [&_button[aria-pressed=true]]:teal-u-text-primary [&_button[data-state=on]]:teal-u-relative [&_button[data-state=on]]:teal-u-z-10 [&_button[data-state=on]]:teal-u-border-primary/30 [&_button[data-state=on]]:teal-u-bg-primary/10 [&_button[data-state=on]]:teal-u-text-primary'

/**
 * Attaches sibling buttons into a single cluster: inner corners are squared
 * off and adjacent borders collapse into hairline seams. A selected child
 * (aria-pressed or data-state="on") pops with an accent fill.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, className, orientation = 'horizontal', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'teal-u-inline-flex [&_button]:teal-u-rounded-none',
        orientation === 'horizontal'
          ? '-teal-u-space-x-px [&>:first-child]:teal-u-rounded-l-xl [&>:last-child]:teal-u-rounded-r-xl'
          : 'teal-u-flex-col -teal-u-space-y-px [&>:first-child]:teal-u-rounded-t-xl [&>:last-child]:teal-u-rounded-b-xl',
        selectedClasses,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
