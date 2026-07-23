import { FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'
import { VerticalNav, VerticalNavBrand, VerticalNavFooter, VerticalNavItem, VerticalNavList, VerticalNavSection } from '@kryv/teal'

export function VerticalNavDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-xl border border-teal-outline-variant/30">
        <VerticalNav mode="rail" className="absolute">
          <VerticalNavBrand>
            <span className="flex w-16 items-center justify-center">
              <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
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
        </VerticalNav>
      </div>

      <div className="relative h-80 overflow-hidden rounded-xl border border-teal-outline-variant/30">
        <VerticalNav mode="full" className="absolute">
          <VerticalNavBrand>
            <span className="flex w-16 items-center justify-center">
              <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
                <LayoutDashboard className="size-5" />
              </span>
            </span>
            <span className="font-teal-headline text-lg font-extrabold leading-none">Teal</span>
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
        </VerticalNav>
      </div>
    </div>
  )
}
