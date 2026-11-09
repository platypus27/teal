import { isSafeUrl } from '../src/url-safety'

describe('isSafeUrl', () => {
  it.each([
    '/docs/page',
    '/',
    '#section',
    '#',
    'https://example.com/docs',
    'HTTPS://EXAMPLE.COM',
    'http://example.com',
    'https://example.com:8080/x?y=1#z',
    'mailto:someone@example.com',
  ])('accepts %s', (url) => {
    expect(isSafeUrl(url)).toBe(true)
  })

  it.each([
    '//attacker.example/login',
    '/\\attacker.example',
    '\\\\attacker.example',
    '\\attacker.example',
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'java script:alert(1)',
    '%6Aavascript:alert(1)',
    'data:text/html;base64,PGI+',
    'vbscript:msgbox(1)',
    ' https://example.com',
    '\thttps://example.com',
    'https://example.com/x y',
    'https://example.com/\u0001x',
    '',
  ])('rejects %j', (url) => {
    expect(isSafeUrl(url)).toBe(false)
  })
})
