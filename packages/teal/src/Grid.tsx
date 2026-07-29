import { forwardRef, type ElementType } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

export interface GridOwnProps {
  /** Fixed column count, rendered as `repeat(n, minmax(0, 1fr))`. Ignored when `minChildWidth` is set. */
  columns?: number
  /** Minimum child width (e.g. '16rem' or 256 for pixels); enables `auto-fit` responsive columns. */
  minChildWidth?: string | number
  /** Gap between tracks. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  gap?: number | string
}

export type GridProps<C extends ElementType = 'div'> = PolymorphicProps<C, GridOwnProps>

const GridImpl = forwardRef<HTMLElement, GridProps<ElementType>>(function Grid(
  { as: Component = 'div', className, columns, gap, minChildWidth, style, ...props },
  ref,
) {
  const gridTemplateColumns = minChildWidth
    ? `repeat(auto-fit, minmax(${typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth}, 1fr))`
    : columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : undefined

  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      className={cn('teal-u-grid', className)}
      style={{
        gridTemplateColumns,
        gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap,
        ...style,
      }}
      {...props}
    />
  )
})

/**
 * A grid layout primitive with either a fixed column count
 * or responsive auto-fit columns driven by a minimum child width.
 */
export const Grid = GridImpl as PolymorphicComponent<'div', GridOwnProps>
