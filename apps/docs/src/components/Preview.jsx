export function Preview({ children }) {
  return (
    <div className="docs-grid min-h-40 rounded-2xl border border-teal-outline-variant/30 bg-teal-background p-5 sm:p-8">
      <div className="mx-auto flex min-h-24 max-w-4xl flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  )
}
