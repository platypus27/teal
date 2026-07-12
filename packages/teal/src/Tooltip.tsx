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
  /** Renders a translucent, blurred surface instead of an opaque tooltip. */
  glass?: boolean
  /** Preferred side of the trigger for the tooltip. */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ children, className, content, delayDuration = 300, glass = false, side = 'top' }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-[var(--teal-z-tooltip)] max-w-xs rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-[var(--teal-shadow-overlay)] motion-reduce:transition-none',
              glass
                ? 'border border-outline-variant/20 bg-surface-container/80 backdrop-blur-xl text-on-surface'
                : 'bg-inverse-surface text-inverse-on-surface',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className={glass ? 'fill-surface-container/80' : 'fill-inverse-surface'} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
