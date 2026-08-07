import { CurrencyInput } from '@kryv/teal'

export function CurrencyInputDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <CurrencyInput
          label="Monthly budget"
          description="Clamped between $0 and $5,000 when the field loses focus."
          min={0}
          max={5000}
          defaultValue={1250}
        />
        <CurrencyInput label="Custom amount" placeholder="0.00" />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <CurrencyInput label="Invoice total" defaultValue={1234.5} />
      <CurrencyInput label="Revenue" currency="EUR" locale="de-DE" defaultValue={98765.4} />
    </div>
  )
}
