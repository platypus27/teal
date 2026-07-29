import { type ReactNode } from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'

export interface NavigationMenuLinkItem {
  /** Marks the link as the current page; sets aria-current="page". */
  active?: boolean
  /** Link destination. */
  href: string
  /** Visible label. */
  label: ReactNode
  type: 'link'
}

export interface NavigationMenuPanelItem {
  /** Panel content revealed in the viewport when the trigger is active. */
  content: ReactNode
  /** Visible label of the trigger. */
  label: ReactNode
  type: 'panel'
}

export type NavigationMenuItem = NavigationMenuLinkItem | NavigationMenuPanelItem

export interface NavigationMenuProps {
  className?: string
  /** Items rendered left to right; links navigate, panels open a content panel. */
  items: NavigationMenuItem[]
  /** Accessible name for the navigation landmark. */
  label: string
}

const triggerClasses =
  'teal-focus-ring teal-u-group teal-u-flex teal-u-h-9 teal-u-select-none teal-u-items-center teal-u-gap-1 teal-u-rounded-lg teal-u-px-3 teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface-variant teal-u-outline-none hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface data-[state=open]:teal-u-bg-surface-container-high data-[state=open]:teal-u-text-on-surface'

export function NavigationMenu({ className, items, label }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root aria-label={label} className={cn('teal-u-relative teal-u-z-10 teal-u-flex', className)}>
      <NavigationMenuPrimitive.List className="teal-u-flex teal-u-list-none teal-u-items-center teal-u-gap-1 teal-u-p-0">
        {items.map((item, index) =>
          item.type === 'link' ? (
            <NavigationMenuPrimitive.Item key={index}>
              <NavigationMenuPrimitive.Link
                href={item.href}
                {...(item.active !== undefined ? { active: item.active } : {})}
                className={cn(
                  'teal-focus-ring teal-u-relative teal-u-flex teal-u-h-9 teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-px-3 teal-u-text-sm teal-u-font-semibold teal-u-outline-none teal-u-no-underline hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
                  item.active ? 'teal-u-text-on-surface' : 'teal-u-text-on-surface-variant',
                )}
              >
                {item.label}
                {item.active ? (
                  <span
                    aria-hidden="true"
                    className="teal-u-absolute teal-u-inset-x-3 teal-u-bottom-1 teal-u-h-0.5 teal-u-rounded-full teal-u-bg-primary"
                  />
                ) : null}
              </NavigationMenuPrimitive.Link>
            </NavigationMenuPrimitive.Item>
          ) : (
            <NavigationMenuPrimitive.Item key={index}>
              <NavigationMenuPrimitive.Trigger className={triggerClasses}>
                {item.label}
                <ChevronDown
                  aria-hidden="true"
                  className="teal-u-size-[var(--teal-icon-sm)] teal-u-transition-transform teal-u-duration-[var(--teal-motion-standard)] group-data-[state=open]:teal-u-rotate-180 motion-reduce:teal-u-transition-none"
                />
              </NavigationMenuPrimitive.Trigger>
              <NavigationMenuPrimitive.Content className="teal-u-w-max teal-u-max-w-[calc(100vw-2rem)] teal-u-p-4">
                {item.content}
              </NavigationMenuPrimitive.Content>
            </NavigationMenuPrimitive.Item>
          ),
        )}
      </NavigationMenuPrimitive.List>
      <div className="teal-u-absolute teal-u-left-0 teal-u-top-full teal-u-flex teal-u-pt-1">
        <NavigationMenuPrimitive.Viewport className="teal-popper-content teal-overlay-surface teal-u-relative teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none motion-reduce:teal-u-animate-none" />
      </div>
    </NavigationMenuPrimitive.Root>
  )
}
