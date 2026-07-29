import { useEffect, useState } from 'react'
import {
  Archive,
  Bell,
  Filter,
  Home,
  Moon,
  MoreVertical,
  Search,
  Settings,
  Sun,
} from 'lucide-react'
import {
  Alert,
  AlertDialog,
  Announcer,
  AspectRatio,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  Checkbox,
  ColorPicker,
  CopyButton,
  DateRangePicker,
  Dialog,
  Editable,
  EmptyState,
  Field,
  Grid,
  HealthIndicator,
  IconButton,
  Input,
  InputAddon,
  InputGroup,
  List,
  ListItem,
  Menubar,
  Menu,
  Meter,
  NavigationMenu,
  NavRail,
  NavRailItem,
  Pagination,
  PinInput,
  Popconfirm,
  Popover,
  Progress,
  Rating,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Result,
  Select,
  Separator,
  Skeleton,
  Sparkline,
  Spinner,
  Stack,
  Stat,
  Switch,
  Table,
  Tabs,
  TagsInput,
  TextArea,
  ThemeToggle as TealThemeToggle,
  TimePicker,
  Toaster,
  Tooltip,
  TooltipProvider,
  Tour,
  VisuallyHidden,
  toast,
} from '@kryv/teal'
import changelog from '../generated/changelog.json'

/* ---------------------------------------------------------------- */
/* Shared specimen set — identical content for every variant         */
/* ---------------------------------------------------------------- */

const projectRows = [
  { id: 'orion', name: 'Orion', owner: 'Avery Chen', status: 'Ready', updated: '5 min ago' },
  { id: 'atlas', name: 'Atlas', owner: 'Morgan Reyes', status: 'Review', updated: '1 h ago' },
  { id: 'nova', name: 'Nova', owner: 'Riley Okafor', status: 'Ready', updated: '3 h ago' },
  { id: 'lyra', name: 'Lyra', owner: 'Sam Whitfield', status: 'Paused', updated: 'Yesterday' },
]

const statusVariant = { Ready: 'success', Review: 'warning', Paused: 'neutral' }

const projectColumns = [
  { key: 'name', header: 'Project', cell: (row) => <strong>{row.name}</strong> },
  {
    key: 'owner',
    header: 'Owner',
    cell: (row) => (
      <span className="flex items-center gap-2">
        <Avatar name={row.owner} size="sm" />
        {row.owner}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
  { key: 'updated', header: 'Updated', cell: (row) => row.updated },
]

function ActionsSection() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Small</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <IconButton label="Search">
        <Search />
      </IconButton>
    </div>
  )
}

function StatusSection() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="info">Information</Badge>
        <Badge variant="success">Ready</Badge>
        <Badge variant="warning">Attention</Badge>
        <Badge variant="danger">Action required</Badge>
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Avatar name="Avery Chen" size="sm" />
          <Avatar name="Avery Chen" />
          <Avatar name="Avery Chen" size="lg" />
        </div>
        <div className="flex -space-x-2">
          <Avatar name="Avery Chen" />
          <Avatar name="Morgan Reyes" />
          <Avatar name="Riley Okafor" />
          <Avatar name="Sam Whitfield" />
        </div>
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-5">
        <HealthIndicator status="healthy" label="Billing" />
        <HealthIndicator status="degraded" label="Search" />
        <HealthIndicator status="down" label="Exports" />
        <HealthIndicator status="loading" label="Reports" />
      </div>
    </div>
  )
}

