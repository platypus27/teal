import { forwardRef, type ElementType } from 'react'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

function spacingValue(value: number | string | undefined) {
  return typeof value === 'number' ? `${value * 0.25}rem` : value
}

export interface BoxOwnProps {
  /** Margin on all sides. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  m?: number | string
  /** Horizontal margin; overrides `m` on the inline axis. */
  mx?: number | string
  /** Vertical margin; overrides `m` on the block axis. */
  my?: number | string
  /** Padding on all sides. Numbers follow the Tailwind spacing scale (n × 0.25rem); strings are used as-is. */
  p?: number | string
  /** Horizontal padding; overrides `p` on the inline axis. */
  px?: number | string
  /** Vertical padding; overrides `p` on the block axis. */
  py?: number | string
}

export type BoxProps<C extends ElementType = 'div'> = PolymorphicProps<C, BoxOwnProps>

const BoxImpl = forwardRef<HTMLElement, BoxProps<ElementType>>(function Box(
  { as: Component = 'div', m, mx, my, p, px, py, style, ...props },
  ref,
) {
  return (
    <Component
      // ElementType does not model the per-element ref; the public type carries it.
      ref={ref as never}
      style={{
        margin: spacingValue(m),
        marginInline: spacingValue(mx),
        marginBlock: spacingValue(my),
        padding: spacingValue(p),
        paddingInline: spacingValue(px),
        paddingBlock: spacingValue(py),
        ...style,
      }}
      {...props}
    />
  )
})

/**
 * The lowest-level layout primitive: a polymorphic box with spacing props.
 * Surfaces, colors and borders are applied through `className`.
 */
export const Box = BoxImpl as PolymorphicComponent<'div', BoxOwnProps>
