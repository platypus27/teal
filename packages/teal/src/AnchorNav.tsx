import { forwardRef, useState, type HTMLAttributes, type MouseEvent, type RefObject } from 'react'
import { cn } from './cn'
import { useScrollSpy } from './use-scroll-spy'

export interface AnchorNavItem {
  /** Id of the page section this item scrolls to (without the '#'). */
  id: string
  /** Text of the link. */
  label: string
  /** Nested sections rendered as an indented sub-list. */
  children?: AnchorNavItem[]
}

export interface AnchorNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
  /** Controlled id of the active section. */
  activeId?: string
  /** Scroll container the sections live in; scopes the scroll spy and scrolling to it. */
  containerRef?: RefObject<HTMLElement | null>
  /** Initially active section id when uncontrolled. */
  defaultActiveId?: string
  /** Sections the nav links to and spies on, in document order. */
  items: AnchorNavItem[]
  /** Called with the section id when the active section changes. */
  onActiveChange?: (id: string) => void
}

export const AnchorNav = forwardRef<HTMLElement, AnchorNavProps>(function AnchorNav(
  {
    'aria-label': ariaLabel = 'On this page',
    activeId,
    className,
    containerRef,
    defaultActiveId,
    items,
    onActiveChange,
    ...props
  },
  ref,
) {
  const [internalActive, setInternalActive] = useState<string | undefined>(defaultActiveId ?? items[0]?.id)
  const active = activeId !== undefined ? activeId : internalActive

  function setActive(id: string) {
    if (activeId === undefined) setInternalActive(id)
    onActiveChange?.(id)
  }

  const flatItems = items.flatMap((item) => [item, ...(item.children ?? [])])
  useScrollSpy(flatItems.map((item) => item.id).join(' '), setActive, containerRef)

  function scrollToSection(id: string) {
    const container = containerRef?.current
    const target = container
      ? container.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
      : document.getElementById(id)
    if (!target) return false
    if (container) {
      container.scrollTo({ behavior: 'smooth', top: target.offsetTop - container.offsetTop + container.scrollTop })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return true
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setActive(id)
    if (scrollToSection(id)) event.preventDefault()
  }

  function renderItems(nodes: AnchorNavItem[], depth: number) {
    return (
      <ul className={depth > 0 ? 'teal-u-mt-1 teal-u-pl-4' : undefined}>
        {nodes.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === active ? 'location' : undefined}
              onClick={(event) => handleClick(event, item.id)}
              className={cn(
                'teal-focus-ring teal-u-block teal-u-border-l-2 teal-u-border-solid teal-u-py-1.5 teal-u-pl-3 teal-u-text-sm teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
                item.id === active
                  ? 'teal-u-border-primary teal-u-font-semibold teal-u-text-primary'
                  : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-text-on-surface-variant hover:teal-u-text-on-surface',
              )}
            >
              {item.label}
            </a>
            {item.children && item.children.length > 0 ? renderItems(item.children, depth + 1) : null}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cn('teal-u-flex teal-u-flex-col', className)} {...props}>
      {renderItems(items, 0)}
    </nav>
  )
})
