import { useState } from 'react'
import { Bell, LayoutDashboard, Menu, Settings, X } from 'lucide-react'
import { IconButton, Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarSection, TopBar, TopBarActions, TopBarBrand } from '@kryv/teal'

export function ResponsiveShellRecipe() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-80 w-full max-w-3xl overflow-hidden rounded-2xl border border-teal-outline-variant/30">
      {open ? <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/40 sm:hidden" onClick={() => setOpen(false)} /> : null}
      <Sidebar mode="rail" className={`${open ? 'fixed inset-y-0 left-0 z-40 flex' : 'hidden'} shrink-0 sm:flex`}>
        <SidebarHeader><span className="flex w-16 justify-center text-teal-primary"><LayoutDashboard /></span></SidebarHeader>
        <SidebarContent><SidebarSection label="Workspace"><SidebarItem active icon={<LayoutDashboard />} onClick={() => setOpen(false)}>Overview</SidebarItem><SidebarItem icon={<Settings />} onClick={() => setOpen(false)}>Settings</SidebarItem></SidebarSection></SidebarContent>
      </Sidebar>
      <div className="min-w-0 flex-1">
        <TopBar sticky={false} className="px-4">
          <TopBarBrand><IconButton label={open ? 'Close navigation' : 'Open navigation'} size="sm" className="sm:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</IconButton><span className="font-teal-headline font-bold">Overview</span></TopBarBrand>
          <TopBarActions><IconButton label="Notifications" size="sm"><Bell /></IconButton></TopBarActions>
        </TopBar>
        <div className="p-5 text-sm text-teal-on-surface-variant">Content remains readable while navigation changes shape at the shell boundary.</div>
      </div>
    </div>
  )
}
