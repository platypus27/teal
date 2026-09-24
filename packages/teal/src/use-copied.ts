import { useEffect, useRef, useState } from 'react'

/**
 * Tracks a brief "copied" confirmation: `markCopied` re-arms the state and the
 * flag resets itself after `resetAfterMs`, clearing any pending timer on unmount.
 */
export function useCopied(resetAfterMs = 1600) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    },
    [],
  )

  function markCopied() {
    setCopied(true)
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), resetAfterMs)
  }

  return [copied, markCopied] as const
}
