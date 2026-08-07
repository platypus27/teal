import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

/** Props for the frosted-glass surface; all standard div attributes are supported. */
export type GlassPanelProps = HTMLAttributes<HTMLDivElement>

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-rounded-2xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface/70 teal-u-p-6 teal-u-backdrop-blur-xl teal-u-shadow-overlay',
        className,
      )}
      {...props}
    />
  )
})
