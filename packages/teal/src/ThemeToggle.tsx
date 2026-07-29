import { forwardRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export type Theme = 'light' | 'dark'

export interface ThemeToggleProps {
  /** Accessible label for the button; defaults to 'Toggle dark mode'. */
  label?: string
  /** Called with the new theme after toggling; the app is responsible for persisting it. */
  onChange?: (theme: Theme) => void
  className?: string
}

const iconClasses =
  'teal-u-absolute teal-u-transition-opacity teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none'

/** Toggles the 'dark' class on the document root to switch between light and dark themes. */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { className, label = 'Toggle dark mode', onChange },
  ref,
) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const dark = theme === 'dark'

  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setTheme(next)
    onChange?.(next)
  }

  return (
    <IconButton
      ref={ref}
      label={label}
      aria-pressed={dark}
      onClick={toggle}
      className={cn('teal-u-relative teal-u-overflow-hidden', className)}
    >
      <Sun aria-hidden="true" className={cn(iconClasses, dark ? 'teal-u-opacity-0' : 'teal-u-opacity-100')} />
      <Moon aria-hidden="true" className={cn(iconClasses, dark ? 'teal-u-opacity-100' : 'teal-u-opacity-0')} />
    </IconButton>
  )
})
