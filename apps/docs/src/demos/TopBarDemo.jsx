import { Bell, CircleUserRound, Gauge, Palette, Search, Sun } from 'lucide-react'
import { GitHubIcon } from '../components/GitHubIcon.jsx'
import { IconButton, TopBar, TopBarActions, TopBarBrand, TopBarSearch } from '@kryv/teal'

export function TopBarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full rounded-xl border border-teal-outline-variant/30">
        <TopBar sticky={false} className="px-4">
          <TopBarBrand>
            <span className="flex size-8 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
              <Gauge className="size-4" />
            </span>
            <span className="font-teal-headline font-extrabold">Acme Console</span>
          </TopBarBrand>
          <TopBarSearch>
            <button
              type="button"
              className="flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-teal-outline-variant/40 bg-teal-surface px-3 text-sm text-teal-on-surface-variant"
            >
              <Search className="size-4" />
              Search projects, people, and settings...
            </button>
          </TopBarSearch>
          <TopBarActions>
            <IconButton label="Show notifications">
              <Bell />
            </IconButton>
            <IconButton label="Account menu">
              <CircleUserRound />
            </IconButton>
          </TopBarActions>
        </TopBar>
      </div>
    )
  }

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
          <IconButton label="View on GitHub">
            <GitHubIcon />
          </IconButton>
          <IconButton label="Toggle dark mode">
            <Sun />
          </IconButton>
        </TopBarActions>
      </TopBar>
    </div>
  )
}
