import { type ReactElement } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from './cn'
import { MenuItems, type MenuItem } from './menu-items'

export type { MenuItem } from './menu-items'

export interface MenuProps {
  /** Horizontal alignment of the menu relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  className?: string
  /** Items rendered in the menu. */
  items: MenuItem[]
  /** Accessible name for the menu. */
  label?: string
  /** Traps focus and blocks outside interaction while open. Defaults to false. */
  modal?: boolean
  /** Element that opens the menu; receives trigger props automatically. */
  trigger: ReactElement
}

export function Menu({ align = 'end', className, items, label, modal = false, trigger }: MenuProps) {
  return (
    <MenuPrimitive.Root modal={modal}>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align={align}
          sideOffset={6}
          aria-label={label}
          className={cn(
            'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-min-w-44 teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface',
            className,
          )}
        >
          <MenuItems items={items} Item={MenuPrimitive.Item} Separator={MenuPrimitive.Separator} />
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
