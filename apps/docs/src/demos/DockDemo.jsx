import { Folder, Mail, MapPin, Music, Search, Settings } from 'lucide-react'
import { Dock, DockItem } from '@kryv/teal'

export function DockDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Dock aria-label="Favorite apps">
        <DockItem icon={<Search className="size-6" />} label="Search" />
        <DockItem active icon={<MapPin className="size-6" />} label="Maps" />
        <DockItem icon={<Settings className="size-6" />} label="Settings" />
      </Dock>
    )
  }

  return (
    <Dock>
      <DockItem active icon={<Mail className="size-6" />} label="Mail" />
      <DockItem icon={<Music className="size-6" />} label="Music" />
      <DockItem active icon={<Folder className="size-6" />} label="Files" />
    </Dock>
  )
}
