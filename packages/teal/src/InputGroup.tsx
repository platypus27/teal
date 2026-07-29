import { forwardRef, type HTMLAttributes } from 'react'
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
        'teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-high teal-u-px-3 teal-u-text-sm teal-u-font-medium teal-u-text-on-surface-variant',
        position === 'leading' ? 'teal-u-border-r' : 'teal-u-border-l',
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
  return (
    <div
      ref={ref}
      className={cn(
        'teal-input-group teal-u-flex teal-u-w-full teal-u-items-stretch teal-u-overflow-hidden teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-transition-[border-color,box-shadow] teal-u-duration-[var(--teal-motion-fast)] teal-u-ease-out hover:teal-u-border-outline focus-within:teal-u-border-primary [&:has(input[aria-invalid=true])]:teal-u-border-error [&:has(input[aria-invalid=true])]:teal-u-shadow-[0_0_0_3px_color-mix(in_srgb,var(--teal-color-error)_20%,transparent)] motion-reduce:teal-u-transition-none',
        '[&_input]:teal-u-min-w-0 [&_input]:teal-u-border-0 [&_input]:teal-u-bg-transparent [&_input]:teal-u-shadow-none [&_input]:focus-visible:teal-u-shadow-none [&_input]:aria-[invalid=true]:teal-u-shadow-none [&_input]:disabled:teal-u-bg-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
