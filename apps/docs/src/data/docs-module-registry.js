/**
 * Lightweight documentation registry consumed by the shell, search, and
 * pagination adapters. Demo modules and playground implementations live in
 * catalog.jsx and are loaded only by a module route.
 */
import { moduleGroups, moduleGuidance } from './module-meta.js'

const playgroundModules = new Set(['button', 'input', 'select', 'checkbox', 'switch', 'card', 'badge', 'dialog', 'empty-state', 'loading', 'pagination', 'separator'])

export const catalogGroups = moduleGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => ({
    ...module,
    guidance: moduleGuidance[module.id],
    hasPlayground: playgroundModules.has(module.id),
  })),
}))

export const catalog = catalogGroups.flatMap((group) => group.modules)
