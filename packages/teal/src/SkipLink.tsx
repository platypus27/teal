import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { cn } from './cn'

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target of the skip link, usually the main content landmark. */
  href?: string
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { children = 'Skip to content', className, href = '#main', ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        'teal-u-absolute teal-u--top-16 teal-u-left-4 teal-u-z-[var(--teal-z-tooltip)] teal-u-rounded-lg teal-u-bg-primary teal-u-px-4 teal-u-py-2 teal-u-text-sm teal-u-font-semibold teal-u-text-on-primary teal-u-shadow-overlay teal-u-transition-[top] teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none focus:teal-u-top-4',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
})
