import { Bell, Palette, Search } from 'lucide-react'
import { IconButton, TopBar, TopBarActions, TopBarBrand, TopBarSearch } from '@kryv/teal'

export function TopBarShellDemo() {
  return (
    <div className="w-full rounded-xl border border-teal-outline-variant/30">
      <TopBar sticky={false} className="px-4">
        <TopBarBrand>
          <span className="flex size-8 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary"><Palette className="size-4" /></span>
          <span className="font-teal-headline font-bold">Project Orion</span>
        </TopBarBrand>
        <TopBarSearch>
          <button type="button" className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-teal-outline-variant/40 px-3 text-xs text-teal-on-surface-variant"><Search className="size-4" />Search workspace</button>
        </TopBarSearch>
        <TopBarActions><IconButton label="Notifications" size="sm"><Bell /></IconButton></TopBarActions>
      </TopBar>
    </div>
  )
}
