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
| [0004](0004-class-based-theming-contract.md) | 2026-09-24 | Keep theming class-based and explicit about system preference |
| [0005](0005-esm-only-package.md) | 2026-09-24 | Ship the package as ESM-only |
| [0006](0006-react-20-ref-as-prop.md) | 2026-09-24 | Prepare for React 20 by migrating to ref-as-prop |
| [0007](0007-voxel-world-palette.md) | 2026-10-01 | Adopt the voxel-world palette for Teal 1.0 |

## Adding a new ADR

Number sequentially (`NNNN-kebab-case-title.md`), copy the structure of an
existing ADR (Status / Context / Decision / Consequences), and add a row to
the table above. Superseded ADRs stay in place with their status updated.
