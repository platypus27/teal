import { Field, FormErrorSummary, Input } from '@kryv/teal'

export function FormErrorSummaryDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md space-y-4">
        <FormErrorSummary
          title="Fix this error to continue"
          errors={[{ fieldId: 'demo-card-number', label: 'Card number', message: 'Enter the 16-digit number on the card.' }]}
        />
        <Field id="demo-card-number" label="Card number" error="Enter the 16-digit number on the card." required>
          <Input placeholder="1234 5678 9012 3456" />
        </Field>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <FormErrorSummary
        errors={[
          { fieldId: 'demo-email', label: 'Email', message: 'Enter a valid email address.' },
          { fieldId: 'demo-password', label: 'Password', message: 'Use at least 12 characters.' },
        ]}
      />
      <Field id="demo-email" label="Email" error="Enter a valid email address." required>
        <Input type="email" defaultValue="avery@example" />
      </Field>
      <Field id="demo-password" label="Password" error="Use at least 12 characters." required>
        <Input type="password" defaultValue="short" />
      </Field>
    </div>
  )
}
