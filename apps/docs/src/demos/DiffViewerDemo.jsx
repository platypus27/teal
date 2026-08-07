import { DiffViewer } from '@kryv/teal'

const before = ['export function greet(name) {', '  return "Hello " + name', '}'].join('\n')
const after = ['export function greet(name) {', '  const who = name ?? "world"', '  return `Hello ${who}!`', '}'].join('\n')

export function DiffViewerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <DiffViewer
        label="Migration diff"
        lineNumbers={false}
        hunks={[
          { type: 'context', content: '"scripts": {' },
          { type: 'remove', content: '  "test": "jest"' },
          { type: 'add', content: '  "test": "vitest run"' },
          { type: 'context', content: '}' },
        ]}
        className="w-full max-w-lg"
      />
    )
  }

  return <DiffViewer label="greet.js changes" oldValue={before} newValue={after} className="w-full max-w-lg" />
}
