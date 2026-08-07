import { Checkbox, Field, Input, Switch, TextArea } from '@kryv/teal'

export function FieldDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-md gap-5">
        <Field
          label="Work email"
          description="Used for sign-in and workspace invitations"
          required
          error="Enter a valid work email address"
        >
          <Input type="email" defaultValue="avery@example" autoComplete="email" />
        </Field>
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-5">
        <Field label="Marketing emails" description="Unsubscribe any time from the email footer">
          <Checkbox defaultChecked />
        </Field>
        <Field label="Beta features" description="Applies immediately to this workspace">
          <Switch />
        </Field>
      </div>
    )
  }

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
