import { forwardRef, type ElementType } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'
import { VerticalNav, verticalNavVariants } from './VerticalNav'

export interface SideRailOwnProps {
  /** Accessible name for the floating rail landmark. */
  'aria-label'?: string
  /** Rail collapses labels until hover or focus; full keeps labels visible. */
  mode?: VariantProps<typeof verticalNavVariants>['mode']
  /** Edge where the navigation is attached; a floating rail usually keeps this unset. */
  side?: VariantProps<typeof verticalNavVariants>['side']
}

export type SideRailProps<C extends ElementType = 'nav'> = PolymorphicProps<C, SideRailOwnProps>

const SideRailImpl = forwardRef<HTMLElement, SideRailProps>(function SideRail(
  { as: Component = 'nav', 'aria-label': ariaLabel = 'Primary', className, mode = 'rail', side, ...props },
  ref,
) {
  return (
    <VerticalNav
      as={Component}
      ref={ref as never}
      aria-label={ariaLabel}
      className={cn(
        'teal-u-rounded-full teal-u-border teal-u-bg-surface/70 teal-u-backdrop-blur-xl teal-u-shadow-overlay',
        className,
      )}
      mode={mode}
      side={side}
      {...props}
    />
  )
})

export const SideRail = SideRailImpl as PolymorphicComponent<'nav', SideRailOwnProps>
