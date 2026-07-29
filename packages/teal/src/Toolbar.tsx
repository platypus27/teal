import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

/**
 * A horizontal container for related actions, such as editor controls.
 * Compose with `ToolbarGroup` and `ToolbarSeparator`.
 */
export const Toolbar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Toolbar(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="toolbar"
      className={cn(
        'teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest teal-u-p-1',
        className,
      )}
      {...props}
    />
  )
})

/** Groups related controls inside a Toolbar. */
export const ToolbarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarGroup(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="group" className={cn('teal-u-flex teal-u-items-center teal-u-gap-1', className)} {...props} />
})

/** Vertical hairline that visually separates toolbar groups. */
export const ToolbarSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarSeparator(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('teal-u-mx-1 teal-u-h-5 teal-u-w-px teal-u-bg-outline-variant/60', className)}
      {...props}
    />
  )
})
