import { Callout } from '@kryv/teal'

export function CalloutDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex w-full max-w-xl flex-col gap-4">
        <Callout variant="success" title="Import finished">
          All 1,240 records were imported without conflicts.
        </Callout>
        <Callout variant="warning" title="Trial ending soon">
          Your trial ends in 5 days. Add a payment method to keep your workspace active.
        </Callout>
        <Callout variant="danger" title="Deletion is permanent">
          Removing this project deletes all of its environments and cannot be undone.
        </Callout>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl">
      <Callout title="Heads up">
        New pricing starts next month. Your current plan is locked in until the end of the billing cycle.
      </Callout>
    </div>
  )
}
