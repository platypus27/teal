// Post-processes the Tailwind v4 build of dist/styles.css into the exact
// selector vocabulary Teal has shipped since 1.0:
//
// 1. Strip @layer theme and @layer base. Teal's styles.css never shipped
//    v3 preflight (base.css is hand-authored) and the v4 default theme's
//    :root variables (--color-red-500, --tw-font-sans, ...) must not leak
//    into consumer pages. The few default-theme variables the generated
//    utilities reference are inlined below.
// 2. Inline --tw-spacing so spacing-derived utilities survive the strip.
// 3. Rewrite alpha-modifier color-mix emissions from v4's default oklab
//    space to v3's srgb space so tinted surfaces render identically.
// 4. Prefix every utility selector inside @layer utilities with teal-u-,
//    inserting after variant boundaries (bracket-aware) so the emitted
//    selectors match the v3 class strings component sources use, e.g.
//    .hover:teal-u-bg-surface\/15:hover and
//    .\[\&\:not\(\:disabled\)\]\:active\:teal-u-scale-\[0\.98\]:active.

/** Remove `@layer <name>{ ... }` blocks (balanced braces). */
function stripLayer(css, name) {
  let out = css
  for (;;) {
    const marker = `@layer ${name}{`
    const start = out.indexOf(marker)
    if (start < 0) break
    let depth = 0
    let end = -1
    for (let i = start + marker.length - 1; i < out.length; i += 1) {
      if (out[i] === '{') depth += 1
      else if (out[i] === '}') {
        depth -= 1
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }
    if (end < 0) throw new Error(`Unbalanced @layer ${name} block`)
    out = out.slice(0, start) + out.slice(end)
  }
  return out
}

/** Unwrap `@media (hover:hover){ ... }` blocks, keeping their rules. */
function unwrapHoverMedia(css) {
  const marker = '@media (hover:hover){'
  let out = css
  for (;;) {
    const start = out.indexOf(marker)
    if (start < 0) break
    let depth = 0
    let end = -1
    for (let i = start + marker.length - 1; i < out.length; i += 1) {
      if (out[i] === '{') depth += 1
      else if (out[i] === '}') {
        depth -= 1
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }
    if (end < 0) throw new Error('Unbalanced hover media block')
    out = out.slice(0, start) + out.slice(start + marker.length, end - 1) + out.slice(end)
  }
  return out
}

/** Remove the v4 default theme variables. Lightning CSS merges the design
 *  tokens' :root block with v4's default theme :root,:host block, so the
 *  strip is surgical: keep every --teal-* declaration, drop the v4 defaults
 *  (--tw-*, --font-sans, the default palette, --spacing, ...). */
function stripDefaultTheme(css) {
  const marker = ':root,:host{'
  const start = css.indexOf(marker)
  if (start < 0) return css
  let depth = 0
  let end = -1
  for (let i = start + marker.length - 1; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') {
      depth -= 1
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  if (end < 0) throw new Error('Unbalanced default theme block')
  const block = css.slice(start, end)
  if (!block.includes('--tw-default-font-family')) return css
  const inner = block.slice(marker.length, -1)
  const kept = inner
    .split(';')
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration.startsWith('--teal-'))
  return css.slice(0, start) + `:root{${kept.join(';')}}` + css.slice(end)
}

// Escape-aware scanning of a selector string. Returns the utility-bearing
// segment index when splitting on escaped-colon variant boundaries.
function splitVariantSegments(compound) {
  const segments = []
  let depth = 0
  let current = ''
  let boundary = -1
  for (let i = 0; i < compound.length; i += 1) {
    const two = compound.slice(i, i + 2)
    if (two === '\\[' || two === '\\(') depth += 1
    else if (two === '\\]' || two === '\\)') depth = Math.max(0, depth - 1)
    if (two === '\\:' && depth === 0) {
      segments.push(current)
      current = ''
      i += 1
      continue
    }
    current += compound[i]
  }
  segments.push(current)
  return segments
}

// Re-insert the teal-u- prefix into one compound selector. Variant-aware:
// the prefix lands on the utility name, after every variant boundary.
function prefixCompound(compound, spellings) {
  if (compound === '' || compound === '*') return compound
  // Arbitrary-property utilities ([appearance:textfield]) shipped unprefixed
  // in the v3 build; keep them that way.
  if (/^\.\\\[[a-z-]+\\:/.test(compound)) return compound
  // :is(...) / :where(...) wrapping the whole compound.
  const fnMatch = /^(:is|:where)\((.*)\)(.*)$/s.exec(compound)
  if (fnMatch) {
    return `${fnMatch[1]}(${prefixSelectorList(fnMatch[2], spellings)})${fnMatch[3]}`
  }
  if (!compound.startsWith('.')) return compound
  const segments = splitVariantSegments(compound)
  const last = segments.length - 1
  let utility = segments[last]
  // Trailing :is(...)/:where(...) groups ride on the utility
  // (.flex:is(:where(.group):hover *)); prefix the utility base and recurse
  // into the wrapper.
  const tailMatch = /^(.*?)((?::is|:where)\((?:[^()]|\([^()]*\))*\).*)$/s.exec(utility)
  if (tailMatch && tailMatch[1] !== '') {
    utility = `${prefixUtilityBase(tailMatch[1], segments.length === 1, spellings)}${recurseFnTails(tailMatch[2], spellings)}`
    segments[last] = utility
    return segments.join('\\:')
  }
  segments[last] = prefixUtilityBase(utility, segments.length === 1, spellings)
  return segments.join('\\:')
}

// Prefix one utility name (no variants inside). single=true when the name
// carries the leading dot/dash itself. spellings records which negative
// spellings the source uses per utility (v3 shipped exactly those).
function prefixUtilityBase(utility, single, spellings) {
  const unescaped = (text) => text.replace(/\\(.)/g, '$1')
  if (single) {
    const dashMatch = /^(\.-?)(.*)$/.exec(utility)
    if (!dashMatch) return utility
    if (dashMatch[1] === '.-') {
      const name = unescaped(dashMatch[2])
      const entry = spellings.get(name)
      // Only the double-dash spelling used: teal-u--top-16.
      if (entry?.doubleDash && !entry.dashFirst) return `.teal-u--${dashMatch[2]}`
    }
    return `${dashMatch[1]}teal-u-${dashMatch[2]}`
  }
  if (utility.startsWith('-')) {
    const rest = utility.slice(1)
    const entry = spellings.get(unescaped(rest))
    if (entry?.doubleDash && !entry.dashFirst) return `teal-u--${rest}`
    return `-teal-u-${rest}`
  }
  return `teal-u-${utility}`
}

// Recurse into every :is(...)/:where(...) group attached to a utility.
function recurseFnTails(text, doubleDash) {
  return text.replace(/(:is|:where)\(((?:[^()]|\([^()]*\))*)\)/g, (all, fn, inner) => {
    return `${fn}(${prefixSelectorList(inner, doubleDash)})`
  })
}

// Split a selector list into comma parts, then into compounds on top-level
// whitespace (whitespace inside :is(...)/:where(...)/:not(...) or escaped
// brackets stays inside its compound).
function splitCompounds(part) {
  const compounds = []
  let depth = 0
  let current = ''
  for (let i = 0; i < part.length; i += 1) {
    const char = part[i]
    const two = part.slice(i, i + 2)
    if (char === '(' || two === '\\[') depth += 1
    else if (char === ')' || two === '\\]') depth = Math.max(0, depth - 1)
    if (/\s/.test(char) && depth === 0) {
      compounds.push(current)
      current = ''
      continue
    }
    current += char
  }
  compounds.push(current)
  return compounds
}

function prefixSelectorList(list, spellings) {
  return list
    .split(',')
    .map((part) => splitCompounds(part).map((piece) => prefixCompound(piece, spellings)).join(' '))
    .join(',')
}

/** Walk a stylesheet body; rewrite selector lists, recursing into at-rules. */
function transformBody(css, start, end, topLevel, spellings) {
  let out = ''
  let i = start
  while (i < end) {
    const open = css.indexOf('{', i)
    if (open < 0 || open >= end) {
      out += css.slice(i, end)
      break
    }
    const prelude = css.slice(i, open)
    let depth = 1
    let close = open + 1
    while (close < end && depth > 0) {
      if (css[close] === '{') depth += 1
      else if (css[close] === '}') depth -= 1
      close += 1
    }
    if (depth !== 0) throw new Error('Unbalanced block while transforming utilities')
    const body = css.slice(open + 1, close - 1)
    if (prelude.trimStart().startsWith('@')) {
      const name = prelude.trim()
      const inner = name.startsWith('@layer utilities')
        ? transformBody(body, 0, body.length, false, spellings)
        : transformBody(body, 0, body.length, topLevel, spellings)
      out += prelude + '{' + inner + '}'
    } else {
      const transformed = topLevel ? prelude : prefixSelectorList(prelude, spellings)
      const bodyOut = transformBody(body, 0, body.length, false, spellings)
      // v3 shipped both spellings for negatives used both ways (only
      // translate-y-1/2 today): emit the missing spelling next to each
      // negative selector.
      for (const match of transformed.matchAll(/(?:^|[^a-zA-Z0-9-])\.-teal-u-([^\s,{]+)/g)) {
        const name = match[1].replace(/\\(.)/g, '$1')
        const entry = spellings.get(name)
        if (entry?.doubleDash) out += `.teal-u--${match[1]}{${bodyOut}}`
      }
      for (const match of transformed.matchAll(/(?:^|[^a-zA-Z0-9-])(\.teal-u--[^\s,{]+)/g)) {
        const name = match[1].slice('.teal-u--'.length).replace(/\\(.)/g, '$1')
        const entry = spellings.get(name)
        if (entry?.dashFirst) out += `.-teal-u-${match[1].slice('.teal-u--'.length)}{${bodyOut}}`
      }
      out += transformed + '{' + bodyOut + '}'
    }
    i = close
  }
  return out
}

/** v4 wraps every alpha-modifier utility in a fallback declaration plus an
 * @supports(color-mix) override. The fallback selector list can GROUP the
 * base utility with the modifier (`.base,.base\/5{fallback}`) while the
 * override lists only the modifier, so this walks rule pairs explicitly:
 * base selectors keep the fallback, modifier selectors keep the override.
 * Teal's browser matrix (Safari 16.4+, Chrome 111+, Firefox 128+) all
 * support color-mix, so the fallback only matters as the base rule. */
/** Split on top-level commas only; commas inside (), [], and escaped
 * brackets belong to arbitrary values and must not separate selectors. */
function splitSelectorList(text) {
  const parts = []
  let depth = 0
  let current = ''
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const two = text.slice(i, i + 2)
    // Track both raw and escaped parens/brackets; arbitrary values in
    // selectors escape everything (\\(, \\, ...).
    if (char === '(' || char === '[' || two === '\\(' || two === '\\[') depth += 1
    else if (char === ')' || char === ']' || two === '\\)' || two === '\\]') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  parts.push(current)
  return parts.map((part) => part.trim())
}

function stripModifierFallbacks(css) {
  const supports = '@supports (color:color-mix(in lab, red, red)){'
  let out = css
  for (;;) {
    const sIdx = out.indexOf(supports)
    if (sIdx < 0) break
    // The block is: FALLBACK_GROUP{fallback}@supports{ MODIFIER{tinted} }
    const innerStart = sIdx + supports.length
    const innerOpen = out.indexOf('{', innerStart)
    const innerClose = out.indexOf('}', innerOpen)
    const tintedSelectors = out.slice(innerStart, innerOpen)
    const tintedBody = out.slice(innerOpen + 1, innerClose)
    const supportsClose = innerClose + 1
    const fallbackClose = sIdx - 1
    const fallbackOpen = out.lastIndexOf('{', fallbackClose - 1)
    const ruleStart = out.lastIndexOf('}', fallbackOpen - 1) + 1
    if (fallbackOpen < 0 || out[fallbackClose] !== '}') throw new Error('Malformed modifier fallback pair')
    const fallbackSelectors = out.slice(ruleStart, fallbackOpen)
    const fallbackBody = out.slice(fallbackOpen + 1, fallbackClose)
    const inner = splitSelectorList(tintedSelectors)
    let replacement = ''
    for (const selector of splitSelectorList(fallbackSelectors)) {
      if (!inner.includes(selector)) replacement += `${selector}{${fallbackBody}}`
    }
    for (const selector of inner) {
      replacement += `${selector}{${tintedBody}}`
    }
    out = out.slice(0, ruleStart) + replacement + out.slice(supportsClose + 1)
  }
  return {
    replaceWithTransformed(spellings) {
      return transformBody(out, 0, out.length, false, spellings)
    },
  }
}

export function postProcessStyles(css, { spellings = new Map() } = {}) {
  let out = stripLayer(css, 'theme')
  out = stripLayer(out, 'base')
  out = stripDefaultTheme(out)
  out = unwrapHoverMedia(out)
  out = out.replaceAll('var(--tw-spacing)', '0.25rem')
  // v4 initializes the --tw-* variables twice: @property registrations for
  // modern engines and an @supports-gated universal initializer as a
  // fallback for old ones. The initializer is smaller, so keep it and
  // unwrap the @supports gate (Teal's matrix all matches modern behavior),
  // and drop the @property rules. The initializer is filtered to variables
  // some emitted rule actually references, which drops v4's pre-registered
  // defaults for utilities that never made the candidate set.
  out = out.replaceAll(/@property --tw-[^{]+\{[^}]*\}/g, '')
  {
    const marker = '@layer properties{'
    const start = out.indexOf(marker)
    if (start >= 0) {
      let depth = 0
      let end = -1
      for (let i = start + marker.length - 1; i < out.length; i += 1) {
        if (out[i] === '{') depth += 1
        else if (out[i] === '}') {
          depth -= 1
          if (depth === 0) {
            end = i + 1
            break
          }
        }
      }
      if (end < 0) throw new Error('Unbalanced @layer properties block')
      const block = out.slice(start, end)
      const universal = /(\*,:[^@{}]+\{([^{}]*)\})/.exec(block)
      if (universal) {
        const selector = universal[1].slice(0, universal[1].indexOf('{'))
        // Keep only variables some emitted rule actually references; v4
        // pre-registers defaults for utilities that never made it into the
        // candidate set (font stacks, numeric variants, ...).
        const rest = out.slice(0, start) + out.slice(end)
        const vars = universal[2]
          .split(';')
          .map((declaration) => declaration.trim())
          .filter((declaration) => {
            const name = /^(--tw-[a-z-]+)/.exec(declaration)?.[1]
            if (!name) return false
            if (/^--tw-(font|default)/.test(name)) return false
            const references = rest.split(name).length - 1
            return references > 0
          })
        out = out.slice(0, start) + `${selector}{${vars.join(';')}}` + out.slice(end)
      } else {
        out = out.slice(0, start) + out.slice(end)
      }
    }
  }
  // NOTE: the alpha-modifier fallback strip runs inside the utilities
  // layer only (see below); the tokens.css :root enhancement outside the
  // layer matches v3 and stays untouched.
  // v4 mixes alpha modifiers in oklab; v3 used srgb. Rewrite so tinted
  // surfaces render identically. transparent shortens to #0000 (same
  // premultiplied black), which keeps the tinted rules within the
  // stylesheet budget at parity selector count.
  out = out.replaceAll('color-mix(in oklab,', 'color-mix(in srgb,')
  out = out.replaceAll(/%, transparent\)/g, '%,#0000)')
  if (out.includes('@media (hover:hover)')) {
    throw new Error('v4 hover gating leaked into the compiled stylesheet')
  }
  if (out.includes('--tw-font-sans')) {
    throw new Error('v4 default theme variables leaked into the compiled stylesheet')
  }
  // Consumers run Tailwind 3 over this stylesheet (their PostCSS pipeline
  // inlines it via @import), and v3 errors on literal @layer blocks without
  // matching @tailwind directives. The v3 build was fully unlayered, so
  // unwrap every layer here; cascade behavior matches v3 because the
  // surviving custom rules carry the specificity and !important that the
  // component-layer comments document.
  out = out.replaceAll(/@layer [a-z, ]+;/g, '')
  for (const layer of ['components', 'utilities']) {
    const marker = `@layer ${layer}{`
    for (;;) {
      const at = out.indexOf(marker)
      if (at < 0) break
      let depth = 0
      let end = -1
      for (let i = at + marker.length - 1; i < out.length; i += 1) {
        if (out[i] === '{') depth += 1
        else if (out[i] === '}') {
          depth -= 1
          if (depth === 0) {
            end = i + 1
            break
          }
        }
      }
      if (end < 0) throw new Error(`Unbalanced @layer ${layer} block`)
      const content = out.slice(at + marker.length, end - 1)
      const processed = layer === 'utilities'
        ? stripModifierFallbacks(content).replaceWithTransformed(spellings)
        : content
      out = out.slice(0, at) + processed + out.slice(end)
    }
  }
  return out
}
