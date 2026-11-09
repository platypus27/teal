// eslint-disable-next-line no-control-regex -- matching control characters is the point of this guard
const unsafeCharacterPattern = /[\s\u0000-\u001F\u007F]/

const absoluteUrlPattern = /^(https?:\/\/|mailto:)/i

/**
 * Whether a URL parsed from user- or model-authored content may render as a
 * clickable link. Same-origin paths with exactly one leading slash (never `//`
 * or `/\`), `#` fragments, and `https:`, `http:`, and `mailto:` URLs are
 * allowed. Protocol-relative references, backslash tricks, and obfuscated or
 * percent-encoded schemes are rejected.
 */
export function isSafeUrl(url: string): boolean {
  if (unsafeCharacterPattern.test(url)) return false
  if (url.startsWith('#')) return true
  if (url.startsWith('/')) return !url.startsWith('//') && !url.startsWith('/\\')
  return absoluteUrlPattern.test(url)
}

/**
 * Whether a safe URL points off-site and therefore needs `rel="noopener
 * noreferrer"` on the rendered anchor. Same-origin paths and fragments are
 * internal.
 */
export function isExternalUrl(url: string): boolean {
  return absoluteUrlPattern.test(url)
}
