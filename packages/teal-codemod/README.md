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

The codemod is a private workspace package: it is not published to npm. Run it
from a checkout of the Teal repository, pointing it at your application's
sources:

```sh
git clone --depth 1 https://github.com/platypus27/teal.git
npm ci --prefix teal --workspace @kryv/teal-codemod
node teal/packages/teal-codemod/cli.mjs <file-or-directory>...
```

Inside the Teal workspace itself, `npx teal-codemod <file-or-directory>...`
runs the linked workspace copy.

Run it on a clean working tree so you can review the rewrite with `git diff`.
