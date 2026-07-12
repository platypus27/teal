import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'

const root = resolve(import.meta.dirname, '../../..')
const source = resolve(root, 'packages/teal/src')
const output = resolve(root, 'apps/docs/src/generated/api.json')
const parser = withCustomConfig(resolve(root, 'packages/teal/tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
})

const files = [
  'Badge.tsx',
  'Button.tsx',
  'Card.tsx',
  'Checkbox.tsx',
  'Dialog.tsx',
  'EmptyState.tsx',
  'Field.tsx',
  'Input.tsx',
  'LoadingState.tsx',
  'Menu.tsx',
  'PageHeader.tsx',
  'Pagination.tsx',
  'Popover.tsx',
  'Select.tsx',
  'Separator.tsx',
  'Switch.tsx',
  'Table.tsx',
  'Tabs.tsx',
  'Toast.tsx',
  'Tooltip.tsx',
  'TopBar.tsx',
  'VerticalNav.tsx',
].map((file) => resolve(source, file))

const docs = parser.parse(files).map((doc) => ({
  description: doc.description,
  displayName: doc.displayName,
  props: Object.values(doc.props).map((prop) => ({
    defaultValue: prop.defaultValue?.value ?? '',
    description: prop.description,
    name: prop.name,
    required: prop.required,
    type: prop.type.name,
  })),
}))

await mkdir(resolve(output, '..'), { recursive: true })
await writeFile(output, `${JSON.stringify(docs, null, 2)}\n`)
