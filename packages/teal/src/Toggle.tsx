import { forwardRef } from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from './cn'

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  /** Control size. */
  size?: 'sm' | 'md'
}

/**
 * A two-state button that toggles a single option on or off, such as a
 * formatting choice. Renders the pressed state as `aria-pressed`.
 */
export const Toggle = forwardRef<React.ComponentRef<typeof TogglePrimitive.Root>, ToggleProps>(function Toggle(
  { className, size = 'md', ...props },
  ref,
) {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-1.5 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-font-semibold teal-u-text-on-surface-variant hover:teal-u-border-[color:var(--teal-border-strong)] hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55 data-[state=on]:teal-u-border-primary/30 data-[state=on]:teal-u-bg-primary/10 data-[state=on]:teal-u-text-primary',
        size === 'sm' ? 'teal-u-h-8 teal-u-px-2.5 teal-u-text-xs' : 'teal-u-h-9 teal-u-px-3 teal-u-text-sm',
        className,
      )}
      {...props}
    />
  )
})
