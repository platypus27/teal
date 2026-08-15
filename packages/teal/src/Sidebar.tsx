import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic'

const sidebarVariants = cva(
  'teal-u-box-border teal-u-group teal-u-flex teal-u-h-full teal-u-flex-col teal-u-overflow-hidden teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none',
  {
    variants: {
      mode: {
        rail: 'teal-u-w-20 hover:teal-u-w-72 focus-within:teal-u-w-72',
        // Full-mode width is driven by the collapsed state instead (w-16/w-64).
        full: '',
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

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (next: boolean) => void
  mode: 'rail' | 'full'
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mode: 'full',
})

function useSidebar() {
  return useContext(SidebarContext)
}

export interface SidebarOwnProps {
  /** Accessible name for the sidebar landmark. */
  'aria-label'?: string
  /** Controlled collapsed state; true renders the sidebar as an icon rail. */
  collapsed?: boolean
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean
  /** Called with the new collapsed state when the sidebar is toggled. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Rail collapses labels until hover or focus; full keeps labels visible and honors the collapsed state. */
  mode?: VariantProps<typeof sidebarVariants>['mode']
  /** Edge where the sidebar is attached; the border is drawn on the inner side. */
  side?: VariantProps<typeof sidebarVariants>['side']
  /** Floating glass-pill surface: rounded, translucent, blurred, and elevated. */
  floating?: boolean
}

export type SidebarProps<C extends ElementType = 'nav'> = PolymorphicProps<C, SidebarOwnProps>

const SidebarImpl = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    as: Component = 'nav',
    'aria-label': ariaLabel = 'Sidebar',
    className,
    collapsed,
    defaultCollapsed = false,
    floating = false,
    mode,
    onCollapsedChange,
    side,
    ...props
  },
  ref,
) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed
  const resolvedMode = mode ?? 'full'

  function setCollapsed(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed, setCollapsed, mode: resolvedMode }}>
      <Component
        ref={ref as never}
        aria-label={ariaLabel}
        data-collapsed={isCollapsed || undefined}
        className={cn(
          sidebarVariants({ mode, side }),
          resolvedMode === 'full' ? (isCollapsed ? 'teal-u-w-16' : 'teal-u-w-64') : undefined,
          floating
            ? 'teal-u-rounded-[2rem] teal-u-border teal-u-bg-surface/70 teal-u-backdrop-blur-xl teal-u-shadow-overlay'
            : undefined,
          className,
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
})

export const Sidebar = SidebarImpl as PolymorphicComponent<'nav', SidebarOwnProps>

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('teal-u-flex teal-u-items-center teal-u-gap-2 teal-u-overflow-hidden teal-u-px-3 teal-u-py-4', className)}
      {...props}
    />
  )
})

export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarContent(
  { className, tabIndex, ...props },
  ref,
) {
  const { mode } = useSidebar()
  const overflowClass =
    mode === 'rail'
      ? 'teal-u-overflow-hidden group-hover:teal-u-overflow-y-auto group-focus-within:teal-u-overflow-y-auto'
      : 'teal-u-overflow-x-hidden teal-u-overflow-y-auto'
  return (
    <div
      ref={ref}
      tabIndex={mode === 'full' ? (tabIndex ?? 0) : tabIndex}
      className={cn('teal-u-flex-1 teal-u-space-y-1 teal-u-px-2 teal-u-py-2', overflowClass, className)}
      {...props}
    />
  )
})

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('teal-u-mt-auto teal-u-space-y-1 teal-u-px-2 teal-u-pb-4', className)} {...props} />
})

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Uppercase heading shown above the items. Hidden while the sidebar is collapsed or, in rail mode, until the rail expands. */
  label?: string
}

