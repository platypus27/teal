import { Separator } from '@kryv/teal'

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <p>Account settings</p>
      <Separator />
      <p className="text-sm text-on-surface-variant">Security preferences</p>
    </div>
  )
}
