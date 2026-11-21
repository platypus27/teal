import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'

const root = resolve(import.meta.dirname, '../../..')
const source = resolve(root, 'packages/teal/src')
const output = resolve(root, 'apps/docs/src/generated/api.json')
const parser = withCustomConfig(resolve(root, 'packages/teal/tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Polymorphic components (Card, TopBar, Sidebar, SidebarItem) carry a
  // `ref` in their public call signature; it is a React convention, not a
  // documented prop, so drop the spurious row.
  propFilter: (prop) => prop.name !== 'ref' && !prop.parent?.fileName.includes('node_modules'),
})

// Parse every component source file so new modules can never be left out of
// the generated interface tables. Only .tsx files are components; helpers
// (cn, form-semantics, polymorphic) are plain .ts.
const files = (await readdir(source))
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => resolve(source, file))

// The TypeScript printer wraps some function types in a redundant outer pair
// of parentheses (for example `((value: string) => void)` from Radix Select's
// widened signature). Strip parentheses only when they enclose the whole type,
// so unions such as `((a: string) => void) | ((b: string[]) => void)` keep
// the grouping they need.
function stripEnclosingParens(type) {
  let result = type
  while (result.startsWith('(') && result.endsWith(')')) {
    let depth = 0
    let enclosesAll = true
    for (let index = 0; index < result.length; index += 1) {
      if (result[index] === '(') depth += 1
      else if (result[index] === ')') depth -= 1
      if (depth === 0 && index < result.length - 1) {
        enclosesAll = false
        break
      }
    }
    if (!enclosesAll) break
    result = result.slice(1, -1)
  }
  return result
}

// react-docgen-typescript also reports plain function exports (toast,
// dismissToast, mergeDescriptionIds, useFieldControl) as pseudo-components.
// Components are PascalCase by convention; anything else is a function or
// value export and gets no interface table.
const docs = parser
  .parse(files)
  .filter((doc) => /^[A-Z]/.test(doc.displayName))
  .map((doc) => ({
    description: doc.description,
    displayName: doc.displayName,
    props: Object.values(doc.props).map((prop) => ({
      defaultValue: prop.defaultValue?.value ?? '',
      description: prop.description,
      name: prop.name,
      required: prop.required,
      type: prop.name === 'as' ? 'ElementType' : stripEnclosingParens(prop.type.name),
    })),
  }))

await mkdir(resolve(output, '..'), { recursive: true })
const contents = `${JSON.stringify(docs, null, 2)}\n`
if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch(() => '')
  if (current !== contents) throw new Error('generated/api.json is stale - run npm run generate:api')
} else {
  await writeFile(output, contents)
}
