import { type ReactElement, type ReactNode } from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cn } from './cn'

export interface HoverCardProps {
  /** Horizontal alignment of the content relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Content rendered inside the hover card surface. */
  children: ReactNode
  className?: string
  /** Delay in milliseconds before the card closes after the pointer leaves. */
  closeDelay?: number
  /** Delay in milliseconds before the card opens on hover. */
  openDelay?: number
  /** Side of the trigger the content opens on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Element that opens the card on hover or focus; receives trigger props automatically. */
  trigger: ReactElement
}

export function HoverCard({
  align = 'center',
  children,
  className,
  closeDelay,
  openDelay,
  side = 'bottom',
  trigger,
}: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root
      {...(openDelay !== undefined ? { openDelay } : {})}
      {...(closeDelay !== undefined ? { closeDelay } : {})}
    >
      <HoverCardPrimitive.Trigger asChild>{trigger}</HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
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
