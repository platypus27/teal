import { Children, forwardRef, type ElementType } from 'react'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

export interface MasonryOwnProps {
  /** Fixed column count; defaults to 2. Ignored when `minColumnWidth` is set. */
  columns?: number
  /** Gap between columns and stacked items. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  gap?: number | string
  /** Minimum column width (e.g. '16rem' or 256 for pixels); enables responsive auto-filling columns. */
  minColumnWidth?: number | string
}

export type MasonryProps<C extends ElementType = 'div'> = PolymorphicProps<C, MasonryOwnProps>

const MasonryImpl = forwardRef<HTMLElement, MasonryProps<ElementType>>(function Masonry(
  { as: Component = 'div', children, columns = 2, gap = 4, minColumnWidth, style, ...props },
  ref,
) {
  const gapValue = typeof gap === 'number' ? `${gap * 0.25}rem` : gap

  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      style={{
        columnCount: minColumnWidth !== undefined ? undefined : columns,
        columnWidth: typeof minColumnWidth === 'number' ? `${minColumnWidth}px` : minColumnWidth,
        columnGap: gapValue,
        ...style,
      }}
      {...props}
    >
      {/* Items fill down each column, so every child is wrapped to keep it out of column breaks. */}
      {Children.map(children, (child) => (
        <div className="teal-u-break-inside-avoid" style={{ marginBottom: gapValue }}>
          {child}
        </div>
      ))}
    </Component>
  )
})

/**
 * A CSS-columns masonry layout: items flow down each column before
 * continuing in the next, so unequal heights pack without row gaps.
 */
export const Masonry = MasonryImpl as PolymorphicComponent<'div', MasonryOwnProps>
