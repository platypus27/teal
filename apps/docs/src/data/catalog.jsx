import { useState } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, Progress, Separator } from '@kryv/teal'
import { catalogGroups as metadataGroups } from './docs-module-registry.js'

const demoLoaders = import.meta.glob('../demos/*Demo.jsx')
const sourceLoaders = import.meta.glob('../demos/*Demo.jsx', { query: '?raw', import: 'default' })

function pascalCase(id) {
  return id
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
}

/** Load a module's demo and source only when its route is opened. */
export async function loadModuleRecord(id) {
  const module = catalog.find((entry) => entry.id === id)
  if (!module) return null
  const files = [...new Set(module.examples.map((example) => `../demos/${pascalCase(example.demo ?? id)}Demo.jsx`))]
  const loaded = await Promise.all(files.map(async (file) => {
    const demoLoader = demoLoaders[file]
    const sourceLoader = sourceLoaders[file]
    if (!demoLoader || !sourceLoader) throw new Error(`Missing documentation demo for ${file}`)
    const [demoModule, source] = await Promise.all([demoLoader(), sourceLoader()])
    return /** @type {[string, Record<string, any>, string]} */ ([file, demoModule, source])
  }))
  const records = new Map(
    loaded.map(([file, demoModule, source]) => [file, { demoModule, source }]),
  )
  return {
    ...module,
    examples: module.examples.map((example, index) => {
      const file = `../demos/${pascalCase(example.demo ?? id)}Demo.jsx`
      const record = records.get(file)
      const demoModule = record.demoModule
      const source = record.source
      const DemoComponent = demoModule[`${pascalCase(example.demo ?? id)}Demo`] ?? demoModule.default
      const Demo = (props) => <DemoComponent {...props} exampleIndex={index} />
      return { ...example, Demo, source }
    }),
  }
}

function DialogPlayground({ description, size, title }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description || undefined}
        size={size}
      >
        <p>Project Orion will leave the active workspace and its reports will be archived.</p>
      </Dialog>
    </>
  )
}

function dialogCode(values) {
  const props = ['open={open}', 'onOpenChange={setOpen}', `title="${values.title}"`]
  if (values.description) props.push(`description="${values.description}"`)
  if (values.size !== 'md') props.push(`size="${values.size}"`)
  return [
    'const [open, setOpen] = useState(false)',
    '',
    '<Button onClick={() => setOpen(true)}>Open dialog</Button>',
    `<Dialog\n${props.map((prop) => `  ${prop}`).join('\n')}\n>`,
    '  <p>Project Orion will leave the active workspace.</p>',
    '</Dialog>',
  ].join('\n')
}

/**
 * Live demos, sources, and playgrounds keyed by module id. Merged over the
 * plain metadata from module-meta.js.
 */
const extras = {
  button: {
    playground: {
      component: 'Button',
      controls: [
        { name: 'variant' },
        { name: 'size' },
        { name: 'loading' },
        { name: 'disabled', kind: 'boolean' },
        { name: 'children', kind: 'text', defaultValue: 'Save changes', required: true },
      ],
    },
  },
  input: {
    playground: {
      component: 'Input',
      staticProps: { 'aria-label': 'Display name', defaultValue: 'Avery Chen' },
      controls: [
        { name: 'size' },
        { name: 'aria-invalid', kind: 'boolean', label: 'invalid' },
        { name: 'disabled', kind: 'boolean' },
        { name: 'placeholder', kind: 'text', defaultValue: 'Project name' },
      ],
    },
  },
  select: {
    playground: {
      component: 'Select',
      staticProps: {
        'aria-label': 'Role',
        defaultValue: 'viewer',
        options: [
          { value: 'admin', label: 'Administrator' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
        ],
      },
      controls: [
        { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
        { name: 'disabled' },
      ],
    },
  },
  checkbox: {
    playground: {
      component: 'Checkbox',
      controls: [
        {
          name: 'checked',
          kind: 'boolean',
          event: 'onCheckedChange',
          normalize: (value) => value === true,
          as: 'defaultChecked',
        },
        { name: 'disabled', kind: 'boolean' },
        { name: 'label', kind: 'text', defaultValue: 'Include archived projects', required: true },
        { name: 'description', kind: 'text', defaultValue: '' },
      ],
    },
  },
  switch: {
    playground: {
      component: 'Switch',
      controls: [
        { name: 'checked', kind: 'boolean', event: 'onCheckedChange', as: 'defaultChecked' },
        { name: 'size', kind: 'select', options: ['sm', 'md'], defaultValue: 'md' },
        { name: 'disabled', kind: 'boolean' },
        { name: 'label', kind: 'text', defaultValue: 'Security notifications', required: true },
        { name: 'description', kind: 'text', defaultValue: 'High-risk account activity', required: true },
      ],
    },
  },
  card: {
    playground: {
      component: 'Card',
      controls: [],
      render: (props) => (
        <Card {...props} className="w-72">
          <CardHeader>
            <CardTitle>Project Orion</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Incident response workspace with 4 active reports.</CardDescription>
          </CardContent>
        </Card>
      ),
      code: () =>
        `<Card>\n  <CardHeader>\n    <CardTitle>Project Orion</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <CardDescription>Incident response workspace with 4 active reports.</CardDescription>\n  </CardContent>\n</Card>`,
    },
  },
  badge: {
    playground: {
      component: 'Badge',
      controls: [
        { name: 'variant' },
        { name: 'children', kind: 'text', defaultValue: 'Deployed', required: true },
      ],
    },
  },
  dialog: {
    playground: {
      component: 'Dialog',
      controls: [
        { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
        { name: 'title', kind: 'text', defaultValue: 'Archive project?', required: true },
        { name: 'description', kind: 'text', defaultValue: 'The project can be restored later.' },
      ],
      render: (props) => <DialogPlayground {...props} />,
      code: dialogCode,
    },
  },
  tooltip: {
  },
  menu: {
  },
  popover: {
  },
  toast: {
  },
  'empty-state': {
    playground: {
      component: 'EmptyState',
      staticProps: { title: 'No results found', description: 'Try adjusting your search terms.' },
      controls: [],
      code: () =>
        `<EmptyState title="No results found" description="Try adjusting your search terms." />`,
    },
  },
  loading: {
    playground: {
      component: 'Progress',
      controls: [
        { name: 'value', kind: 'number', defaultValue: 64 },
        { name: 'label', kind: 'text', defaultValue: 'Import progress', required: true },
      ],
      render: (props) => (
        <div className="w-72">
          <Progress {...props} />
        </div>
      ),
    },
  },
  tabs: {
  },
  pagination: {
    playground: {
      component: 'Pagination',
      controls: [
        { name: 'page', kind: 'number', defaultValue: 2, event: 'onPageChange' },
        { name: 'pageCount', kind: 'number', defaultValue: 12 },
      ],
      code: (values) =>
        `const [page, setPage] = useState(${values.page})\n\n<Pagination page={page} pageCount={${values.pageCount}} onPageChange={setPage} />`,
    },
  },
  'page-header': {
  },
  'vertical-nav': {
  },
  'top-bar': {
  },
  table: {
  },
  separator: {
    playground: {
      component: 'Separator',
      controls: [
        { name: 'orientation', kind: 'select', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
        { name: 'decorative', kind: 'boolean' },
      ],
      render: (props) => (
        <div className="flex h-28 w-72 items-center justify-center">
          <Separator {...props} />
        </div>
      ),
    },
  },
}

export const catalogGroups = metadataGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => ({
    ...module,
    ...(extras[module.id] ?? {}),
  })),
}))

export const catalog = catalogGroups.flatMap((group) => group.modules)
