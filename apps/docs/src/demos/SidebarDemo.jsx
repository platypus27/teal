import { FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarCollapseButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from '@kryv/teal'

export function SidebarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="h-96 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30">
        <Sidebar defaultCollapsed>
          <SidebarHeader>
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
              <LayoutDashboard className="size-5" />
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarSection label="Workspace">
              <SidebarItem active href="#overview" icon={<LayoutDashboard className="size-5" />}>
                Overview
              </SidebarItem>
              <SidebarItem href="#projects" icon={<FolderKanban className="size-5" />}>
                Projects
              </SidebarItem>
              <SidebarItem href="#team" icon={<Users className="size-5" />}>
                Team
              </SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem href="#settings" icon={<Settings className="size-5" />}>
              Settings
            </SidebarItem>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
      </div>
    )
  }

  return (
    <div className="h-96 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <Sidebar>
        <SidebarHeader>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
            <LayoutDashboard className="size-5" />
          </span>
          <span className="font-teal-headline text-lg font-extrabold leading-none">Acme</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection label="Workspace">
            <SidebarItem active href="#overview" icon={<LayoutDashboard className="size-5" />}>
              Overview
            </SidebarItem>
            <SidebarItem href="#projects" icon={<FolderKanban className="size-5" />}>
              Projects
            </SidebarItem>
            <SidebarItem href="#team" icon={<Users className="size-5" />}>
              Team
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem href="#settings" icon={<Settings className="size-5" />}>
            Settings
          </SidebarItem>
          <SidebarCollapseButton />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
