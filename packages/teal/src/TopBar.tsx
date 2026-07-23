import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const topBarVariants = cva('teal-u-flex teal-u-h-16 teal-u-items-center teal-u-gap-3 teal-u-bg-surface teal-u-px-4 sm:teal-u-px-8 lg:teal-u-px-12', {
  variants: {
    sticky: {
      true: 'teal-u-box-border teal-u-sticky teal-u-top-0 teal-u-z-30 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-shadow-sm',
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
    return <div ref={ref} className={cn('teal-u-flex teal-u-items-center teal-u-gap-2', className)} {...props} />
  },
)

export const TopBarSearch = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TopBarSearch({ className, ...props }, ref) {
    return <div ref={ref} className={cn('teal-u-flex teal-u-flex-1 teal-u-items-center teal-u-justify-center', className)} {...props} />
  },
)

export const TopBarActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TopBarActions({ className, ...props }, ref) {
    return <div ref={ref} className={cn('teal-u-ml-auto teal-u-flex teal-u-items-center teal-u-gap-1', className)} {...props} />
  },
)

export { topBarVariants }
