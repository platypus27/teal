import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from './cn'

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (next: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

function useSidebar() {
  return useContext(SidebarContext)
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the sidebar landmark. */
  'aria-label'?: string
  /** Controlled collapsed state; true renders the sidebar as an icon rail. */
  collapsed?: boolean
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean
  /** Called with the new collapsed state when the sidebar is toggled. */
  onCollapsedChange?: (collapsed: boolean) => void
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { 'aria-label': ariaLabel = 'Sidebar', className, collapsed, defaultCollapsed = false, onCollapsedChange, ...props },
  ref,
) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed

  function setCollapsed(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed, setCollapsed }}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-collapsed={isCollapsed || undefined}
        className={cn(
          'teal-u-box-border teal-u-flex teal-u-h-full teal-u-flex-col teal-u-overflow-hidden teal-u-border-r teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] teal-u-ease-out motion-reduce:teal-u-transition-none',
          isCollapsed ? 'teal-u-w-16' : 'teal-u-w-64',
          className,
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
})

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
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('teal-u-flex-1 teal-u-space-y-1 teal-u-overflow-x-hidden teal-u-overflow-y-auto teal-u-px-2 teal-u-py-2', className)}
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
  /** Uppercase heading shown above the items. Hidden while the sidebar is collapsed. */
  label?: string
}

export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { className, label, children, ...props },
  ref,
) {
  const { collapsed } = useSidebar()
  return (
    <div ref={ref} className={cn('teal-u-space-y-0.5', className)} {...props}>
      {label ? (
        <div
          className={cn(
            'teal-u-px-3 teal-u-pb-2 teal-u-text-xs teal-u-font-bold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant teal-u-transition-opacity teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
            collapsed ? 'teal-u-opacity-0' : 'teal-u-opacity-100',
          )}
        >
          {label}
        </div>
      ) : null}
      {children}
    </div>
  )
})

export interface SidebarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the item as the current page; sets `aria-current="page"`. */
  active?: boolean
  /** Icon shown before the label. Always visible, even when the sidebar is collapsed. */
  icon?: ReactNode
}

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { active = false, className, icon, children, ...props },
  ref,
) {
  const { collapsed } = useSidebar()
  return (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      title={collapsed && typeof children === 'string' ? children : undefined}
      className={cn(
        'teal-focus-ring teal-u-flex teal-u-items-center teal-u-rounded-xl teal-u-py-2 teal-u-text-sm teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
        active
          ? 'teal-u-bg-primary/10 teal-u-font-semibold teal-u-text-primary'
          : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className={cn('teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center', collapsed ? 'teal-u-w-12' : 'teal-u-w-10')}>
          {icon}
        </span>
      ) : null}
      <span
        className={cn(
          'teal-u-overflow-hidden teal-u-whitespace-nowrap teal-u-transition-[width,opacity] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
          collapsed ? 'teal-u-w-0 teal-u-opacity-0' : 'teal-u-flex-1 teal-u-opacity-100',
          icon ? undefined : 'teal-u-pl-3',
        )}
      >
        {children}
      </span>
    </a>
  )
})

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
