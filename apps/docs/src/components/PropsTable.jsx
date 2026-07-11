import { Link } from 'lucide-react'
import { mergePropDocs } from '../data/prop-docs.js'

export function PropsTable({ name, props }) {
  const rows = mergePropDocs(name, props)
  if (!rows.length) {
    return <p className="text-sm text-on-surface-variant">This module forwards native element properties.</p>
  }
  return (
    <div
      role="region"
      aria-label={`${name} properties`}
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
        <thead className="bg-surface-container-high text-xs uppercase tracking-wide text-on-surface-variant">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Default</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/25 bg-surface-container">
          {rows.map((prop) => {
            const anchorId = `${name}-${prop.name}`.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-')
            return (
              <tr key={prop.name} id={anchorId} className="scroll-mt-24">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                  <a href={`#${anchorId}`} className="group inline-flex items-center gap-1.5 hover:underline">
                    {prop.name}
                    {prop.required ? <span className="text-error">*</span> : null}
                    <Link
                      aria-hidden="true"
                      className="size-3 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{prop.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{prop.defaultValue || '-'}</td>
                <td className="px-4 py-3 text-xs leading-relaxed text-on-surface-variant">{prop.description || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
