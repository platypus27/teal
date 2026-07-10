import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('teal-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('teal-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base">{dark ? 'light_mode' : 'dark_mode'}</span>
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export function Sidebar({ nav, active, onSelect }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-outline-variant/30 bg-surface-container">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-on-primary">
          <span className="material-symbols-outlined text-lg">palette</span>
        </span>
        <div>
          <div className="font-headline text-base font-extrabold leading-none text-on-surface">teal</div>
          <div className="mt-0.5 text-[11px] text-on-surface-variant">design system</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {nav.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              {group.title}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`flex w-full items-center rounded-lg px-3 py-1.5 text-left text-sm transition ${
                        isActive
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-outline-variant/30 p-3">
        <ThemeToggle />
      </div>
    </aside>
  )
}
