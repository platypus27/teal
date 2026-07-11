import { Field, Input, TextArea } from '@kryv/teal'

export function FieldDemo() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <Field label="Display name" description="Shown to other workspace members" required>
        <Input defaultValue="Avery Chen" />
      </Field>
      <Field label="Notes" error="Keep notes under 240 characters">
        <TextArea defaultValue="Notify the incident team before changing this account." />
      </Field>
    </div>
  )
}
