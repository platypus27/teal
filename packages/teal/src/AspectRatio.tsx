import { forwardRef } from 'react'
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'
import { cn } from './cn'

export type AspectRatioProps = React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>

/** Keeps media or other content at a consistent width-to-height ratio. */
export const AspectRatio = forwardRef<React.ElementRef<typeof AspectRatioPrimitive.Root>, AspectRatioProps>(
  function AspectRatio({ className, ratio = 1, ...props }, ref) {
    return (
      <AspectRatioPrimitive.Root
        ref={ref}
        ratio={ratio}
        className={cn('teal-u-overflow-hidden teal-u-rounded-lg', className)}
        {...props}
      />
    )
  },
)
