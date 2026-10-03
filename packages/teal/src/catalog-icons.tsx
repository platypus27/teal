import { Camera, Gauge, House, LineChart, Sparkles, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Icon names carried by the app-catalog contract (app-catalog-v1) `icon`
 * field for each Kryv product.
 */
export type CatalogIconName =
  | 'house'
  | 'gauge'
  | 'images'
  | 'candlestick-chart'
  | 'sparkles'

/** Stable product identifiers carried by the app-catalog contract `id` field. */
export type CatalogAppId = 'home' | 'yang' | 'photos' | 'trict' | 'twinkle'

/**
 * Anything catalogIcon resolves: a contract icon name or an app id. The
 * `string & {}` union member keeps autocomplete for known keys while letting
 * untyped catalog data through to the documented fallback.
 */
export type CatalogIconKey = CatalogIconName | CatalogAppId | (string & {})

/**
 * The canonical rail glyph for each contract icon name — the icons Home's
 * production rail renders, promoted to the ecosystem standard (ADR-0008).
 * Note the deliberate divergences from the catalog names: `images` renders
 * Camera and `candlestick-chart` renders LineChart, matching Home.
 */
export const CATALOG_ICONS: Record<CatalogIconName, LucideIcon> = {
  house: House,
  gauge: Gauge,
  images: Camera,
  'candlestick-chart': LineChart,
  sparkles: Sparkles,
}

const APP_ICON_NAMES: Record<CatalogAppId, CatalogIconName> = {
  home: 'house',
  yang: 'gauge',
  photos: 'images',
  trict: 'candlestick-chart',
  twinkle: 'sparkles',
}

const warnedUnknownNames = new Set<string>()

/**
 * Resolves a contract icon name or app id to the canonical rail glyph Home
 * uses for it. Unknown names are a compile-time error for typed callers;
 * untyped (runtime) unknowns return undefined and warn once per name outside
 * production, so a catalog entry with an unrecognized icon simply renders
 * without a glyph until the map is extended.
 */
export function catalogIcon(name: CatalogIconKey): ReactNode {
  const iconName = (APP_ICON_NAMES as Record<string, CatalogIconName>)[name] ?? name
  const Icon = (CATALOG_ICONS as Record<string, LucideIcon>)[iconName]
  if (!Icon) {
    if (
      !warnedUnknownNames.has(name)
      && typeof process !== 'undefined'
      && process.env?.NODE_ENV !== 'production'
    ) {
      console.warn(`[@kryv/teal] catalogIcon: no canonical icon for "${name}"`)
    }
    warnedUnknownNames.add(name)
    return undefined
  }
  return <Icon aria-hidden="true" />
}
