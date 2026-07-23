import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { contrastPairs } from './tokens.generated'

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
    expect(Object.keys(light)).toHaveLength(51)
    expect(Object.keys(dark)).toHaveLength(51)
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

describe('visual system tokens', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/tokens.css'), 'utf8')

  it.each([
    '--teal-radius-control',
    '--teal-radius-surface',
    '--teal-radius-pill',
    '--teal-border-subtle',
    '--teal-border-strong',
    '--teal-focus-ring',
    '--teal-shadow-raised',
    '--teal-shadow-overlay',
    '--teal-icon-xs',
    '--teal-icon-sm',
    '--teal-icon-md',
    '--teal-icon-lg',
    '--teal-icon-xl',
    '--teal-motion-fast',
    '--teal-motion-standard',
  ])('publishes %s as a supported theming hook', (token) => {
    expect(css).toMatch(new RegExp(`${token}:\\s*[^;]+;`))
  })
})
