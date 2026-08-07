import { LogViewer } from '@kryv/teal'

/** @type {import('@kryv/teal').LogLine[]} */
const lines = [
  { id: '1', level: 'info', message: 'build started (node 20, linux x64)', timestamp: '10:00:01' },
  { id: '2', level: 'info', message: 'installed 412 packages in 8.2s', timestamp: '10:00:09' },
  { id: '3', level: 'warn', message: 'bundle size exceeds budget by 12 kB', timestamp: '10:00:31' },
  { id: '4', level: 'error', message: 'type check failed: src/parser.ts:118', timestamp: '10:00:33' },
  { id: '5', level: 'debug', message: 'retrying with cache disabled', timestamp: '10:00:34' },
]

export function LogViewerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <LogViewer
        label="CI logs"
        lines={lines}
        search="cache"
        defaultFollow={false}
        className="w-full max-w-xl"
      />
    )
  }

  return <LogViewer label="Deploy logs" lines={lines} className="w-full max-w-xl" />
}
