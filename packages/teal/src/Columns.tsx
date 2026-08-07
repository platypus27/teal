import { forwardRef, type ElementType } from 'react'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6

// Static class names so the Tailwind build can scan them.
const columnsClasses: Record<ColumnCount, string> = {
  1: 'teal-u-grid-cols-1',
  2: 'teal-u-grid-cols-1 sm:teal-u-grid-cols-2',
  3: 'teal-u-grid-cols-1 sm:teal-u-grid-cols-2 lg:teal-u-grid-cols-3',
  4: 'teal-u-grid-cols-1 sm:teal-u-grid-cols-2 lg:teal-u-grid-cols-4',
  5: 'teal-u-grid-cols-2 sm:teal-u-grid-cols-3 lg:teal-u-grid-cols-5',
  6: 'teal-u-grid-cols-2 sm:teal-u-grid-cols-3 lg:teal-u-grid-cols-6',
}

export interface ColumnsOwnProps {
  /** Number of equal-width columns on wide viewports; collapses to fewer columns on narrow screens. */
  columns?: ColumnCount
  /** Gap between tracks. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  gap?: number | string
}

export type ColumnsProps<C extends ElementType = 'div'> = PolymorphicProps<C, ColumnsOwnProps>

const ColumnsImpl = forwardRef<HTMLElement, ColumnsProps<ElementType>>(function Columns(
  { as: Component = 'div', className, columns = 3, gap, style, ...props },
  ref,
) {
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      className={cn('teal-u-grid', columnsClasses[columns as ColumnCount], className)}
      style={{
        gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap,
        ...style,
      }}
      {...props}
    />
  )
})

/**
 * An equal-width column layout that keeps row alignment and
 * collapses to fewer columns responsively.
 */
export const Columns = ColumnsImpl as PolymorphicComponent<'div', ColumnsOwnProps>
