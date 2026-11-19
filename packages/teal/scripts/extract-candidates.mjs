// Extracts every teal-u-* class token from the package sources (the same
// raw-text scan Tailwind v3's content globs performed) and rewrites each to
// the unprefixed v4 candidate (variant stack kept, `teal-u-` removed). The
// v4 build compiles these plain candidates; scripts/prefix-utilities.mjs
// then re-inserts `teal-u-` into the emitted selectors, keeping the shipped
// class vocabulary byte-identical. Tokens that v3 spelled with the double
// dash after the prefix (teal-u--top-1) are reported separately so the
// prefixer can restore that exact spelling.

import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// Characters that can appear inside a class token (variants, arbitrary
// values, slashes). Whitespace and quotes always end a token.
const CLASSY = /[a-zA-Z0-9\-()[\]:&.#>_*=/+%]/
const UTILITY = /^[a-zA-Z0-9.-]+(?:\/(?:[0-9.]+|\[[0-9.]+\]))?(?:-\[[^\]]*\])?$/

// A variant segment concatenates word runs and bracketed/parenthesized
// groups ("hover", "data-[state=open]", "[&:not(:disabled)]"). Scanned
// linearly with balanced brackets; regex alternation backtracks
// catastrophically on the dashes in long segments.
function isVariantSegment(segment) {
  let i = 0
  while (i < segment.length) {
    const char = segment[i]
    if (char === '[' || char === '(') {
      const close = char === '[' ? ']' : ')'
      let depth = 0
      let end = -1
      for (let j = i; j < segment.length; j += 1) {
        if (segment[j] === char) depth += 1
        else if (segment[j] === close) {
          depth -= 1
          if (depth === 0) {
            end = j
            break
          }
        }
      }
      if (end < 0) return false
      i = end + 1
    } else {
      let j = i
      while (j < segment.length && /[a-zA-Z0-9/-]/.test(segment[j])) j += 1
      if (j === i) return false
      i = j
    }
  }
  return true
}

// Split a variant stack on top-level colons; colons inside
// brackets/parenthesized groups ([&:not(:disabled)], [data-[...]]) belong
// to the variant itself.
function splitVariants(text) {
  const segments = []
  let depth = 0
  let current = ''
  for (const char of text) {
    if (char === '[' || char === '(') depth += 1
    else if (char === ']' || char === ')') depth = Math.max(0, depth - 1)
    if (char === ':' && depth === 0) {
      segments.push(current)
      current = ''
      continue
    }
    current += char
  }
  segments.push(current)
  return segments
}

// Linear validation: a token is `variant:variant:...utility` where the
// utility is what follows `teal-u-`. No nested-quantifier regexes, so long
// minified blobs cannot trigger catastrophic backtracking.
function parseToken(text) {
  const at = text.lastIndexOf('teal-u-')
  if (at < 0) return null
  const utilityText = text.slice(at + 'teal-u-'.length)
  if (!UTILITY.test(utilityText)) return null
  const separator = at > 0 ? text[at - 1] : ''
  const negative = separator === '-' ? '-' : ''
  const variantsText = separator === ':' ? text.slice(0, at - 1) : ''
  if (variantsText === '') return `${negative}${utilityText}`
  if (variantsText.length > 100) return null
  const variants = splitVariants(variantsText)
  if (variants.some((segment) => !isVariantSegment(segment))) return null
  return `${negative}${variantsText}:${utilityText}`
}

function* tokensInChunk(chunk) {
  let current = ''
  let depth = 0
  const flush = function* (raw) {
    let text = raw
    // Trim characters that cannot start a class.
    text = text.replace(/^[^a-zA-Z0-9\-[(.]+/, '')
    // Characters that cannot end a class.
    text = text.replace(/[^a-zA-Z0-9\])/-]+$/, '')
    if (!text.includes('teal-u-')) {
      // Standalone arbitrary-property utilities ([appearance:textfield])
      // carry no teal-u prefix; v3's content scan compiled them as-is.
      if (/^\[[a-zA-Z-]+:[^\s\]]+\]$/.test(text)) {
        yield { candidate: text, spelling: 'plain', utility: '' }
      }
      return
    }
    const token = parseToken(text)
    if (token) {
      yield {
        candidate: token,
        spelling: text.includes('teal-u--') ? 'double-dash' : token.startsWith('-') ? 'dash-first' : 'plain',
        utility: token.replace(/^-/, ''),
      }
    }
  }
  for (const char of chunk) {
    if (char === '[' || char === '(') depth += 1
    else if (char === ']' || char === ')') depth = Math.max(0, depth - 1)
    if (CLASSY.test(char) || (char === ',' && depth > 0)) {
      current += char
    } else {
      yield* flush(current)
      current = ''
    }
  }
  yield* flush(current)
}

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (/\.(ts|tsx)$/.test(entry.name)) yield path
  }
}

export async function extractCandidates(sourceRoot) {
  const candidates = new Set()
  // v3 shipped exactly the negative spellings used in source (teal-u--top-1
  // vs -teal-u-top-1); record both directions per utility.
  const spellings = new Map()
  for await (const file of walk(sourceRoot)) {
    const text = await readFile(file, 'utf8')
    for (const chunk of text.split(/[\s"'`]+/)) {
      for (const found of tokensInChunk(chunk)) {
        candidates.add(found.candidate)
        if (found.utility && found.spelling !== 'plain') {
          const entry = spellings.get(found.utility) ?? { dashFirst: false, doubleDash: false }
          entry[found.spelling === 'dash-first' ? 'dashFirst' : 'doubleDash'] = true
          spellings.set(found.utility, entry)
        }
      }
    }
  }
  return { candidates: [...candidates].sort(), spellings }
}

export function candidatesDocument(candidates) {
  // HTML, not JSX: v4's JavaScript candidate scanner rejects bracket-led
  // tokens like [appearance:textfield], while HTML class attributes accept
  // every candidate form.
  const chunks = []
  for (let i = 0; i < candidates.length; i += 200) {
    chunks.push(`<div class="${candidates.slice(i, i + 200).join(' ')}"></div>`)
  }
  return chunks.join('\n') + '\n'
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const root = resolve(import.meta.dirname, '../src')
  const { candidates, spellings } = await extractCandidates(root)
  console.log(`${candidates.length} candidates (${spellings.size} negatives)`)
  for (const candidate of candidates.slice(0, 40)) console.log(candidate)
}
