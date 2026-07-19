/**
 * Markdown generation for docs pages. Powers the in-app "Copy page" button
 * and the build-time llms.txt / llms-full.txt files. Plain JavaScript so the
 * same functions run in the browser and in Node build scripts.
 */

import { accessibility } from '../data/accessibility.js'
import { colorTokens, shapeNotes, typeTokens, visualTokens } from '../data/foundations.js'
import { installSteps, packageManagers, principles } from '../data/getting-started.js'
import { mergePropDocs } from '../data/prop-docs.js'
import { promotionRule } from '../data/recipes.js'

function fence(code, lang = 'jsx') {
  return `\`\`\`${lang}\n${code.replace(/^\n+|\n+$/g, '')}\n\`\`\``
}

function cell(value) {
  return String(value || '-').replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function collapse(lines) {
  return lines.join('\n').replaceAll(/\n{3,}/g, '\n\n').trim() + '\n'
}

export function propsTableMarkdown(name, props) {
  const rows = mergePropDocs(name, props)
  if (!rows.length) return '_This module forwards native element properties._'
  const lines = ['| Property | Type | Default | Description |', '| --- | --- | --- | --- |']
  for (const prop of rows) {
    const propName = `\`${prop.name}\`${prop.required ? ' (required)' : ''}`
    const type = prop.type ? `\`${cell(prop.type)}\`` : '-'
    const defaultValue = prop.defaultValue ? `\`${cell(prop.defaultValue)}\`` : '-'
    lines.push(`| ${propName} | ${type} | ${defaultValue} | ${cell(prop.description)} |`)
  }
  return lines.join('\n')
}

/**
 * @param {{ id: string, name: string, description: string, usage: string, apiNames: string[], imports?: string[], guidance?: { useWhen: string, avoidWhen: string, behavior: string, responsive: string }, examples?: Array<{ title: string, description?: string, source?: string }> }} module
 * @param {Array<{ displayName: string, props: Array<object> }>} apiEntries
 */
export function moduleMarkdown(module, apiEntries) {
  const imports = module.imports ?? module.apiNames
  const lines = [`# ${module.name}`, '', module.description, '', '## Usage', '']
  lines.push(fence(`import { ${imports.join(', ')} } from '@kryv/teal'`, 'js'))
  lines.push('')
  lines.push(fence(module.usage))

  if (module.guidance) {
    lines.push('', '## Design guidance', '')
    for (const [label, value] of [
      ['Use when', module.guidance.useWhen],
      ['Avoid when', module.guidance.avoidWhen],
      ['Behavior', module.guidance.behavior],
      ['Responsive', module.guidance.responsive],
    ]) {
      lines.push(`### ${label}`, '', value)
    }
  }

  if (module.examples?.length) {
    lines.push('', '## Examples')
    for (const example of module.examples) {
      lines.push('', `### ${example.title}`, '')
      if (example.description) lines.push(example.description, '')
      if (example.source) lines.push(fence(example.source))
    }
  }

  const docs = module.apiNames.flatMap((name) => apiEntries.filter((entry) => entry.displayName === name))
  if (docs.length) {
    lines.push('', '## Interface')
    for (const entry of docs) {
      lines.push('', `### ${entry.displayName}`, '', propsTableMarkdown(entry.displayName, entry.props))
    }
  }

  const guide = accessibility[module.id]
  if (guide) {
    lines.push('', '## Accessibility')
    if (guide.keyboard?.length) {
      lines.push('', '| Keys | Action |', '| --- | --- |')
      for (const row of guide.keyboard) {
        lines.push(`| ${row.keys.map((key) => `\`${key}\``).join(' + ')} | ${cell(row.action)} |`)
      }
    }
    if (guide.notes?.length) {
      lines.push('')
      for (const note of guide.notes) lines.push(`- ${note}`)
    }
  }

  return collapse(lines)
}

export function gettingStartedMarkdown() {
  const lines = [
    '# Getting started',
    '',
    'Teal provides typed React modules, semantic design tokens, and tested interaction behavior for Kryv applications.',
    '',
    '## Principles',
  ]
  for (const principle of principles) {
    lines.push('', `- **${principle.title}** - ${principle.text}`)
  }
  lines.push('', '## Installation')
  installSteps.forEach((step, index) => {
    lines.push('', `### ${index + 1}. ${step.title}`, '')
    if (step.description) lines.push(step.description, '')
    if (step.kind === 'packageManagers') {
      for (const manager of packageManagers) {
        lines.push(fence(manager.code, 'bash'), '')
      }
    } else if (step.code) {
      lines.push(fence(step.code, step.lang))
    }
  })
  return collapse(lines)
}

export function foundationsMarkdown() {
  const lines = [
    '# Foundations',
    '',
    'Semantic tokens keep visual decisions consistent across themes and products.',
    '',
    '## Color',
    '',
    'Use semantic roles instead of raw palette values.',
    '',
  ]
  for (const color of colorTokens) lines.push(`- **${color.name}** - \`${color.token}\``)
  lines.push('', '## Typography', '')
  for (const type of typeTokens) lines.push(`- **${type.label}** - \`${type.token}\``)
  lines.push('', '## Shape, elevation, and motion', '')
  for (const note of shapeNotes) lines.push(`- ${note}`)
  lines.push('', '## Visual tokens', '', 'Override these supported CSS properties at `:root` to tune Teal without rewriting module styles.', '')
  for (const token of visualTokens) lines.push(`- **${token.name}** - \`${token.token}\``)
  return collapse(lines)
}

/**
 * @param {Array<{ title: string, description: string, source?: string }>} recipeEntries
 */
export function recipesMarkdown(recipeEntries) {
  const lines = [
    '# Recipes',
    '',
    'Recipes demonstrate product composition without expanding the supported package interface prematurely.',
  ]
  for (const recipe of recipeEntries) {
    lines.push('', `## ${recipe.title}`, '', recipe.description, '')
    if (recipe.source) lines.push(fence(recipe.source))
  }
  lines.push('', '## Promotion rule', '', promotionRule)
  return collapse(lines)
}

/**
 * @param {{ version: string, entries: Array<{ version: string, groups: Array<{ label: string, items: string[] }> }> }} changelog
 */
export function changelogMarkdown(changelog) {
  const lines = [
    '# Changelog',
    '',
    `Versioned changes to @kryv/teal, generated from the changesets changelog. Current version: v${changelog.version}.`,
  ]
  if (!changelog.entries.length) {
    lines.push('', '_No published releases yet._')
  }
  for (const entry of changelog.entries) {
    lines.push('', `## v${entry.version}`)
    for (const group of entry.groups) {
      lines.push('', `### ${group.label}`, '')
      for (const item of group.items) lines.push(`- ${item}`)
    }
  }
  return collapse(lines)
}
