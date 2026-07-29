import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack direction of the attached buttons. */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Attaches sibling buttons into a single cluster: inner corners are squared
 * off and adjacent borders collapse into hairline seams.
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
          ? '-teal-u-space-x-px [&>:first-child]:teal-u-rounded-l-full [&>:last-child]:teal-u-rounded-r-full'
          : 'teal-u-flex-col -teal-u-space-y-px [&>:first-child]:teal-u-rounded-t-full [&>:last-child]:teal-u-rounded-b-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
