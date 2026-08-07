import { PhoneInput } from '@kryv/teal'

export function PhoneInputDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <PhoneInput
          label="Support line"
          description="Stored as an E.164-ish string like +442071234567."
          defaultValue="+442071234567"
        />
        <PhoneInput label="Mobile" placeholder="555 123 4567" />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <PhoneInput label="Phone number" />
      <PhoneInput label="Emergency contact" defaultValue="+14155552671" />
    </div>
  )
}
