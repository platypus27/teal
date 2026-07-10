import { useState } from 'react'
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  Badge,
  Input,
  Select,
  TextArea,
  Toggle,
  Checkbox,
  PageHeader,
  EmptyState,
  LoadingState,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tooltip,
  Toaster,
  toast,
} from '../../../ui'

export const NAV = [
  {
    title: 'Docs',
    items: [{ id: 'getting-started', label: 'Getting Started' }],
  },
  {
    title: 'Design Language',
    items: [
      { id: 'principles', label: 'Principles' },
      { id: 'tokens', label: 'Color' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing & Radius' },
      { id: 'elevation', label: 'Elevation' },
      { id: 'iconography', label: 'Iconography' },
      { id: 'motion', label: 'Motion' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'card', label: 'Card' },
      { id: 'badge', label: 'Badge' },
      { id: 'input', label: 'Input' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'toast', label: 'Toast' },
      { id: 'page-header', label: 'Page Header' },
      { id: 'empty-state', label: 'Empty State' },
      { id: 'loading-state', label: 'Loading State' },
    ],
  },
  {
    title: 'Soon',
    items: [
      { id: 'blocks', label: 'Blocks' },
      { id: 'charts', label: 'Charts' },
    ],
  },
]

/* ---------- demo components (each renders a live example) ---------- */

function ButtonVariants() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </>
  )
}

function ButtonWithIcon() {
  return (
    <Button>
      <span className="material-symbols-outlined text-base">add</span>
      New item
    </Button>
  )
}

function IconButtons() {
  return (
    <>
      <IconButton title="Search">
        <span className="material-symbols-outlined text-[20px]">search</span>
      </IconButton>
      <IconButton title="Filter">
        <span className="material-symbols-outlined text-[20px]">tune</span>
      </IconButton>
      <IconButton title="More">
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </IconButton>
    </>
  )
}

function CardBasic() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Project Orion</CardTitle>
        <Badge tone="success">active</Badge>
      </CardHeader>
      <CardSubtitle>Last updated 2 hours ago</CardSubtitle>
    </Card>
  )
}

function CardHover() {
  return (
    <Card hover className="w-72 cursor-pointer">
      <CardTitle>Hover me</CardTitle>
      <CardSubtitle>Cards can lift and glow on hover.</CardSubtitle>
    </Card>
  )
}

function BadgeTones() {
  const tones = ['high', 'critical', 'medium', 'low', 'success', 'warning', 'error', 'info', 'neutral']
  return tones.map((t) => (
    <Badge key={t} tone={t}>
      {t}
    </Badge>
  ))
}

function InputDemo() {
  return (
    <div className="w-72 space-y-3">
      <Input placeholder="you@example.com" />
      <Select defaultValue="">
        <option value="" disabled>
          Pick a role
        </option>
        <option>Admin</option>
        <option>Editor</option>
        <option>Viewer</option>
      </Select>
      <TextArea rows={3} placeholder="Notes…" />
    </div>
  )
}

function ToggleFull() {
  const [on, setOn] = useState(true)
  return <Toggle checked={on} onChange={setOn} label="Notifications" icon="notifications" />
}

function ToggleCompact() {
  const [on, setOn] = useState(false)
  return <Toggle compact checked={on} onChange={setOn} title="Compact toggle" />
}

function CheckboxDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="space-y-2">
      <Checkbox checked={on} onChange={(e) => setOn(e.target.checked)} label="Enabled" />
      <Checkbox disabled label="Disabled" />
    </div>
  )
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Archive project?</DialogTitle>
        <DialogDescription>This moves the project to your archive. You can restore it at any time.</DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Archive</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

function TooltipDemo() {
  return (
    <>
      {['top', 'right', 'bottom', 'left'].map((side) => (
        <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </>
  )
}

function ToastDemo() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast('Changes saved', { tone: 'success' })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast('Something went wrong', { tone: 'error' })}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast('Storage almost full', { tone: 'warning' })}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast('New update available', { tone: 'info' })}>
          Info
        </Button>
      </div>
      <Toaster />
    </>
  )
}

function PageHeaderDemo() {
  return (
    <div className="w-full max-w-2xl">
      <PageHeader title="Dashboard" subtitle="Overview of your workspace">
        <Button variant="secondary">Export</Button>
        <Button>New report</Button>
      </PageHeader>
    </div>
  )
}

