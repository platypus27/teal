import { forwardRef } from 'react'
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden'

export type VisuallyHiddenProps = React.ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>

/** Hides content visually while keeping it available to assistive technology. */
export const VisuallyHidden = forwardRef<
  React.ElementRef<typeof VisuallyHiddenPrimitive.Root>,
  VisuallyHiddenProps
>(function VisuallyHidden(props, ref) {
  return <VisuallyHiddenPrimitive.Root ref={ref} {...props} />
})
