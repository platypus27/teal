const warned = new Set<string>()

/**
 * Emits a one-time deprecation warning, silenced in production builds and
 * deduped per key so a warning fires once per process no matter how many
 * instances render. Wire this into props or components when deprecating an
 * API ahead of a major release (ADR-0006 records the first planned window).
 */
export function warnDeprecated(key: string, message: string) {
  if (warned.has(key) || typeof console === 'undefined') return
  const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
  if (isProduction) {
    warned.add(key)
    return
  }
  warned.add(key)
  console.warn(`[@kryv/teal] Deprecated: ${message}`)
}
