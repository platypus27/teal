import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { Container, type ContainerProps } from './Container'

const sectionVariants = cva('', {
  variants: {
    spacing: {
      none: '',
      sm: 'teal-u-py-6',
      md: 'teal-u-py-12',
      lg: 'teal-u-py-20',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
})

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Wraps children in a centered Container. */
  container?: boolean
  /** Width of the inner container when `container` is true. */
  containerSize?: ContainerProps['size']
  /** Vertical rhythm padding above and below the section content. */
  spacing?: VariantProps<typeof sectionVariants>['spacing']
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, container = false, containerSize, spacing = 'md', ...props },
  ref,
) {
  return (
    <section ref={ref} className={cn(sectionVariants({ spacing }), className)} {...props}>
      {container ? <Container size={containerSize ?? 'lg'}>{children}</Container> : children}
    </section>
  )
})

export { sectionVariants }
