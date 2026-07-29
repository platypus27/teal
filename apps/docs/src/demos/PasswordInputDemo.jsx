import { useState } from 'react'
import { PasswordInput } from '@kryv/teal'

export function PasswordInputDemo({ exampleIndex = 0 }) {
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <PasswordInput
          label="Current password"
          description="Required to change workspace security settings"
          autoComplete="current-password"
          value={currentPassword}
          onValueChange={setCurrentPassword}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <PasswordInput
        label="Password"
        description="Use at least 12 characters"
        autoComplete="new-password"
        value={password}
        onValueChange={setPassword}
      />
    </div>
  )
}
