export function Preview({ children, label = 'Live example' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container">
      <div className="border-b border-outline-variant/30 px-4 py-2 text-xs font-semibold text-on-surface-variant">{label}</div>
      <div className="docs-grid min-h-40 bg-background p-5 sm:p-8">
        <div className="mx-auto flex min-h-24 max-w-4xl flex-wrap items-center justify-center gap-3">{children}</div>
      </div>
    </div>
  )
}
