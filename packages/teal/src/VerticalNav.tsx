import { createContext, forwardRef, useContext, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const verticalNavVariants = cva(
  'box-border group flex flex-col overflow-hidden border-solid border-[color:var(--teal-border-subtle)] bg-surface transition-[width] duration-[var(--teal-motion-standard)] ease-out motion-reduce:transition-none',
  {
    variants: {
      mode: {
        rail: 'w-20 hover:w-72 focus-within:w-72',
        full: 'w-72',
      },
      side: {
        left: 'border-r',
        right: 'border-l',
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
    return <div ref={ref} className={cn('flex items-center px-2 py-5', className)} {...props} />
  },
)

export const VerticalNavList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function VerticalNavList({ className, tabIndex, ...props }, ref) {
    const { mode } = useVerticalNavMode()
    const overflowClass =
      mode === 'rail'
        ? 'overflow-hidden group-hover:overflow-y-auto group-focus-within:overflow-y-auto'
        : 'overflow-y-auto'
    return (
      <div
        ref={ref}
        tabIndex={mode === 'full' ? (tabIndex ?? 0) : tabIndex}
        className={cn('flex-1 space-y-6 px-2 py-2', overflowClass, className)}
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
      <div ref={ref} className={cn('space-y-0.5', className)} {...props}>
        {label ? (
          <div
            className={cn(
              'px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-opacity duration-[var(--teal-motion-fast)] motion-reduce:transition-none',
              mode === 'rail'
                ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                : 'opacity-100',
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
    'overflow-hidden whitespace-nowrap transition-[width,opacity] duration-[var(--teal-motion-standard)] motion-reduce:transition-none',
    mode === 'rail'
      ? 'w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-focus-within:w-auto group-focus-within:opacity-100'
      : 'flex-1 opacity-100',
  )

  return (
    <Component
      ref={ref as never}
      className={cn(
        'teal-focus-ring group/item flex items-center rounded-xl py-1.5 text-sm',
        className,
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {icon ? (
        <span className="flex w-16 shrink-0 items-center justify-center">
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-xl transition-colors duration-[var(--teal-motion-fast)]',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant group-hover/item:bg-surface-container-high group-hover/item:text-on-surface',
            )}
          >
            {icon}
          </span>
        </span>
      ) : null}
      <span
        className={cn(
          labelClass,
          'flex items-center',
          icon ? undefined : 'pl-3',
          active ? 'font-semibold text-primary' : 'text-on-surface-variant group-hover/item:text-on-surface',
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
    return <div ref={ref} className={cn('mt-auto px-2 pb-6', className)} {...props} />
  },
)

export { verticalNavVariants }
