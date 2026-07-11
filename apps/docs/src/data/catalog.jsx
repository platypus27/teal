import { useState } from 'react'
import { Button, Dialog, Progress, Separator } from '@kryv/teal'
import { BadgeDemo } from '../demos/BadgeDemo.jsx'
import badgeSource from '../demos/BadgeDemo.jsx?raw'
import { ButtonDemo } from '../demos/ButtonDemo.jsx'
import buttonSource from '../demos/ButtonDemo.jsx?raw'
import { CardDemo } from '../demos/CardDemo.jsx'
import cardSource from '../demos/CardDemo.jsx?raw'
import { CheckboxDemo } from '../demos/CheckboxDemo.jsx'
import checkboxSource from '../demos/CheckboxDemo.jsx?raw'
import { DialogDemo } from '../demos/DialogDemo.jsx'
import dialogSource from '../demos/DialogDemo.jsx?raw'
import { EmptyStateDemo } from '../demos/EmptyStateDemo.jsx'
import emptyStateSource from '../demos/EmptyStateDemo.jsx?raw'
import { FieldDemo } from '../demos/FieldDemo.jsx'
import fieldSource from '../demos/FieldDemo.jsx?raw'
import { InputDemo } from '../demos/InputDemo.jsx'
import inputSource from '../demos/InputDemo.jsx?raw'
import { LoadingDemo } from '../demos/LoadingDemo.jsx'
import loadingSource from '../demos/LoadingDemo.jsx?raw'
import { MenuDemo } from '../demos/MenuDemo.jsx'
import menuSource from '../demos/MenuDemo.jsx?raw'
import { PageHeaderDemo } from '../demos/PageHeaderDemo.jsx'
import pageHeaderSource from '../demos/PageHeaderDemo.jsx?raw'
import { PaginationDemo } from '../demos/PaginationDemo.jsx'
import paginationSource from '../demos/PaginationDemo.jsx?raw'
import { PopoverDemo } from '../demos/PopoverDemo.jsx'
import popoverSource from '../demos/PopoverDemo.jsx?raw'
import { SelectDemo } from '../demos/SelectDemo.jsx'
import selectSource from '../demos/SelectDemo.jsx?raw'
import { SeparatorDemo } from '../demos/SeparatorDemo.jsx'
import separatorSource from '../demos/SeparatorDemo.jsx?raw'
import { SwitchDemo } from '../demos/SwitchDemo.jsx'
import switchSource from '../demos/SwitchDemo.jsx?raw'
import { TableDemo } from '../demos/TableDemo.jsx'
import tableSource from '../demos/TableDemo.jsx?raw'
import { TabsDemo } from '../demos/TabsDemo.jsx'
import tabsSource from '../demos/TabsDemo.jsx?raw'
import { ToastDemo } from '../demos/ToastDemo.jsx'
import toastSource from '../demos/ToastDemo.jsx?raw'
import { TooltipDemo } from '../demos/TooltipDemo.jsx'
import tooltipSource from '../demos/TooltipDemo.jsx?raw'
import { moduleGroups } from './module-meta.js'

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
    examples: [{ Demo: ButtonDemo, source: buttonSource }],
  },
  field: {
    examples: [{ Demo: FieldDemo, source: fieldSource }],
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
    examples: [{ Demo: InputDemo, source: inputSource }],
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
    examples: [{ Demo: SelectDemo, source: selectSource }],
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
    examples: [{ Demo: CheckboxDemo, source: checkboxSource }],
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
    examples: [{ Demo: SwitchDemo, source: switchSource }],
  },
  card: {
    examples: [{ Demo: CardDemo, source: cardSource }],
  },
  badge: {
    playground: {
      component: 'Badge',
      controls: [
        { name: 'tone' },
        { name: 'children', kind: 'text', defaultValue: 'Deployed', required: true },
      ],
    },
    examples: [{ Demo: BadgeDemo, source: badgeSource }],
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
    examples: [{ Demo: DialogDemo, source: dialogSource }],
  },
  tooltip: {
    examples: [{ Demo: TooltipDemo, source: tooltipSource }],
  },
  menu: {
    examples: [{ Demo: MenuDemo, source: menuSource }],
  },
  popover: {
    examples: [{ Demo: PopoverDemo, source: popoverSource }],
  },
  toast: {
    examples: [{ Demo: ToastDemo, source: toastSource }],
  },
  'empty-state': {
    examples: [{ Demo: EmptyStateDemo, source: emptyStateSource }],
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
    examples: [{ Demo: LoadingDemo, source: loadingSource }],
  },
  tabs: {
    examples: [{ Demo: TabsDemo, source: tabsSource }],
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
    examples: [{ Demo: PaginationDemo, source: paginationSource }],
  },
  'page-header': {
    examples: [{ Demo: PageHeaderDemo, source: pageHeaderSource }],
  },
  table: {
    examples: [{ Demo: TableDemo, source: tableSource }],
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
    examples: [{ Demo: SeparatorDemo, source: separatorSource }],
  },
}

export const catalogGroups = moduleGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => {
    const { examples: extraExamples = [], ...rest } = extras[module.id] ?? {}
    return {
      ...module,
      ...rest,
      examples: module.examples.map((example, index) => ({ ...example, ...extraExamples[index] })),
    }
  }),
}))

export const catalog = catalogGroups.flatMap((group) => group.modules)
