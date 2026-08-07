import { AlignCenter, AlignLeft, Bold, Italic, Underline } from 'lucide-react'
import { IconButton, Separator } from '@kryv/teal'

export function SeparatorDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex h-6 items-center gap-3 text-sm">
        <span>Draft</span>
        <Separator orientation="vertical" />
        <span className="text-teal-on-surface-variant">Last saved 5 min ago</span>
        <Separator orientation="vertical" />
        <span className="text-teal-on-surface-variant">2 editors</span>
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="flex h-10 items-center gap-1 rounded-xl border border-teal-outline-variant/30 px-2">
        <IconButton label="Bold" size="sm">
          <Bold />
        </IconButton>
        <IconButton label="Italic" size="sm">
          <Italic />
        </IconButton>
        <IconButton label="Underline" size="sm">
          <Underline />
        </IconButton>
        <Separator orientation="vertical" className="mx-1" />
        <IconButton label="Align left" size="sm">
          <AlignLeft />
        </IconButton>
        <IconButton label="Align center" size="sm">
          <AlignCenter />
        </IconButton>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <p>Account settings</p>
      <Separator />
      <p className="text-sm text-teal-on-surface-variant">Security preferences</p>
    </div>
  )
}
