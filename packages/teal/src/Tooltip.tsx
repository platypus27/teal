import { type ReactElement, type ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from './cn'

export interface TooltipProps {
  /** Element the tooltip describes; receives trigger props automatically. */
  children: ReactElement
  className?: string
  /** Text rendered inside the tooltip. */
  content: ReactNode
  /** Delay in milliseconds before the tooltip opens. */
  delayDuration?: number
  /** Preferred side of the trigger for the tooltip. */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ children, className, content, delayDuration = 300, side = 'top' }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-[var(--teal-z-tooltip)] max-w-xs rounded-lg bg-inverse-surface px-2.5 py-1.5 text-xs font-medium text-inverse-on-surface shadow-[var(--teal-shadow-overlay)] motion-reduce:transition-none',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-inverse-surface" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
