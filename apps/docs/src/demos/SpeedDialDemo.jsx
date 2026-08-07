import { FilePlus, FolderPlus, Link as LinkIcon, Upload } from 'lucide-react'
import { SpeedDial, SpeedDialAction } from '@kryv/teal'

export function SpeedDialDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <SpeedDial label="Share actions" direction="left" position="top-right">
        <SpeedDialAction label="Copy link" icon={<LinkIcon aria-hidden />} />
        <SpeedDialAction label="Upload" icon={<Upload aria-hidden />} />
      </SpeedDial>
    )
  }

  return (
    <SpeedDial label="Create actions" position="bottom-right">
      <SpeedDialAction label="New file" icon={<FilePlus aria-hidden />} />
      <SpeedDialAction label="New folder" icon={<FolderPlus aria-hidden />} />
      <SpeedDialAction label="Upload" icon={<Upload aria-hidden />} />
    </SpeedDial>
  )
}
