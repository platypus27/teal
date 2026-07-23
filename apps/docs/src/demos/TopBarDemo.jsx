import { Palette, Search, Sun } from 'lucide-react'
import { GitHubIcon } from '../components/GitHubIcon.jsx'
import { IconButton, TopBar, TopBarActions, TopBarBrand, TopBarSearch } from '@kryv/teal'

export function TopBarDemo() {
  return (
    <div className="w-full space-y-4">
      <TopBar sticky={false}>
        <TopBarBrand>
          <span className="flex size-8 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
            <Palette className="size-4" />
          </span>
          <span className="font-teal-headline font-extrabold">Teal</span>
        </TopBarBrand>
        <TopBarSearch>
          <button
            type="button"
            className="flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-teal-outline-variant/40 bg-teal-surface px-3 text-sm text-teal-on-surface-variant"
          >
            <Search className="size-4" />
            Search the docs...
          </button>
        </TopBarSearch>
        <TopBarActions>
          <IconButton label="GitHub">
            <GitHubIcon />
          </IconButton>
          <IconButton label="Switch theme">
            <Sun />
          </IconButton>
        </TopBarActions>
      </TopBar>

      <TopBar sticky={false} className="rounded-xl">
        <TopBarBrand>
          <span className="flex size-8 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
            <Palette className="size-4" />
          </span>
          <span className="font-teal-headline font-extrabold">Teal</span>
        </TopBarBrand>
        <TopBarActions>
          <IconButton label="GitHub">
            <GitHubIcon />
          </IconButton>
          <IconButton label="Switch theme">
            <Sun />
          </IconButton>
        </TopBarActions>
      </TopBar>
    </div>
  )
}
