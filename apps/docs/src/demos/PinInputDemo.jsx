import { useState } from 'react'
import { PinInput } from '@kryv/teal'

export function PinInputDemo({ exampleIndex = 0 }) {
  const [completed, setCompleted] = useState('')

  if (exampleIndex === 1) {
    return (
      <div className="grid gap-2">
        <PinInput label="Security PIN" length={4} masked />
        <span className="text-sm text-teal-on-surface-variant">Masked cells hide the code like a password.</span>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <PinInput label="Verification code" length={6} onComplete={setCompleted} />
      <span className="text-sm text-teal-on-surface-variant">
        {completed ? `Completed code: ${completed}` : 'Type or paste a six-digit code.'}
      </span>
    </div>
  )
}
