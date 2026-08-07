import { Bell, Calendar, Home, Search, User } from 'lucide-react'
import { BottomNav, BottomNavItem } from '@kryv/teal'

export function BottomNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="relative h-24 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30">
        <BottomNav className="absolute">
          <BottomNavItem href="#home" icon={<Home className="size-5" />} label="Home" />
          <BottomNavItem href="#search" icon={<Search className="size-5" />} label="Search" />
          <BottomNavItem active href="#calendar" icon={<Calendar className="size-5" />} label="Calendar" />
          <BottomNavItem badge={3} href="#alerts" icon={<Bell className="size-5" />} label="Alerts" />
          <BottomNavItem href="#profile" icon={<User className="size-5" />} label="Profile" />
        </BottomNav>
      </div>
    )
  }

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <BottomNav className="absolute">
        <BottomNavItem active href="#home" icon={<Home className="size-5" />} label="Home" />
        <BottomNavItem href="#search" icon={<Search className="size-5" />} label="Search" />
        <BottomNavItem badge={2} href="#alerts" icon={<Bell className="size-5" />} label="Alerts" />
        <BottomNavItem href="#profile" icon={<User className="size-5" />} label="Profile" />
      </BottomNav>
    </div>
  )
}
