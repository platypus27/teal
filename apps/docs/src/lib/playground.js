import { propDocs } from '../data/prop-docs.js'
import api from '../generated/api.json'

function parseUnion(type) {
  if (typeof type !== 'string') return null
  const values = []
  for (const part of type.split('|')) {
    const trimmed = part.trim()
    if (trimmed === 'null' || trimmed === 'undefined') continue
    const match = /^"(.*)"$/.exec(trimmed)
    if (!match) return null
    values.push(match[1])
  }
  return values.length ? values : null
}

function inferFromType(type) {
  if (type === 'boolean') return { kind: 'boolean' }
  if (type === 'string') return { kind: 'text' }
  if (type === 'number') return { kind: 'number' }
  const options = parseUnion(type)
  return options ? { kind: 'select', options } : null
}

function parseDefault(raw, kind) {
  if (raw === '' || raw === undefined || raw === null) return undefined
  if (kind === 'boolean') return raw === true || raw === 'true'
  if (kind === 'number') {
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  const match = /^"(.*)"$/.exec(String(raw))
  return match ? match[1] : String(raw)
}

function fallbackDefault(kind, options) {
  if (kind === 'boolean') return false
  if (kind === 'number') return 0
  if (kind === 'select') return options[0]
  return ''
}

/**
 * Merges curated control specs with generated api.json metadata and the
 * prop-docs overlay so options and defaults stay in sync with the source.
 */
export function resolveControls(componentName, specs) {
  const entry = api.find((item) => item.displayName === componentName)
  return specs.map((spec) => {
    const generated = entry?.props.find((prop) => prop.name === spec.name)
    const overlay = propDocs[componentName]?.[spec.name]
    const inferred = inferFromType(generated?.type) ?? inferFromType(overlay?.type) ?? null
    const control = { ...(inferred ?? {}), ...spec }
    if (!control.kind) {
      throw new Error(`Playground control "${componentName}.${spec.name}" must declare a kind`)
    }
    if (control.kind === 'select' && !control.options?.length) {
      throw new Error(`Playground control "${componentName}.${spec.name}" must declare options`)
    }
    const resolvedDefault =
      control.defaultValue ??
      parseDefault(overlay?.defaultValue, control.kind) ??
      parseDefault(generated?.defaultValue, control.kind)
    control.defaultValue = resolvedDefault ?? fallbackDefault(control.kind, control.options)
    control.label = control.label ?? control.name
    return control
  })
}

export function coerceValue(raw, control) {
  if (raw === null) return control.defaultValue
  if (control.kind === 'boolean') return raw === 'true'
  if (control.kind === 'number') {
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : control.defaultValue
  }
  if (control.kind === 'select' && !control.options.includes(raw)) return control.defaultValue
  return raw
}

function escapeAttr(value) {
  return String(value).replace(/"/g, '&quot;')
}

/** Generates the JSX snippet for the current playground state. */
export function generateJsx(componentName, values, controls) {
  const props = []
  let children
  for (const control of controls) {
    const value = values[control.name]
    if (control.name === 'children') {
      children = value
      continue
    }
    if (value === undefined || value === null || value === '') continue
    if (!control.required && value === control.defaultValue) continue
    const propName = control.as ?? control.name
    if (control.kind === 'boolean') {
      if (value || control.required) props.push(value ? propName : `${propName}={false}`)
    } else if (control.kind === 'number') {
      props.push(`${propName}={${value}}`)
    } else {
      props.push(`${propName}="${escapeAttr(value)}"`)
    }
  }
  if (!children) {
    if (props.length === 0) return `<${componentName} />`
    if (props.length === 1) return `<${componentName} ${props[0]} />`
    return `<${componentName}\n${props.map((prop) => `  ${prop}`).join('\n')}\n/>`
  }
  const open =
    props.length === 0
      ? `<${componentName}>`
      : `<${componentName}\n${props.map((prop) => `  ${prop}`).join('\n')}\n>`
  return `${open}\n  ${children}\n</${componentName}>`
}
