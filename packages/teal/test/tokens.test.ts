import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
})
