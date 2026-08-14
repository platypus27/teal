import { type ReactElement } from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from './cn'
import { MenuItems, type MenuItem } from './menu-items'

export type { MenuItem as ContextMenuItem } from './menu-items'

export interface ContextMenuProps {
  /** Element the menu is attached to; opens on right-click and receives trigger props automatically. */
  children: ReactElement
  className?: string
  /** Items rendered in the menu. */
  items: MenuItem[]
  /** Accessible name for the menu. */
  label?: string
}

export function ContextMenu({ children, className, items, label }: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          aria-label={label}
          className={cn(
            'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-min-w-44 teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface',
            className,
          )}
        >
          <MenuItems items={items} Item={ContextMenuPrimitive.Item} Separator={ContextMenuPrimitive.Separator} />
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  )
}
