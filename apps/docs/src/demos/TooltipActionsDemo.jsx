import { IconButton, Tooltip } from '@kryv/teal'
import { CircleHelp } from 'lucide-react'

export function TooltipActionsDemo() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip content="Changes apply to everyone in this workspace" delayDuration={0}>
        <IconButton label="Workspace sharing help"><CircleHelp /></IconButton>
      </Tooltip>
      <span className="text-sm text-teal-on-surface-variant">Workspace sharing</span>
    </div>
  )
}
