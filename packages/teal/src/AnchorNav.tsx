import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from './cn'

function useScrollSpy(idsKey: string, onActive: (id: string) => void) {
  const callbackRef = useRef(onActive)

  useEffect(() => {
    callbackRef.current = onActive
  }, [onActive])

  useEffect(() => {
    // No IntersectionObserver (very old browsers, some test environments):
    // the nav still works, it just does not track scrolling.
    if (typeof IntersectionObserver === 'undefined') return
    const ids = idsKey.split(' ').filter(Boolean)
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbackRef.current(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [idsKey])
}

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }
  return false
}

export interface AnchorNavItem {
  /** Id of the page section this item scrolls to (without the '#'). */
  id: string
  /** Text of the link. */
  label: string
}

export interface AnchorNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
  /** Controlled id of the active section. */
  activeId?: string
  /** Initially active section id when uncontrolled. */
  defaultActiveId?: string
  /** Sections the nav links to and spies on, in document order. */
  items: AnchorNavItem[]
  /** Called with the section id when the active section changes. */
  onActiveChange?: (id: string) => void
}

export const AnchorNav = forwardRef<HTMLElement, AnchorNavProps>(function AnchorNav(
  { 'aria-label': ariaLabel = 'On this page', activeId, className, defaultActiveId, items, onActiveChange, ...props },
  ref,
) {
  const [internalActive, setInternalActive] = useState<string | undefined>(defaultActiveId ?? items[0]?.id)
  const active = activeId !== undefined ? activeId : internalActive

  function setActive(id: string) {
    if (activeId === undefined) setInternalActive(id)
    onActiveChange?.(id)
  }

  useScrollSpy(items.map((item) => item.id).join(' '), setActive)

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setActive(id)
    if (scrollToSection(id)) event.preventDefault()
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cn('teal-u-flex teal-u-flex-col', className)} {...props}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={item.id === active ? 'location' : undefined}
          onClick={(event) => handleClick(event, item.id)}
          className={cn(
            'teal-focus-ring teal-u-border-l-2 teal-u-border-solid teal-u-py-1.5 teal-u-pl-3 teal-u-text-sm teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
            item.id === active
              ? 'teal-u-border-primary teal-u-font-semibold teal-u-text-primary'
              : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-text-on-surface-variant hover:teal-u-text-on-surface',
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
})
