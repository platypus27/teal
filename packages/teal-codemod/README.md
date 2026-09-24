# @kryv/teal-codemod

Codemods for migrating `@kryv/teal` across breaking releases. Rewrites removed
component tags and `@kryv/teal` import specifiers to their consolidated
replacements, inserting the constant attributes the replacements need
(`PulseDot` → `<StatusDot pulse />`, `SegmentedControl` → `<ToggleGroup
variant="segmented" />`, ...). Edits are applied by AST position, so all other
formatting, comments, and code stay untouched. Cases that need prop
restructuring (DatePicker modes, Dialog placement, Slider range values) are
listed as manual follow-ups after the run.

## Usage

```sh
npx @kryv/teal-codemod@latest <file-or-directory>...
```

Run it on a clean working tree so you can review the rewrite with `git diff`.
