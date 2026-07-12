import { Github, Palette, Search, Sun } from 'lucide-react'
import { IconButton, TopBar, TopBarActions, TopBarBrand, TopBarSearch } from '@kryv/teal'

export function TopBarDemo() {
  return (
    <div className="w-full space-y-4">
      <TopBar variant="solid" sticky={false}>
        <TopBarBrand>
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-4" />
          </span>
          <span className="font-headline font-extrabold">Teal</span>
        </TopBarBrand>
        <TopBarSearch>
          <button
            type="button"
            className="flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface-variant"
          >
            <Search className="size-4" />
            Search the docs...
          </button>
        </TopBarSearch>
        <TopBarActions>
          <IconButton label="GitHub">
            <Github />
          </IconButton>
          <IconButton label="Switch theme">
            <Sun />
          </IconButton>
        </TopBarActions>
      </TopBar>

      <TopBar variant="solid" sticky={false} className="rounded-xl">
        <TopBarBrand>
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-4" />
          </span>
          <span className="font-headline font-extrabold">Teal</span>
        </TopBarBrand>
        <TopBarActions>
          <IconButton label="GitHub">
            <Github />
          </IconButton>
          <IconButton label="Switch theme">
            <Sun />
          </IconButton>
        </TopBarActions>
      </TopBar>
    </div>
  )
}
