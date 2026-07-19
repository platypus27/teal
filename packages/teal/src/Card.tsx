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
        'teal-raised-surface border bg-surface-container p-6',
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

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading element used for the title; defaults to 'h2'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, titleAs: TitleTag = 'h2', ...props },
  ref,
) {
  return <TitleTag ref={ref} className={cn('font-headline text-lg font-bold text-on-surface', className)} {...props} />
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
