import { JsonViewer } from '@kryv/teal'

const payload = {
  name: 'teal',
  version: 5,
  stable: true,
  license: null,
  tags: ['design', 'system'],
  author: { name: 'Ada Lovelace', active: true },
}

export function JsonViewerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <JsonViewer
        data={payload}
        copyable
        defaultExpandedDepth={3}
        label="Package manifest"
        className="w-full max-w-md"
      />
    )
  }

  return <JsonViewer data={payload} label="Package manifest" className="w-full max-w-md" />
}
