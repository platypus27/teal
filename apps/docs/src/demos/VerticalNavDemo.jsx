import { FolderKanban, Gauge, Inbox, LayoutDashboard, ListTodo, Map, PanelLeft, PanelTop, Rocket, Settings, Settings2, ShieldCheck, Table2, Tag, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { VerticalNav, VerticalNavBrand, VerticalNavFooter, VerticalNavItem, VerticalNavList, VerticalNavSection } from '@kryv/teal'

function ApplicationShellNav() {
  return (
    <div className="flex h-80 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <VerticalNav mode="rail">
        <VerticalNavBrand>
          <span className="flex w-16 items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
              <Inbox className="size-5" />
            </span>
          </span>
        </VerticalNavBrand>
        <VerticalNavList>
          <VerticalNavItem active icon={<Inbox className="size-5" />}>
            Inbox
          </VerticalNavItem>
          <VerticalNavItem icon={<Map className="size-5" />}>Roadmap</VerticalNavItem>
          <VerticalNavItem icon={<Gauge className="size-5" />}>Reports</VerticalNavItem>
        </VerticalNavList>
        <VerticalNavFooter>
          <VerticalNavItem icon={<ShieldCheck className="size-5" />}>Admin</VerticalNavItem>
        </VerticalNavFooter>
      </VerticalNav>

      <VerticalNav mode="full">
        <VerticalNavBrand>
          <span className="flex w-16 items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
              <Rocket className="size-5" />
            </span>
          </span>
          <span className="font-teal-headline text-lg font-extrabold leading-none">Orion</span>
        </VerticalNavBrand>
        <VerticalNavList>
          <VerticalNavSection label="Project Orion">
            <VerticalNavItem active icon={<ListTodo className="size-5" />}>
              Backlog
            </VerticalNavItem>
            <VerticalNavItem icon={<Rocket className="size-5" />}>Sprints</VerticalNavItem>
            <VerticalNavItem icon={<Tag className="size-5" />}>Releases</VerticalNavItem>
          </VerticalNavSection>
        </VerticalNavList>
        <VerticalNavFooter>
          <VerticalNavItem icon={<Settings2 className="size-5" />}>Project settings</VerticalNavItem>
        </VerticalNavFooter>
      </VerticalNav>

      <div className="flex flex-1 items-center justify-center bg-teal-surface-container-low text-sm text-teal-on-surface-variant">
        Main content
      </div>
    </div>
  )
}

function RouterNav() {
  const location = useLocation()
  const links = [
    { to: '/modules/vertical-nav', label: 'Vertical nav', icon: <PanelLeft className="size-5" /> },
    { to: '/modules/top-bar', label: 'Top bar', icon: <PanelTop className="size-5" /> },
    { to: '/modules/data-table', label: 'Data table', icon: <Table2 className="size-5" /> },
  ]

  return (
    <div className="relative h-72 w-full max-w-xs overflow-hidden rounded-xl border border-teal-outline-variant/30">
      <VerticalNav mode="full" className="absolute h-full">
        <VerticalNavList>
          <VerticalNavSection label="Components">
            {links.map((link) => (
              <VerticalNavItem
                key={link.to}
                as={Link}
                to={link.to}
                active={location.pathname === link.to}
                icon={link.icon}
              >
                {link.label}
              </VerticalNavItem>
            ))}
          </VerticalNavSection>
        </VerticalNavList>
      </VerticalNav>
    </div>
  )
}

export function VerticalNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return <ApplicationShellNav />
  }
  if (exampleIndex === 2) {
    return <RouterNav />
  }

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
