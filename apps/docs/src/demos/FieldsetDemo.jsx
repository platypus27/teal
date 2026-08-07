import { Checkbox, Field, Fieldset, Input } from '@kryv/teal'

export function FieldsetDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Fieldset
        className="w-full max-w-md"
        legend="Notification channels"
        description="Choose how the workspace reaches you"
      >
        <Checkbox label="Email digest" description="A weekly summary of activity" defaultChecked />
        <Checkbox label="Mentions" description="Only when someone tags you" />
      </Fieldset>
    )
  }

  return (
    <Fieldset className="w-full max-w-md" legend="Shipping address">
      <Field label="Street" required>
        <Input placeholder="500 Market Street" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <Input placeholder="San Francisco" />
        </Field>
        <Field label="Postal code">
          <Input placeholder="94105" />
        </Field>
      </div>
    </Fieldset>
  )
}
