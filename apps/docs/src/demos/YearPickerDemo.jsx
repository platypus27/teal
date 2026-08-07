import { useState } from 'react'
import { YearPicker } from '@kryv/teal'

export function YearPickerDemo({ exampleIndex = 0 }) {
  const [graduation, setGraduation] = useState(/** @type {Date | undefined} */ (undefined))
  const [fiscal, setFiscal] = useState(new Date())

  if (exampleIndex === 1) {
    const currentYear = new Date().getFullYear()
    return (
      <div className="w-full max-w-xs">
        <YearPicker
          label="Fiscal year"
          description="Only recent and upcoming years are open"
          value={fiscal}
          onValueChange={setFiscal}
          minDate={new Date(currentYear - 5, 0, 1)}
          maxDate={new Date(currentYear + 2, 0, 1)}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <YearPicker
        label="Graduation year"
        description="Page by decade with the header buttons or arrow keys"
        value={graduation}
        onValueChange={setGraduation}
      />
    </div>
  )
}
