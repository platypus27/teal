import { useEffect, useState } from 'react'
import { Menu as MenuIcon, Moon, Palette, Sun, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { IconButton, Toaster } from '@kryv/teal'
import { catalogGroups } from '../data/catalog.jsx'

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
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

function linkClass({ isActive }) {
  return `block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    isActive
      ? 'bg-primary/10 font-semibold text-primary'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
  }`
}

export function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface-container/95 px-4 backdrop-blur lg:hidden">
        <NavLink to="/" className="flex items-center gap-2 font-headline font-extrabold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-4" />
          </span>
          Teal
        </NavLink>
        <IconButton label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <MenuIcon />}
        </IconButton>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-outline-variant/30 bg-surface-container transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavLink to="/" className="flex items-center gap-3 px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Palette className="size-5" />
          </span>
          <span>
            <span className="block font-headline text-lg font-extrabold leading-none">Teal</span>
            <span className="mt-1 block text-xs text-on-surface-variant">Kryv design system</span>
          </span>
        </NavLink>

        <nav aria-label="Documentation" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          <div>
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Start</div>
            <NavLink end to="/" className={linkClass} onClick={() => setOpen(false)}>Getting started</NavLink>
            <NavLink to="/foundations" className={linkClass} onClick={() => setOpen(false)}>Foundations</NavLink>
          </div>
          {catalogGroups.map((group) => (
            <div key={group.name}>
              <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{group.name}</div>
              <ul className="space-y-0.5">
                {group.modules.map((module) => (
                  <li key={module.id}>
                    <NavLink to={`/modules/${module.id}`} className={linkClass} onClick={() => setOpen(false)}>{module.name}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Patterns</div>
            <NavLink to="/recipes" className={linkClass} onClick={() => setOpen(false)}>Recipes</NavLink>
          </div>
        </nav>
        <div className="border-t border-outline-variant/30 p-3"><ThemeToggle /></div>
      </aside>

      <main id="main-content" className="lg:ml-72">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
