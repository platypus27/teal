import type { ComponentType, ReactNode } from 'react'
import { cn } from './cn'

export interface MenuItem {
  /** Prevents the item from being selected. */
  disabled?: boolean
  /** Icon rendered before the label. */
  icon?: ReactNode
  /** Unique identifier for the item. */
  id: string
  /** Visible label of the item. */
  label: ReactNode
  /** Called when the item is selected. */
  onSelect: () => void
  /** Renders a separator above this item. */
  separatorBefore?: boolean
  /** Use 'danger' for destructive actions. */
  variant?: 'neutral' | 'danger'
}

interface MenuItemPrimitives {
  Item: ComponentType<{
    children?: ReactNode
    className?: string
    disabled?: boolean
    onSelect: () => void
  }>
  Separator: ComponentType<{ className?: string }>
}

/** Shared item list for Menu (dropdown and context modes) and Menubar. */
export function MenuItems({ items, Item, Separator }: { items: MenuItem[] } & MenuItemPrimitives) {
  return items.map((item) => (
    <div key={item.id}>
      {item.separatorBefore ? (
        <Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" />
      ) : null}
      <Item
        onSelect={item.onSelect}
        {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
        className={cn(
          'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-surface-container-high',
          item.variant === 'danger'
            ? 'teal-u-text-error data-[highlighted]:teal-u-bg-error/10'
            : 'teal-u-text-on-surface',
        )}
      >
        {item.icon ? (
          <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{item.icon}</span>
        ) : null}
        {item.label}
      </Item>
    </div>
  ))
}
