import { forwardRef, type ElementType, type ReactNode } from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { IconButton } from './Button'
import { Menu } from './Menu'

export interface BreadcrumbItem {
  /** Link element type for router integration (e.g. a Link component). */
  as?: ElementType
  /** Item destination; ignored on the last item, which is the current page. */
  href?: string
  /** Visible item label. */
  label: ReactNode
  /** Custom navigation used when the item is collapsed into the overflow menu. */
  onSelect?: () => void
}

export interface BreadcrumbProps {
  className?: string
  /** Maximum items shown before middle items collapse into a menu. */
  collapseAfter?: number
  /** Items in hierarchy order; the last item is the current page. */
  items: BreadcrumbItem[]
  /** Accessible name for the navigation landmark. */
  label?: string
}

const separator = <ChevronRight aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant" />

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, collapseAfter = 5, items, label = 'Breadcrumb' },
  ref,
) {
  const collapsed = items.length > collapseAfter
  const visible = collapsed ? items.slice(0, 1) : items.slice(0, -1)
  const hiddenItems = collapsed ? items.slice(1, -1) : []
  const current = items[items.length - 1]

  return (
    <nav ref={ref} aria-label={label} className={className}>
      <ol className="teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-1 teal-u-text-sm">
        {visible.map((item, index) => {
          const LinkComponent = item.as ?? 'a'
          return (
            <li key={index} className="teal-u-flex teal-u-items-center teal-u-gap-1">
              <LinkComponent
                href={item.href}
                className="teal-focus-ring teal-u-rounded teal-u-px-1 teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface"
              >
                {item.label}
              </LinkComponent>
              {separator}
            </li>
          )
        })}
        {hiddenItems.length > 0 ? (
          <li className="teal-u-flex teal-u-items-center teal-u-gap-1">
            <Menu
              label="Hidden breadcrumb items"
              trigger={<IconButton label="Show hidden breadcrumb items" size="sm"><MoreHorizontal /></IconButton>}
              items={hiddenItems.map((item, index) => ({
                id: `hidden-${index}`,
                label: item.label,
                onSelect: item.onSelect ?? (() => {
                  if (item.href) window.location.assign(item.href)
                }),
              }))}
            />
            {separator}
          </li>
        ) : null}
        {current ? (
          <li className="teal-u-flex teal-u-items-center teal-u-gap-1">
            <span aria-current="page" className="teal-u-font-semibold teal-u-text-on-surface">
              {current.label}
            </span>
          </li>
        ) : null}
      </ol>
    </nav>
  )
})
