import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const topBarVariants = cva(
  'flex h-16 items-center gap-3 px-4 sm:px-8 lg:px-12',
  {
    variants: {
      variant: {
        solid: 'bg-surface-container',
      },
      sticky: {
        true: 'sticky top-0 z-30',
        false: '',
      },
    },
    compoundVariants: [
      { sticky: true, variant: 'solid', className: 'border-b border-outline-variant/30' },
    ],
    defaultVariants: {
      variant: 'solid',
      sticky: true,
    },
  },
)

export interface TopBarProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof topBarVariants> {
  /** Element rendered by the top bar; defaults to `<header>`. */
  as?: ElementType
}

export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { as: Component = 'header', className, variant, sticky = true, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(topBarVariants({ variant, sticky }), className)}
      {...props}
    />
  )
})

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
