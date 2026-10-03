import { render } from '@testing-library/react'
import { CATALOG_ICONS, catalogIcon, type CatalogAppId, type CatalogIconName } from '../src/catalog-icons'

const CANONICAL_GLYPHS: Record<CatalogIconName, string> = {
  house: 'lucide-house',
  gauge: 'lucide-gauge',
  images: 'lucide-camera',
  'candlestick-chart': 'lucide-chart-line',
  sparkles: 'lucide-sparkles',
}

const APP_TO_ICON_NAME: Record<CatalogAppId, CatalogIconName> = {
  home: 'house',
  yang: 'gauge',
  photos: 'images',
  trict: 'candlestick-chart',
  twinkle: 'sparkles',
}

function renderIcon(name: string) {
  const { container } = render(<>{catalogIcon(name)}</>)
  return container.querySelector('svg')
}

describe('catalogIcon', () => {
  it('returns the canonical Home glyph for every contract catalog icon name', () => {
    for (const [name, glyph] of Object.entries(CANONICAL_GLYPHS)) {
      const svg = renderIcon(name)
      expect(svg, `icon name "${name}"`).toHaveClass(glyph)
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('resolves every catalog app id to the same glyph as its contract icon name', () => {
    for (const [appId, iconName] of Object.entries(APP_TO_ICON_NAME)) {
      const svg = renderIcon(appId)
      expect(svg, `app id "${appId}"`).toHaveClass(CANONICAL_GLYPHS[iconName as CatalogIconName])
    }
  })

  it('covers exactly the five contract catalog entries', () => {
    expect(Object.keys(CATALOG_ICONS).sort()).toEqual([
      'candlestick-chart',
      'gauge',
      'house',
      'images',
      'sparkles',
    ])
  })

  it('returns undefined and warns once for an unknown name (documented fallback)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(catalogIcon('no-such-app')).toBeUndefined()
    expect(catalogIcon('no-such-app')).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no-such-app'))
  })
})
