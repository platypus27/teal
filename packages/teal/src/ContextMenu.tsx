import { type ReactElement } from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from './cn'
import { type MenuItem } from './Menu'

export type { MenuItem as ContextMenuItem }

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
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? <ContextMenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" /> : null}
              <ContextMenuPrimitive.Item
                onSelect={item.onSelect}
                {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
                className={cn(
                  'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-surface-container-high',
                  item.variant === 'danger' ? 'teal-u-text-error data-[highlighted]:teal-u-bg-error/10' : 'teal-u-text-on-surface',
                )}
              >
                {item.icon ? <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{item.icon}</span> : null}
                {item.label}
              </ContextMenuPrimitive.Item>
            </div>
          ))}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  )
}
