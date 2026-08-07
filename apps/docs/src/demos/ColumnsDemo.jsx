import { Columns } from '@kryv/teal'

const features = ['Single sign-on', 'Audit log', 'Custom roles', 'Usage reports', 'Data export', 'Priority support']

export function ColumnsDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Columns columns={2} gap={6} className="w-full">
        {features.slice(0, 4).map((feature) => (
          <div key={feature} className="rounded-xl bg-teal-surface-container p-4">
            <p className="text-sm font-semibold text-teal-on-surface">{feature}</p>
            <p className="mt-1 text-sm text-teal-on-surface-variant">Included on every plan.</p>
          </div>
        ))}
      </Columns>
    )
  }

  return (
    <Columns columns={3} gap={3} className="w-full">
      {features.map((feature) => (
        <span key={feature} className="rounded-lg border border-teal-outline-variant/50 px-3 py-3 text-center text-sm">
          {feature}
        </span>
      ))}
    </Columns>
  )
}
