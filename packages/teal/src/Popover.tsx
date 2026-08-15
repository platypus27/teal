import { type ReactElement, type ReactNode } from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from './cn'

export interface PopoverProps {
  /** Horizontal alignment of the content relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Content rendered inside the popover surface. */
  children: ReactNode
  className?: string
  /** Delay in milliseconds before the surface closes after the pointer leaves (hover mode only). */
  closeDelay?: number
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Accessible name for the dialog-like popover surface. */
  label: string
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Delay in milliseconds before the surface opens on hover (hover mode only). */
  openDelay?: number
  /** How the popover opens: on trigger click, or on hover and keyboard focus. */
  openOn?: 'click' | 'hover'
  /** Side of the trigger the content opens on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Element that toggles the popover; receives trigger props automatically. */
  trigger: ReactElement
}

export function Popover({
  align = 'center',
  children,
  className,
  closeDelay,
  defaultOpen,
  label,
  onOpenChange,
  open,
  openDelay,
  openOn = 'click',
  side = 'bottom',
  trigger,
}: PopoverProps) {
  if (openOn === 'hover') {
    return (
      <HoverCardPrimitive.Root
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange ? { onOpenChange } : {})}
        {...(openDelay !== undefined ? { openDelay } : {})}
        {...(closeDelay !== undefined ? { closeDelay } : {})}
      >
        <HoverCardPrimitive.Trigger asChild>{trigger}</HoverCardPrimitive.Trigger>
        <HoverCardPrimitive.Portal>
          <HoverCardPrimitive.Content
            aria-label={label}
            align={align}
            side={side}
            sideOffset={6}
            className={cn(
              'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-max-w-xs teal-u-border teal-u-bg-surface teal-u-p-4 teal-u-text-on-surface teal-u-outline-none',
              className,
            )}
          >
            {children}
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    )
  }

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
            'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-w-[min(24rem,calc(100vw-2rem))] teal-u-border teal-u-p-4 teal-u-text-on-surface teal-u-outline-none',
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
