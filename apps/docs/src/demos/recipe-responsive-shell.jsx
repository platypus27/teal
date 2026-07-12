import { useState } from 'react'
import { Bell, LayoutDashboard, Menu, Settings, X } from 'lucide-react'
import { IconButton, TopBar, TopBarActions, TopBarBrand, VerticalNav, VerticalNavBrand, VerticalNavItem, VerticalNavList, VerticalNavSection } from '@kryv/teal'

export function ResponsiveShellRecipe() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-80 w-full max-w-3xl overflow-hidden rounded-2xl border border-outline-variant/30">
      {open ? <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/40 sm:hidden" onClick={() => setOpen(false)} /> : null}
      <VerticalNav mode="rail" className={`${open ? 'fixed inset-y-0 left-0 z-40 flex' : 'hidden'} shrink-0 sm:flex`}>
        <VerticalNavBrand><span className="flex w-16 justify-center text-primary"><LayoutDashboard /></span></VerticalNavBrand>
        <VerticalNavList><VerticalNavSection label="Workspace"><VerticalNavItem active icon={<LayoutDashboard />} onClick={() => setOpen(false)}>Overview</VerticalNavItem><VerticalNavItem icon={<Settings />} onClick={() => setOpen(false)}>Settings</VerticalNavItem></VerticalNavSection></VerticalNavList>
      </VerticalNav>
      <div className="min-w-0 flex-1">
        <TopBar sticky={false} className="px-4">
          <TopBarBrand><IconButton label={open ? 'Close navigation' : 'Open navigation'} size="sm" className="sm:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</IconButton><span className="font-headline font-bold">Overview</span></TopBarBrand>
          <TopBarActions><IconButton label="Notifications" size="sm"><Bell /></IconButton></TopBarActions>
        </TopBar>
        <div className="p-5 text-sm text-on-surface-variant">Content remains readable while navigation changes shape at the shell boundary.</div>
      </div>
    </div>
  )
}
