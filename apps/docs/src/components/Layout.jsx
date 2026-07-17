import { useEffect, useRef, useState } from 'react'
import { FlaskConical, Menu as MenuIcon, Moon, Palette, Search, Sun, X } from 'lucide-react'
import { GitHubIcon } from './GitHubIcon.jsx'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconButton, Toaster, TooltipProvider, TopBar, TopBarActions, TopBarBrand, TopBarSearch, VerticalNav, VerticalNavBrand, VerticalNavItem, VerticalNavList, VerticalNavSection, iconButtonVariants } from '@kryv/teal'
import { catalogGroups } from '../data/docs-module-registry.js'
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

function Header({ navOpen, setNavOpen }) {
  const { setOpen: setPaletteOpen } = useCommandPalette()
  const [modifier] = useState(() =>
    typeof navigator !== 'undefined' && /mac/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K',
  )
  return (
    <TopBar sticky>
      <TopBarBrand>
        <NavLink to="/" className="flex items-center gap-2 font-headline font-extrabold lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-4" />
          </span>
          Teal
        </NavLink>
      </TopBarBrand>
      <TopBarSearch>
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
      </TopBarSearch>
      <TopBarActions>
        <IconButton label="Search the docs" className="lg:hidden" onClick={() => setPaletteOpen(true)}>
          <Search />
        </IconButton>
        <ThemeToggle />
        <a
          href="https://github.com/platypus27/teal"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          className={iconButtonVariants({ variant: 'ghost', size: 'md' })}
        >
          <GitHubIcon className="size-5" />
        </a>
        <IconButton
          label={navOpen ? 'Close navigation' : 'Open navigation'}
          className="lg:hidden"
          onClick={() => setNavOpen((value) => !value)}
        >
          {navOpen ? <X /> : <MenuIcon />}
        </IconButton>
      </TopBarActions>
    </TopBar>
  )
}

function Sidebar({ navOpen, setNavOpen }) {
  const { pathname } = useLocation()
  const firstLinkRef = useRef(null)
  const active = (to, end = false) => (end ? pathname === to : pathname.startsWith(to))

  useEffect(() => {
    if (navOpen) firstLinkRef.current?.focus()
  }, [navOpen])

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
      <VerticalNav
        mode="full"
        side="left"
        aria-label="Documentation"
        className={`fixed inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <VerticalNavBrand>
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setNavOpen(false)}>
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
        </VerticalNavBrand>

        <VerticalNavList>
          <VerticalNavSection label="Start">
            <VerticalNavItem ref={firstLinkRef} as={NavLink} end to="/" active={active('/', true)} onClick={() => setNavOpen(false)}>
              Getting started
            </VerticalNavItem>
            <VerticalNavItem as={NavLink} to="/foundations" active={active('/foundations')} onClick={() => setNavOpen(false)}>
              Foundations
            </VerticalNavItem>
            <VerticalNavItem as={NavLink} to="/changelog" active={active('/changelog')} onClick={() => setNavOpen(false)}>
              Changelog
            </VerticalNavItem>
          </VerticalNavSection>
          {catalogGroups.map((group) => (
            <VerticalNavSection key={group.name} label={group.name}>
              {group.modules.map((module) => (
                <VerticalNavItem
                  key={module.id}
                  as={NavLink}
                  to={`/modules/${module.id}`}
                  active={active(`/modules/${module.id}`)}
                  onClick={() => setNavOpen(false)}
                >
                  {module.name}
                  {module.hasPlayground ? (
                    <FlaskConical aria-hidden="true" className="ml-auto size-3.5 text-primary/70" />
                  ) : null}
                </VerticalNavItem>
              ))}
            </VerticalNavSection>
          ))}
          <VerticalNavSection label="Patterns">
            <VerticalNavItem as={NavLink} to="/recipes" active={active('/recipes')} onClick={() => setNavOpen(false)}>
              Recipes
            </VerticalNavItem>
          </VerticalNavSection>
        </VerticalNavList>
      </VerticalNav>
    </>
  )
}

export function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!navOpen) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <CommandPaletteProvider>
      <TooltipProvider>
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
      </TooltipProvider>
    </CommandPaletteProvider>
  )
}
