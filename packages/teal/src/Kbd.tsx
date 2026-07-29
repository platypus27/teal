import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export type KbdProps = HTMLAttributes<HTMLElement>

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, ...props }, ref) {
  return (
    <kbd
      ref={ref}
      className={cn(
        'teal-u-inline-flex teal-u-items-center teal-u-rounded teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-1.5 teal-u-py-0.5 teal-u-font-mono teal-u-text-[0.75em] teal-u-font-semibold teal-u-text-on-surface-variant teal-u-shadow-sm',
        className,
      )}
      {...props}
    />
  )
})
