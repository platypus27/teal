import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { cn } from './cn'
import { Tooltip } from './Tooltip'

export interface NavRailProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the rail landmark. */
  'aria-label'?: string
}

export const NavRail = forwardRef<HTMLElement, NavRailProps>(function NavRail(
  { 'aria-label': ariaLabel = 'Primary', className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'teal-u-inline-flex teal-u-flex-col teal-u-items-center teal-u-gap-1 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-p-1.5 teal-u-shadow-raised',
        className,
      )}
      {...props}
    />
  )
})

export interface NavRailItemProps extends HTMLAttributes<HTMLElement> {
  /** Marks the item as the current page; sets `aria-current="page"`. */
  active?: boolean
  /** Renders a small attention dot in the corner of the item. */
  badge?: boolean
  /** Destination URL; renders a link instead of a button when provided. */
  href?: string
  /** Icon rendered inside the circular item. */
  icon: ReactNode
  /** Accessible name for the item; also shown in a tooltip on hover or focus. */
  label: string
}

export const NavRailItem = forwardRef<HTMLElement, NavRailItemProps>(function NavRailItem(
  { active = false, badge = false, className, href, icon, label, ...props },
  ref,
) {
  const classes = cn(
    'teal-focus-ring teal-u-relative teal-u-inline-flex teal-u-size-11 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-transition-colors',
    active
      ? 'teal-u-bg-primary/10 teal-u-text-primary'
      : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
    className,
  )
  const content = (
    <>
      {icon}
      {badge ? (
        <span
          aria-hidden="true"
          className="teal-u-absolute teal-u-right-1.5 teal-u-top-1.5 teal-u-size-2 teal-u-rounded-full teal-u-bg-error"
        />
      ) : null}
    </>
  )
  return (
    <Tooltip content={label} side="right">
      {href ? (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...props}
        >
          {content}
        </a>
      ) : (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...props}
        >
          {content}
        </button>
      )}
    </Tooltip>
  )
})
