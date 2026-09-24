# @kryv/teal-codemod

## 0.1.0

### Minor Changes

- 8b83cce: Initial release: an AST-position-preserving codemod for the 0.5.1 component
  consolidation. Renames removed component tags and @kryv/teal imports to their
  consolidated replacements, inserts required constant attributes, and prints
  manual follow-ups for prop restructures. Run with
  `npx @kryv/teal-codemod <file-or-directory>...` on a clean working tree.
