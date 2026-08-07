import { forwardRef } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from './cn'

/**
 * Radix types the root as a single|multiple union, so this stays a type
 * alias rather than an interface.
 */
export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>

/**
 * A cluster of toggles with shared focus management. Use `type="single"` for
 * mutually exclusive choices and `type="multiple"` for independent ones.
 */
export const ToggleGroup = forwardRef<React.ComponentRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  function ToggleGroup({ className, ...props }, ref) {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn('teal-u-inline-flex teal-u-flex-wrap teal-u-gap-1.5', className)}
        {...props}
      />
    )
  },
)

export interface ToggleGroupItemProps extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  /** Control size. */
  size?: 'sm' | 'md'
}

/** A single option inside a ToggleGroup, styled to match Toggle. */
export const ToggleGroupItem = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, size = 'md', ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-1.5 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-font-semibold teal-u-text-on-surface-variant hover:teal-u-border-[color:var(--teal-border-strong)] hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55 data-[state=on]:teal-u-border-primary/30 data-[state=on]:teal-u-bg-primary/10 data-[state=on]:teal-u-text-primary',
        size === 'sm' ? 'teal-u-h-8 teal-u-px-2.5 teal-u-text-xs' : 'teal-u-h-9 teal-u-px-3 teal-u-text-sm',
        className,
      )}
      {...props}
    />
  )
})
