// Compile-only compatibility check. The 1.3.0 palette context members must
// stay optional so a consumer that hand-builds or mocks the 1.2.0
// ThemeContextValue still typechecks; the ThemeProvider always supplies both
// values at runtime.
import type { ThemeContextValue } from '../src/ThemeProvider'

const legacyContext: ThemeContextValue = {
  choice: 'system',
  resolved: 'light',
  setChoice: () => {},
}

void legacyContext

export type LegacyContextShape = typeof legacyContext