function FormsSection() {
  const [region, setRegion] = useState('eu')
  const [tags, setTags] = useState(['design', 'security'])
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-5">
        <Field label="Workspace name" description="Shown on invoices and shared links" required>
          <Input defaultValue="Kryv Labs" />
        </Field>
        <Field label="Home region" description="Where new data is stored">
          <Select
            aria-label="Home region"
            value={region}
            onValueChange={setRegion}
            options={[
              { value: 'eu', label: 'Europe (Frankfurt)' },
              { value: 'us', label: 'United States (Virginia)' },
              { value: 'ap', label: 'Asia Pacific (Singapore)' },
            ]}
          />
        </Field>
        <Field label="Announcement" error="Keep announcements under 240 characters">
          <TextArea defaultValue="Scheduled maintenance on Saturday, 02:00–03:00 UTC." />
        </Field>
        <Field label="Workspace domain">
          <InputGroup>
            <InputAddon position="leading">https://</InputAddon>
            <Input aria-label="Workspace domain" placeholder="kryv.example" />
          </InputGroup>
        </Field>
        <DateRangePicker label="Report period" onChange={() => undefined} />
      </div>
      <div className="grid content-start gap-6">
        <div className="grid gap-4">
          <Checkbox label="Include archived projects" description="Show archived work in lists" defaultChecked />
          <Checkbox label="Select all reports" defaultChecked="indeterminate" />
          <Checkbox label="Share with external reviewers" />
        </div>
        <Separator />
        <div className="grid gap-5">
          <Switch label="Security notifications" description="Alerts for high-risk account activity" defaultChecked />
          <Switch label="Weekly digest" />
          <Switch label="Billing alerts" description="Managed by your administrator" disabled />
        </div>
        <Separator />
        <div className="grid gap-5">
          <TagsInput label="Add label" value={tags} onChange={setTags} placeholder="Add a label…" />
          <div className="flex flex-wrap items-center gap-6">
            <TimePicker label="Start time" defaultValue="09:30" onChange={() => undefined} />
            <ColorPicker label="Accent color" defaultValue="#065a60" onChange={() => undefined} />
          </div>
          <Editable label="Workspace name" defaultValue="Kryv Labs" onSubmit={() => undefined} />
          <PinInput label="Verification code" length={6} onComplete={() => undefined} />
        </div>
      </div>
    </div>
  )
}

function DataSection() {
  const [page, setPage] = useState(3)
  const [date, setDate] = useState(() => new Date())
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <Stat label="Monthly recurring revenue" value="$48.2k" delta={{ direction: 'up', value: '+12.4%' }} description="vs. previous month">
          <Sparkline aria-label="Revenue trending up" data={[4, 8, 6, 12, 9, 14]} variant="area" width={180} />
        </Stat>
        <Stat label="Active incidents" value="3" delta={{ direction: 'down', value: '-2' }} description="vs. previous week" />
        <Stat label="Open reports" value="14" delta={{ direction: 'flat', value: '0' }} description="unchanged" />
      </div>
      <Separator />
      <Table caption="Projects" rows={projectRows} getRowKey={(row) => row.id} columns={projectColumns} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Progress label="Import progress" value={64} className="w-full max-w-xs" />
        <Pagination page={page} pageCount={8} onPageChange={setPage} />
      </div>
      <Separator />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-2">
          <Calendar value={date} onSelect={setDate} />
          <span className="text-sm text-teal-on-surface-variant">Selected: {date.toLocaleDateString()}</span>
        </div>
        <div className="rounded-lg border border-teal-outline-variant/50">
          <List>
            <ListItem title="Security report.pdf" secondary="240 KB · Updated 5 min ago" onClick={() => undefined} />
            <ListItem title="Reliability review.pdf" secondary="128 KB · Updated 1 h ago" onClick={() => undefined} />
            <ListItem title="Usage metrics.csv" secondary="64 KB · Updated yesterday" onClick={() => undefined} />
          </List>
        </div>
      </div>
    </div>
  )
}

function FeedbackSection() {
  const [announcement, setAnnouncement] = useState('')
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 lg:grid-cols-2">
        <Alert variant="success" title="Report published">
          The quarterly security report is now available to all workspace members.
        </Alert>
        <Alert variant="warning" title="Payment method expiring" onDismiss={() => undefined}>
          The workspace card ends in 04/25. Update billing details to avoid interruption.
        </Alert>
      </div>
      <Separator />
      <div className="grid gap-5">
        <Meter label="Storage used" value={72} low={60} high={85} optimum={20} className="max-w-sm" />
        <Rating label="Rate this workspace" defaultValue={4} />
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-6">
        <Spinner label="Loading example" />
        <Skeleton className="h-14 w-full max-w-sm" />
        <Button
          variant="secondary"
          onClick={() => {
            setAnnouncement('Changes saved')
            toast({ title: 'Changes saved', description: 'Your settings are up to date.', variant: 'success' })
          }}
        >
          Show toast
        </Button>
        <Announcer message={announcement} />
      </div>
    </div>
  )
}

