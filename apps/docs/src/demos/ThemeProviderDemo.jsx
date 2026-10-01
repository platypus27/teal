import { Button, ThemeProvider, ThemeToggle, useTheme } from '@kryv/teal'

function ThemeReadout() {
  const { choice, resolved, setChoice } = useTheme()
  return (
    <div className="space-y-3">
      <p className="text-sm text-teal-on-surface-variant">
        choice: <strong className="text-teal-on-surface">{choice}</strong> · resolved:{' '}
        <strong className="text-teal-on-surface">{resolved}</strong>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {/** @type {import('@kryv/teal').ThemeChoice[]} */ (['light', 'dark', 'system']).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={choice === value ? 'primary' : 'secondary'}
            onClick={() => setChoice(value)}
          >
            {value}
          </Button>
        ))}
        <span className="mx-1 h-5 w-px bg-teal-outline-variant/50" aria-hidden="true" />
        <ThemeToggle />
      </div>
    </div>
  )
}

export function ThemeProviderDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ThemeProvider storageKey="teal-docs:theme-demo" defaultChoice="light">
        <div className="space-y-2">
          <ThemeReadout />
          <p className="text-xs text-teal-on-surface-variant">
            Persisted under teal-docs:theme-demo — reload the page and the choice survives.
          </p>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="space-y-2">
        <ThemeReadout />
        <p className="text-xs text-teal-on-surface-variant">
          The provider owns the dark class on the document root; ThemeToggle inside it flips the stored choice.
        </p>
      </div>
    </ThemeProvider>
  )
}
