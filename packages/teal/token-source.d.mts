/**
 * Type declarations for token-source.mjs so TypeScript tests can import the
 * plain-JS token source. Mirrors the runtime exports; update alongside it.
 */
export type ColorChannels = [number, number, number]

export interface ThemeColor {
  light: ColorChannels
  dark: ColorChannels
}

export const colorTokens: Record<string, ThemeColor>

export const palettes: {
  garden: {
    light: Record<string, ColorChannels>
    dark: Record<string, ColorChannels>
  }
}
