import { MarkdownView } from '@kryv/teal'

const releaseNotes = [
  '## Release 2.4.0',
  '',
  'This release ships the **parser rewrite** and a *faster* token stream.',
  '',
  '- Merge conflict detection',
  '- Inline `diff` rendering',
  '- Keyboard-first navigation',
  '',
  '> Please keep the public API unchanged for this release.',
  '',
  'See the [migration guide](https://example.com/migrate) for details.',
].join('\n')

const withCode = [
  '### Usage',
  '',
  'Import the component and pass a string:',
  '',
  '```',
  'import { MarkdownView } from "@kryv/teal"',
  '',
  '<MarkdownView content={notes} />',
  '```',
  '',
  'Raw HTML like <script>alert(1)</script> is rendered as text.',
].join('\n')

export function MarkdownViewDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return <MarkdownView content={withCode} className="w-full max-w-lg" />
  }

  return <MarkdownView content={releaseNotes} className="w-full max-w-lg" />
}
