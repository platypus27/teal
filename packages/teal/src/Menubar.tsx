import { type ReactNode } from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { cn } from './cn'
import { MenuItems, type MenuItem } from './menu-items'

export type { MenuItem as MenubarItem } from './menu-items'

export interface MenubarMenu {
  /** Items rendered inside the menu panel. */
  items: MenuItem[]
  /** Visible label of the menu trigger, e.g. 'File'. */
  label: ReactNode
}

export interface MenubarProps {
  className?: string
  /** Accessible name for the menubar. */
  label?: string
  /** Menus rendered left to right, e.g. File/Edit/View. */
  menus: MenubarMenu[]
}

export function Menubar({ className, label, menus }: MenubarProps) {
  return (
    <MenubarPrimitive.Root
      aria-label={label}
      className={cn('teal-u-flex teal-u-items-center teal-u-gap-1', className)}
    >
      {menus.map((menu, index) => (
        <MenubarPrimitive.Menu key={index} value={`menu-${index}`}>
          <MenubarPrimitive.Trigger className="teal-focus-ring teal-u-flex teal-u-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-px-3 teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface-variant teal-u-outline-none hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface data-[state=open]:teal-u-bg-surface-container-high data-[state=open]:teal-u-text-on-surface data-[highlighted]:teal-u-bg-surface-container-high data-[highlighted]:teal-u-text-on-surface">
            {menu.label}
          </MenubarPrimitive.Trigger>
          <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content
              align="start"
              sideOffset={6}
              className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-min-w-44 teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface"
            >
              <MenuItems items={menu.items} Item={MenubarPrimitive.Item} Separator={MenubarPrimitive.Separator} />
            </MenubarPrimitive.Content>
          </MenubarPrimitive.Portal>
        </MenubarPrimitive.Menu>
      ))}
    </MenubarPrimitive.Root>
  )
}
