import { useEffect, useRef } from 'react'
import { FlaskConical, Palette } from 'lucide-react'
import {
  VerticalNav,
  VerticalNavBrand,
  VerticalNavItem,
  VerticalNavList,
  VerticalNavSection,
} from '@kryv/teal'
import { catalogGroups } from '../data/docs-module-registry.js'
import changelog from '../generated/changelog.json'

export function Sidebar({ navOpen, setNavOpen }) {
  const { pathname } = window.location
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
          <a href="/" className="flex items-center gap-3" onClick={() => setNavOpen(false)}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-primary text-teal-on-primary">
              <Palette className="size-5" />
            </span>
            <span>
              <span className="flex items-center gap-2 font-teal-headline text-lg font-extrabold leading-none">
                Teal
                <span className="rounded-full bg-teal-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-teal-primary">
                  v{changelog.version}
                </span>
              </span>
              <span className="mt-1 block text-xs text-teal-on-surface-variant">Kryv design system</span>
            </span>
          </a>
        </VerticalNavBrand>

        <VerticalNavList>
          <VerticalNavSection label="Start">
            <VerticalNavItem ref={firstLinkRef} as="a" href="/" active={active('/', true)} onClick={() => setNavOpen(false)}>
              Getting started
            </VerticalNavItem>
            <VerticalNavItem as="a" href="/foundations" active={active('/foundations')} onClick={() => setNavOpen(false)}>
              Foundations
            </VerticalNavItem>
            <VerticalNavItem as="a" href="/changelog" active={active('/changelog')} onClick={() => setNavOpen(false)}>
              Changelog
            </VerticalNavItem>
          </VerticalNavSection>
          {catalogGroups.map((group) => (
            <VerticalNavSection key={group.name} label={group.name}>
              {group.modules.map((module) => (
                <VerticalNavItem
                  key={module.id}
                  as="a"
                  href={`/modules/${module.id}`}
                  active={active(`/modules/${module.id}`)}
                  onClick={() => setNavOpen(false)}
                >
                  {module.name}
                  {module.hasPlayground ? (
                    <FlaskConical aria-hidden="true" className="ml-auto size-3.5 text-teal-primary/70" />
                  ) : null}
                </VerticalNavItem>
              ))}
            </VerticalNavSection>
          ))}
          <VerticalNavSection label="Patterns">
            <VerticalNavItem as="a" href="/recipes" active={active('/recipes')} onClick={() => setNavOpen(false)}>
              Recipes
            </VerticalNavItem>
          </VerticalNavSection>
        </VerticalNavList>
      </VerticalNav>
    </>
  )
}
