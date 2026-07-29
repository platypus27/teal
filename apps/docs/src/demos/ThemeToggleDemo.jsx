import { useState } from 'react'
import { ThemeToggle } from '@kryv/teal'

export function ThemeToggleDemo({ exampleIndex = 0 }) {
  const [theme, setTheme] = useState('light')

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle onChange={setTheme} />
        <span className="text-sm text-teal-on-surface-variant">
          onChange reported: {theme} — persist this in your app shell.
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <span className="text-sm text-teal-on-surface-variant">Toggles the dark class on the document root.</span>
    </div>
  )
}
