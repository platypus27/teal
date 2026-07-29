import { Children, forwardRef, isValidElement, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface InputAddonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Which end of the input the addon attaches to. */
  position: 'leading' | 'trailing'
}

export const InputAddon = forwardRef<HTMLSpanElement, InputAddonProps>(function InputAddon(
  { className, position, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-high teal-u-px-3 teal-u-text-sm teal-u-font-medium teal-u-text-on-surface-variant',
        position === 'leading' ? 'teal-u-rounded-l-xl teal-u-border-r-0' : 'teal-u-rounded-r-xl teal-u-border-l-0',
        className,
      )}
      {...props}
    />
  )
})

export type InputGroupProps = HTMLAttributes<HTMLDivElement>

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { children, className, ...props },
  ref,
) {
  let hasLeading = false
  let hasTrailing = false
  Children.forEach(children, (child) => {
    if (isValidElement<InputAddonProps>(child) && child.type === InputAddon) {
      if (child.props.position === 'leading') hasLeading = true
      if (child.props.position === 'trailing') hasTrailing = true
    }
  })

  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-flex teal-u-items-stretch [&_input]:teal-u-min-w-0',
        hasLeading && '[&_input]:teal-u-rounded-l-none',
        hasTrailing && '[&_input]:teal-u-rounded-r-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
