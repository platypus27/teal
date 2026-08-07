import { MaskedInput } from '@kryv/teal'

export function MaskedInputDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <MaskedInput
          label="Phone (US)"
          mask="(###) ###-####"
          description="Only digits are accepted; separators appear automatically."
        />
        <MaskedInput label="Zip + 4" mask="#####-####" defaultValue="941073101" />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <MaskedInput label="Date" mask="##/##/####" />
      <MaskedInput label="Card expiry" mask="##/##" defaultValue="0428" />
    </div>
  )
}
