import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import { toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

// jest-dom is installed at the workspace root while vitest resolves inside
// packages/teal, so the package's own vitest.d.ts augmentation does not reach
// this project's vitest types; mirror it here (types only, runtime matchers
// are registered by the import above).
declare module 'vitest' {
  interface Assertion<R, T> extends TestingLibraryMatchers<T, R> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
  interface Matchers<R, T> {
    toHaveNoViolations(): R
  }
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false
  HTMLElement.prototype.setPointerCapture = () => undefined
  HTMLElement.prototype.releasePointerCapture = () => undefined
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => undefined
}
