import { createContext, useContext, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from './cn'

// Marks that a Teal TooltipProvider is an ancestor; Radix requires a provider
// above every Tooltip.Root and does not expose its own context for detection.
const TooltipProviderContext = createContext(false)

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>

/** Rendered once near the app root so tooltips share open-delay grouping. */
export function TooltipProvider({ children, delayDuration = 300, ...props }: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider delayDuration={delayDuration} {...props}>
        {children}
      </TooltipPrimitive.Provider>
    </TooltipProviderContext.Provider>
  )
}

export interface TooltipProps {
  /** Element the tooltip describes; receives trigger props automatically. */
  children: ReactElement
  className?: string
  /** Text rendered inside the tooltip. */
  content: ReactNode
  /** Per-instance open delay in milliseconds; overrides the nearest TooltipProvider. */
  delayDuration?: number
  /** Preferred side of the trigger for the tooltip. */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ children, className, content, delayDuration, side = 'top' }: TooltipProps) {
  const hasProvider = useContext(TooltipProviderContext)
  const root = (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            'box-border z-[var(--teal-z-tooltip)] max-w-xs rounded-lg border border-solid border-inverse-on-surface/15 px-2.5 py-1.5 text-xs font-medium shadow-overlay motion-reduce:transition-none',
            'bg-inverse-surface text-inverse-on-surface',
            className,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-inverse-surface" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
  if (hasProvider && delayDuration === undefined) return root
  return <TooltipPrimitive.Provider delayDuration={delayDuration ?? 300}>{root}</TooltipPrimitive.Provider>
}
