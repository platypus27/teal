// One-off codemod for the 0.5.1 consolidation (ADR-0001): rewrites removed
// component tags and @kryv/teal import specifiers to their consolidated
// replacements. Edits are applied by AST position, so all other formatting,
// comments, and code stay untouched. Cases that need prop restructuring
// (DatePicker modes, Dialog placement, Slider range values) are not rewritten;
// they are listed as manual follow-ups.
//
// Usage: node scripts/migrate-consolidation.mjs <file-or-directory>...
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import ts from 'typescript'

// name → { as, attr?, warn? }: `as` is the consolidated component; `attr` is a
// constant attribute the replacement always needs; `warn` needs manual work.
const RENAMES = {
  AreaChart: { as: 'LineChart', attr: 'type="area"' },
  AutosizeTextarea: { as: 'TextArea', attr: 'autosize' },
  Banner: { as: 'Alert', attr: 'appearance="banner"' },
  BottomSheet: { as: 'Dialog', warn: 'choose placement="bottom" (BottomSheet snap props carry over)' },
  Callout: { as: 'Alert', attr: 'appearance="callout"' },
  Cascader: { as: 'TreeSelect', warn: 'choose display="columns" or "tree"' },
  CheckboxCard: { as: 'Checkbox', attr: 'variant="card"' },
  ContextMenu: { as: 'Menu', attr: 'mode="context"' },
  DataTable: { as: 'Table', warn: 'merge DataTableColumn props into Table columns' },
  Drawer: { as: 'Dialog', warn: 'choose placement="left" or "right"' },
  FullscreenDialog: { as: 'Dialog', attr: 'placement="fullscreen"' },
  GlassPanel: { as: 'Card', attr: 'variant="glass"' },
  HoverCard: { as: 'Popover', attr: 'openOn="hover"' },
  MegaMenu: { as: 'NavigationMenu' },
  MonthPicker: { as: 'DatePicker', warn: 'set mode="month"' },
  MultiSelect: { as: 'Combobox', attr: 'multiple' },
  Panel: { as: 'Card', warn: 'move header content into title/actions props' },
  PasswordInput: { as: 'Input', attr: 'type="password"' },
  ProgressCircle: { as: 'Progress', attr: 'shape="circle"' },
  PulseDot: { as: 'StatusDot', attr: 'pulse' },
  RadioCard: { as: 'RadioGroup', attr: 'variant="card"' },
  RangeSlider: { as: 'Slider', warn: 'convert value to [number, number] and add range' },
  Result: { as: 'EmptyState', warn: 'rename the actions prop to action' },
  SearchInput: { as: 'Input' },
  SearchOverlay: { as: 'Command', warn: 'review the render-prop children API' },
  SegmentedControl: { as: 'ToggleGroup', attr: 'variant="segmented"' },
  SideRail: { as: 'Sidebar', warn: 'review collapsed/mode props' },
  SpeedDial: { as: 'FloatingActionButton', warn: 'move menu entries into actions[]' },
  TableOfContents: { as: 'AnchorNav', warn: 'convert entries to nested items' },
  VerticalNav: { as: 'Sidebar', warn: 'review collapsed/mode props' },
  YearPicker: { as: 'DatePicker', warn: 'set mode="year"' },
}

function applyEdits(source, edits) {
  return edits
    .sort((a, b) => b.start - a.start)
    .reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source)
}

/** Rewrites one file's source. Returns { code, warnings }. */
export function migrateSource(source) {
  const sourceFile = ts.createSourceFile('input.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const edits = []
  const warnings = []

  // Local names actually bound to @kryv/teal imports; JSX tags are only
  // rewritten when they resolve through this map, so a local component that
  // merely shares a removed name is never touched.
  const tealLocals = new Map()
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.getText(sourceFile) !== "'@kryv/teal'") continue
    const named = statement.importClause?.namedBindings
    if (!named || !ts.isNamedImports(named)) continue
    for (const element of named.elements) {
      const imported = (element.propertyName ?? element.name).getText(sourceFile)
      const rule = RENAMES[imported]
      if (!rule) continue
      // Keep the local binding; change which export is imported.
      const renameTarget = element.propertyName ?? element.name
      edits.push({ start: renameTarget.getStart(sourceFile), end: renameTarget.getEnd(), text: rule.as })
      // Aliased imports keep their local binding, so their usages stay valid;
      // unaliased ones change name and their tags must follow.
      if (!element.propertyName) tealLocals.set(element.name.getText(sourceFile), rule)
      if (rule.warn) warnings.push(`${imported} → ${rule.as}: ${rule.warn}`)
    }
  }

  function visit(node) {
    const isTagNode = ts.isJsxOpeningElement(node) || ts.isJsxClosingElement(node) || ts.isJsxSelfClosingElement(node)
    if (isTagNode) {
      const tag = node.tagName.getText(sourceFile)
      const rule = tealLocals.get(tag)
      if (rule) {
        edits.push({ start: node.tagName.getStart(sourceFile), end: node.tagName.getEnd(), text: rule.as })
        if (
          rule.attr &&
          !ts.isJsxClosingElement(node) &&
          !node.attributes.properties.some(
            (property) => property.kind === ts.SyntaxKind.JsxAttribute && rule.attr.split('=')[0] === property.name.getText(sourceFile),
          )
        ) {
          edits.push({ start: node.tagName.getEnd(), end: node.tagName.getEnd(), text: ` ${rule.attr}` })
        }
        if (rule.warn && !ts.isJsxClosingElement(node)) warnings.push(`${tag} → ${rule.as}: ${rule.warn}`)
      }
    }
    ts.forEachChild(node, visit)
  }

  ts.forEachChild(sourceFile, visit)
  return { code: applyEdits(source, edits), warnings: [...new Set(warnings)] }
}

async function collectFiles(target) {
  const stats = await stat(target)
  if (stats.isDirectory()) {
    const entries = await readdir(target)
    return (await Promise.all(entries.map((entry) => collectFiles(join(target, entry))))).flat()
  }
  return ['.tsx', '.ts', '.jsx', '.js'].includes(extname(target)) ? [target] : []
}

async function main(argv) {
  if (argv.length === 0) {
    console.error('Usage: node scripts/migrate-consolidation.mjs <file-or-directory>...')
    process.exit(1)
  }
  const files = (await Promise.all(argv.map((arg) => collectFiles(resolve(arg))))).flat()
  let touched = 0
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const { code, warnings } = migrateSource(source)
    if (code !== source) {
      await writeFile(file, code)
      touched += 1
    }
    for (const warning of warnings) console.warn(`${file}: ${warning}`)
  }
  console.log(`migrate-consolidation: rewrote ${touched} of ${files.length} file(s)`)
}

if (process.argv[1] !== undefined && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await main(process.argv.slice(2))
}
