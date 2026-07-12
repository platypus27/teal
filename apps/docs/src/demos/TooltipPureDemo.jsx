import { IconButton, Tooltip } from '@kryv/teal'
import { Info } from 'lucide-react'

export function TooltipPureDemo() {
  return (
    <Tooltip content="Only visible context, never an action" delayDuration={0}>
      <IconButton label="More information">
        <Info />
      </IconButton>
    </Tooltip>
  )
}
