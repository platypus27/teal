import { type ReactElement, type ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from './cn'

export interface MenuItem {
  disabled?: boolean
  icon?: ReactNode
  id: string
  label: ReactNode
  onSelect: () => void
  separatorBefore?: boolean
  tone?: 'default' | 'danger'
}

export interface MenuProps {
  align?: 'start' | 'center' | 'end'
  className?: string
  items: MenuItem[]
  label?: string
  trigger: ReactElement
}

export function Menu({ align = 'end', className, items, label, trigger }: MenuProps) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align={align}
          sideOffset={6}
          aria-label={label}
          className={cn(
            'z-[var(--teal-z-popover)] min-w-44 rounded-xl border border-outline-variant/40 bg-surface-container p-1 text-on-surface shadow-[var(--teal-shadow-overlay)]',
            className,
          )}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? <MenuPrimitive.Separator className="my-1 h-px bg-outline-variant/30" /> : null}
              <MenuPrimitive.Item
                onSelect={item.onSelect}
                {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
                className={cn(
                  'flex min-h-9 cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-surface-container-high',
                  item.tone === 'danger' ? 'text-error data-[highlighted]:bg-error/10' : 'text-on-surface',
                )}
              >
                {item.icon ? <span className="shrink-0 [&_svg]:size-4">{item.icon}</span> : null}
                {item.label}
              </MenuPrimitive.Item>
            </div>
          ))}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
