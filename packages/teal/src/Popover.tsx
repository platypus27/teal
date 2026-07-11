import { type ReactElement, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from './cn'

export interface PopoverProps {
  align?: 'start' | 'center' | 'end'
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
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
