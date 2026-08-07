import { forwardRef, type ElementType } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface FlexOwnProps {
  /** Cross-axis alignment of children. */
  align?: FlexAlign
  /** Main axis direction; defaults to 'row'. */
  direction?: FlexDirection
  /** Spacing between children. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  gap?: number | string
  /** Renders as an inline flex container that shrinks to its content. */
  inline?: boolean
  /** Main-axis distribution of children. */
  justify?: FlexJustify
  /** Allows children to wrap onto multiple lines when true. */
  wrap?: boolean
}

export type FlexProps<C extends ElementType = 'div'> = PolymorphicProps<C, FlexOwnProps>

const directionClasses: Record<FlexDirection, string> = {
  row: 'teal-u-flex-row',
  'row-reverse': 'teal-u-flex-row-reverse',
  column: 'teal-u-flex-col',
  'column-reverse': 'teal-u-flex-col-reverse',
}

const alignValues: Record<FlexAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyValues: Record<FlexJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const FlexImpl = forwardRef<HTMLElement, FlexProps<ElementType>>(function Flex(
  { as: Component = 'div', align, className, direction = 'row', gap, inline = false, justify, style, wrap = false, ...props },
  ref,
) {
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      className={cn(
        inline ? 'teal-u-inline-flex' : 'teal-u-flex',
        directionClasses[direction as FlexDirection],
        wrap && 'teal-u-flex-wrap',
        className,
      )}
      style={{
        gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap,
        alignItems: align ? alignValues[align as FlexAlign] : undefined,
        justifyContent: justify ? justifyValues[justify as FlexJustify] : undefined,
        ...style,
      }}
      {...props}
    />
  )
})

/**
 * A flex container primitive with direction, spacing, alignment and
 * distribution props; defaults to a horizontal row.
 */
export const Flex = FlexImpl as PolymorphicComponent<'div', FlexOwnProps>
