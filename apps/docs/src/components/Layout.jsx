import { lazy, Suspense, useEffect, useState } from 'react'
import { Menu as MenuIcon, Moon, Palette, Search, Sun, X } from 'lucide-react'
import { GitHubIcon } from './GitHubIcon.jsx'
import { IconButton, TopBar, TopBarActions, TopBarBrand, TopBarSearch, iconButtonVariants } from '@kryv/teal'
import { CommandPaletteProvider, useCommandPalette } from './CommandPaletteState.jsx'
import { TableOfContents } from './TableOfContents.jsx'

const CommandPalette = lazy(() =>
  import('./CommandPalette.jsx').then((module) => ({ default: module.CommandPalette })),
)
const Sidebar = lazy(() => import('./Sidebar.jsx').then((module) => ({ default: module.Sidebar })))
const DeferredToaster = lazy(() =>
  import('./DeferredToaster.jsx').then((module) => ({ default: module.DeferredToaster })),
)

function LazyCommandPalette() {
  const { open } = useCommandPalette()
  if (!open) return null
  return (
    <Suspense fallback={null}>
      <CommandPalette />
    </Suspense>
  )
}

function FirstInteractionToaster() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reveal = () => setReady(true)
    window.addEventListener('pointerdown', reveal, { capture: true, once: true })
    window.addEventListener('keydown', reveal, { capture: true, once: true })
    const fallback = window.setTimeout(reveal, 10_000)
    return () => {
      window.removeEventListener('pointerdown', reveal, { capture: true })
      window.removeEventListener('keydown', reveal, { capture: true })
      window.clearTimeout(fallback)
    }
  }, [])

  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <DeferredToaster />
    </Suspense>
  )
}

function useDesktopNavigation() {
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return desktop
}

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
        <a href="/" className="flex items-center gap-2 font-teal-headline font-extrabold lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
            <Palette className="size-4" />
          </span>
          Teal
        </a>
      </TopBarBrand>
      <TopBarSearch>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-teal-outline-variant/40 bg-teal-surface px-3 text-sm text-teal-on-surface-variant transition hover:border-teal-outline hover:text-teal-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary lg:flex"
        >
          <Search aria-hidden="true" className="size-4" />
          <span>Search the docs...</span>
          <kbd className="ml-auto rounded border border-teal-outline-variant/50 bg-teal-surface-container px-1.5 py-0.5 font-mono text-[10px] font-semibold">
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

export function Layout({ children }) {
  const [navOpen, setNavOpen] = useState(false)
  const desktopNavigation = useDesktopNavigation()

  useEffect(() => {
    if (!navOpen) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  return (
    <CommandPaletteProvider>
      <div className="min-h-screen bg-teal-background text-teal-on-surface">
          <a
            href="#main-content"
            className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-teal-primary px-4 py-2 font-semibold text-teal-on-primary focus:translate-y-0"
          >
            Skip to content
          </a>
          {desktopNavigation || navOpen ? (
            <Suspense fallback={null}>
              <Sidebar navOpen={navOpen} setNavOpen={setNavOpen} />
            </Suspense>
          ) : null}
          <div className="lg:ml-72">
            <Header navOpen={navOpen} setNavOpen={setNavOpen} />
            <div className="flex min-h-[calc(100vh-4rem)]">
              <main id="main-content" className="min-w-0 flex-1 scroll-mt-16">
                {children}
              </main>
              <TableOfContents />
            </div>
          </div>
          <LazyCommandPalette />
          <FirstInteractionToaster />
        </div>
    </CommandPaletteProvider>
  )
}
