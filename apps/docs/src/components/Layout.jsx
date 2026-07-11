import { useEffect, useState } from 'react'
import { FlaskConical, Menu as MenuIcon, Moon, Palette, Search, Sun, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconButton, Toaster } from '@kryv/teal'
import { catalogGroups } from '../data/catalog.jsx'
import changelog from '../generated/changelog.json'
import { CommandPalette, CommandPaletteProvider, useCommandPalette } from './CommandPalette.jsx'
import { PrevNext } from './PrevNext.jsx'
import { TableOfContents } from './TableOfContents.jsx'

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = window.localStorage.getItem('teal-theme')
    return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('teal-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <IconButton
      label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark((value) => !value)}
    >
      {dark ? <Sun /> : <Moon />}
    </IconButton>
  )
}

function linkClass({ isActive }) {
  return `block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    isActive
      ? 'bg-primary/10 font-semibold text-primary'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
  }`
}

function Header({ navOpen, setNavOpen }) {
  const { setOpen: setPaletteOpen } = useCommandPalette()
  const [modifier] = useState(() =>
    typeof navigator !== 'undefined' && /mac/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K',
  )
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-outline-variant/30 bg-surface-container/95 px-4 backdrop-blur sm:px-8 lg:px-12">
      <NavLink to="/" className="flex items-center gap-2 font-headline font-extrabold lg:hidden">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
          <Palette className="size-4" />
        </span>
        Teal
      </NavLink>
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface-variant transition hover:border-outline hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex"
      >
        <Search aria-hidden="true" className="size-4" />
        <span>Search the docs...</span>
        <kbd className="ml-auto rounded border border-outline-variant/50 bg-surface-container px-1.5 py-0.5 font-mono text-[10px] font-semibold">
          {modifier}
        </kbd>
      </button>
      <div className="ml-auto flex items-center gap-1">
        <IconButton label="Search the docs" className="lg:hidden" onClick={() => setPaletteOpen(true)}>
          <Search />
        </IconButton>
        <ThemeToggle />
        <IconButton
          label={navOpen ? 'Close navigation' : 'Open navigation'}
          className="lg:hidden"
          onClick={() => setNavOpen((value) => !value)}
        >
          {navOpen ? <X /> : <MenuIcon />}
        </IconButton>
      </div>
    </header>
  )
}

function Sidebar({ navOpen, setNavOpen }) {
  return (
    <>
      {navOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-outline-variant/30 bg-surface-container transition-transform lg:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavLink to="/" className="flex items-center gap-3 px-5 py-5" onClick={() => setNavOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-5" />
          </span>
          <span>
            <span className="flex items-center gap-2 font-headline text-lg font-extrabold leading-none">
              Teal
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                v{changelog.version}
              </span>
            </span>
            <span className="mt-1 block text-xs text-on-surface-variant">Kryv design system</span>
          </span>
        </NavLink>

        <nav aria-label="Documentation" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          <div>
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Start</div>
            <NavLink end to="/" className={linkClass} onClick={() => setNavOpen(false)}>
              Getting started
            </NavLink>
            <NavLink to="/foundations" className={linkClass} onClick={() => setNavOpen(false)}>
              Foundations
            </NavLink>
            <NavLink to="/changelog" className={linkClass} onClick={() => setNavOpen(false)}>
              Changelog
            </NavLink>
          </div>
          {catalogGroups.map((group) => (
            <div key={group.name}>
              <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {group.name}
              </div>
              <ul className="space-y-0.5">
                {group.modules.map((module) => (
                  <li key={module.id}>
                    <NavLink
                      to={`/modules/${module.id}`}
                      className={(state) => `${linkClass(state)} flex items-center gap-2`}
                      onClick={() => setNavOpen(false)}
                    >
                      {module.name}
                      {module.playground ? (
                        <FlaskConical aria-hidden="true" className="ml-auto size-3.5 text-primary/70" />
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Patterns
            </div>
            <NavLink to="/recipes" className={linkClass} onClick={() => setNavOpen(false)}>
              Recipes
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  )
}

export function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <CommandPaletteProvider>
      <div className="min-h-screen bg-background text-on-surface">
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary focus:translate-y-0"
        >
          Skip to content
        </a>
        <Sidebar navOpen={navOpen} setNavOpen={setNavOpen} />
        <div className="lg:ml-72">
          <Header navOpen={navOpen} setNavOpen={setNavOpen} />
          <div className="flex min-h-[calc(100vh-4rem)]">
            <main id="main-content" className="min-w-0 flex-1 scroll-mt-16">
              <Outlet />
              <PrevNext />
            </main>
            <TableOfContents />
          </div>
        </div>
        <CommandPalette />
        <Toaster />
      </div>
    </CommandPaletteProvider>
  )
}
