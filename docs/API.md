# API reference

The module API reference for `@kryv/teal` is generated from JSDoc comments
and TypeScript declarations (via react-docgen-typescript) and is published
with the documentation site:

<https://teal.kryvlabs.com/modules>

Each module page shows its props and interfaces as generated tables with
live examples and playgrounds. The raw generated data lives in
`apps/docs/src/generated/api.json`; regenerate it with:

```bash
npm run generate:api --workspace @kryv/teal-docs
```

The generated interface tables are only as good as the JSDoc on the source —
document every public prop when adding or changing a module. See
[ARCHITECTURE.md](ARCHITECTURE.md) for how the docs pipeline fits together
and [CONTRIBUTING.md](../CONTRIBUTING.md) for the change bar.
