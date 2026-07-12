import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from './cn'
import { glassSurface } from './glass'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the card; use an interactive element for clickable cards. */
  as?: ElementType
  /** Renders a translucent, blurred surface instead of an opaque card. */
  glass?: boolean
  /** Applies disabled styling and blocks interaction on interactive cards. */
  disabled?: boolean
  /** Button type used when the card renders an interactive element. */
  type?: 'button' | 'submit' | 'reset'
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Component = 'div', className, glass = false, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'rounded-2xl border border-outline-variant/20 p-6 shadow-[var(--teal-shadow-card)]',
        glass ? glassSurface : 'bg-surface-container',
        className,
      )}
      {...props}
    />
  )
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('mb-4 flex items-center justify-between', className)} {...props} />
})

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h2 ref={ref} className={cn('font-headline text-lg font-bold text-on-surface', className)} {...props} />
})

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn('text-sm leading-relaxed text-on-surface-variant', className)} {...props} />
  },
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={className} {...props} />
})

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('mt-4 flex items-center gap-2', className)} {...props} />
})
