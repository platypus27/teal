import { List, ListItem } from '@kryv/teal'
import { FileText, Folder, Image } from 'lucide-react'

export function ListDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md rounded-lg border border-teal-outline-variant/50">
        <List dense>
          <ListItem title="Security report.pdf" secondary="240 KB" onClick={() => undefined} />
          <ListItem title="Reliability review.pdf" secondary="128 KB" onClick={() => undefined} />
          <ListItem title="Usage metrics.csv" secondary="64 KB" onClick={() => undefined} />
        </List>
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full max-w-xs rounded-lg border border-teal-outline-variant/50 p-2">
        <p className="px-2 py-1 text-xs font-medium text-teal-on-surface-variant">Preferences</p>
        <List dense>
          <ListItem title="Notifications" onClick={() => undefined} />
          <ListItem title="Appearance" onClick={() => undefined} />
          <ListItem title="Keyboard shortcuts" onClick={() => undefined} />
        </List>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-teal-outline-variant/50">
      <List>
        <ListItem leading={<Folder />} title="Reports" secondary="12 files" trailing="2 GB" />
        <ListItem leading={<Image />} title="Screenshots" secondary="48 files" trailing="640 MB" />
        <ListItem leading={<FileText />} title="Q2 security report" secondary="Updated 5 min ago" trailing="240 KB" onClick={() => undefined} />
      </List>
    </div>
  )
}
