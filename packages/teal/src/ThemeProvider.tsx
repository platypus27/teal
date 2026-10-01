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
}

export interface ThemeContextValue {
  /** The stored preference: light, dark, or system. */
  choice: ThemeChoice
  /** The effective theme after resolving 'system' against prefers-color-scheme. */
  resolved: Theme
  /** Update the preference, apply it to the document root, and persist it. */
  setChoice: (choice: ThemeChoice) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const choices: ThemeChoice[] = ['light', 'dark', 'system']

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

function systemTheme(): Theme {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * Owns the ecosystem-wide theme preference: a 3-way light/dark/system choice,
 * persisted to localStorage and applied as the 'dark' class on the document
 * root (the ADR 0004 theming contract). Wrap each application once, near the
 * root, and read the state with useTheme.
 */
export function ThemeProvider({ children, defaultChoice = 'system', storageKey = 'kryv:theme' }: ThemeProviderProps) {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => readStoredChoice(storageKey) ?? defaultChoice)
  const [system, setSystem] = useState<Theme>(systemTheme)

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

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next)
      persistChoice(storageKey, next)
    },
    [storageKey],
  )

  return <ThemeContext.Provider value={{ choice, resolved, setChoice }}>{children}</ThemeContext.Provider>
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