function NavigationSection() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: 'Workspace', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'Orion' },
          ]}
        />
        <Menu
          trigger={
            <IconButton label="Project actions">
              <MoreVertical />
            </IconButton>
          }
          items={[
            { id: 'settings', label: 'Settings', icon: <Settings />, onSelect: () => undefined },
            { id: 'archive', label: 'Archive', icon: <Archive />, variant: 'danger', separatorBefore: true, onSelect: () => undefined },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Menubar
          label="Application"
          menus={[
            { label: 'File', items: [{ id: 'new', label: 'New project', onSelect: () => undefined }, { id: 'export', label: 'Export…', onSelect: () => undefined }] },
            { label: 'Edit', items: [{ id: 'undo', label: 'Undo', onSelect: () => undefined }, { id: 'redo', label: 'Redo', disabled: true, onSelect: () => undefined }] },
          ]}
        />
        <NavigationMenu
          label="Primary"
          items={[
            { type: 'link', label: 'Overview', href: '#', active: true },
            { type: 'link', label: 'Reports', href: '#' },
            { type: 'link', label: 'Members', href: '#' },
          ]}
        />
        <NavRail aria-label="Product">
          <NavRailItem icon={<Home />} label="Home" href="#" active />
          <NavRailItem icon={<Search />} label="Search" href="#" />
          <NavRailItem icon={<Bell />} label="Notifications" href="#" badge />
          <NavRailItem icon={<Settings />} label="Settings" href="#" />
        </NavRail>
      </div>
      <Tabs
        aria-label="Project details"
        defaultValue="overview"
        items={[
          { value: 'overview', label: 'Overview', content: <p className="text-sm text-teal-on-surface-variant">Project overview content</p> },
          { value: 'activity', label: 'Activity', content: <p className="text-sm text-teal-on-surface-variant">Recent project activity</p> },
          { value: 'access', label: 'Access', content: <p className="text-sm text-teal-on-surface-variant">Workspace access settings</p> },
        ]}
      />
    </div>
  )
}

function OverlaysSection() {
  const [open, setOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button id="showcase-open-dialog" onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Archive project?"
        description="The project can be restored later."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Archive
            </Button>
          </>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          Project Orion and its reports will leave the active workspace.
        </p>
      </Dialog>
      <AlertDialog
        trigger={<Button variant="danger">Delete project</Button>}
        title="Delete project?"
        description="This removes Orion and its reports permanently."
        tone="danger"
        confirmText="Delete"
        onConfirm={() => undefined}
      />
      <Popconfirm
        trigger={<Button variant="secondary">Remove member</Button>}
        title="Remove Avery?"
        message="They lose access to this workspace immediately."
        tone="danger"
        confirmText="Remove"
        onConfirm={() => undefined}
      />
      <Popover
        label="Filter projects"
        trigger={
          <Button id="showcase-filters" variant="secondary">
            <Filter /> Filters
          </Button>
        }
        align="start"
      >
        <div className="grid gap-3">
          <h3 className="font-teal-headline font-bold">Filter projects</h3>
          <Checkbox label="Active only" defaultChecked />
          <Button size="sm">Apply filters</Button>
        </div>
      </Popover>
      <Tooltip content="Search the workspace" delayDuration={0}>
        <IconButton label="Search">
          <Search />
        </IconButton>
      </Tooltip>
      <Button variant="ghost" onClick={() => setTourOpen(true)}>Start tour</Button>
      <Tour
        open={tourOpen}
        onOpenChange={setTourOpen}
        steps={[
          { target: '#showcase-open-dialog', title: 'Blocking decisions', content: 'Dialogs and alert dialogs own focus for decisions that must wait.' },
          { target: '#showcase-filters', title: 'Anchored controls', content: 'Popovers and popconfirms keep supplemental controls near their trigger.' },
        ]}
      />
    </div>
  )
}

function SurfacesSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-col items-start justify-start gap-1.5">
          <CardTitle>Security report</CardTitle>
          <CardDescription>Updated five minutes ago</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-teal-on-surface">No critical findings were detected across 14 checks.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="secondary">
            View report
          </Button>
        </CardFooter>
      </Card>
      <EmptyState
        title="No reports"
        description="Create a report to begin tracking results."
        action={<Button>Create report</Button>}
      />
      <div className="lg:col-span-2">
        <Result
          status="404"
          title="Page not found"
          description="The report may have been moved or deleted."
          actions={<Button variant="secondary">Back to projects</Button>}
          className="rounded-teal-surface border border-teal-outline-variant/50"
        />
      </div>
    </div>
  )
}

