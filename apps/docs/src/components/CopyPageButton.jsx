import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { IconButton, toast } from '@kryv/teal'

export function CopyPageButton({ markdown }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast({ title: 'Copied page as Markdown', tone: 'success', duration: 2000 })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Could not copy page', tone: 'danger' })
    }
  }

  return (
    <IconButton
      label={copied ? 'Copied page as Markdown' : 'Copy page as Markdown'}
      variant="secondary"
      size="sm"
      onClick={copy}
    >
      {copied ? <Check /> : <Copy />}
    </IconButton>
  )
}
