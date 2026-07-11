export function PropsTable({ props }) {
  if (!props?.length) return <p className="text-sm text-on-surface-variant">This module forwards native element properties.</p>
  return (
    <div role="region" aria-label="Module properties" tabIndex={0} className="overflow-x-auto rounded-2xl border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <table className="min-w-[42rem] w-full border-collapse text-left text-sm">
        <thead className="bg-surface-container-high text-xs uppercase tracking-wide text-on-surface-variant">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Default</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/25 bg-surface-container">
          {props.map((prop) => (
            <tr key={prop.name}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                {prop.name}{prop.required ? <span className="text-error"> *</span> : null}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{prop.defaultValue || 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
