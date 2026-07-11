import { createElement, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Pagination,
  Progress,
  Select,
  Separator,
  Switch,
} from '@kryv/teal'
import { CodeBlock } from './CodeBlock.jsx'
import { coerceValue, generateJsx, resolveControls } from '../lib/playground.js'

const registry = { Badge, Button, Checkbox, Dialog, Input, Pagination, Progress, Select, Separator, Switch }

function PlaygroundControl({ control, value, onChange }) {
  if (control.kind === 'boolean') {
    return (
      <Switch
        size="sm"
        label={control.label}
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
    )
  }
  if (control.kind === 'select') {
    return (
      <span className="grid gap-1">
        <span className="font-mono text-xs text-on-surface-variant">{control.label}</span>
        <Select
          size="sm"
          aria-label={control.label}
          value={String(value)}
          onValueChange={onChange}
          options={control.options.map((option) => ({ value: option, label: option }))}
        />
      </span>
    )
  }
  return (
    <label className="grid gap-1">
      <span className="font-mono text-xs text-on-surface-variant">{control.label}</span>
      <Input
        size="sm"
        type={control.kind === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(event) => {
          if (control.kind !== 'number') {
            onChange(event.target.value)
            return
          }
          const parsed = event.target.valueAsNumber
          onChange(Number.isFinite(parsed) ? parsed : control.defaultValue)
        }}
      />
    </label>
  )
}

export function Playground({ config }) {
  const controls = useMemo(() => resolveControls(config.component, config.controls), [config])
  const [searchParams, setSearchParams] = useSearchParams()

  const values = {}
  for (const control of controls) {
    values[control.name] = coerceValue(searchParams.get(control.name), control)
  }

  function commit(draft) {
    const next = new URLSearchParams()
    for (const control of controls) {
      const value = draft[control.name]
      if (value === control.defaultValue || value === '' || value === undefined || value === null) continue
      next.set(control.name, String(value))
    }
    setSearchParams(next, { replace: true })
  }

  function update(name, value) {
    commit({ ...values, [name]: value })
  }

  const renderProps = { ...(config.staticProps ?? {}) }
  for (const control of controls) {
    renderProps[control.name] = values[control.name]
    if (control.event) {
      renderProps[control.event] = (next) => update(control.name, control.normalize ? control.normalize(next) : next)
    }
  }

  const Render = config.render
  const preview = Render ? <Render {...renderProps} /> : createElement(registry[config.component], renderProps)
  const code = config.code ? config.code(values) : generateJsx(config.component, values, controls)

  return (
    <div className="space-y-4">
      <div className="grid overflow-hidden rounded-2xl border border-outline-variant/30 lg:grid-cols-[1fr_15rem]">
        <div className="docs-grid flex min-h-56 items-center justify-center bg-background p-6 sm:p-10">
          {preview}
        </div>
        <div className="border-t border-outline-variant/30 bg-surface-container p-4 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              props
            </span>
            <IconButton label="Reset props" size="sm" variant="ghost" onClick={() => commit({})}>
              <RotateCcw />
            </IconButton>
          </div>
          <div className="grid gap-3">
            {controls.map((control) => (
              <PlaygroundControl
                key={control.name}
                control={control}
                value={values[control.name]}
                onChange={(value) => update(control.name, value)}
              />
            ))}
          </div>
        </div>
      </div>
      <CodeBlock code={code} lang="jsx" label={`${config.component}.jsx`} />
    </div>
  )
}
