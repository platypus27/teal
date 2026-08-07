import { CopyButton } from '@kryv/teal'

export function CopyButtonDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-teal-outline-variant/50">
        <div className="flex items-center justify-between bg-teal-surface-container-high px-3 py-1.5">
          <span className="text-xs text-teal-on-surface-variant">install.sh</span>
          <CopyButton iconOnly value="npm install @kryv/teal" label="Copy snippet" copiedLabel="Snippet copied" />
        </div>
        <pre className="px-3 py-2 text-sm">
          <code>npm install @kryv/teal</code>
        </pre>
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-3">
        <code className="rounded-md bg-teal-surface-container-high px-2 py-1 text-sm">sk_live_4eC39HqLyjWDarj</code>
        <CopyButton iconOnly value="sk_live_4eC39HqLyjWDarj" label="Copy API key" copiedLabel="API key copied" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton value="npm install @kryv/teal" label="Copy install command" copiedLabel="Copied" />
      <CopyButton value="npm install @kryv/teal" variant="secondary" size="sm" />
    </div>
  )
}
