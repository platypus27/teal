export function PropsTable({ props = [] }) {
  if (!props.length) return null
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-outline-variant/30">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-container text-xs uppercase tracking-wide text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-semibold">Prop</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Default</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30 bg-surface">
          {props.map((p) => (
            <tr key={p.name} className="align-top">
              <td className="monotype px-4 py-3 text-xs font-semibold text-primary">{p.name}</td>
              <td className="monotype px-4 py-3 text-xs text-on-surface-variant">{p.type}</td>
              <td className="monotype px-4 py-3 text-xs text-on-surface-variant">{p.default ?? '—'}</td>
              <td className="px-4 py-3 text-on-surface-variant">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
