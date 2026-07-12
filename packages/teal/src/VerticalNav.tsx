import { createContext, forwardRef, useContext, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const verticalNavVariants = cva(
  'group flex flex-col overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none',
  {
    variants: {
      variant: {
        solid: 'border-outline-variant/30 bg-surface-container',
      },
      mode: {
        rail: 'w-20 hover:w-72 focus-within:w-72',
        full: 'w-72',
      },
      side: {
        left: '',
        right: '',
      },
    },
    compoundVariants: [
      { variant: 'solid', side: 'left', className: 'border-r' },
      { variant: 'solid', side: 'right', className: 'border-l' },
    ],
    defaultVariants: {
      variant: 'solid',
      mode: 'full',
      side: 'left',
    },
  },
)

const VerticalNavContext = createContext<{ mode: 'rail' | 'full' }>({ mode: 'full' })
const useVerticalNavMode = () => useContext(VerticalNavContext)

export interface VerticalNavProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof verticalNavVariants> {
  /** Element rendered by the nav container; defaults to `<nav>`. */
  as?: ElementType
}

export const VerticalNav = forwardRef<HTMLElement, VerticalNavProps>(function VerticalNav(
  { as: Component = 'nav', className, variant, mode, side, ...props },
  ref,
) {
  const resolvedMode = mode ?? 'full'
  return (
    <VerticalNavContext.Provider value={{ mode: resolvedMode }}>
      <Component
        ref={ref}
        className={cn(verticalNavVariants({ variant, mode, side }), className)}
        {...props}
      />
    </VerticalNavContext.Provider>
  )
})

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
              'px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-opacity duration-200 motion-reduce:transition-none',
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

export interface VerticalNavItemProps extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the item; defaults to `<a>`. Use `as={Link}` for router integration. */
  as?: ElementType
  /** Marks the item as the current page; sets `aria-current="page"`. */
  active?: boolean
  /** Icon element shown before the label. Always visible, even in rail mode. */
  icon?: ReactNode
}

export const VerticalNavItem = forwardRef<HTMLElement, VerticalNavItemProps>(function VerticalNavItem(
  { as: Component = 'a', active = false, icon, className, children, ...props },
  ref,
) {
  const { mode } = useVerticalNavMode()

  const labelClass = cn(
    'overflow-hidden whitespace-nowrap transition-[width,opacity] duration-200 motion-reduce:transition-none',
    mode === 'rail'
      ? 'w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-focus-within:w-auto group-focus-within:opacity-100'
      : 'flex-1 opacity-100',
  )

  return (
    <Component
      ref={ref}
      className={cn(
        'group/item flex items-center py-1.5 text-sm transition-colors focus-visible:outline-none',
        className,
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      <span className="flex w-16 shrink-0 items-center justify-center">
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-xl transition-colors group-focus-visible/item:ring-2 group-focus-visible/item:ring-primary',
            active
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant group-hover/item:bg-surface-container-high group-hover/item:text-on-surface',
          )}
        >
          {icon}
        </span>
      </span>
      <span
        className={cn(
          labelClass,
          active ? 'font-semibold text-primary' : 'text-on-surface-variant group-hover/item:text-on-surface',
        )}
      >
        {children}
      </span>
    </Component>
  )
})

export const VerticalNavFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function VerticalNavFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn('mt-auto px-2 pb-6', className)} {...props} />
  },
)

export { verticalNavVariants }
