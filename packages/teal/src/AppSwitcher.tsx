import { type ReactElement, type ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from './cn'

export interface AppSwitcherItem {
  /** Marks the application the person is currently using. */
  current?: boolean
  /** URL the application item navigates to. */
  href: string
  /** Icon rendered before the label. */
  icon?: ReactNode
  /** Unique identifier for the application. */
  id: string
  /** Visible application label. */
  label: ReactNode
}

export interface AppSwitcherProps {
  /** Horizontal alignment of the switcher relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Applications to show. The caller filters by entitlement first; the switcher renders only what it is given. */
  apps: AppSwitcherItem[]
  className?: string
  /** Marks the Home destination as the application the person is currently using. */
  homeCurrent?: boolean
  /** URL of the explicit Home destination. */
  homeHref: string
  /** Visible label of the Home destination. */
  homeLabel: ReactNode
  /** Accessible name for the switcher menu. */
  label?: string
  /** Called with the application id, or 'home', when a destination is selected. */
  onNavigate?: (id: string) => void
  /** Element that opens the switcher; receives trigger props automatically. */
  trigger: ReactElement
}

const itemClass =
  'teal-focus-ring teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-gap-2 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface teal-u-no-underline data-[highlighted]:teal-u-bg-surface-container-high'

export function AppSwitcher({
  align = 'end',
  apps,
  className,
  homeCurrent = false,
  homeHref,
  homeLabel,
  label,
  onNavigate,
  trigger,
}: AppSwitcherProps) {
  return (
    <MenuPrimitive.Root modal={false}>
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
          <MenuPrimitive.Item asChild onSelect={() => onNavigate?.('home')}>
            <a className={itemClass} href={homeHref} {...(homeCurrent ? { 'aria-current': 'page' as const } : {})}>
              {homeLabel}
            </a>
          </MenuPrimitive.Item>
          {apps.length > 0 ? (
            <MenuPrimitive.Separator className="teal-u-my-1 teal-u-h-px teal-u-bg-outline-variant/30" />
          ) : null}
          {apps.map((app) => (
            <MenuPrimitive.Item key={app.id} asChild onSelect={() => onNavigate?.(app.id)}>
              <a
                className={itemClass}
                href={app.href}
                {...(app.current ? { 'aria-current': 'page' as const } : {})}
              >
                {app.icon ? (
                  <span className="teal-u-shrink-0 [&_svg]:teal-u-size-[var(--teal-icon-sm)]">{app.icon}</span>
                ) : null}
                {app.label}
              </a>
            </MenuPrimitive.Item>
          ))}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
