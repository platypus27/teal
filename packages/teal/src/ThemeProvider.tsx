import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme } from './ThemeToggle'

/** The stored 3-way theme preference; 'system' tracks prefers-color-scheme. */
export type ThemeChoice = Theme | 'system'

export interface ThemeProviderProps {
  children: ReactNode
  /** Choice applied when nothing is persisted yet; defaults to 'system'. */
  defaultChoice?: ThemeChoice
  /** localStorage key the choice is persisted under; defaults to 'kryv:theme'. */
  storageKey?: string
  /** Palette applied when nothing is persisted yet; defaults to 'safari', the attribute-free default. */
  palette?: string
  /** localStorage key the palette is persisted under; defaults to 'kryv:palette'. */
  paletteStorageKey?: string
}

export interface ThemeContextValue {
  /** The stored preference: light, dark, or system. */
  choice: ThemeChoice
  /** The effective theme after resolving 'system' against prefers-color-scheme. */
  resolved: Theme
  /** Update the preference, apply it to the document root, and persist it. */
  setChoice: (choice: ThemeChoice) => void
  /**
   * The active named palette. 'safari' is the default and has no data-palette
   * attribute; every other value is applied verbatim, so unknown palette names
   * render with the default tokens. Optional in the type so contexts built
   * against Teal 1.2.0 remain valid; ThemeProvider always supplies it.
   */
  palette?: string
  /**
   * Update the palette, apply it to the document root, and persist it. Optional
   * in the type for the same 1.2.0 compatibility reason; gate palette
   * affordances on its presence when an application supports older Teal.
   */
  setPalette?: (palette: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const choices: ThemeChoice[] = ['light', 'dark', 'system']

const DEFAULT_PALETTE = 'safari'

function readStoredChoice(storageKey: string): ThemeChoice | null {
  try {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem(storageKey)
    return choices.includes(stored as ThemeChoice) ? (stored as ThemeChoice) : null
  } catch {
    return null
  }
}

function persistChoice(storageKey: string, choice: ThemeChoice) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, choice)
  } catch {
    // Storage can be unavailable (private mode, disabled cookies); the theme
    // still applies for the session.
  }
}

function readStoredPalette(storageKey: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function persistPalette(storageKey: string, palette: string) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, palette)
  } catch {
    // Storage can be unavailable (private mode, disabled cookies); the palette
    // still applies for the session.
  }
}

function systemTheme(): Theme {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * Owns the ecosystem-wide theme preference: a 3-way light/dark/system choice,
 * persisted to localStorage and applied as the 'dark' class on the document
 * root (the ADR 0004 theming contract), plus the active named palette (ADR
 * 0010), applied as the data-palette attribute that scopes generated palette
 * overrides. Theme mode and palette stay separate: the default 'safari'
 * palette removes the attribute entirely. Wrap each application once, near
 * the root, and read the state with useTheme.
 */
export function ThemeProvider({
  children,
  defaultChoice = 'system',
  storageKey = 'kryv:theme',
  palette: paletteProp = DEFAULT_PALETTE,
  paletteStorageKey = 'kryv:palette',
}: ThemeProviderProps) {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => readStoredChoice(storageKey) ?? defaultChoice)
  const [system, setSystem] = useState<Theme>(systemTheme)
  const [palette, setPaletteState] = useState<string>(() => readStoredPalette(paletteStorageKey) ?? paletteProp)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystem(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const resolved: Theme = choice === 'system' ? system : choice

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [resolved])

  useEffect(() => {
    if (palette === DEFAULT_PALETTE) {
      delete document.documentElement.dataset.palette
    } else {
      document.documentElement.dataset.palette = palette
    }
  }, [palette])

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next)
      persistChoice(storageKey, next)
    },
    [storageKey],
  )

  const setPalette = useCallback(
    (next: string) => {
      setPaletteState(next)
      persistPalette(paletteStorageKey, next)
    },
    [paletteStorageKey],
  )

  return (
    <ThemeContext.Provider value={{ choice, resolved, setChoice, palette, setPalette }}>{children}</ThemeContext.Provider>
  )
}

/**
 * Read the theme state from the nearest ThemeProvider. Throws when there is
 * none, because silently diverging document state is worse than a loud error.
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (value === null) throw new Error('useTheme must be used within a ThemeProvider')
  return value
}

/**
 * Internal escape hatch for components that work both inside and outside a
 * provider (ThemeToggle keeps its uncontrolled behavior when absent).
 */
export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext)
}
