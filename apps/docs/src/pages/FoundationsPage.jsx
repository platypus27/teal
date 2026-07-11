import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from '@kryv/teal'
import { Page, Section } from '../components/Page.jsx'
import { colorTokens, shapeNotes, typeTokens } from '../data/foundations.js'
import { foundationsMarkdown } from '../lib/markdown.js'

const shapeStyles = [
  'rounded-xl bg-surface-container-high',
  'rounded-2xl bg-surface-container shadow-[var(--teal-shadow-card)]',
  'rounded-2xl border border-outline-variant/30',
]

function useCopyToken() {
  const [copied, setCopied] = useState(null)
  async function copy(token) {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(token)
      toast({ title: `Copied ${token}`, tone: 'success', duration: 2000 })
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      toast({ title: 'Could not copy token', tone: 'danger' })
    }
  }
  return { copied, copy }
}

export function FoundationsPage() {
  const { copied, copy } = useCopyToken()

  return (
    <Page
      title="Foundations"
      eyebrow="Design language"
      description="Semantic tokens keep visual decisions consistent across themes and products."
      markdown={foundationsMarkdown()}
    >
      <Section title="Color" description="Use semantic roles instead of raw palette values. Select a swatch to copy its token.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colorTokens.map(({ name, token, bg, fg }) => (
            <button
              key={name}
              type="button"
              onClick={() => copy(token)}
              className={`${bg} ${fg} group flex h-32 flex-col justify-end rounded-2xl border border-outline-variant/20 p-4 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-bold">{name}</span>
                {copied === token ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <Copy aria-hidden="true" className="size-4 opacity-0 transition group-hover:opacity-70" />
                )}
              </span>
              <span className="mt-1 font-mono text-[11px] opacity-80">{token}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Typography" description="Select a token to copy it.">
        <div className="space-y-5 rounded-2xl border border-outline-variant/30 bg-surface-container p-6">
          <p className="font-headline text-4xl font-extrabold">Display heading</p>
          <p className="font-headline text-2xl font-bold">Section heading</p>
          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Body copy uses Manrope with relaxed line height. Headlines use Plus Jakarta Sans to create clear
            hierarchy without decorative weight.
          </p>
          <div className="flex flex-wrap gap-2 border-t border-outline-variant/30 pt-5">
            {typeTokens.map(({ token, label, className }) => (
              <button
                key={token}
                type="button"
                onClick={() => copy(token)}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className={`${className} font-semibold text-on-surface`}>{label}</span>
                <span className="font-mono text-on-surface-variant">{token}</span>
                {copied === token ? (
                  <Check aria-hidden="true" className="size-3.5 text-primary" />
                ) : (
                  <Copy aria-hidden="true" className="size-3.5 text-on-surface-variant" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Shape, elevation, and motion">
        <div className="grid gap-4 sm:grid-cols-3">
          {shapeNotes.map((note, index) => (
            <div key={note} className={`${shapeStyles[index]} p-5`}>
              {note}
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
