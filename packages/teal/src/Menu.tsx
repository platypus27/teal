import { type ReactElement } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from './cn'
import { MenuItems, type MenuItem } from './menu-items'

export type { MenuItem } from './menu-items'

interface MenuSharedProps {
  /** Horizontal alignment of the menu relative to the trigger. Applies to mode="dropdown". */
  align?: 'start' | 'center' | 'end'
  className?: string
  /** Items rendered in the menu. */
  items: MenuItem[]
  /** Accessible name for the menu. */
  label?: string
  /** Traps focus and blocks outside interaction while open. Defaults to false. Applies to mode="dropdown". */
  modal?: boolean
}

export type MenuProps = MenuSharedProps &
  (
    | {
        /** Opens from the trigger element on click. This is the default. */
        mode?: 'dropdown'
        /** Element that opens the menu; receives trigger props automatically. */
        trigger: ReactElement
      }
    | {
        /** Opens on right-click of the attached element. */
        mode: 'context'
        /** Element the menu is attached to; receives trigger props automatically. */
        children: ReactElement
      }
  )

export function Menu(props: MenuProps) {
  const { className, items, label } = props
  const contentClassName = cn(
    'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-min-w-44 teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface',
    className,
  )

  if (props.mode === 'context') {
    return (
      <ContextMenuPrimitive.Root>
        <ContextMenuPrimitive.Trigger asChild>{props.children}</ContextMenuPrimitive.Trigger>
        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Content aria-label={label} className={contentClassName}>
            <MenuItems items={items} Item={ContextMenuPrimitive.Item} Separator={ContextMenuPrimitive.Separator} />
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      </ContextMenuPrimitive.Root>
    )
  }

  const { align = 'end', modal = false, trigger } = props
  return (
    <MenuPrimitive.Root modal={modal}>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content align={align} sideOffset={6} aria-label={label} className={contentClassName}>
          <MenuItems items={items} Item={MenuPrimitive.Item} Separator={MenuPrimitive.Separator} />
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
