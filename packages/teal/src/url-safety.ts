export interface MarkdownLinkOptions {
  /** Additional URL schemes allowed on absolute links, e.g. `['http:', 'tel:']`. `https:` and (sanitized) `mailto:` are always allowed. */
  allowedSchemes?: readonly string[]
  /** Narrows which hrefs render as links. Receives the href that would be rendered; return false to render the text literally. */
  isAllowedHref?: (href: string) => boolean
}

// eslint-disable-next-line no-control-regex -- matching control characters is the point of this guard
const unsafeCharacterPattern = /[\s\u0000-\u001F\u007F\u00AD\u200B-\u200D\u2028\u2029\uFEFF]/
// eslint-disable-next-line no-control-regex -- matching control characters is the point of this guard
const decodedControlPattern = /[\u0000-\u001F\u007F]/
const numericEntityPattern = /&#(?:x[0-9a-f]+|\d+);/i
const maxDecodeRounds = 10
const fallbackBaseUrl = 'http://localhost/'
const httpsScheme = 'https:'
const mailtoScheme = 'mailto:'
/** mailto parameters that may leak the message to extra recipients or forge content; stripped before rendering. */
const strippedMailtoParams = ['cc', 'bcc', 'body']

function baseUrl(base?: string): URL {
  try {
    return new URL(base ?? (typeof window !== 'undefined' ? window.location.href : fallbackBaseUrl))
  } catch {
    return new URL(fallbackBaseUrl)
  }
}

function resolveUrl(url: string, base?: string): URL | null {
  try {
    return new URL(url, baseUrl(base))
  } catch {
    return null
  }
}

/** Whether a URL resolves to a different origin than `base` (defaults to the current document). */
export function isExternalUrl(url: string, base?: string): boolean {
  const resolved = resolveUrl(url, base)
  return resolved !== null && resolved.origin !== baseUrl(base).origin
}

function stripMailtoParams(resolved: URL): string {
  const params = new URLSearchParams(resolved.search)
  for (const param of strippedMailtoParams) params.delete(param)
  const query = params.toString()
  return `mailto:${resolved.pathname}${query === '' ? '' : `?${query}`}`
}

/** True when the URL opens with a percent-encoded ASCII letter, an obfuscated scheme start such as `%6aavascript:`. */
function startsWithEncodedLetter(url: string): boolean {
  const match = /^%([0-9a-f]{2})/i.exec(url)
  if (match === null) return false
  const code = Number.parseInt(match[1]!, 16)
  return (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)
}

/**
 * True when the first path segment of a resolved pathname decodes to a slash,
 * backslash, or ASCII control character: a server that decodes before
 * redirecting would turn `/%2F/` into `//` and `/%09/` into a control-led
 * path that URL parsers normalize to `//`. Dot segments are already resolved
 * by `new URL`, so the pathname is what the server would see.
 */
function firstSegmentDecodesToDanger(pathname: string): boolean {
  const rest = pathname.startsWith('/') ? pathname.slice(1) : pathname
  const end = rest.search(/[/?#]/)
  let segment = end === -1 ? rest : rest.slice(0, end)
  if (!segment.includes('%')) return false
  for (let rounds = 0; rounds < maxDecodeRounds; rounds += 1) {
    let decoded: string
    try {
      decoded = decodeURIComponent(segment)
    } catch {
      return false
    }
    if (decoded === segment) {
      return decoded.startsWith('/') || decoded.startsWith('\\') || decodedControlPattern.test(decoded)
    }
    segment = decoded
  }
  return true
}

function approve(href: string, options?: MarkdownLinkOptions): string | null {
  return options?.isAllowedHref !== undefined && !options.isAllowedHref(href) ? null : href
}

/**
 * Returns the href to render for a URL parsed from user- or model-authored
 * content, or null when the URL must not become a link. Rejects
 * protocol-relative references, backslashes, whitespace, control and
 * zero-width characters, numeric HTML entities, first path segments that
 * decode to a slash, backslash, or control character, absolute URLs with
 * userinfo, and non-allowlisted schemes.
 * Same-origin relative links pass through unchanged; `mailto:` links arrive
 * with `cc`, `bcc` and `body` stripped.
 */
export function sanitizeHref(url: string, options?: MarkdownLinkOptions, base?: string): string | null {
  if (url === '') return null
  if (unsafeCharacterPattern.test(url) || url.includes('\\') || numericEntityPattern.test(url)) return null
  if (url.startsWith('//') || startsWithEncodedLetter(url)) return null
  const resolved = resolveUrl(url, base)
  if (resolved === null || resolved.pathname.startsWith('//')) return null
  if (firstSegmentDecodesToDanger(resolved.pathname)) return null
  if (resolved.username !== '' || resolved.password !== '') return null
  if (isExternalUrl(url, base)) {
    const schemeAllowed =
      resolved.protocol === httpsScheme ||
      resolved.protocol === mailtoScheme ||
      (options?.allowedSchemes ?? []).includes(resolved.protocol)
    if (!schemeAllowed) return null
    return approve(resolved.protocol === mailtoScheme ? stripMailtoParams(resolved) : url, options)
  }
  return approve(url, options)
}

/** Whether a URL parsed from user- or model-authored content may render as a clickable link. */
export function isSafeUrl(url: string, options?: MarkdownLinkOptions, base?: string): boolean {
  return sanitizeHref(url, options, base) !== null
}
