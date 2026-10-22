import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { contrastPairs } from './tokens.generated'
import { palettes, colorTokens } from '../token-source.mjs'

function channel(value: number) {
  const normalized = value / 255
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(rgb: number[]) {
  return channel(rgb[0] ?? 0) * 0.2126 + channel(rgb[1] ?? 0) * 0.7152 + channel(rgb[2] ?? 0) * 0.0722
}

function contrast(first: number[], second: number[]) {
  const lighter = Math.max(luminance(first), luminance(second))
  const darker = Math.min(luminance(first), luminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

function composite(foreground: number[] | undefined, background: number[] | undefined, opacity: number) {
  return [0, 1, 2].map((index) =>
    Math.round((foreground?.[index] ?? 0) * opacity + (background?.[index] ?? 0) * (1 - opacity)),
  )
}

function variables(block: string) {
  return Object.fromEntries(
    [...block.matchAll(/--(teal-color-[\w-]+):\s*rgb\(\s*([0-9]+)\s+([0-9]+)\s+([0-9]+)\s*\);/g)].map((match) => [
      match[1],
      [Number(match[2]), Number(match[3]), Number(match[4])],
    ]),
  )
}

describe('semantic color tokens', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/tokens.css'), 'utf8')
  const light = variables(css.match(/:root\s*{([\s\S]*?)\n}/)?.[1] ?? '')
  const dark = variables(css.match(/html\.dark\s*{([\s\S]*?)\n}/)?.[1] ?? '')
  const expectedContrastPairs = [
    ['teal-color-on-surface', 'teal-color-surface'],
    ['teal-color-on-surface-variant', 'teal-color-surface-variant'],
    ['teal-color-on-background', 'teal-color-background'],
    ['teal-color-on-primary', 'teal-color-primary'],
    ['teal-color-on-primary-container', 'teal-color-primary-container'],
    ['teal-color-on-primary-fixed', 'teal-color-primary-fixed'],
    ['teal-color-on-primary-fixed-variant', 'teal-color-primary-fixed-dim'],
    ['teal-color-on-secondary', 'teal-color-secondary'],
    ['teal-color-on-secondary-container', 'teal-color-secondary-container'],
    ['teal-color-on-secondary-fixed', 'teal-color-secondary-fixed'],
    ['teal-color-on-secondary-fixed-variant', 'teal-color-secondary-fixed-dim'],
    ['teal-color-on-tertiary', 'teal-color-tertiary'],
    ['teal-color-on-tertiary-container', 'teal-color-tertiary-container'],
    ['teal-color-on-tertiary-fixed', 'teal-color-tertiary-fixed'],
    ['teal-color-on-tertiary-fixed-variant', 'teal-color-tertiary-fixed-dim'],
    ['teal-color-on-error', 'teal-color-error'],
    ['teal-color-on-error-container', 'teal-color-error-container'],
    ['teal-color-inverse-on-surface', 'teal-color-inverse-surface'],
    ['teal-color-inverse-primary', 'teal-color-inverse-surface'],
  ] as const

  it('publishes complete namespaced CSS colors without legacy channel tokens', () => {
    expect(Object.keys(light)).toHaveLength(57)
    expect(Object.keys(dark)).toHaveLength(57)
    expect(css).not.toMatch(/--color-[\w-]+:/)
  })

  it('declares every supported semantic foreground and background pair', () => {
    expect(contrastPairs).toEqual(expectedContrastPairs)
  })

  it.each(contrastPairs)('%s and %s are defined in both themes', (foreground, background) => {
    expect(light[foreground]).toBeDefined()
    expect(light[background]).toBeDefined()
    expect(dark[foreground]).toBeDefined()
    expect(dark[background]).toBeDefined()
  })

  it.each([
    ...expectedContrastPairs.flatMap(([foreground, background]) => [
      [`light ${foreground}`, light[foreground], light[background]],
      [`dark ${foreground}`, dark[foreground], dark[background]],
    ]),
    ['light warning text', light['teal-color-warning'], composite(light['teal-color-warning'], light['teal-color-surface-container'], 0.1)],
    ['dark warning text', dark['teal-color-warning'], composite(dark['teal-color-warning'], dark['teal-color-surface-container'], 0.1)],
    ['light tertiary text', light['teal-color-tertiary'], composite(light['teal-color-tertiary'], light['teal-color-surface-container'], 0.1)],
    ['dark tertiary text', dark['teal-color-tertiary'], composite(dark['teal-color-tertiary'], dark['teal-color-surface-container'], 0.1)],
  ])('%s meets WCAG AA for normal text', (_name, foreground, background) => {
    expect(contrast(foreground ?? [], background ?? [])).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['light strong control border', light['teal-color-outline'], light['teal-color-surface']],
    ['light focus indicator', light['teal-color-primary'], light['teal-color-surface']],
    ['dark strong control border', dark['teal-color-outline'], dark['teal-color-surface']],
    ['dark focus indicator', dark['teal-color-primary'], dark['teal-color-surface']],
  ])('%s meets WCAG non-text contrast', (_name, foreground, background) => {
    expect(contrast(foreground ?? [], background ?? [])).toBeGreaterThanOrEqual(3)
  })
})

describe('garden palette', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/tokens.css'), 'utf8')
  const defaultLight = variables(css.match(/:root\s*{([\s\S]*?)\n}/)?.[1] ?? '')
  const defaultDark = variables(css.match(/html\.dark\s*{([\s\S]*?)\n}/)?.[1] ?? '')
  const lightBlock = css.match(/:root:not\(\.dark\)\[data-palette='garden'\]\s*{([\s\S]*?)\n}/)?.[1] ?? ''
  const darkBlock = css.match(/html\.dark\[data-palette='garden'\]\s*{([\s\S]*?)\n}/)?.[1] ?? ''
  const garden = palettes.garden

  test('overrides only known color tokens', () => {
    const known = new Set(Object.keys(colorTokens))
    expect(garden).toBeDefined()
    if (garden === undefined) return
    for (const mode of ['light', 'dark'] as const) {
      for (const key of Object.keys(garden[mode])) {
        expect(known.has(key)).toBe(true)
      }
    }
  })

  test('every override is an rgb channel triple', () => {
    for (const modes of Object.values(palettes)) {
      for (const mode of ['light', 'dark'] as const) {
        for (const value of Object.values(modes[mode])) {
          expect(value).toHaveLength(3)
          for (const channel of value) {
            expect(Number.isInteger(channel)).toBe(true)
            expect(channel).toBeGreaterThanOrEqual(0)
            expect(channel).toBeLessThanOrEqual(255)
          }
        }
      }
    }
  })

  test('generated css scopes overrides behind data-palette without leaking light into dark', () => {
    expect(css).toContain(":root:not(.dark)[data-palette='garden']")
    expect(css).toContain("html.dark[data-palette='garden']")
    expect(css).not.toContain(":root[data-palette='garden']")
  })

  test('generated blocks contain exactly the intended overrides', () => {
    expect(variables(lightBlock)).toEqual({
      'teal-color-surface': [250, 249, 244],
      'teal-color-primary': [27, 94, 32],
    })
    expect(variables(darkBlock)).toEqual({
      'teal-color-surface': [22, 28, 24],
      'teal-color-primary': [129, 199, 132],
    })
  })

  test('generated palette blocks come after the default light and dark blocks', () => {
    const defaultLightIndex = css.indexOf('\n:root {')
    const defaultDarkIndex = css.indexOf('\nhtml.dark {')
    const gardenLightIndex = css.indexOf(":root:not(.dark)[data-palette='garden']")
    const gardenDarkIndex = css.indexOf("html.dark[data-palette='garden']")
    expect(defaultLightIndex).toBeGreaterThan(-1)
    expect(defaultDarkIndex).toBeGreaterThan(defaultLightIndex)
    expect(gardenLightIndex).toBeGreaterThan(defaultDarkIndex)
    expect(gardenDarkIndex).toBeGreaterThan(gardenLightIndex)
  })

  /* The palette's composed states are part of its AA contract: primary is used
     as text (Badge, Sidebar, TreeSelect, Command) directly on surfaces and on
     primary/10 or /15 tints of them, so gating only the raw token pairs would
     miss the states users actually see. */
  const gardenTokens = {
    light: { ...defaultLight, ...(garden?.light ?? {}) },
    dark: { ...defaultDark, ...(garden?.dark ?? {}) },
  }
  const aaProbes: Array<[string, number[], number[]]> = []
  for (const mode of ['light', 'dark'] as const) {
    const tokens = gardenTokens[mode]
    const primary = tokens['teal-color-primary'] ?? []
    const background = tokens['teal-color-background'] ?? []
    const surface = tokens['teal-color-surface'] ?? []
    const surfaceHigh = tokens['teal-color-surface-container-high'] ?? []
    aaProbes.push(
      [`${mode} on-primary on primary`, tokens['teal-color-on-primary'] ?? [], primary],
      [`${mode} on-surface on surface`, tokens['teal-color-on-surface'] ?? [], surface],
      [`${mode} primary on background`, primary, background],
      [`${mode} primary on surface`, primary, surface],
      [`${mode} primary on surface-container-high`, primary, surfaceHigh],
      [`${mode} primary on primary/10 over background`, primary, composite(primary, background, 0.1)],
      [`${mode} primary on primary/15 over background`, primary, composite(primary, background, 0.15)],
      [`${mode} primary on primary/10 over surface`, primary, composite(primary, surface, 0.1)],
      [`${mode} primary on primary/15 over surface`, primary, composite(primary, surface, 0.15)],
    )
  }

  it.each(aaProbes)('garden %s meets WCAG AA for normal text', (_name, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5)
  })
})

describe('visual system tokens', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/tokens.css'), 'utf8')

  it.each([
    '--teal-radius-control',
    '--teal-radius-surface',
    '--teal-radius-xl',
    '--teal-radius-pill',
    '--teal-border-subtle',
    '--teal-border-strong',
    '--teal-focus-ring',
    '--teal-shadow-raised',
    '--teal-shadow-overlay',
    '--teal-shadow-voxel',
    '--teal-icon-xs',
    '--teal-icon-sm',
    '--teal-icon-md',
    '--teal-icon-lg',
    '--teal-icon-xl',
    '--teal-motion-fast',
    '--teal-motion-standard',
    '--teal-motion-med',
    '--teal-motion-slow',
    '--teal-motion-ease',
  ])('publishes %s as a supported theming hook', (token) => {
    expect(css).toMatch(new RegExp(`${token}:\\s*[^;]+;`))
  })
})
