import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

export interface CardOwnProps {
  /** Applies disabled styling and blocks interaction on interactive cards. */
  disabled?: boolean
  /** Button type used when the card renders an interactive element. */
  type?: 'button' | 'submit' | 'reset'
}

export type CardProps<C extends ElementType = 'div'> = PolymorphicProps<C, CardOwnProps>

const CardImpl = forwardRef<HTMLElement, CardProps<ElementType>>(function Card(
  { as: Component = 'div', className, disabled = false, type, ...props },
  ref,
) {
  const isButton = Component === 'button'
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      {...(isButton ? { type: type ?? 'button', disabled } : {})}
      aria-disabled={disabled || undefined}
      className={cn(
        'rounded-2xl border border-outline-variant/20 bg-surface-container p-6 shadow-[var(--teal-shadow-card)]',
        disabled && 'pointer-events-none opacity-55',
        className,
      )}
      {...props}
    />
  )
})

export const Card = CardImpl as PolymorphicComponent<'div', CardOwnProps>

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
