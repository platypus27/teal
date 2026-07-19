import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const topBarVariants = cva('flex h-16 items-center gap-3 bg-surface px-4 sm:px-8 lg:px-12', {
  variants: {
    sticky: {
      true: 'sticky top-0 z-30 border-b border-[color:var(--teal-border-subtle)] shadow-sm',
      false: '',
    },
  },
  defaultVariants: {
    sticky: true,
  },
})

export interface TopBarOwnProps {
  /** Keeps the bar at the top of its scrolling container. */
  sticky?: VariantProps<typeof topBarVariants>['sticky']
}

export type TopBarProps<C extends ElementType = 'header'> = PolymorphicProps<C, TopBarOwnProps>

const TopBarImpl = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { as: Component = 'header', className, sticky = true, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(topBarVariants({ sticky }), className)}
      {...props}
    />
  )
})

export const TopBar = TopBarImpl as PolymorphicComponent<'header', TopBarOwnProps>

export const TopBarBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TopBarBrand({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
  },
)

export const TopBarSearch = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TopBarSearch({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex flex-1 items-center justify-center', className)} {...props} />
  },
)

export const TopBarActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TopBarActions({ className, ...props }, ref) {
    return <div ref={ref} className={cn('ml-auto flex items-center gap-1', className)} {...props} />
  },
)

export { topBarVariants }
