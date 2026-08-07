import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders as an inline flex box that shrinks to its content. */
  inline?: boolean
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(function Center(
  { className, inline = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        inline ? 'teal-u-inline-flex' : 'teal-u-flex',
        'teal-u-items-center teal-u-justify-center',
        className,
      )}
      {...props}
    />
  )
})
