import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

const marqueeStyles = `
@keyframes teal-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.teal-marquee-track {
  animation: teal-marquee-scroll var(--teal-marquee-duration, 20s) linear infinite;
  will-change: transform;
}
.teal-marquee[data-direction="right"] .teal-marquee-track {
  animation-direction: reverse;
}
.teal-marquee[data-pause-on-hover="true"]:hover .teal-marquee-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .teal-marquee-track {
    animation: none;
    will-change: auto;
  }
}
`

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** Content that loops; it is rendered twice for a seamless wrap. */
  children?: ReactNode
  /** Scroll direction. */
  direction?: 'left' | 'right'
  /** Seconds for one full loop; larger values scroll slower. */
  duration?: number
  /** Pauses the animation while the pointer hovers the marquee. */
  pauseOnHover?: boolean
}

export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { children, className, direction = 'left', duration = 20, pauseOnHover = true, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover}
      style={{ '--teal-marquee-duration': `${duration}s`, ...style } as CSSProperties}
      className={cn('teal-marquee teal-u-overflow-hidden', className)}
      {...props}
    >
      <style>{marqueeStyles}</style>
      <div className="teal-marquee-track teal-u-flex teal-u-w-max">
        <div className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-gap-8 teal-u-pr-8">{children}</div>
        <div
          aria-hidden="true"
          className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-gap-8 teal-u-pr-8"
        >
          {children}
        </div>
      </div>
    </div>
  )
})
