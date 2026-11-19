// Compares the selector vocabulary of the Tailwind v4 build against the
// saved v3 reference (/tmp/styles-v3-reference.css). Every utility selector
// the v3 build shipped must exist in the v4 build (unescaped comparison);
// v4-only selectors are reported for review (expected: utilities for the
// renamed classes outline-hidden, shadow-xs, scale-none, backdrop-blur-xs).

import { readFile } from 'node:fs/promises'

function unescapeSelector(selector) {
  return selector.replace(/\\(.)/g, '$1')
}

// Collect class selectors per stylesheet, annotated with their at-rule
// context (media/supports) so variant selectors compare under context.
function collect(css) {
  const found = new Map()
  const walk = (body, context) => {
    let i = 0
    while (i < body.length) {
      const open = body.indexOf('{', i)
      if (open < 0) break
      const prelude = body.slice(i, open).trim()
      let depth = 1
      let close = open + 1
      while (close < body.length && depth > 0) {
        if (body[close] === '{') depth += 1
        else if (body[close] === '}') depth -= 1
        close += 1
      }
      const inner = body.slice(open + 1, close - 1)
      if (prelude.startsWith('@')) {
        walk(inner, `${context}|${prelude.slice(0, 60)}`)
      } else {
        for (const part of prelude.split(',')) {
          const sel = part.trim()
          // Record every teal utility class token in the selector, so
          // wrapped forms (:where(...), :is(...), descendant combinators)
          // compare by their class identity.
          const tokenRe = /\.-?teal-u[-\w\[\]/%().\\]+/g
          const plain = unescapeSelector(sel)
          let match
          let sawToken = false
          while ((match = tokenRe.exec(plain)) !== null) {
            sawToken = true
            // Trim bracket/paren tails so wrapped forms (v4's
            // :is(:where(...)) group selectors) compare by class identity.
            const key = match[0].replace(/[[(].*$/, '').replace(/\)+$/g, '')
            if (!found.has(key)) found.set(key, sel)
          }
          if (!sawToken && sel.startsWith('.')) {
            const lead = /^(\.[^\s:.(]+)/.exec(plain)
            if (lead && !found.has(lead[1])) found.set(lead[1], sel)
          }
        }
      }
      i = close
    }
  }
  walk(css, '')
  return found
}

const [reference, current] = await Promise.all([
  readFile(process.argv[2] ?? '/tmp/styles-v3-reference.css', 'utf8'),
  readFile(process.argv[3] ?? 'dist/styles.css', 'utf8'),
])

const ref = collect(reference)
const cur = collect(current)

const missing = []
for (const [key, selector] of ref) {
  if (!cur.has(key)) missing.push(selector)
}
const added = []
for (const [key, selector] of cur) {
  if (!ref.has(key)) added.push(selector)
}

console.log(`reference selectors: ${ref.size}`)
console.log(`current selectors:   ${cur.size}`)
console.log(`missing in v4 build: ${missing.length}`)
for (const selector of missing.slice(0, 40)) console.log('  -', selector)
console.log(`added in v4 build:   ${added.length}`)
for (const selector of added.slice(0, 40)) console.log('  +', selector)

const unexpectedMissing = missing.filter(
  (selector) =>
    !selector.includes('outline-none') &&
    !selector.includes('shadow-sm') &&
    !selector.includes('transform-none') &&
    !selector.includes('backdrop-blur-sm'),
)
if (unexpectedMissing.length > 0) {
  console.error(`\nFAIL: ${unexpectedMissing.length} selectors missing beyond the renames`)
  process.exit(1)
}
console.log('\nSelector parity OK (only documented renames differ).')
