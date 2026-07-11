import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Component = 'div', className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'rounded-2xl border border-outline-variant/20 bg-surface-container p-6 shadow-[var(--teal-shadow-card)]',
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
