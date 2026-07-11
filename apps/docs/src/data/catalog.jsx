import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  EmptyState,
  Field,
  IconButton,
  Input,
  LoadingState,
  Menu,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Tabs,
  TextArea,
  Tooltip,
  toast,
} from '@kryv/teal'
import { Archive, Filter, MoreVertical, Search, Settings } from 'lucide-react'

function ButtonDemo() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Saving</Button>
      <IconButton label="Search"><Search /></IconButton>
    </>
  )
}

function BadgeDemo() {
  return (
    <>
      <Badge>Neutral</Badge>
      <Badge tone="info">Information</Badge>
      <Badge tone="success">Ready</Badge>
      <Badge tone="warning">Attention</Badge>
      <Badge tone="danger">Action required</Badge>
    </>
  )
}

function CardDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Security report</CardTitle>
        <CardDescription>Updated five minutes ago</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-on-surface">No critical findings were detected.</p></CardContent>
      <CardFooter><Button size="sm" variant="secondary">View report</Button></CardFooter>
    </Card>
  )
}

function FormDemo() {
  const [role, setRole] = useState('viewer')
  const [archived, setArchived] = useState(false)
  const [notifications, setNotifications] = useState(true)
  return (
    <div className="grid w-full max-w-lg gap-5">
      <Field label="Display name" description="Shown to other workspace members" required>
        <Input defaultValue="Avery Chen" />
      </Field>
      <Field label="Role">
        <Select
          value={role}
          onValueChange={setRole}
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
      </Field>
      <Field label="Notes" error="Keep notes under 240 characters">
        <TextArea defaultValue="Notify the incident team before changing this account." />
      </Field>
      <Checkbox label="Include archived projects" checked={archived} onCheckedChange={(checked) => setArchived(checked === true)} />
      <Switch
        label="Security notifications"
        description="Receive alerts for high-risk account activity"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
    </div>
  )
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Archive project?"
        description="The project can be restored later."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Archive</Button>
          </>
        }
      >
        <p className="text-sm text-on-surface-variant">Project Orion and its reports will leave the active workspace.</p>
      </Dialog>
    </>
  )
}

function TooltipDemo() {
  return (
    <Tooltip content="Refresh search results" delayDuration={0}>
      <IconButton label="Refresh results"><Search /></IconButton>
    </Tooltip>
  )
}

function ToastDemo() {
  return <Button onClick={() => toast({ title: 'Changes saved', description: 'Your settings are up to date.', tone: 'success' })}>Show toast</Button>
}

function MenuDemo() {
  return (
    <Menu
      trigger={<IconButton label="Project actions"><MoreVertical /></IconButton>}
      items={[
        { id: 'settings', label: 'Settings', icon: <Settings />, onSelect: () => undefined },
        { id: 'archive', label: 'Archive', icon: <Archive />, tone: 'danger', separatorBefore: true, onSelect: () => undefined },
      ]}
    />
  )
}

function PopoverDemo() {
  return (
    <Popover trigger={<Button variant="secondary"><Filter /> Filters</Button>} align="start">
      <div className="grid gap-3">
        <h3 className="font-headline font-bold">Filter projects</h3>
        <Checkbox label="Active only" defaultChecked />
        <Button size="sm">Apply filters</Button>
      </div>
    </Popover>
  )
}

function TabsDemo() {
  return (
    <div className="w-full max-w-xl">
      <Tabs
        aria-label="Project details"
        defaultValue="overview"
        items={[
          { value: 'overview', label: 'Overview', content: <p className="text-sm">Project overview content</p> },
          { value: 'activity', label: 'Activity', content: <p className="text-sm">Recent project activity</p> },
          { value: 'access', label: 'Access', content: <p className="text-sm">Workspace access settings</p> },
        ]}
      />
    </div>
  )
}

function EmptyDemo() {
  return <EmptyState title="No reports" description="Create a report to begin tracking results." action={<Button>Create report</Button>} className="w-full max-w-lg" />
}

function LoadingDemo() {
  return (
    <div className="grid w-full max-w-lg gap-5">
      <div className="flex items-center gap-5"><Spinner label="Loading example" /><Progress label="Import progress" value={64} /></div>
      <Skeleton className="h-20 w-full" />
      <LoadingState label="Loading reports" className="min-h-32" />
    </div>
  )
}

const projectRows = [
  { id: 'orion', name: 'Orion', owner: 'Avery', status: 'Ready' },
  { id: 'atlas', name: 'Atlas', owner: 'Morgan', status: 'Review' },
  { id: 'nova', name: 'Nova', owner: 'Riley', status: 'Ready' },
]

function TableDemo() {
  return (
    <div className="w-full">
      <Table
        caption="Projects"
        rows={projectRows}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Project', cell: (row) => <strong>{row.name}</strong> },
          { key: 'owner', header: 'Owner', cell: (row) => row.owner },
          { key: 'status', header: 'Status', cell: (row) => <Badge tone={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge> },
        ]}
      />
    </div>
  )
}

