import { forwardRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from './cn'

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

export const Separator = forwardRef<React.ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  function Separator({ className, decorative = true, orientation = 'horizontal', ...props }, ref) {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'teal-u-shrink-0 teal-u-bg-outline-variant/30',
          orientation === 'horizontal' ? 'teal-u-h-px teal-u-w-full' : 'teal-u-h-full teal-u-w-px',
          className,
        )}
        {...props}
      />
    )
  },
)
