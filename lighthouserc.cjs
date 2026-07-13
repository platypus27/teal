module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview --workspace @kryv/teal-docs -- --host 127.0.0.1',
      startServerReadyPattern: '127.0.0.1:4173',
      url: ['http://127.0.0.1:4173/', 'http://127.0.0.1:4173/modules/field', 'http://127.0.0.1:4173/recipes'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
      },
    },
  },
}
