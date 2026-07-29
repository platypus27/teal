import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface DescriptionListItem {
  /** Term rendered as the row's `dt`. */
  label: ReactNode
  /** Definition rendered as the row's `dd`. */
  value: ReactNode
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Rows to render, in order. */
  items: DescriptionListItem[]
  /** `stacked` fills the container width; `grid` splits rows into two columns on small screens and up. */
  layout?: 'stacked' | 'grid'
}

const rowClasses =
  'teal-u-flex teal-u-justify-between teal-u-gap-4 teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-outline-variant/40 teal-u-py-3 last:teal-u-border-b-0'

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { className, items, layout = 'stacked', ...props },
  ref,
) {
  return (
    <dl
      ref={ref}
      className={cn(layout === 'grid' && 'teal-u-grid sm:teal-u-grid-cols-2 teal-u-gap-x-8', className)}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} className={rowClasses}>
          <dt className="teal-u-text-sm teal-u-text-on-surface-variant">{item.label}</dt>
          <dd className="teal-u-text-right teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
})
