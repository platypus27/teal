import { forwardRef, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface BackTopProps {
  /** Scrolled distance in pixels after which the button appears; defaults to 400. */
  threshold?: number
  /** Accessible label for the button; defaults to 'Back to top'. */
  label?: string
  className?: string
}

/** Floating button that appears after scrolling down and smoothly returns to the top of the page. */
export const BackTop = forwardRef<HTMLButtonElement, BackTopProps>(function BackTop(
  { className, label = 'Back to top', threshold = 400 },
  ref,
) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  if (!visible) return null

  return (
    <IconButton
      ref={ref}
      variant="secondary"
      label={label}
      onClick={() => {
        const reduce =
          typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      }}
      className={cn(
        'teal-u-fixed teal-u-bottom-6 teal-u-right-6 teal-u-z-[var(--teal-z-toast)] teal-u-shadow-overlay',
        className,
      )}
    >
      <ArrowUp aria-hidden="true" />
    </IconButton>
  )
})
