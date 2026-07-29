import { CopyButton } from '@kryv/teal'

export function CopyButtonDemo({ exampleIndex = 0 }) {
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
