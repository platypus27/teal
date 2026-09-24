/**
 * Lightweight documentation registry consumed by the shell, search, and
 * pagination adapters. Full metadata and demo modules are loaded per route
 * by catalog.jsx.
 */
import { moduleIndexGroups } from './module-index.js'
import { deriveAutoControls } from '../lib/playground.js'

// Modules with hand-crafted playground configs in catalog.jsx.
const curatedPlaygroundModules = new Set(['button', 'input', 'select', 'checkbox', 'switch', 'card', 'badge', 'dialog', 'empty-state', 'loading', 'pagination', 'separator'])

// Static props for modules whose bare render would be unnamed or whose
// required accessible name is not derivable from primitive props.
const autoPlaygroundStaticProps = {
  'calendar-heatmap': { 'aria-label': 'Sample calendar heatmap' },
  'gauge-chart': { 'aria-label': 'Sample gauge' },
  slider: { 'aria-label': 'Sample slider' },
}

// Modules whose primitives-only API derives controls but renders an empty or
// misleading preview without wiring (remote assets, context, child content).
const autoPlaygroundExclusions = new Set([
  'bulk-action-bar',
  'chart-container',
  'focus-trap',
  'image-viewer',
  'infinite-scroll',
  'lazy-image',
  'marquee',
  'reveal',
])

/**
 * Auto playgrounds: derived from the primary export's generated prop types, so
 * every module whose controls can be expressed with primitives gets one.
 */
const autoPlaygrounds = {}
for (const group of moduleIndexGroups) {
  for (const module of group.modules) {
    if (curatedPlaygroundModules.has(module.id) || autoPlaygroundExclusions.has(module.id)) continue
    const primary = module.apiNames?.[0]
    if (primary !== undefined && deriveAutoControls(primary) !== null) {
      const derived = primary !== undefined ? deriveAutoControls(primary) : null
      if (derived !== null) {
        autoPlaygrounds[module.id] = {
          component: primary,
          controls: derived.controls,
          staticProps: { ...derived.staticProps, ...(autoPlaygroundStaticProps[module.id] ?? {}) },
        }
      }
    }
  }
}

export const catalogGroups = moduleIndexGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => ({
    ...module,
    hasPlayground: curatedPlaygroundModules.has(module.id) || autoPlaygrounds[module.id] !== undefined,
    ...(autoPlaygrounds[module.id] !== undefined ? { playground: autoPlaygrounds[module.id] } : {}),
  })),
}))

export const catalog = catalogGroups.flatMap((group) => group.modules)
