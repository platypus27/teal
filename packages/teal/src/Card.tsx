import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

export interface CardOwnProps {
  /** Action elements rendered on the trailing side of the header. */
  actions?: ReactNode
  /** Applies disabled styling and blocks interaction on interactive cards. */
  disabled?: boolean
  /** Title rendered in the header; omit to render the card without a header. */
  title?: ReactNode
  /** Heading element used for the title; defaults to 'h2'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Button type used when the card renders an interactive element. */
  type?: 'button' | 'submit' | 'reset'
  /** Surface treatment; 'glass' applies the frosted-glass variant. */
  variant?: 'default' | 'glass'
}

const cardVariantClasses = {
  default: 'teal-focus-ring teal-raised-surface teal-u-border teal-u-bg-surface-container teal-u-p-6',
  glass:
    'teal-u-rounded-2xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface/80 teal-u-p-6 teal-u-backdrop-blur-xl teal-u-shadow-overlay teal-u-text-on-surface',
} as const

export type CardProps<C extends ElementType = 'div'> = PolymorphicProps<C, CardOwnProps>

const CardImpl = forwardRef<HTMLElement, CardProps<ElementType>>(function Card(
  {
    as: Component = 'div',
    actions,
    children,
    className,
    disabled = false,
    onClick,
    onKeyDown,
    tabIndex,
    title,
    titleAs: TitleTag = 'h2',
    type,
    variant = 'default',
    ...props
  },
  ref,
) {
  const isButton = Component === 'button'
  const hasHeader = title !== undefined && title !== null
  const blockDisabledInteraction = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      {...(isButton ? { type: type ?? 'button', disabled } : {})}
      aria-disabled={disabled || undefined}
      onClick={disabled && !isButton ? blockDisabledInteraction : onClick}
      onKeyDown={disabled && !isButton ? blockDisabledInteraction : onKeyDown}
      tabIndex={disabled && !isButton ? -1 : tabIndex}
      className={cn(
        // ElementType makes own props any; variant is 'default' | 'glass' per the public type.
        cardVariantClasses[variant as keyof typeof cardVariantClasses],
        disabled && 'teal-u-pointer-events-none teal-u-opacity-55',
        className,
      )}
      {...props}
    >
      {hasHeader || actions ? (
        <div className="teal-u-mb-3 teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-3">
          {hasHeader ? (
            <TitleTag className="teal-u-font-headline teal-u-text-base teal-u-font-semibold teal-u-text-on-surface">
              {title}
            </TitleTag>
          ) : null}
          {actions ? <div className="teal-u-ms-auto teal-u-flex teal-u-items-center teal-u-gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </Component>
  )
})

export const Card = CardImpl as PolymorphicComponent<'div', CardOwnProps>

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('teal-u-mb-4 teal-u-flex teal-u-items-center teal-u-justify-between', className)} {...props} />
})

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading element used for the title; defaults to 'h2'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, titleAs: TitleTag = 'h2', ...props },
  ref,
) {
  return <TitleTag ref={ref} className={cn('teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface', className)} {...props} />
})

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn('teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant', className)} {...props} />
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
  return <div ref={ref} className={cn('teal-u-mt-4 teal-u-flex teal-u-items-center teal-u-gap-2', className)} {...props} />
})
