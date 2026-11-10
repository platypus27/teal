import { isExternalUrl, isSafeUrl, sanitizeHref } from '../src/url-safety'

const base = 'https://app.example/dashboard'

describe('isExternalUrl', () => {
  it.each([
    'https://other.example/x',
    '//other.example/x',
    'mailto:team@example.com',
    'tel:+15551234',
  ])('reports %s as external', (url) => {
    expect(isExternalUrl(url, base)).toBe(true)
  })

  it.each(['/docs', './page', '../x', '?tab=2', '#section', 'https://app.example/docs'])(
    'reports %s as internal',
    (url) => {
      expect(isExternalUrl(url, base)).toBe(false)
    },
  )
})

describe('isSafeUrl', () => {
  it.each([
    '/docs/page',
    '/',
    '/docs%20guide/page',
    '#section',
    '#',
    './page',
    '../up',
    'page.html',
    'docs/guide',
    '?tab=2',
    'https://example.com/docs',
    'HTTPS://EXAMPLE.COM',
    'https://example.com:8080/x?y=1#z',
    'https://app.example/local',
    'mailto:someone@example.com',
  ])('accepts %j', (url) => {
    expect(isSafeUrl(url, undefined, base)).toBe(true)
  })

  it.each([
    '//attacker.example/login',
    '/.//attacker.example',
    '/\\attacker.example',
    '/.\\attacker.example',
    '\\\\attacker.example',
    '\\attacker.example',
    'https:\\\\attacker.example/x',
    'http:/attacker.example',
    'http://attacker.example',
    'tel:+15551234',
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'java script:alert(1)',
    '%6Aavascript:alert(1)',
    '&#106;avascript:alert(1)',
    '&#x6a;avascript:alert(1)',
    'data:text/html;base64,PGI+',
    'vbscript:msgbox(1)',
    ' https://example.com',
    '\thttps://example.com',
    '\nhttps://example.com',
    'https://example.com/x y',
    'https://example.com/\u0001x',
    '\u00A0https://example.com',
    '\u2028https://example.com',
    '\uFEFFhttps://example.com',
    '\u00ADhttps://example.com',
    '\u200Bhttps://example.com',
    '/%2F/evil.com',
    '/%2f/evil.com',
    '/%5C/evil.com',
    '/%5c/evil.com',
    '/%252F/evil.com',
    '/%252f/evil.com',
    '/%255C/evil.com',
    '/%255c/evil.com',
    'https://evil.com@good.com',
    'https://user:pass@good.com',
    '',
  ])('rejects %j', (url) => {
    expect(isSafeUrl(url, undefined, base)).toBe(false)
  })

  it('allows http: and tel: only when passed via allowedSchemes', () => {
    const options = { allowedSchemes: ['http:', 'tel:'] as const }

    expect(isSafeUrl('http://example.com', options, base)).toBe(true)
    expect(isSafeUrl('tel:+15551234', options, base)).toBe(true)
    expect(isSafeUrl('http://example.com', undefined, base)).toBe(false)
    expect(isSafeUrl('tel:+15551234', undefined, base)).toBe(false)
  })

  it('narrows links through isAllowedHref', () => {
    const options = { isAllowedHref: (href: string) => href.startsWith('https://allowed.example/') }

    expect(isSafeUrl('https://allowed.example/x', options, base)).toBe(true)
    expect(isSafeUrl('https://other.example/x', options, base)).toBe(false)
    expect(isSafeUrl('/docs', options, base)).toBe(false)
  })
})

describe('sanitizeHref', () => {
  it('strips cc, bcc and body from mailto links', () => {
    expect(sanitizeHref('mailto:team@example.com?cc=other@example.com&subject=Hello&body=secret', undefined, base)).toBe(
      'mailto:team@example.com?subject=Hello',
    )
    expect(sanitizeHref('mailto:team@example.com?bcc=other@example.com', undefined, base)).toBe('mailto:team@example.com')
  })

  it('returns the raw href for same-origin and absolute links', () => {
    expect(sanitizeHref('/docs/page', undefined, base)).toBe('/docs/page')
    expect(sanitizeHref('./page', undefined, base)).toBe('./page')
    expect(sanitizeHref('#section', undefined, base)).toBe('#section')
    expect(sanitizeHref('https://example.com/docs', undefined, base)).toBe('https://example.com/docs')
  })

  it('returns null for unsafe URLs', () => {
    expect(sanitizeHref('//attacker.example', undefined, base)).toBeNull()
    expect(sanitizeHref('javascript:alert(1)', undefined, base)).toBeNull()
  })
})
