import { useEffect, useRef, type RefObject } from 'react'

export function useScrollSpy(
  idsKey: string,
  onActive: (id: string) => void,
  containerRef?: RefObject<HTMLElement | null>,
) {
  const callbackRef = useRef(onActive)

  useEffect(() => {
    callbackRef.current = onActive
  }, [onActive])

  useEffect(() => {
    // No IntersectionObserver (very old browsers, some test environments):
    // the nav still works, it just does not track scrolling.
    if (typeof IntersectionObserver === 'undefined') return
    // When a scroll container is given, only sections inside it are tracked
    // and it becomes the observer root; otherwise fall back to the document.
    const container = containerRef?.current ?? null
    const ids = idsKey.split(' ').filter(Boolean)
    const targets = ids
      .map((id) => (container ? container.querySelector(`[id="${CSS.escape(id)}"]`) : document.getElementById(id)))
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
      { root: container, rootMargin: '0px 0px -70% 0px' },
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [idsKey, containerRef])
}
