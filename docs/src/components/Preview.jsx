import { useState } from 'react'
import { CodeBlock } from './CodeBlock.jsx'

export function Preview({ children, code, title }) {
  const [tab, setTab] = useState('preview')

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-outline-variant/30 bg-surface-container">
      <div className="flex items-center justify-between border-b border-outline-variant/30 px-4 py-2">
        <span className="text-xs font-semibold text-on-surface-variant">{title || 'Example'}</span>
        <div className="flex gap-1 rounded-lg bg-surface-container-high p-0.5">
          {['preview', 'code'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                tab === t ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' ? (
        <div className="grid-pattern flex min-h-[120px] items-center justify-center bg-background p-8">
          <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
        </div>
      ) : (
        <CodeBlock code={code} className="rounded-none border-0" />
      )}
    </div>
  )
}
