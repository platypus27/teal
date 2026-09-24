---
'@kryv/teal-codemod': minor
---

Initial release: an AST-position-preserving codemod for the 0.5.1 component
consolidation. Renames removed component tags and @kryv/teal imports to their
consolidated replacements, inserts required constant attributes, and prints
manual follow-ups for prop restructures. Run with
`npx @kryv/teal-codemod <file-or-directory>...` on a clean working tree.
