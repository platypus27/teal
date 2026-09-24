import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Evaluated happy-dom (2026-09): ~7x faster wall clock but breaks the axe
    // overlay sweep and several Radix-driven behaviors (12 failures) — jsdom's
    // fidelity is load-bearing, so the speed trade stays rejected.
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // Barrel re-exports and shared scaffolding inflate per-file numbers
      // without adding behavior worth counting.
      exclude: ['src/index.ts', 'src/menu-items.tsx', 'src/field-scaffolding.tsx'],
      reporter: ['text-summary', 'html'],
      // Ratchet: keep slightly under the measured baseline (92/85/96/95) so
      // regressions fail CI while normal churn does not. Raise after adding tests.
      thresholds: {
        statements: 91,
        branches: 84,
        functions: 95,
        lines: 94,
      },
    },
  },
})
