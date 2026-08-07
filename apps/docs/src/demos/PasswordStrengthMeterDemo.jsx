import { PasswordStrengthMeter } from '@kryv/teal'

export function PasswordStrengthMeterDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <PasswordStrengthMeter
          label="Passphrase strength"
          password="correct horse battery staple"
          score={(value) => Math.min(4, Math.floor(value.length / 8))}
        />
        <PasswordStrengthMeter password="Abcdefgh1!23" showLabel={false} />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <PasswordStrengthMeter password="abc" />
      <PasswordStrengthMeter password="Abcdefg1" />
      <PasswordStrengthMeter password="Abcdefgh1!23" />
    </div>
  )
}
