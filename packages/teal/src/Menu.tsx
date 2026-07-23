import { type ReactElement, type ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
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
            'teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-min-w-44 teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface',
            className,
          )}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? <MenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" /> : null}
              <MenuPrimitive.Item
                onSelect={item.onSelect}
                {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
                className={cn(
                  'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-surface-container-high',
                  item.variant === 'danger' ? 'teal-u-text-error data-[highlighted]:teal-u-bg-error/10' : 'teal-u-text-on-surface',
                )}
              >
                {item.icon ? <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{item.icon}</span> : null}
                {item.label}
              </MenuPrimitive.Item>
            </div>
          ))}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
