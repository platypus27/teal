import { forwardRef, type ElementType } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackOwnProps {
  /** Main axis direction; defaults to 'column'. */
  direction?: 'column' | 'row'
  /** Spacing between children. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  gap?: number | string
  /** Cross-axis alignment of children. */
  align?: StackAlign
  /** Main-axis distribution of children. */
  justify?: StackJustify
  /** Allows children to wrap onto multiple lines when true. */
  wrap?: boolean
}

export type StackProps<C extends ElementType = 'div'> = PolymorphicProps<C, StackOwnProps>

const alignValues: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyValues: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const StackImpl = forwardRef<HTMLElement, StackProps<ElementType>>(function Stack(
  { as: Component = 'div', align, className, direction = 'column', gap, justify, style, wrap = false, ...props },
  ref,
) {
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      className={cn(
        'teal-u-flex',
        direction === 'column' ? 'teal-u-flex-col' : 'teal-u-flex-row',
        wrap && 'teal-u-flex-wrap',
        className,
      )}
      style={{
        gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap,
        alignItems: align ? alignValues[align as StackAlign] : undefined,
        justifyContent: justify ? justifyValues[justify as StackJustify] : undefined,
        ...style,
      }}
      {...props}
    />
  )
})

/**
 * A flex layout primitive that stacks children along a single axis
 * with consistent spacing, alignment and distribution.
 */
export const Stack = StackImpl as PolymorphicComponent<'div', StackOwnProps>
