import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Filter,
  Moon,
  MoreVertical,
  Search,
  Settings,
  Sun,
} from 'lucide-react'
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
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
  HealthIndicator,
  IconButton,
  Input,
  Menu,
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
  Toaster,
  Tooltip,
  TooltipProvider,
  toast,
} from '@kryv/teal'
import changelog from '../generated/changelog.json'

/**
 * Refined direction: the details the library currently skips.
 * 1. Interactive state changes snap — every button, input, tab, checkbox and menu item
 *    flips color instantly. Here they transition over --teal-motion-fast.
 * 2. Default control borders are heavy (--teal-border-strong is full outline color).
 *    Here they start as hairlines and strengthen on hover/focus.
 */
const refinedMotionCss = `
  [data-refined] button,
  [data-refined] a,
  [data-refined] input,
  [data-refined] textarea,
  [data-refined] [role='tab'],
  [data-refined] [role='checkbox'],
  [data-refined] [role='switch'],
  [data-refined] [role='menuitem'] {
    transition-property: color, background-color, border-color, box-shadow, transform;
    transition-duration: var(--teal-motion-fast);
    transition-timing-function: ease;
  }
  @media (prefers-reduced-motion: reduce) {
    [data-refined] button,
    [data-refined] a,
    [data-refined] input,
    [data-refined] textarea,
    [data-refined] [role='tab'],
    [data-refined] [role='checkbox'],
    [data-refined] [role='switch'],
    [data-refined] [role='menuitem'] {
      transition: none;
    }
  }
`

const variants = [
  {
    key: 'A',
    name: 'Current',
    caption: 'The library as it ships today — hairline panels, refined radii, calm elevation.',
  },
  {
    key: 'B',
    name: 'Refined',
    caption:
      'Same language, finished feel — every interactive state eases over 150ms, and control borders start as hairlines that strengthen on hover.',
  },
]

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
      </div>
    </div>
  )
}

function DataSection() {
  const [page, setPage] = useState(3)
  return (
    <div className="grid gap-6">
      <Table caption="Projects" rows={projectRows} getRowKey={(row) => row.id} columns={projectColumns} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Progress label="Import progress" value={64} className="w-full max-w-xs" />
        <Pagination page={page} pageCount={8} onPageChange={setPage} />
      </div>
    </div>
  )
}

function FeedbackSection() {
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
      <div className="flex flex-wrap items-center gap-6">
        <Spinner label="Loading example" />
        <Skeleton className="h-14 w-full max-w-sm" />
        <Button
          variant="secondary"
          onClick={() => toast({ title: 'Changes saved', description: 'Your settings are up to date.', variant: 'success' })}
        >
          Show toast
        </Button>
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
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
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
      <Popover
        label="Filter projects"
        trigger={
          <Button variant="secondary">
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
  { id: 'data', title: 'Data display', hint: 'Table · Progress · Pagination', Body: DataSection },
  { id: 'feedback', title: 'Feedback', hint: 'Alert · Skeleton · Toast', Body: FeedbackSection },
  { id: 'navigation', title: 'Navigation', hint: 'Tabs · Breadcrumb · Menu', Body: NavigationSection },
  { id: 'overlays', title: 'Overlays', hint: 'Dialog · Popover · Tooltip', Body: OverlaysSection },
  { id: 'surfaces', title: 'Surfaces', hint: 'Card · EmptyState', Body: SurfacesSection },
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

function VariantSwitcher({ current, onChange }) {
  const index = variants.findIndex((v) => v.key === current)
  const step = (delta) => onChange(variants[(index + delta + variants.length) % variants.length].key)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-teal-outline-variant/40 bg-teal-inverse-surface px-2 py-1.5 text-teal-inverse-on-surface shadow-teal-overlay">
      <button type="button" aria-label="Previous direction" onClick={() => step(-1)} className="grid size-8 place-items-center rounded-full transition hover:bg-white/10">
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-32 text-center text-xs font-bold tracking-wide">
        <span className="text-teal-inverse-primary">{current}</span>
        <span className="mx-1.5 opacity-40">/</span>
        {variants[index].name}
      </span>
      <button type="button" aria-label="Next direction" onClick={() => step(1)} className="grid size-8 place-items-center rounded-full transition hover:bg-white/10">
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export function ShowcasePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('variant')?.toUpperCase() ?? 'A'
  const current = variants.some((v) => v.key === requested) ? requested : 'A'
  const variant = variants.find((v) => v.key === current)
  const refined = current === 'B'

  const changeVariant = (key) => {
    const next = new URLSearchParams(searchParams)
    next.set('variant', key)
    setSearchParams(next, { replace: true })
  }

  return (
    <TooltipProvider>
      <div
        {...(refined ? { 'data-refined': '' } : {})}
        style={refined ? { '--teal-border-strong': 'color-mix(in srgb, var(--teal-color-outline) 50%, transparent)' } : undefined}
        className="min-h-screen bg-teal-surface text-teal-on-surface"
      >
        {refined ? <style>{refinedMotionCss}</style> : null}
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-primary">
                Teal design system · component gallery · v{changelog.version}
              </p>
              <h1 className="mt-3 font-teal-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
                Direction {current} — {variant.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-teal-on-surface-variant">{variant.caption}</p>
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
        <VariantSwitcher current={current} onChange={changeVariant} />
        <Toaster />
      </div>
    </TooltipProvider>
  )
}

export default ShowcasePage
