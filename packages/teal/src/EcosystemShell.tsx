import { forwardRef, useRef, useState, type ReactNode } from 'react'
import { PanelLeftOpen, Settings as SettingsIcon } from 'lucide-react'
import { AccountMenu, type AccountMenuAction, type AccountMenuUser } from './AccountMenu'
import { Button } from './Button'
import { cn } from './cn'
import { Dialog } from './Dialog'
import { EcosystemBrand } from './EcosystemBrand'
import { EcosystemRail, type EcosystemRailDestination, type EcosystemRailHome } from './EcosystemRail'
import type { MenuItem } from './Menu'
import { SidebarItem } from './Sidebar'

export interface EcosystemShellProps {
  /** Extra account menu items rendered above the sign-out actions. */
  accountItems?: MenuItem[]
  /** Sign-out that ends only the current application session. */
  appSignOut?: AccountMenuAction
  /** Accessible name for the ecosystem navigation. */
  ariaLabel?: string
  /** Product-family brand content rendered at the top of the rail. Defaults to EcosystemBrand: the Kryv mark with its wordmark reveal (ADR-0008). */
  brand?: ReactNode
  /** Main content of the application. */
  children: ReactNode
  className?: string
  /** Caller-filtered destinations, each with an optional honest HealthIndicator status. The shell never derives entitlements. */
  destinations: EcosystemRailDestination[]
  /** Replaces the composed rail footer (settings link plus account menu) entirely. */
  footer?: ReactNode
  /** Stable Home destination, always rendered first in the rail. */
  home: EcosystemRailHome
  /** Called with a destination id before ordinary anchor navigation. */
  onNavigate?: (id: string) => void
  /** Settings destination pinned in the rail footer above the account menu. */
  settingsHref?: string
  /** Marks the settings footer item as current (aria-current="page"). */
  settingsCurrent?: boolean
  /** Sign-out that ends the shared single-sign-on session. */
  ssoSignOut?: AccountMenuAction
  /** Content rendered in a top bar above the main region. */
  topBar?: ReactNode
  /** Signed-in household identity shown in the rail footer's account menu. */
  user?: AccountMenuUser
}

/**
 * The assembled ecosystem chrome shared by every Kryv product: the
 * EcosystemRail on the left (icon rail on desktop, a voxel-shadow drawer on
 * mobile), an optional top bar slot, and the main content region. It is
 * purely presentational — callers supply hrefs, entitlements, and session
 * actions; nothing here routes or authenticates.
 */
export const EcosystemShell = forwardRef<HTMLDivElement, EcosystemShellProps>(function EcosystemShell(
  {
    accountItems,
    appSignOut,
    ariaLabel = 'Kryv ecosystem',
    brand,
    children,
    className,
    destinations,
    footer,
    home,
    onNavigate,
    settingsCurrent = false,
    settingsHref,
    ssoSignOut,
    topBar,
    user,
  },
  ref,
) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTriggerRef = useRef<HTMLButtonElement>(null)

  const footerContent = footer ?? (settingsHref || user ? (
    <>
      {settingsHref ? (
        <SidebarItem
          href={settingsHref}
          active={settingsCurrent}
          aria-label="Settings"
          icon={<SettingsIcon aria-hidden="true" className="teal-u-size-5" />}
        >
          Settings
        </SidebarItem>
      ) : null}
      {user ? (
        <SidebarItem
          as="div"
          icon={(
            <AccountMenu
              align="start"
              user={user}
              {...(accountItems !== undefined ? { items: accountItems } : {})}
              {...(appSignOut !== undefined ? { appSignOut } : {})}
              {...(ssoSignOut !== undefined ? { ssoSignOut } : {})}
            />
          )}
        >
          {user.name}
        </SidebarItem>
      ) : null}
    </>
  ) : undefined)

  const rail = (mode: 'rail' | 'full', railClassName?: string, closeOnNavigate = false) => (
    <EcosystemRail
      ariaLabel={ariaLabel}
      mode={mode}
      home={home}
      destinations={destinations}
      {...(railClassName !== undefined ? { className: railClassName } : {})}
      brand={brand ?? <EcosystemBrand />}
      {...(footerContent ? { footer: footerContent } : {})}
      onNavigate={closeOnNavigate
        ? (id) => {
            setDrawerOpen(false)
            onNavigate?.(id)
          }
        : (id) => onNavigate?.(id)}
    />
  )

  return (
    <div ref={ref} className={cn('ecosystem-shell teal-u-relative teal-u-flex teal-u-h-dvh teal-u-overflow-hidden teal-u-bg-background teal-u-text-on-surface', className)}>
      {rail('rail', 'teal-u-hidden teal-u-h-full teal-u-shrink-0 md:teal-u-flex')}
      <div className="teal-u-flex teal-u-min-w-0 teal-u-flex-1 teal-u-flex-col">
        <div className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-gap-2 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-3 teal-u-py-2 md:teal-u-hidden">
          <Button
            ref={drawerTriggerRef}
            size="sm"
            variant="secondary"
            aria-label="Open ecosystem navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <PanelLeftOpen aria-hidden="true" />
            Ecosystem
          </Button>
        </div>
        {topBar ? (
          <div className="teal-u-shrink-0 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)]">{topBar}</div>
        ) : null}
        <main className="teal-u-min-h-0 teal-u-min-w-0 teal-u-flex-1 teal-u-overflow-y-auto">{children}</main>
      </div>
      <Dialog
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        restoreFocusRef={drawerTriggerRef}
        placement="left"
        title={ariaLabel}
        closeLabel="Close ecosystem navigation"
        width="min(21rem, 92vw)"
        className="teal-u-shadow-voxel"
      >
        {rail('full', 'teal-u-h-full teal-u-border-0', true)}
      </Dialog>
    </div>
  )
})
