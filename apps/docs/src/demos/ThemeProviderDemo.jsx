import { Button, ThemeProvider, ThemeToggle, useTheme } from '@kryv/teal'

function ThemeReadout({ showPalette = false }) {
  const { choice, resolved, setChoice, palette = 'safari', setPalette } = useTheme()
  return (
    <div className="space-y-3">
      <p className="text-sm text-teal-on-surface-variant">
        choice: <strong className="text-teal-on-surface">{choice}</strong> · resolved:{' '}
        <strong className="text-teal-on-surface">{resolved}</strong>
        {showPalette ? (
          <>
            {' '}· palette: <strong className="text-teal-on-surface">{palette}</strong>
          </>
        ) : null}
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
        {showPalette && typeof setPalette === 'function' ? (
          <>
            <span className="mx-1 h-5 w-px bg-teal-outline-variant/50" aria-hidden="true" />
            {['safari', 'garden'].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={palette === value ? 'primary' : 'secondary'}
                onClick={() => setPalette(value)}
              >
                {value === 'garden' ? 'Garden' : 'Safari'}
              </Button>
            ))}
          </>
        ) : null}
      </div>
    </div>
  )
}

export function ThemeProviderDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ThemeProvider
        storageKey="teal-docs:theme-demo"
        defaultChoice="light"
        palette="safari"
        paletteStorageKey="teal-docs:palette-demo"
      >
        <div className="space-y-2">
          <ThemeReadout showPalette />
          <p className="text-xs text-teal-on-surface-variant">
            Theme choice persists under teal-docs:theme-demo and palette under teal-docs:palette-demo - reload the page
            and both survive.
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
