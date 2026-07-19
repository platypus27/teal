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
    [...block.matchAll(/--([\w-]+):\s*([0-9]+)\s+([0-9]+)\s+([0-9]+);/g)].map((match) => [
      match[1],
      [Number(match[2]), Number(match[3]), Number(match[4])],
    ]),
  )
}

describe('semantic color tokens', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/tokens.css'), 'utf8')
  const light = variables(css.match(/:root\s*{([\s\S]*?)\n}/)?.[1] ?? '')
  const dark = variables(css.match(/html\.dark\s*{([\s\S]*?)\n}/)?.[1] ?? '')

  it.each(contrastPairs)('%s and %s are defined in both themes', (foreground, background) => {
    expect(light[foreground]).toBeDefined()
    expect(light[background]).toBeDefined()
    expect(dark[foreground]).toBeDefined()
    expect(dark[background]).toBeDefined()
  })

  it.each([
    ['light secondary text', light['color-on-surface-variant'], light['color-background']],
    ['light primary action', light['color-on-primary'], light['color-primary']],
    ['light success text', light['color-tertiary'], light['color-surface-container']],
    ['light warning text', light['color-warning'], composite(light['color-warning'], light['color-surface-container'], 0.1)],
    ['light danger text', light['color-error'], light['color-background']],
    ['light danger action hover', light['color-on-error'], light['color-error-dim']],
    ['dark secondary text', dark['color-on-surface-variant'], dark['color-background']],
    ['dark primary action', dark['color-on-primary'], dark['color-primary']],
    ['dark success text', dark['color-tertiary'], dark['color-surface-container']],
    ['dark warning text', dark['color-warning'], composite(dark['color-warning'], dark['color-surface-container'], 0.1)],
    ['dark danger text', dark['color-error'], dark['color-background']],
    ['dark danger action hover', dark['color-on-error'], dark['color-error-dim']],
  ])('%s meets WCAG AA for normal text', (_name, foreground, background) => {
    expect(contrast(foreground ?? [], background ?? [])).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['light strong control border', light['color-outline'], light['color-surface']],
    ['light focus indicator', light['color-primary'], light['color-surface']],
    ['dark strong control border', dark['color-outline'], dark['color-surface']],
    ['dark focus indicator', dark['color-primary'], dark['color-surface']],
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
