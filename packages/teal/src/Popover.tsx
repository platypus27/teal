import { type ReactElement, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from './cn'

export interface PopoverProps {
  /** Horizontal alignment of the content relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Content rendered inside the popover surface. */
  children: ReactNode
  className?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Accessible name for the dialog-like popover surface. */
  label: string
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Side of the trigger the content opens on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Element that toggles the popover; receives trigger props automatically. */
  trigger: ReactElement
}

export function Popover({
  align = 'center',
  children,
  className,
  defaultOpen,
  label,
  onOpenChange,
  open,
  side = 'bottom',
  trigger,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-label={label}
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            'teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-w-[min(24rem,calc(100vw-2rem))] teal-u-border teal-u-p-4 teal-u-text-on-surface teal-u-outline-none',
            'teal-u-bg-surface',
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
