import { useEffect, useRef } from 'react'

export function useScrollSpy(idsKey: string, onActive: (id: string) => void) {
  const callbackRef = useRef(onActive)

  useEffect(() => {
    callbackRef.current = onActive
  }, [onActive])

  useEffect(() => {
    // No IntersectionObserver (very old browsers, some test environments):
    // the nav still works, it just does not track scrolling.
    if (typeof IntersectionObserver === 'undefined') return
    const ids = idsKey.split(' ').filter(Boolean)
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbackRef.current(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [idsKey])
}