export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { className, label, children, ...props },
  ref,
) {
  const { collapsed, mode } = useSidebar()
  return (
    <div ref={ref} className={cn('teal-u-space-y-0.5', className)} {...props}>
      {label ? (
        <div
          className={cn(
            'teal-u-px-3 teal-u-pb-2 teal-u-text-xs teal-u-font-bold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant teal-u-transition-opacity teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
            collapsed
              ? 'teal-u-opacity-0'
              : mode === 'rail'
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
})

export interface SidebarItemOwnProps {
  /** Marks the item as the current page; sets `aria-current="page"`. In rail mode the active background is a circle around the icon; in full mode it is a rounded row. */
  active?: boolean
  /** Icon shown before the label. Always visible, even when the sidebar is collapsed or in rail mode. */
  icon?: ReactNode
}

export type SidebarItemProps<C extends ElementType = 'a'> = PolymorphicProps<C, SidebarItemOwnProps>

const SidebarItemImpl = forwardRef<HTMLElement, SidebarItemProps>(function SidebarItem(
  { as: Component = 'a', active = false, className, icon, children, ...props },
  ref,
) {
  const { collapsed, mode } = useSidebar()
  const rail = mode === 'rail'

  const rowColorClass = active
    ? rail
      ? 'teal-u-font-semibold teal-u-text-primary'
      : 'teal-u-bg-primary/10 teal-u-font-semibold teal-u-text-primary'
    : rail
      ? 'teal-u-text-on-surface-variant hover:teal-u-text-on-surface'
      : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface'

  const labelClass = cn(
    'teal-u-overflow-hidden teal-u-whitespace-nowrap teal-u-transition-[width,opacity] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
    collapsed
      ? 'teal-u-w-0 teal-u-opacity-0'
      : rail
        ? 'teal-u-w-0 teal-u-opacity-0 group-hover:teal-u-w-auto group-hover:teal-u-opacity-100 group-focus-within:teal-u-w-auto group-focus-within:teal-u-opacity-100'
        : 'teal-u-flex-1 teal-u-opacity-100',
  )

  return (
    <Component
      ref={ref as never}
      aria-current={active ? 'page' : undefined}
      title={collapsed && typeof children === 'string' ? children : undefined}
      className={cn(
        'teal-focus-ring teal-u-group/item teal-u-flex teal-u-items-center teal-u-rounded-xl teal-u-py-2 teal-u-text-sm teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
        rowColorClass,
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            'teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center',
            rail ? 'teal-u-w-16' : collapsed ? 'teal-u-w-12' : 'teal-u-w-10',
          )}
        >
          {rail ? (
            <span
              className={cn(
                'teal-u-flex teal-u-size-11 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
                active ? 'teal-u-bg-primary/10' : 'group-hover/item:teal-u-bg-surface-container-high',
              )}
            >
              {icon}
            </span>
          ) : (
            icon
          )}
        </span>
      ) : null}
      <span className={cn(labelClass, icon ? undefined : 'teal-u-pl-3')}>{children}</span>
    </Component>
  )
})

export const SidebarItem = SidebarItemImpl as PolymorphicComponent<'a', SidebarItemOwnProps>

export const SidebarCollapseButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function SidebarCollapseButton({ className, onClick, ...props }, ref) {
    const { collapsed, setCollapsed } = useSidebar()
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={(event) => {
          setCollapsed(!collapsed)
          onClick?.(event)
        }}
        className={cn(
          'teal-focus-ring teal-u-flex teal-u-w-full teal-u-items-center teal-u-rounded-xl teal-u-py-2 teal-u-text-sm teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
          className,
        )}
        {...props}
      >
        <span className={cn('teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center', collapsed ? 'teal-u-w-12' : 'teal-u-w-10')}>
          <Icon aria-hidden="true" className="teal-u-size-5" />
        </span>
        <span
          className={cn(
            'teal-u-overflow-hidden teal-u-whitespace-nowrap teal-u-transition-[width,opacity] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
            collapsed ? 'teal-u-w-0 teal-u-opacity-0' : 'teal-u-flex-1 teal-u-text-left teal-u-opacity-100',
          )}
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </span>
      </button>
    )
  },
)
