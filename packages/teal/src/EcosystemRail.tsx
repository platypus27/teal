import type { ReactNode } from 'react'
import { HealthIndicator, type HealthIndicatorStatus } from './HealthIndicator'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from './Sidebar'

export interface EcosystemRailHome {
  /** Accessible destination name when the visible label is collapsed. */
  ariaLabel?: string
  /** Marks Home as the current product. */
  current?: boolean
  /** URL of the stable Home destination. */
  href: string
  /** Icon rendered beside the Home label. */
  icon?: ReactNode
  /** Visible Home label. */
  label: ReactNode
}

export interface EcosystemRailDestination {
  /** Accessible destination name when the visible label is collapsed. */
  ariaLabel?: string
  /** Marks this destination as the current product. */
  current?: boolean
  /** URL supplied by the consuming product. */
  href: string
  /** Icon rendered beside the destination label. */
  icon?: ReactNode
  /** Stable product identifier. */
  id: string
  /** Visible product label. */
  label: ReactNode
  /** Optional honest health state. Missing evidence should be omitted or unknown. */
  status?: HealthIndicatorStatus
}

export interface EcosystemRailProps {
  /** Accessible name for the product navigation. */
  ariaLabel?: string
  /** Optional product-family brand content. */
  brand?: ReactNode
  className?: string
  /** Caller-filtered destinations. The rail never derives entitlements. */
  destinations: EcosystemRailDestination[]
  /** Stable Home destination, always rendered first. */
  home: EcosystemRailHome
  /** Optional account or session controls pinned to the bottom. */
  footer?: ReactNode
  /** Rail collapses labels until hover or focus; full keeps labels visible. */
  mode?: 'rail' | 'full'
  /** Called before ordinary anchor navigation. */
  onNavigate?: (id: string) => void
  /** Edge where the rail is attached. */
  side?: 'left' | 'right'
}

export function EcosystemRail({
  ariaLabel = 'Kryv ecosystem',
  brand,
  className,
  destinations,
  footer,
  home,
  mode = 'rail',
  onNavigate,
  side = 'left',
}: EcosystemRailProps) {
  const reportNavigation = (id: string) => () => {
    onNavigate?.(id)
  }

  return (
    <Sidebar aria-label={ariaLabel} className={className} mode={mode} side={side}>
      {brand ? <SidebarHeader>{brand}</SidebarHeader> : null}
      <SidebarContent>
        <SidebarSection label="Ecosystem">
          <SidebarItem
            active={home.current ?? false}
            aria-label={home.ariaLabel ?? (typeof home.label === 'string' ? home.label : undefined)}
            href={home.href}
            icon={home.icon}
            onClick={reportNavigation('home')}
          >
            {home.label}
          </SidebarItem>
          {destinations.map((destination) => (
            <SidebarItem
              key={destination.id}
              active={destination.current ?? false}
              aria-label={
                destination.ariaLabel
                ?? (typeof destination.label === 'string' ? destination.label : undefined)
              }
              href={destination.href}
              icon={destination.icon}
              onClick={reportNavigation(destination.id)}
            >
              <span className="teal-u-flex teal-u-min-w-0 teal-u-flex-1 teal-u-items-center teal-u-justify-between teal-u-gap-2">
                <span className="teal-u-truncate">{destination.label}</span>
                {destination.status ? (
                  <HealthIndicator className="teal-u-shrink-0" status={destination.status} />
                ) : null}
              </span>
            </SidebarItem>
          ))}
        </SidebarSection>
      </SidebarContent>
      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  )
}
