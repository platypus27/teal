import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Search } from 'lucide-react'
import { Dialog, Input } from '@kryv/teal'
import { catalogGroups } from '../data/docs-module-registry.js'

const RECENTS_KEY = 'teal-docs-recent-pages'
const MAX_RESULTS = 8

const staticEntries = [
  {
    to: '/',
    title: 'Getting started',
    group: 'Start',
    description: 'Install @kryv/teal, wire up Tailwind, and apply the theme tokens.',
    keywords: 'install setup npm pnpm yarn tailwind vite fonts theme css',
  },
  {
    to: '/foundations',
    title: 'Foundations',
    group: 'Start',
    description: 'Color, typography, shape, elevation, and motion tokens.',
    keywords: 'tokens color typography shape elevation motion dark mode theme',
  },
  {
    to: '/changelog',
    title: 'Changelog',
    group: 'Start',
    description: 'Versioned changes to @kryv/teal, generated from changesets.',
    keywords: 'changelog release version changesets history update',
  },
  {
    to: '/recipes',
    title: 'Recipes',
    group: 'Patterns',
    description: 'Production-ready patterns composed from Teal modules.',
    keywords: 'patterns settings review queue layout composite',
  },
]

export const searchEntries = [
  ...staticEntries,
  ...catalogGroups.flatMap((group) =>
    group.modules.map((module) => ({
      to: `/modules/${module.id}`,
      title: module.name,
      group: group.name,
      description: module.description,
      keywords: `${module.id} ${module.apiNames.join(' ')}`,
    })),
  ),
]

const CommandPaletteContext = createContext(null)

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (!context) throw new Error('useCommandPalette must be used within a CommandPaletteProvider')
  return context
}

export function CommandPaletteProvider({ children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target
        const tagName = target?.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) return
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])
  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>
}

function readRecents() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENTS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && entry.to && entry.title) : []
  } catch {
    return []
  }
}

function scoreEntry(entry, query) {
  const title = entry.title.toLowerCase()
  if (title.startsWith(query)) return 3
  if (title.includes(query)) return 2
  const haystack = `${entry.group} ${entry.description} ${entry.keywords}`.toLowerCase()
  return haystack.includes(query) ? 1 : 0
}

function KbdHint({ children }) {
  return (
    <kbd className="rounded border border-teal-outline-variant/50 bg-teal-surface-container px-1.5 py-0.5 font-mono text-[10px] font-semibold text-teal-on-surface">
      {children}
    </kbd>
  )
}

function PaletteBody({ onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recents] = useState(() => readRecents())

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [])

  const trimmed = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!trimmed) return []
    return searchEntries
      .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, MAX_RESULTS)
      .map((result) => result.entry)
  }, [trimmed])

  const visible = trimmed ? results : recents.length ? recents : searchEntries.slice(0, MAX_RESULTS)

  const go = useCallback(
    (entry) => {
      onClose()
      navigate(entry.to)
      const next = [entry, ...readRecents().filter((recent) => recent.to !== entry.to)].slice(0, 5)
      try {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch {
        // storage can be unavailable in private browsing - recents are optional
      }
    },
    [navigate, onClose],
  )

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % Math.max(visible.length, 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + visible.length) % Math.max(visible.length, 1))
    } else if (event.key === 'Enter' && visible[activeIndex]) {
      event.preventDefault()
      go(visible[activeIndex])
    }
  }

  return (
    <div className="-mt-5">
      <div className="relative flex h-16 items-center border-b border-teal-outline-variant/30">
        <Search aria-hidden="true" className="pointer-events-none absolute left-5 size-4 text-teal-on-surface-variant" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Search the docs..."
          aria-label="Search the docs"
          className="h-full min-h-0 rounded-none border-transparent bg-transparent py-4 pl-12 pr-14 text-base shadow-none focus-visible:border-transparent focus-visible:ring-0"
        />
      </div>
      <div className="max-h-[min(20rem,45vh)] overflow-y-auto p-2">
        {!trimmed && recents.length ? (
          <div className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-teal-on-surface-variant">
            Recent
          </div>
        ) : null}
        {visible.length ? (
          visible.map((entry, index) => (
            <button
              key={entry.to}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => go(entry)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary ${
                index === activeIndex ? 'bg-teal-primary/10 text-teal-primary' : 'text-teal-on-surface-variant hover:bg-teal-surface-container-high'
              }`}
            >
              <FileText aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-teal-on-surface">{entry.title}</span>
                <span className="block truncate text-xs">{entry.group}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className={`size-4 shrink-0 transition-opacity ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
          ))
        ) : (
          <p className="px-3 py-10 text-center text-sm text-teal-on-surface-variant">
            No results for <span className="font-semibold text-teal-on-surface">&ldquo;{query.trim()}&rdquo;</span>
          </p>
        )}
      </div>
      <div className="flex h-11 items-center gap-4 border-t border-teal-outline-variant/30 px-5 text-xs text-teal-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <KbdHint>&uarr;&darr;</KbdHint> Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <KbdHint>&crarr;</KbdHint> Open
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <KbdHint>esc</KbdHint> Close
        </span>
      </div>
    </div>
  )
}

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      size="lg"
      title={<span className="sr-only">Search the documentation</span>}
      description={
        <span className="sr-only">Type to filter pages, then use arrow keys and enter to navigate.</span>
      }
      className="top-[12vh] max-h-[72vh] translate-y-0 p-0"
    >
      {open ? <PaletteBody onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}