function PaginationDemo() {
  const [page, setPage] = useState(3)
  return <Pagination page={page} pageCount={8} onPageChange={setPage} />
}

function PageHeaderDemo() {
  return <div className="w-full"><PageHeader title="Workspace settings" subtitle="Manage security and notifications" actions={<Button>Save changes</Button>} /></div>
}

function SeparatorDemo() {
  return <div className="w-full max-w-md space-y-4"><p>Account settings</p><Separator /><p className="text-sm text-on-surface-variant">Security preferences</p></div>
}

const moduleEntries = [
  { id: 'button', name: 'Button', apiNames: ['Button', 'IconButton'], description: 'Actions with consistent hierarchy, sizing, loading, and accessible icon treatment.', Demo: ButtonDemo },
  { id: 'field', name: 'Field', apiNames: ['Field', 'Label'], description: 'A deep form seam that connects labels, descriptions, errors, and required state.', Demo: FormDemo },
  { id: 'input', name: 'Input and TextArea', apiNames: ['Input', 'TextArea'], description: 'Native text controls with Teal sizing, invalid states, and forwarded refs.', Demo: FormDemo },
  { id: 'select', name: 'Select', apiNames: ['Select'], description: 'An accessible single-value picker with keyboard navigation, typeahead, and collision-aware positioning.', Demo: FormDemo },
  { id: 'checkbox', name: 'Checkbox', apiNames: ['Checkbox'], description: 'Boolean and indeterminate selection with an integrated label and description.', Demo: FormDemo },
  { id: 'switch', name: 'Switch', apiNames: ['Switch'], description: 'An immediate boolean setting with explicit labeling and controlled or uncontrolled state.', Demo: FormDemo },
  { id: 'card', name: 'Card', apiNames: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'], description: 'A structural surface for related content without ambiguous interactive behavior.', Demo: CardDemo },
  { id: 'badge', name: 'Badge', apiNames: ['Badge'], description: 'A compact semantic status indicator using canonical information tones.', Demo: BadgeDemo },
  { id: 'dialog', name: 'Dialog', apiNames: ['Dialog'], description: 'A modal surface that owns focus management, naming, dismissal, and scroll locking.', Demo: DialogDemo },
  { id: 'tooltip', name: 'Tooltip', apiNames: ['Tooltip'], description: 'A short contextual hint with accessible trigger association and collision handling.', Demo: TooltipDemo },
  { id: 'menu', name: 'Menu', apiNames: ['Menu'], description: 'A structured action menu with keyboard navigation, disabled items, icons, and danger styling.', Demo: MenuDemo },
  { id: 'popover', name: 'Popover', apiNames: ['Popover'], description: 'An anchored surface for arbitrary controls and supplemental content.', Demo: PopoverDemo },
  { id: 'toast', name: 'Toast', apiNames: ['Toaster'], description: 'Imperative, announced feedback with semantic tones, optional actions, and dismissal.', Demo: ToastDemo },
  { id: 'empty-state', name: 'Empty State', apiNames: ['EmptyState'], description: 'An explanatory empty result with an optional action and SVG icon.', Demo: EmptyDemo },
  { id: 'loading', name: 'Loading', apiNames: ['LoadingState', 'Spinner', 'Skeleton', 'Progress'], description: 'Named progress and loading treatments for local, skeleton, and full-surface states.', Demo: LoadingDemo },
  { id: 'tabs', name: 'Tabs', apiNames: ['Tabs'], description: 'Keyboard-navigable content switching through a compact item interface.', Demo: TabsDemo },
  { id: 'pagination', name: 'Pagination', apiNames: ['Pagination'], description: 'A controlled page navigator with compact ranges and unavailable directions.', Demo: PaginationDemo },
  { id: 'page-header', name: 'Page Header', apiNames: ['PageHeader'], description: 'A responsive page title, supporting text, and action area.', Demo: PageHeaderDemo },
  { id: 'table', name: 'Table', apiNames: ['Table'], description: 'Accessible data presentation driven by column definitions, density, loading, and empty state.', Demo: TableDemo },
  { id: 'separator', name: 'Separator', apiNames: ['Separator'], description: 'A semantic or decorative divider for related content.', Demo: SeparatorDemo },
]

/** @type {Array<[string, string[]]>} */
const groupDefinitions = [
  ['Actions', ['button']],
  ['Forms', ['field', 'input', 'select', 'checkbox', 'switch']],
  ['Surfaces', ['card', 'badge']],
  ['Overlays', ['dialog', 'tooltip', 'menu', 'popover']],
  ['Feedback', ['toast', 'empty-state', 'loading']],
  ['Navigation', ['tabs', 'pagination', 'page-header']],
  ['Data', ['table', 'separator']],
]

export const catalogGroups = groupDefinitions.map(([name, ids]) => ({
  name,
  modules: ids.map((id) => moduleEntries.find((module) => module.id === id)),
}))

export const catalog = moduleEntries
