import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface BottomNavProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  { 'aria-label': ariaLabel = 'Main', className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'teal-u-fixed teal-u-inset-x-0 teal-u-bottom-0 teal-u-z-40 teal-u-flex teal-u-items-stretch teal-u-border-t teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      {...props}
    />
  )
})

export interface BottomNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the item as the current page; sets `aria-current="page"`. */
  active?: boolean
  /** Small badge content shown on the corner of the icon, such as a count. */
  badge?: ReactNode
  /** Icon shown above the label. */
  icon: ReactNode
  /** Text under the icon. */
  label: string
}

export const BottomNavItem = forwardRef<HTMLAnchorElement, BottomNavItemProps>(function BottomNavItem(
  { active = false, badge, className, icon, label, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'teal-focus-ring teal-u-flex teal-u-flex-1 teal-u-flex-col teal-u-items-center teal-u-gap-0.5 teal-u-py-2 teal-u-text-xs teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
        active ? 'teal-u-font-semibold teal-u-text-primary' : 'teal-u-text-on-surface-variant hover:teal-u-text-on-surface',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'teal-u-relative teal-u-flex teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-px-4 teal-u-py-1',
          active && 'teal-u-bg-primary/10',
        )}
      >
        {icon}
        {badge ? (
          <span className="teal-u-absolute teal-u--right-1 teal-u--top-1 teal-u-flex teal-u-min-w-4 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-error teal-u-px-1 teal-u-text-[10px] teal-u-font-bold teal-u-text-on-error">
            {badge}
          </span>
        ) : null}
      </span>
      {label}
    </a>
  )
})
