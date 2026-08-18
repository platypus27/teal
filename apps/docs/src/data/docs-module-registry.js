/**
 * Lightweight documentation registry consumed by the shell, search, and
 * pagination adapters. Full metadata and demo modules are loaded per route
 * by catalog.jsx.
 */
import { moduleIndexGroups } from './module-index.js'

const playgroundModules = new Set(['button', 'input', 'select', 'checkbox', 'switch', 'card', 'badge', 'dialog', 'empty-state', 'loading', 'pagination', 'separator'])

export const catalogGroups = moduleIndexGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => ({
    ...module,
    hasPlayground: playgroundModules.has(module.id),
  })),
}))

export const catalog = catalogGroups.flatMap((group) => group.modules)
