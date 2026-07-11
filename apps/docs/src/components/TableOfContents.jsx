import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function TableOfContents() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const sections = [...document.querySelectorAll('main section[id]')]
      setActiveId(null)
      setItems(
        sections
          .map((section) => ({
            id: section.id,
            label: section.querySelector('h2')?.textContent?.trim() ?? '',
          }))
          .filter((item) => item.label),
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => {
    if (!items.length) return undefined
    let frame = null

    function update() {
      frame = null
      const line = 120
      let current = items[0].id
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element && element.getBoundingClientRect().top <= line) current = item.id
      })
      if (document.documentElement.scrollHeight - (window.innerHeight + window.scrollY) <= line) {
        current = items[items.length - 1].id
      }
      setActiveId(current)
    }

    function onScroll() {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [items])

  if (items.length < 2) return null

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <nav
        aria-label="On this page"
        className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto px-2 py-10 pr-6 text-sm"
      >
        <div className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          On this page
        </div>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block border-l-2 px-3 py-1.5 transition ${
              activeId === item.id
                ? 'border-primary font-semibold text-primary'
                : 'border-transparent text-on-surface-variant hover:border-outline hover:text-on-surface'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
