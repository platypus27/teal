module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview --workspace @kryv/teal-docs -- --host 127.0.0.1',
      startServerReadyPattern: '127.0.0.1:4173',
      // Three URLs on purpose: every module page shares the ModulePage
      // template, so / (shell), /modules/field (heaviest page shape), and
      // /recipes (content page) are the representative surfaces.
      url: ['http://127.0.0.1:4173/', 'http://127.0.0.1:4173/modules/field', 'http://127.0.0.1:4173/recipes'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // Accessibility regressions fail CI outright; the docs axe suite backs
        // this up page-by-page in the Playwright job.
        'categories:accessibility': ['error', { minScore: 1 }],
        // Deliberately warn-only (ADR-worthy trade recorded here rather than
        // in docs/adr): Lighthouse performance on shared CI runners varies
        // run-to-run by more than the 0.1 margin below the gate, so an error
        // assertion would flake PRs without signaling a real regression.
        // Local reproduce with `npx @lhci/cli autorun` before and after any
        // change that touches the docs bundle.
        'categories:performance': ['warn', { minScore: 0.9 }],
      },
    },
  },
}
