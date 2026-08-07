import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface DockProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the dock landmark. */
  'aria-label'?: string
}

export const Dock = forwardRef<HTMLElement, DockProps>(function Dock(
  { 'aria-label': ariaLabel = 'Dock', className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'teal-u-inline-flex teal-u-items-end teal-u-gap-2 teal-u-rounded-3xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface/70 teal-u-p-2 teal-u-shadow-overlay teal-u-backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
})

export interface DockItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows a dot under the icon marking the running or current app. */
  active?: boolean
  /** Icon content of the item. */
  icon: ReactNode
  /** Name of the item; used as the accessible name and the tooltip text. */
  label: string
}

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(function DockItem(
  { active = false, className, icon, label, ...props },
  ref,
) {
  return (
    <span className="teal-u-group teal-u-relative teal-u-flex teal-u-flex-col teal-u-items-center teal-u-gap-1">
      <button
        ref={ref}
        type="button"
        aria-label={label}
        data-active={active || undefined}
        className={cn(
          'teal-focus-ring teal-u-flex teal-u-size-12 teal-u-items-center teal-u-justify-center teal-u-rounded-2xl teal-u-bg-surface-container-high teal-u-text-on-surface teal-u-transition-transform teal-u-duration-[var(--teal-motion-fast)] hover:teal-u-scale-110 motion-reduce:teal-u-transition-none motion-reduce:hover:teal-u-transform-none',
          className,
        )}
        {...props}
      >
        {icon}
      </button>
      <span
        aria-hidden="true"
        className="teal-u-pointer-events-none teal-u-absolute teal-u--top-9 teal-u-rounded-full teal-u-whitespace-nowrap teal-u-bg-inverse-surface teal-u-px-2.5 teal-u-py-1 teal-u-text-xs teal-u-font-medium teal-u-text-inverse-on-surface teal-u-opacity-0 teal-u-transition-opacity teal-u-duration-[var(--teal-motion-fast)] group-hover:teal-u-opacity-100 group-focus-within:teal-u-opacity-100 motion-reduce:teal-u-transition-none"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn('teal-u-size-1 teal-u-rounded-full', active ? 'teal-u-bg-on-surface-variant' : 'teal-u-bg-transparent')}
      />
    </span>
  )
})
