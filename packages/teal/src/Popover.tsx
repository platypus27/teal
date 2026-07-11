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
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            'z-[var(--teal-z-popover)] w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-outline-variant/40 bg-surface-container p-4 text-on-surface shadow-[var(--teal-shadow-overlay)] outline-none',
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
