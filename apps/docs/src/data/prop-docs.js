/**
 * Documentation overlay for generated prop metadata.
 *
 * react-docgen-typescript cannot see cva variant defaults and intentionally
 * filters out props inherited from node_modules (Radix primitives). Entries
 * here either enrich an existing prop (description, defaultValue) or add a
 * prop the generator dropped. Merged in PropsTable.
 */

const asChildDescription =
  'Merges the component onto its child element instead of rendering the default element (Radix Slot).'

/** @type {Record<string, Record<string, { description?: string, type?: string, defaultValue?: string, required?: boolean }>>} */
export const propDocs = {
  Button: {
    variant: {
      description:
        'Visual hierarchy of the action. "glass" renders a translucent, blurred surface.',
      defaultValue: '"primary"',
    },
    size: { description: 'Height and horizontal padding.', defaultValue: '"md"' },
    loading: { description: 'Disables the button, prepends a spinner, and sets aria-busy.' },
    asChild: { description: `${asChildDescription} Cannot be combined with disabled or loading.` },
  },
  IconButton: {
    variant: {
      description: 'Visual treatment of the icon button. "glass" renders a translucent, blurred surface.',
      defaultValue: '"ghost"',
    },
    size: { description: 'Hit-target size; the icon scales with it.', defaultValue: '"md"' },
  },
  Badge: {
    tone: { description: 'Semantic color treatment.', defaultValue: '"neutral"' },
    glass: {
      type: 'boolean',
      defaultValue: 'false',
      description: 'Renders a translucent, blurred surface instead of a solid tone background.',
    },
  },
  Input: {
    size: { description: 'Height and text size of the control.', defaultValue: '"md"' },
    glass: {
      type: 'boolean',
      defaultValue: 'false',
      description: 'Renders a translucent, blurred surface instead of an opaque input.',
    },
  },
  TextArea: {
    size: { description: 'Text size of the control.', defaultValue: '"md"' },
    glass: {
      type: 'boolean',
      defaultValue: 'false',
      description: 'Renders a translucent, blurred surface instead of an opaque textarea.',
    },
  },
  Label: {
    asChild: { description: asChildDescription },
  },
  Checkbox: {
    asChild: { description: asChildDescription },
    checked: {
      type: 'boolean | "indeterminate"',
      description: 'Controlled checked state. Use "indeterminate" for select-all patterns.',
    },
    defaultChecked: {
      type: 'boolean | "indeterminate"',
      description: 'Initial checked state for uncontrolled usage.',
    },
    onCheckedChange: {
      type: '(checked: CheckedState) => void',
      description: 'Called with the next state when the user toggles the checkbox.',
    },
    disabled: { type: 'boolean', description: 'Prevents interaction and dims the control.' },
  },
  Switch: {
    asChild: { description: asChildDescription },
    checked: { type: 'boolean', description: 'Controlled on/off state.' },
    defaultChecked: { type: 'boolean', description: 'Initial state for uncontrolled usage.' },
    onCheckedChange: {
      type: '(checked: boolean) => void',
      description: 'Called with the next state when the user toggles the switch.',
    },
    disabled: { type: 'boolean', description: 'Prevents interaction and dims the control.' },
  },
  Separator: {
    asChild: { description: asChildDescription },
    decorative: {
      type: 'boolean',
      description: 'Removes the separator role so screen readers ignore the element.',
    },
    orientation: {
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: 'Axis the separator runs along.',
    },
  },
  Progress: {
    asChild: { description: asChildDescription },
    value: { type: 'number | null', defaultValue: '0', description: 'Current progress, clamped between 0 and max.' },
    max: { type: 'number', defaultValue: '100', description: 'Maximum value used to compute the filled percentage.' },
  },
  Dialog: {
    className: { description: 'Additional classes merged onto the dialog panel.' },
  },
  Menu: {
    className: { description: 'Additional classes merged onto the menu content.' },
  },
  Popover: {
    className: { description: 'Additional classes merged onto the popover content.' },
  },
  Tabs: {
    className: { description: 'Additional classes merged onto the tabs root.' },
  },
  Pagination: {
    className: { description: 'Additional classes merged onto the nav element.' },
  },
  Select: {
    className: { description: 'Additional classes merged onto the trigger.' },
    'aria-describedby': { description: 'Id of an element that describes the select, forwarded to the trigger.' },
  },
  Tooltip: {
    className: { description: 'Additional classes merged onto the tooltip content.' },
  },
  VerticalNav: {
    variant: {
      type: '"solid" | "glass"',
      defaultValue: '"solid"',
      description: 'Solid renders an opaque bar with a border; glass floats with a translucent backdrop blur.',
    },
    mode: {
      type: '"rail" | "full"',
      defaultValue: '"full"',
      description: 'Rail collapses to an icon strip that expands on hover or keyboard focus. Full shows labels always.',
    },
    side: {
      type: '"left" | "right"',
      defaultValue: '"left"',
      description: 'Which edge the nav anchors to. Solid variants draw a border on the inner side.',
    },
  },
  VerticalNavItem: {
    active: { type: 'boolean', description: 'Marks the item as the current page and sets aria-current="page".' },
    icon: {
      type: 'ReactNode',
      description: 'Icon element shown before the label. Always visible, even in rail mode.',
    },
  },
  TopBar: {
    variant: {
      type: '"solid" | "glass"',
      defaultValue: '"solid"',
      description: 'Solid renders an opaque background; glass adds a translucent backdrop blur.',
    },
    sticky: {
      type: 'boolean',
      defaultValue: 'true',
      description: 'When true, the bar sticks to the top of the scrolling container.',
    },
  },
}

/**
 * Overlay propDocs onto generated props: existing props are enriched and
 * props the generator dropped are appended. Shared by PropsTable and the
 * Markdown generators.
 *
 * @param {string} name
 * @param {Array<{ name: string, type?: string, required?: boolean, defaultValue?: string, description?: string }>} props
 */
export function mergePropDocs(name, props) {
  const overrides = propDocs[name] ?? {}
  const existing = new Set(props.map((prop) => prop.name))
  const merged = props.map((prop) => ({ ...prop, ...(overrides[prop.name] ?? {}) }))
  const added = Object.entries(overrides)
    .filter(([propName]) => !existing.has(propName))
    .map(([propName, override]) => ({
      name: propName,
      type: override.type ?? '',
      required: override.required ?? false,
      defaultValue: override.defaultValue ?? '',
      description: override.description ?? '',
    }))
  return [...merged, ...added]
}