function LayoutSection() {
  return (
    <div className="grid gap-6">
      <Stack direction="row" gap={3} align="center" wrap>
        <Avatar name="Avery Chen" />
        <Stack gap={0}>
          <strong className="text-sm">Avery Chen</strong>
          <span className="text-xs text-teal-on-surface-variant">Workspace owner</span>
        </Stack>
        <Badge variant="success">Active</Badge>
      </Stack>
      <Grid minChildWidth="10rem" gap={3}>
        {['Reports', 'Members', 'Security', 'Billing'].map((tile) => (
          <span key={tile} className="rounded-lg border border-teal-outline-variant/50 px-3 py-4 text-center text-sm">
            {tile}
          </span>
        ))}
      </Grid>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-36">
          <ResizablePanelGroup direction="horizontal" className="gap-1">
            <ResizablePanel defaultSize={30} minSize={15}>
              <div className="flex h-full items-center justify-center rounded-lg border border-teal-outline-variant/50 bg-teal-surface-container-low text-sm text-teal-on-surface-variant">
                Sidebar
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={30}>
              <div className="flex h-full items-center justify-center rounded-lg border border-teal-outline-variant/50 bg-teal-surface-container-low text-sm text-teal-on-surface-variant">
                Content
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <AspectRatio ratio={16 / 9}>
          <div className="flex size-full items-center justify-center bg-teal-surface-container-high text-sm text-teal-on-surface-variant">
            16 : 9 media area
          </div>
        </AspectRatio>
      </div>
    </div>
  )
}

function UtilitiesSection() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <CopyButton value="npm install @kryv/teal" label="Copy install command" />
        <CopyButton iconOnly value="npm install @kryv/teal" label="Copy install command" />
        <TealThemeToggle />
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-teal-outline-variant/50 hover:bg-teal-surface-container-high"
        >
          <Archive aria-hidden="true" className="size-4" />
          <VisuallyHidden>Archive project</VisuallyHidden>
        </button>
      </div>
      <div className="max-w-md">
        <Carousel label="Quarterly reports">
          {['Q1 security', 'Q2 reliability', 'Q3 usage'].map((title) => (
            <div
              key={title}
              className="flex h-36 items-center justify-center rounded-lg border border-teal-outline-variant/50 bg-teal-surface-container-low text-sm font-semibold"
            >
              {title}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Presentation shell — identical for both variants                  */
/* ---------------------------------------------------------------- */

const sections = [
  { id: 'actions', title: 'Actions', hint: 'Button · IconButton', Body: ActionsSection },
  { id: 'status', title: 'Status & identity', hint: 'Badge · Avatar · HealthIndicator', Body: StatusSection },
  { id: 'forms', title: 'Forms', hint: 'Field · Input · Select · Checkbox · Switch', Body: FormsSection },
  { id: 'data', title: 'Data display', hint: 'Table · Progress · Pagination · Stat · Calendar · List', Body: DataSection },
  { id: 'feedback', title: 'Feedback', hint: 'Alert · Skeleton · Toast · Meter · Rating', Body: FeedbackSection },
  { id: 'navigation', title: 'Navigation', hint: 'Tabs · Breadcrumb · Menu · Menubar', Body: NavigationSection },
  { id: 'overlays', title: 'Overlays', hint: 'Dialog · AlertDialog · Popconfirm · Tour', Body: OverlaysSection },
  { id: 'surfaces', title: 'Surfaces', hint: 'Card · EmptyState · Result', Body: SurfacesSection },
  { id: 'layout', title: 'Layout', hint: 'Stack · Grid · Resizable · AspectRatio', Body: LayoutSection },
  { id: 'utilities', title: 'Utilities', hint: 'CopyButton · ThemeToggle · Carousel · VisuallyHidden', Body: UtilitiesSection },
]

function Section({ title, hint, children }) {
  return (
    <section className="overflow-hidden rounded-teal-surface border border-teal-outline-variant/50 bg-teal-surface-container-lowest">
      <header className="flex items-baseline justify-between gap-3 border-b border-teal-outline-variant/40 px-5 py-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-on-surface">{title}</h2>
        <span className="text-[11px] font-medium text-teal-on-surface-variant">{hint}</span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => window.localStorage.getItem('teal-theme') === 'dark',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('teal-theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <IconButton label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark((v) => !v)}>
      {dark ? <Sun /> : <Moon />}
    </IconButton>
  )
}

export function ShowcasePage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-teal-surface text-teal-on-surface">
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-primary">
                Teal design system · component gallery · v{changelog.version}
              </p>
              <h1 className="mt-3 font-teal-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
                Component gallery
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-teal-on-surface-variant">
                The library as it ships — hairline panels, refined radii, calm elevation, and motion on every state change.
              </p>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid gap-5">
            {sections.map(({ id, title, hint, Body }) => (
              <Section key={id} title={title} hint={hint}>
                <Body />
              </Section>
            ))}
          </div>
        </div>
        <Toaster />
        <BackTop />
      </div>
    </TooltipProvider>
  )
}

export default ShowcasePage
