# Architecture Decision Records

Architecture decisions for Teal (Kryv design system, `@kryv/teal`). Each ADR
records a decision, its context, and its consequences so future changes are
made against the reasoning that shaped the codebase rather than reverse-
engineering it.

| ADR | Date | Decision |
| --- | ---- | -------- |
| [0001](0001-0.5.1-hard-break-consolidation.md) | 2026-08-14 | Ship 0.5.1 as a hard-break component consolidation |
| [0002](0002-publish-pipeline-builds-before-pack.md) | 2026-09-05 | The publish pipeline must build before packing/publishing |
| [0003](0003-authentik-theming-adapter-retirement.md) | 2026-09-05 | Retire the generated Authentik theming adapter |

## Adding a new ADR

Number sequentially (`NNNN-kebab-case-title.md`), copy the structure of an
existing ADR (Status / Context / Decision / Consequences), and add a row to
the table above. Superseded ADRs stay in place with their status updated.
