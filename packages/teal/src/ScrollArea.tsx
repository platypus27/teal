import { forwardRef, type ReactNode } from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from './cn'

export interface ScrollAreaProps {
  /** Content rendered inside the scrollable viewport. */
  children: ReactNode
  className?: string
  /** Caps the viewport height; content beyond it scrolls. */
  maxHeight?: string | number
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { children, className, maxHeight },
  ref,
) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('teal-u-overflow-hidden', className)}
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      <ScrollAreaPrimitive.Viewport className="teal-u-size-full teal-u-rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="teal-u-flex teal-u-w-2.5 teal-u-p-0.5">
        <ScrollAreaPrimitive.Thumb className="teal-u-flex-1 teal-u-rounded-full teal-u-bg-outline-variant/70 hover:teal-u-bg-outline" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
