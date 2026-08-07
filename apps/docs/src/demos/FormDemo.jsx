import { Button, Field, Form, Input } from '@kryv/teal'

export function FormDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Form
        className="grid w-full max-w-md gap-5"
        errors={{ email: 'Use your work email to continue' }}
        onSubmit={() => undefined}
      >
        <Field label="Work email" error="Use your work email to continue" required>
          <Input name="email" type="email" placeholder="avery@kryvlabs.com" />
        </Field>
        <div>
          <Button type="submit" variant="primary">
            Request invite
          </Button>
        </div>
      </Form>
    )
  }

  return (
    <Form
      className="grid w-full max-w-md gap-5"
      onSubmit={(values) => console.log('submitted', values)}
    >
      <Field label="Display name" description="Shown to other workspace members" required>
        <Input name="displayName" defaultValue="Avery Chen" />
      </Field>
      <Field label="Job title">
        <Input name="jobTitle" placeholder="Product designer" />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Save profile
        </Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
    </Form>
  )
}
