# ADR-0006: Prepare for React 20 by migrating to ref-as-prop

- Status: Accepted (migration planned, not yet executed)
- Date: 2026-09-24

## Context

The peer range is `react: ">=18 <20"`. React 19 deprecated `forwardRef` in
favor of passing `ref` as a regular prop to function components; React 20 is
expected to remove `forwardRef` outright. All ~170 Teal components use
`forwardRef` today, so the eventual React 20 support bump is blocked on a
mechanical-but-wide API migration.

`forwardRef` still works in React 19 with no warning at runtime, and the
library's tests run against React 19.

## Decision

Migrate the codebase to the ref-as-prop signature before widening the peer
range, in three steps:

1. **Pilot.** Convert a representative slice (a simple component, a Radix
   wrapper, and one compound-component family) to `ref?: Ref<T>` props declared
   in the props interface, with `ComponentPropsWithRef`-style typing where a
   spread passes `ref` through. The existing ref-forwarding tests must pass
   unchanged — they are the migration's safety net.
2. **Bulk.** Apply the pilot's pattern across the remaining modules in a
   single mechanical commit, still pinned to `react <20` so nothing ships
   half-migrated.
3. **Widen.** Change the peer range to `>=19 <21` (or `>=18` if the ref-as-prop
   signature is proven safe on 18 via a shim release), keep `forwardRef` out of
   the codebase, and cut a major.

The existing `test/ref-forwarding.test.tsx` suite is the contract: it asserts
resolved refs for every public component and must not change in steps 1-2.

## Consequences

- The next major is a peer-range bump plus ref-as-prop internals, invisible to
  consumers who only pass `ref` as JSX — the public usage stays identical.
- Until step 3, `forwardRef` and the `<20` peer range remain the shipped
  reality; this ADR does not authorize a partial migration on main.
- Codemod opportunity: consumer code is unaffected, so no consumer-facing
  codemod is needed for this change.
