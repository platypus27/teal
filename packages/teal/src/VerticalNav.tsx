import { createContext, forwardRef, useContext, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const verticalNavVariants = cva(
  'teal-u-box-border teal-u-group teal-u-flex teal-u-flex-col teal-u-overflow-hidden teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none',
  {
    variants: {
      mode: {
        rail: 'teal-u-w-20 hover:teal-u-w-72 focus-within:teal-u-w-72',
        full: 'teal-u-w-72',
      },
      side: {
        left: 'teal-u-border-r',
        right: 'teal-u-border-l',
      },
    },
    defaultVariants: {
      mode: 'full',
      side: 'left',
    },
  },
)

const VerticalNavContext = createContext<{ mode: 'rail' | 'full' }>({ mode: 'full' })
const useVerticalNavMode = () => useContext(VerticalNavContext)

export interface VerticalNavOwnProps {
  /** Rail collapses labels until hover or focus; full keeps labels visible. */
  mode?: VariantProps<typeof verticalNavVariants>['mode']
  /** Edge where the navigation is attached. */
  side?: VariantProps<typeof verticalNavVariants>['side']
}

export type VerticalNavProps<C extends ElementType = 'nav'> = PolymorphicProps<C, VerticalNavOwnProps>

const VerticalNavImpl = forwardRef<HTMLElement, VerticalNavProps>(function VerticalNav(
  { as: Component = 'nav', className, mode, side, ...props },
  ref,
) {
  const resolvedMode = mode ?? 'full'
  return (
    <VerticalNavContext.Provider value={{ mode: resolvedMode }}>
      <Component
        ref={ref as never}
        className={cn(verticalNavVariants({ mode, side }), className)}
        {...props}
      />
    </VerticalNavContext.Provider>
  )
})

export const VerticalNav = VerticalNavImpl as PolymorphicComponent<'nav', VerticalNavOwnProps>

export const VerticalNavBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function VerticalNavBrand({ className, ...props }, ref) {
    return <div ref={ref} className={cn('teal-u-flex teal-u-items-center teal-u-px-2 teal-u-py-5', className)} {...props} />
  },
)

export const VerticalNavList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function VerticalNavList({ className, tabIndex, ...props }, ref) {
    const { mode } = useVerticalNavMode()
    const overflowClass =
      mode === 'rail'
        ? 'teal-u-overflow-hidden group-hover:teal-u-overflow-y-auto group-focus-within:teal-u-overflow-y-auto'
        : 'teal-u-overflow-y-auto'
    return (
      <div
        ref={ref}
        tabIndex={mode === 'full' ? (tabIndex ?? 0) : tabIndex}
        className={cn('teal-u-flex-1 teal-u-space-y-6 teal-u-px-2 teal-u-py-2', overflowClass, className)}
        {...props}
      />
    )
  },
)

export interface VerticalNavSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Uppercase heading shown above the items. Hidden in rail mode until the nav expands. */
  label?: string
}

export const VerticalNavSection = forwardRef<HTMLDivElement, VerticalNavSectionProps>(
  function VerticalNavSection({ className, label, children, ...props }, ref) {
    const { mode } = useVerticalNavMode()
    return (
      <div ref={ref} className={cn('teal-u-space-y-0.5', className)} {...props}>
        {label ? (
          <div
            className={cn(
              'teal-u-px-3 teal-u-pb-2 teal-u-text-xs teal-u-font-bold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant teal-u-transition-opacity teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
              mode === 'rail'
                ? 'teal-u-opacity-0 group-hover:teal-u-opacity-100 group-focus-within:teal-u-opacity-100'
                : 'teal-u-opacity-100',
            )}
          >
            {label}
          </div>
        ) : null}
        {children}
      </div>
    )
  },
)

export interface VerticalNavItemOwnProps {
  /** Marks the item as the current page; sets `aria-current="page"`. */
  active?: boolean
  /** Icon element shown before the label. Always visible, even in rail mode. */
  icon?: ReactNode
}

export type VerticalNavItemProps<C extends ElementType = 'a'> = PolymorphicProps<C, VerticalNavItemOwnProps>

const VerticalNavItemImpl = forwardRef<HTMLElement, VerticalNavItemProps>(function VerticalNavItem(
  { as: Component = 'a', active = false, icon, className, children, ...props },
  ref,
) {
  const { mode } = useVerticalNavMode()

  const labelClass = cn(
    'teal-u-overflow-hidden teal-u-whitespace-nowrap teal-u-transition-[width,opacity] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
    mode === 'rail'
      ? 'teal-u-w-0 teal-u-opacity-0 group-hover:teal-u-w-auto group-hover:teal-u-opacity-100 group-focus-within:teal-u-w-auto group-focus-within:teal-u-opacity-100'
      : 'teal-u-flex-1 teal-u-opacity-100',
  )

  return (
    <Component
      ref={ref as never}
      className={cn(
        'teal-focus-ring teal-u-group/item teal-u-flex teal-u-items-center teal-u-rounded-xl teal-u-py-1.5 teal-u-text-sm',
        className,
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {icon ? (
        <span className="teal-u-flex teal-u-w-16 teal-u-shrink-0 teal-u-items-center teal-u-justify-center">
          <span
            className={cn(
              'teal-u-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)]',
              active
                ? 'teal-u-bg-primary/10 teal-u-text-primary'
                : 'teal-u-text-on-surface-variant group-hover/item:teal-u-bg-surface-container-high group-hover/item:teal-u-text-on-surface',
            )}
          >
            {icon}
          </span>
        </span>
      ) : null}
      <span
        className={cn(
          labelClass,
          'teal-u-flex teal-u-items-center',
          icon ? undefined : 'teal-u-pl-3',
          active ? 'teal-u-font-semibold teal-u-text-primary' : 'teal-u-text-on-surface-variant group-hover/item:teal-u-text-on-surface',
        )}
      >
        {children}
      </span>
    </Component>
  )
})

export const VerticalNavItem = VerticalNavItemImpl as PolymorphicComponent<'a', VerticalNavItemOwnProps>

export const VerticalNavFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function VerticalNavFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn('teal-u-mt-auto teal-u-px-2 teal-u-pb-6', className)} {...props} />
  },
)

export { verticalNavVariants }
