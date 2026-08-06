import { FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'
import { SideRail, VerticalNavBrand, VerticalNavFooter, VerticalNavItem, VerticalNavList, VerticalNavSection } from '@kryv/teal'

export function SideRailDemo() {
  return (
    <div className="relative h-80 w-96 overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <SideRail className="absolute bottom-4 left-4 top-6">
        <VerticalNavBrand>
          <span className="flex w-16 items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-primary text-teal-on-primary">
              <LayoutDashboard className="size-5" />
            </span>
          </span>
        </VerticalNavBrand>
        <VerticalNavList>
          <VerticalNavSection label="Workspace">
            <VerticalNavItem active icon={<LayoutDashboard className="size-5" />}>
              Overview
            </VerticalNavItem>
            <VerticalNavItem icon={<FolderKanban className="size-5" />}>Projects</VerticalNavItem>
            <VerticalNavItem icon={<Users className="size-5" />}>Team</VerticalNavItem>
          </VerticalNavSection>
        </VerticalNavList>
        <VerticalNavFooter>
          <VerticalNavItem icon={<Settings className="size-5" />}>Settings</VerticalNavItem>
        </VerticalNavFooter>
      </SideRail>
    </div>
  )
}