function EmptyStateDemo() {
  return (
    <div className="w-full max-w-md">
      <EmptyState icon="inbox" title="No messages" message="When you receive messages they will show up here." />
    </div>
  )
}

function LoadingStateDemo() {
  return (
    <div className="w-full max-w-md">
      <LoadingState />
    </div>
  )
}

/* ---------- component metadata ---------- */

const el = { children: 'ReactNode', className: 'string' }

export const COMPONENTS = [
  {
    id: 'button',
    name: 'Button',
    importLine: "import { Button, IconButton } from '../teal/ui'",
    description:
      'A pill-shaped action button in three visual styles, plus a rounded IconButton for icon-only actions. Both forward native button attributes.',
    examples: [
      {
        title: 'Variants',
        code: `<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>`,
        Demo: ButtonVariants,
      },
      {
        title: 'With icon',
        code: `<Button>\n  <span className="material-symbols-outlined text-base">add</span>\n  New item\n</Button>`,
        Demo: ButtonWithIcon,
      },
      {
        title: 'IconButton',
        code: `<IconButton title="Search">\n  <span className="material-symbols-outlined text-[20px]">search</span>\n</IconButton>`,
        Demo: IconButtons,
      },
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Visual style.' },
      { name: 'as', type: 'ComponentType | string', default: "'button'", description: 'Render as a different element/component.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Button label / content.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra classes merged onto the root.' },
      { name: '…rest', type: 'ButtonHTMLAttributes', default: '—', description: 'Any native button attribute (onClick, disabled, type…).' },
    ],
    extraProps: [
      {
        title: 'IconButton',
        props: [
          { name: 'children', type: 'ReactNode', default: '—', description: 'Usually a Material Symbols span.' },
          { name: 'title', type: 'string', default: '—', description: 'Tooltip / accessible name.' },
          { name: 'className', type: 'string', default: "''", description: 'Extra classes merged onto the button.' },
          { name: '…rest', type: 'ButtonHTMLAttributes', default: '—', description: 'Any native button attribute.' },
        ],
      },
    ],
  },

  {
    id: 'card',
    name: 'Card',
    importLine: "import { Card, CardHeader, CardTitle, CardSubtitle } from '../teal/ui'",
    description:
      'A soft, rounded surface for grouping content. Use the header/title/subtitle helpers for the common layout, or compose your own.',
    examples: [
      {
        title: 'Basic',
        code: `<Card>\n  <CardHeader>\n    <CardTitle>Project Orion</CardTitle>\n    <Badge tone="success">active</Badge>\n  </CardHeader>\n  <CardSubtitle>Last updated 2 hours ago</CardSubtitle>\n</Card>`,
        Demo: CardBasic,
      },
      {
        title: 'Hover',
        code: `<Card hover>\n  <CardTitle>Hover me</CardTitle>\n  <CardSubtitle>Cards can lift and glow on hover.</CardSubtitle>\n</Card>`,
        Demo: CardHover,
      },
    ],
    props: [
      { name: 'hover', type: 'boolean', default: 'false', description: 'Lift and glow on hover.' },
      { name: 'as', type: 'ComponentType | string', default: "'div'", description: 'Render as a different element.' },
      el.children,
      el.className,
    ],
    extraProps: [
      {
        title: 'CardHeader / CardTitle / CardSubtitle',
        props: [
          { name: 'children', type: 'ReactNode', default: '—', description: 'Content.' },
          { name: 'className', type: 'string', default: "''", description: 'Extra classes.' },
        ],
      },
    ],
  },

  {
    id: 'badge',
    name: 'Badge',
    importLine: "import { Badge } from '../teal/ui'",
    description: 'A small uppercase status pill. The tone maps to the teal / amber / red / emerald palette.',
    examples: [
      {
        title: 'Tones',
        code: `<Badge tone="high">high</Badge>\n<Badge tone="warning">warning</Badge>\n<Badge tone="success">success</Badge>\n<Badge tone="info">info</Badge>\n<Badge tone="neutral">neutral</Badge>`,
        Demo: BadgeTones,
      },
    ],
    props: [
      {
        name: 'tone',
        type: "'high' | 'critical' | 'medium' | 'low' | 'success' | 'warning' | 'error' | 'info' | 'neutral'",
        default: "'neutral'",
        description: 'Colour intent.',
      },
      el.children,
      el.className,
    ],
  },

  {
    id: 'input',
    name: 'Input',
    importLine: "import { Input, Select, TextArea } from '../teal/ui'",
    description: 'Text inputs, selects and textareas sharing the same rounded, focus-ringed field style.',
    examples: [
      {
        title: 'Fields',
        code: `<Input placeholder="you@example.com" />\n<Select defaultValue="">\n  <option value="" disabled>Pick a role</option>\n  <option>Admin</option>\n</Select>\n<TextArea rows={3} placeholder="Notes…" />`,
        Demo: InputDemo,
      },
    ],
    props: [
      { name: 'className', type: 'string', default: "''", description: 'Extra classes.' },
      { name: '…rest', type: 'InputHTMLAttributes', default: '—', description: 'Any native input attribute.' },
    ],
    extraProps: [
      {
        title: 'Select',
        props: [
          { name: 'children', type: 'ReactNode', default: '—', description: '<option> elements.' },
          { name: 'className', type: 'string', default: "''", description: 'Extra classes.' },
          { name: '…rest', type: 'SelectHTMLAttributes', default: '—', description: 'Any native select attribute.' },
        ],
      },
      {
        title: 'TextArea',
        props: [
          { name: 'className', type: 'string', default: "''", description: 'Extra classes.' },
          { name: '…rest', type: 'TextareaHTMLAttributes', default: '—', description: 'Any native textarea attribute.' },
        ],
      },
    ],
  },

  {
    id: 'toggle',
    name: 'Toggle',
    importLine: "import { Toggle } from '../teal/ui'",
    description:
      'A switch control. The default row shows an icon, label and track; the compact mode renders just the track for inline use.',
    examples: [
      {
        title: 'Row',
        code: `const [on, setOn] = useState(true)\n<Toggle checked={on} onChange={setOn} label="Notifications" icon="notifications" />`,
        Demo: ToggleFull,
      },
      {
        title: 'Compact',
        code: `<Toggle compact checked={on} onChange={setOn} title="Compact toggle" />`,
        Demo: ToggleCompact,
      },
    ],
    props: [
      { name: 'checked', type: 'boolean', default: '—', description: 'Controlled state (required).' },
      { name: 'onChange', type: '(next: boolean) => void', default: '—', description: 'Called with the next value (required).' },
      { name: 'label', type: 'string', default: '—', description: 'Row label (non-compact).' },
      { name: 'icon', type: 'string', default: '—', description: 'Material Symbols name (non-compact).' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Render only the switch track.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
      el.className,
    ],
  },

  {
    id: 'checkbox',
    name: 'Checkbox',
    importLine: "import { Checkbox } from '../teal/ui'",
    description: 'A styled checkbox with a Material Symbols check mark, built on a visually-hidden native input for accessibility.',
    examples: [
      {
        title: 'Usage',
        code: `const [on, setOn] = useState(true)\n<Checkbox checked={on} onChange={(e) => setOn(e.target.checked)} label="Enabled" />\n<Checkbox disabled label="Disabled" />`,
        Demo: CheckboxDemo,
      },
    ],
    props: [
      { name: 'checked', type: 'boolean', default: '—', description: 'Controlled state.' },
      { name: 'onChange', type: '(e: ChangeEvent) => void', default: '—', description: 'Native change handler.' },
      { name: 'label', type: 'string', default: '—', description: 'Optional text label.' },
      { name: 'disabled', type: 'boolean', default: '—', description: 'Disable interaction.' },
      el.className,
    ],
  },

  {
    id: 'dialog',
    name: 'Dialog',
    importLine: "import { Dialog, DialogTitle, DialogDescription, DialogFooter } from '../teal/ui'",
    description:
      'A modal dialog rendered in a portal with a blurred scrim. Closes on Escape or a scrim click, traps focus, locks body scroll, and restores focus to the trigger on close.',
    examples: [
      {
        title: 'Usage',
        code: `const [open, setOpen] = useState(false)\n<Button onClick={() => setOpen(true)}>Open dialog</Button>\n<Dialog open={open} onOpenChange={setOpen}>\n  <DialogTitle>Archive project?</DialogTitle>\n  <DialogDescription>You can restore it later.</DialogDescription>\n  <DialogFooter>\n    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>\n    <Button onClick={() => setOpen(false)}>Archive</Button>\n  </DialogFooter>\n</Dialog>`,
        Demo: DialogDemo,
      },
    ],
    props: [
      { name: 'open', type: 'boolean', default: '—', description: 'Controlled open state (required).' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', description: 'Called to change open (Escape / scrim / your buttons).' },
      el.children,
      el.className,
    ],
    extraProps: [
      {
        title: 'DialogTitle / DialogDescription / DialogFooter',
        props: [
          { name: 'children', type: 'ReactNode', default: '—', description: 'Content.' },
          { name: 'className', type: 'string', default: "''", description: 'Extra classes.' },
        ],
      },
    ],
  },

  {
    id: 'tooltip',
    name: 'Tooltip',
    importLine: "import { Tooltip } from '../teal/ui'",
    description:
      'A small anchored hint shown on hover or focus. CSS-anchored (no portal), so it can clip inside overflow:hidden ancestors — wrap the trigger and pick a side.',
    examples: [
      {
        title: 'Sides',
        code: `<Tooltip content="Tooltip on top" side="top">\n  <Button variant="secondary">top</Button>\n</Tooltip>`,
        Demo: TooltipDemo,
      },
    ],
    props: [
      { name: 'content', type: 'ReactNode', default: '—', description: 'Tooltip text / content (required).' },
      { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Placement relative to the trigger.' },
      el.children,
      el.className,
    ],
  },

  {
    id: 'toast',
    name: 'Toast',
    importLine: "import { Toaster, toast } from '../teal/ui'",
    description:
      'Imperative toast notifications. Call toast(message, { tone, duration }) from anywhere; mount <Toaster /> once (here, inside the demo) to render the bottom-right stack.',
    examples: [
      {
        title: 'Tones',
        code: `<Button onClick={() => toast('Changes saved', { tone: 'success' })}>Success</Button>\n<Toaster />`,
        Demo: ToastDemo,
      },
    ],
    props: [
      {
        name: 'toast(message, opts)',
        type: '(message, { tone?, duration? }) => number',
        default: '—',
        description: 'Show a toast. tone: success | error | warning | info | neutral; duration in ms (default 4000). Returns the id.',
      },
      { name: '<Toaster />', type: 'component', default: '—', description: 'Host that renders active toasts — mount once near the root.' },
    ],
  },

  {
    id: 'page-header',
    name: 'Page Header',
    importLine: "import { PageHeader } from '../teal/ui'",
    description: 'A page title row with an optional subtitle and a right-aligned actions slot for buttons.',
    examples: [
      {
        title: 'With actions',
        code: `<PageHeader title="Dashboard" subtitle="Overview of your workspace">\n  <Button variant="secondary">Export</Button>\n  <Button>New report</Button>\n</PageHeader>`,
        Demo: PageHeaderDemo,
      },
    ],
    props: [
      { name: 'title', type: 'ReactNode', default: '—', description: 'Page heading (required).' },
      { name: 'subtitle', type: 'ReactNode', default: '—', description: 'Optional subheading.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Right-aligned actions.' },
      el.className,
    ],
  },

  {
    id: 'empty-state',
    name: 'Empty State',
    importLine: "import { EmptyState } from '../teal/ui'",
    description: 'A centred placeholder for empty lists and panels, with an icon, title and optional message.',
    examples: [
      {
        title: 'Default',
        code: `<EmptyState\n  icon="inbox"\n  title="No messages"\n  message="When you receive messages they will show up here."\n/>`,
        Demo: EmptyStateDemo,
      },
    ],
    props: [
      { name: 'icon', type: 'string', default: "'inbox'", description: 'Material Symbols name.' },
      { name: 'title', type: 'string', default: "'Nothing here'", description: 'Heading.' },
      { name: 'message', type: 'string', default: '—', description: 'Optional helper text.' },
      el.className,
    ],
  },

  {
    id: 'loading-state',
    name: 'Loading State',
    importLine: "import { LoadingState } from '../teal/ui'",
    description: 'A centred spinning placeholder for panels that are fetching data.',
    examples: [
      {
        title: 'Default',
        code: `<LoadingState />`,
        Demo: LoadingStateDemo,
      },
    ],
    props: [el.className],
  },
]
