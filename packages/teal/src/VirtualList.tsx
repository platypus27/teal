import {
  forwardRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type UIEvent,
} from 'react'
import { cn } from './cn'

export interface VirtualListProps<Item> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Height of the scrollable viewport in pixels. */
  height: number
  /** Fixed row height in pixels. */
  itemHeight: number
  /** Items windowed over; only the visible slice is rendered. */
  items: Item[]
  /** Accessible name for the list. */
  label?: string
  /** Extra rows rendered above and below the viewport to reduce blank flashes. */
  overscan?: number
  /** Renders one row for the given item. */
  renderItem: (item: Item, index: number) => ReactNode
}

function VirtualListRender<Item>(
  {
    className,
    height,
    itemHeight,
    items,
    label,
    onScroll,
    overscan = 3,
    renderItem,
    style,
    ...props
  }: VirtualListProps<Item>,
  ref: Ref<HTMLDivElement>,
) {
  const [scrollTop, setScrollTop] = useState(0)

  const firstVisible = Math.floor(scrollTop / itemHeight)
  const startIndex = Math.max(0, firstVisible - overscan)
  const endIndex = Math.min(items.length, firstVisible + Math.ceil(height / itemHeight) + overscan)

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop)
    onScroll?.(event)
  }

  return (
    <div
      ref={ref}
      role="list"
      aria-label={label}
      tabIndex={0}
      onScroll={handleScroll}
      style={{ height, ...style } as CSSProperties}
      className={cn('teal-focus-ring teal-u-overflow-y-auto teal-u-rounded-lg', className)}
      {...props}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, offset) => {
          const index = startIndex + offset
          return (
            <div
              key={index}
              role="listitem"
              aria-setsize={items.length}
              aria-posinset={index + 1}
              style={{ height: itemHeight, left: 0, position: 'absolute', right: 0, top: index * itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Windowed list renderer that mounts only the rows near the scroll position. */
export const VirtualList = forwardRef(VirtualListRender) as <Item>(
  props: VirtualListProps<Item> & { ref?: Ref<HTMLDivElement> },
) => ReactElement
