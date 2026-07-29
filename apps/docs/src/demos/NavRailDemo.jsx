import { NavRail, NavRailItem } from '@kryv/teal'
import { Bell, Home, Search, Settings } from 'lucide-react'

export function NavRailDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <NavRail aria-label="Primary">
        <NavRailItem icon={<Home />} label="Home" href="#" active />
        <NavRailItem icon={<Search />} label="Search" href="#" />
        <NavRailItem icon={<Bell />} label="Notifications" href="#" badge />
        <NavRailItem icon={<Settings />} label="Settings" href="#" badge />
      </NavRail>
    )
  }

  return (
    <NavRail aria-label="Primary">
      <NavRailItem icon={<Home />} label="Home" href="#" active />
      <NavRailItem icon={<Search />} label="Search" href="#" />
      <NavRailItem icon={<Bell />} label="Notifications" href="#" />
      <NavRailItem icon={<Settings />} label="Settings" href="#" />
    </NavRail>
  )
}
