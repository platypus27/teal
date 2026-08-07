import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type KeyboardEvent } from 'react'
import { cn } from './cn'

export interface SubNavProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
}

export const SubNav = forwardRef<HTMLElement, SubNavProps>(function SubNav(
  { 'aria-label': ariaLabel = 'Section', className, onKeyDown, ...props },
  ref,
) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    if (target.tagName !== 'A') {
      onKeyDown?.(event)
      return
    }
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a'))
    const index = links.indexOf(target)
    if (index === -1) {
      onKeyDown?.(event)
      return
    }
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % links.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + links.length) % links.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = links.length - 1
    if (next !== null) {
      event.preventDefault()
      links[next]?.focus()
    }
    onKeyDown?.(event)
  }

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'teal-u-flex teal-u-items-stretch teal-u-gap-1 teal-u-overflow-x-auto teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)]',
        className,
      )}
      {...props}
    />
  )
})

export interface SubNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the item as the current page; sets `aria-current="page"` and shows the underline. */
  active?: boolean
}

export const SubNavItem = forwardRef<HTMLAnchorElement, SubNavItemProps>(function SubNavItem(
  { active = false, className, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'teal-focus-ring teal-u--mb-px teal-u-border-b-2 teal-u-border-solid teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-whitespace-nowrap teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
        active
          ? 'teal-u-border-primary teal-u-font-semibold teal-u-text-primary'
          : 'teal-u-border-transparent teal-u-text-on-surface-variant hover:teal-u-text-on-surface',
        className,
      )}
      {...props}
    />
  )
})
