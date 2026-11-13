/**
 * Type declarations for token-source.mjs, for the TypeScript tests only.
 * This file intentionally declares just the exports the TypeScript tests
 * import; add declarations when tests import more of token-source.mjs. Keep
 * the declared shapes in sync with the runtime values and run
 * `npm run typecheck` after editing either file.
 */
export type ColorChannels = [number, number, number]

export interface ThemeColor {
  light: ColorChannels
  dark: ColorChannels
}

export interface PaletteModes {
  light: Record<string, ColorChannels>
  dark: Record<string, ColorChannels>
}

export const colorTokens: Record<string, ThemeColor>

export const palettes: Record<string, PaletteModes>
