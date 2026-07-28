import { type ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Avatar } from './Avatar'
import { cn } from './cn'
import { type MenuItem } from './Menu'

export interface AccountMenuAction {
  /** Visible label. The product words it to say exactly which session ends. */
  label: ReactNode
  /** Called when the action is selected. */
  onSelect: () => void
}

export interface AccountMenuUser {
  /** Display name used for the trigger, menu header, and avatar fallback. */
  name: string
  /** Secondary line shown under the name, such as an email address. */
  email?: string
  /** Avatar image URL; falls back to initials when missing. */
  avatarUrl?: string
}

export interface AccountMenuProps {
  /** Horizontal alignment of the menu relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Sign-out that ends only the current application session. */
  appSignOut?: AccountMenuAction
  className?: string
  /** Additional product-supplied items rendered above the sign-out actions. */
  items?: MenuItem[]
  /** Accessible name for the menu. */
  label?: string
  /** Sign-out that ends the shared single-sign-on session. */
  ssoSignOut?: AccountMenuAction
  /** Signed-in household identity shown in the trigger and menu header. */
  user: AccountMenuUser
}

const itemClass =
  'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface data-[highlighted]:teal-u-bg-surface-container-high'

export function AccountMenu({
  align = 'end',
  appSignOut,
  className,
  items = [],
  label,
  ssoSignOut,
  user,
}: AccountMenuProps) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        aria-label={user.name}
        className="teal-focus-ring teal-u-inline-flex teal-u-cursor-default teal-u-items-center teal-u-rounded-full"
      >
        <Avatar size="sm" name={user.name} {...(user.avatarUrl !== undefined ? { src: user.avatarUrl } : {})} />
      </MenuPrimitive.Trigger>
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
          <MenuPrimitive.Label className="teal-u-px-3 teal-u-py-2">
            <span className="teal-u-block teal-u-text-sm teal-u-font-semibold">{user.name}</span>
            {user.email ? (
              <span className="teal-u-block teal-u-text-xs teal-u-text-on-surface-variant">{user.email}</span>
            ) : null}
          </MenuPrimitive.Label>
          <MenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" />
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? (
                <MenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" />
              ) : null}
              <MenuPrimitive.Item
                onSelect={item.onSelect}
                {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
                className={cn(
                  itemClass,
                  item.disabled ? 'data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45' : null,
                  item.variant === 'danger' ? 'teal-u-text-error data-[highlighted]:teal-u-bg-error/10' : null,
                )}
              >
                {item.icon ? (
                  <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{item.icon}</span>
                ) : null}
                {item.label}
              </MenuPrimitive.Item>
            </div>
          ))}
          {appSignOut || ssoSignOut ? (
            <MenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" />
          ) : null}
          {appSignOut ? (
            <MenuPrimitive.Item onSelect={appSignOut.onSelect} className={itemClass}>
              {appSignOut.label}
            </MenuPrimitive.Item>
          ) : null}
          {ssoSignOut ? (
            <MenuPrimitive.Item
              onSelect={ssoSignOut.onSelect}
              className={cn(itemClass, 'teal-u-text-error data-[highlighted]:teal-u-bg-error/10')}
            >
              {ssoSignOut.label}
            </MenuPrimitive.Item>
          ) : null}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
