import { forwardRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const containerVariants = cva('teal-u-mx-auto teal-u-w-full teal-u-px-4 sm:teal-u-px-6 lg:teal-u-px-8', {
  variants: {
    size: {
      sm: 'teal-u-max-w-2xl',
      md: 'teal-u-max-w-4xl',
      lg: 'teal-u-max-w-6xl',
      xl: 'teal-u-max-w-7xl',
      fluid: 'teal-u-max-w-none',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

export interface ContainerOwnProps {
  /** Maximum width of the centered column; 'fluid' removes the width cap. */
  size?: VariantProps<typeof containerVariants>['size']
}

export type ContainerProps<C extends ElementType = 'div'> = PolymorphicProps<C, ContainerOwnProps>

const ContainerImpl = forwardRef<HTMLElement, ContainerProps<ElementType>>(function Container(
  { as: Component = 'div', className, size = 'lg', ...props },
  ref,
) {
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
})

/**
 * Centers content in a max-width column with responsive horizontal padding.
 */
export const Container = ContainerImpl as PolymorphicComponent<'div', ContainerOwnProps>

export { containerVariants }
