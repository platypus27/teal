import { useState } from 'react'

export function CodeBlock({ code, className = '' }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container ${className}`}>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-outline-variant/40 bg-surface px-2 py-1 text-[11px] font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="monotype overflow-x-auto p-4 pr-16 text-xs leading-relaxed text-on-surface">
        <code>{code}</code>
      </pre>
    </div>
  )
}
