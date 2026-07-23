import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { IconButton, toast } from '@kryv/teal'
import { highlight } from '../lib/highlight.js'

export function CodeBlock({ code, lang = 'jsx', label = undefined }) {
  const [copied, setCopied] = useState(false)
  const html = highlight(code, lang)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.replace(/^\n+|\n+$/g, ''))
      setCopied(true)
      toast({ title: 'Copied to clipboard', variant: 'success', duration: 2000 })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Could not copy code', variant: 'danger' })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container">
      <div className="flex items-center justify-between border-b border-teal-outline-variant/30 px-4 py-2">
        <span className="font-mono text-xs font-semibold text-teal-on-surface-variant">{label ?? lang}</span>
        <IconButton label={copied ? 'Copied' : 'Copy code'} size="sm" variant="ghost" onClick={copy}>
          {copied ? <Check /> : <Copy />}
        </IconButton>
      </div>
      <pre
        role="region"
        aria-label={`${label ?? lang} code`}
        tabIndex={0}
        className={`language-${lang} docs-code overflow-x-auto p-4 text-[13px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-primary`}
      >
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
