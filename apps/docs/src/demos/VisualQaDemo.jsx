import { useState } from 'react'
import { Bell, Home, MoreHorizontal, Search, Settings, Users } from 'lucide-react'
import {
  Accordion,
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
  Toaster,
  Tooltip,
  TooltipProvider,
  TopBar,
  TopBarActions,
  TopBarBrand,
  TopBarSearch,
  VerticalNav,
  VerticalNavFooter,
  VerticalNavItem,
  VerticalNavList,
  VerticalNavSection,
  toast,
} from '@kryv/teal'

const sections = {
  Actions: 'Buttons preserve a clear primary path and calm secondary actions.',
  Forms: 'Controls share one field rhythm across validation and selection states.',
  Surfaces: 'Containers establish hierarchy through tone, border, and elevation.',
  Overlays: 'Floating surfaces remain distinct from both content and page chrome.',
  Feedback: 'Status treatments carry meaning without relying on color alone.',
  Navigation: 'Navigation modules use the same selected and focus vocabulary.',
  Data: 'Dense information remains legible at comfortable and compact densities.',
}

function Section({ children, name }) {
  return (
    <section aria-labelledby={`visual-${name.toLowerCase()}`} className="grid gap-4">
      <div>
        <h2 id={`visual-${name.toLowerCase()}`} className="font-headline text-xl font-bold text-on-surface">{name}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">{sections[name]}</p>
      </div>
      <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-4 shadow-raised sm:p-6">
        {children}
      </div>
    </section>
  )
}

export function VisualQaDemo() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [page, setPage] = useState(2)
  const tableColumns = [
    { key: 'project', header: 'Project', cell: (row) => <span className="font-semibold">{row.project}</span> },
    { key: 'owner', header: 'Owner', cell: (row) => row.owner },
    { key: 'status', header: 'Status', cell: (row) => <Badge variant={row.variant}>{row.status}</Badge> },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <main className="min-h-screen bg-background px-4 py-10 text-on-surface sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12">
          <PageHeader
            title="Visual QA"
            subtitle="Deterministic coverage for Teal module families, themes, and interaction states."
            actions={<Badge variant="info">v0.3.1</Badge>}
          />

          <Section name="Actions">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Saving</Button>
              <Button disabled>Disabled</Button>
              <IconButton label="Notifications"><Bell /></IconButton>
              <IconButton label="More actions" variant="secondary"><MoreHorizontal /></IconButton>
            </div>
          </Section>

          <Section name="Forms">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Workspace name" description="Shown to everyone in the workspace.">
                <Input defaultValue="Northstar" />
              </Field>
              <Field label="Owner" required>
                <Select
                  defaultValue="avery"
                  options={[{ value: 'avery', label: 'Avery Chen' }, { value: 'sam', label: 'Sam Rivera' }]}
                />
              </Field>
              <Field label="Description" error="Keep the description under 120 characters.">
                <TextArea defaultValue="A shared operating workspace for the product team." />
              </Field>
              <div className="grid content-start gap-4 pt-1">
                <Checkbox label="Include archived projects" description="Archived work appears in search results." defaultChecked />
                <Switch label="Security notifications" description="Receive alerts for high-risk activity." defaultChecked />
                <Input aria-label="Disabled field" value="Managed by your organization" disabled readOnly />
              </div>
            </div>
          </Section>

          <Section name="Surfaces">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Incident response</CardTitle>
                    <CardDescription>Four active reports need review.</CardDescription>
                  </div>
                  <Avatar name="Avery Chen" />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Draft</Badge><Badge variant="success">Healthy</Badge><Badge variant="warning">Review</Badge><Badge variant="danger">Blocked</Badge>
                </CardContent>
                <CardFooter><Button size="sm">Open workspace</Button></CardFooter>
              </Card>
              <Accordion
                defaultValue="summary"
                items={[
                  { value: 'summary', title: 'Summary', content: 'The current system is stable and ready for review.' },
                  { value: 'activity', title: 'Recent activity', content: 'Three updates were published today.' },
                  { value: 'disabled', title: 'Unavailable section', content: 'Unavailable', disabled: true },
                ]}
              />
            </div>
          </Section>

          <Section name="Overlays">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
              <Tooltip content="Search all workspaces"><IconButton label="Search"><Search /></IconButton></Tooltip>
              <Menu
                label="Project actions"
                trigger={<Button variant="secondary">Open menu</Button>}
                items={[
                  { id: 'members', label: 'Manage members', icon: <Users />, onSelect: () => {} },
                  { id: 'archive', label: 'Archive project', variant: 'danger', separatorBefore: true, onSelect: () => {} },
                ]}
              />
              <Popover
                label="Workspace filters"
                trigger={<Button variant="secondary">Open popover</Button>}
              >
                <p className="font-semibold">Workspace filters</p>
                <p className="mt-1 text-sm text-on-surface-variant">Choose which projects appear in this view.</p>
              </Popover>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title="Archive project?"
              description="You can restore the project later."
              footer={<><Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button><Button variant="danger">Archive</Button></>}
            >
              <p className="text-sm text-on-surface-variant">Project Northstar and its reports will leave the active workspace.</p>
            </Dialog>
          </Section>

          <Section name="Feedback">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3">
                <Alert title="Changes saved" variant="success">Your workspace settings are up to date.</Alert>
                <Alert title="Review required" variant="warning">Two fields need your attention.</Alert>
                <Alert title="Connection failed" variant="danger">Check your network and try again.</Alert>
                <Button variant="secondary" onClick={() => toast({ title: 'Import complete', description: '24 records were added.', variant: 'success' })}>Show toast</Button>
              </div>
              <div className="grid gap-4">
                <Progress label="Import progress" value={64} />
                <div className="flex items-center gap-4"><Spinner /><Skeleton className="h-10 flex-1" /></div>
                <LoadingState className="min-h-28" label="Loading report" />
                <EmptyState className="min-h-52" title="No results" description="Try adjusting your filters." action={<Button size="sm">Clear filters</Button>} />
              </div>
            </div>
          </Section>

          <Section name="Navigation">
            <div className="grid gap-5">
              <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Northstar' }]} />
              <Tabs
                aria-label="Project sections"
                defaultValue="overview"
                items={[
                  { value: 'overview', label: 'Overview', content: <p className="text-sm text-on-surface-variant">Overview content</p> },
                  { value: 'activity', label: 'Activity', content: 'Activity content' },
                  { value: 'settings', label: 'Settings', content: 'Settings content', disabled: true },
                ]}
              />
              <Pagination page={page} pageCount={8} onPageChange={setPage} />
              <div className="overflow-hidden rounded-2xl border border-outline-variant/50">
                <TopBar sticky={false} className="px-4">
                  <TopBarBrand className="font-headline font-bold">Northstar</TopBarBrand>
                  <TopBarSearch><span className="text-sm text-on-surface-variant">Search workspace</span></TopBarSearch>
                  <TopBarActions><IconButton label="Settings"><Settings /></IconButton></TopBarActions>
                </TopBar>
                <div className="flex min-h-64 flex-col bg-background sm:flex-row">
                  <VerticalNav className="w-full shrink-0 border-b border-r-0 sm:w-72 sm:border-b-0 sm:border-r" mode="full">
                    <VerticalNavList>
                      <VerticalNavSection label="Workspace">
                        <VerticalNavItem active icon={<Home />} href="#">Overview</VerticalNavItem>
                        <VerticalNavItem icon={<Users />} href="#">People</VerticalNavItem>
                      </VerticalNavSection>
                    </VerticalNavList>
                    <VerticalNavFooter className="text-xs text-on-surface-variant">Northstar</VerticalNavFooter>
                  </VerticalNav>
                  <div className="flex min-h-32 flex-1 items-center justify-center text-sm text-on-surface-variant">Workspace content</div>
                </div>
              </div>
            </div>
          </Section>

          <Section name="Data">
            <div className="grid gap-5">
              <Table
                caption="Active projects"
                columns={tableColumns}
                getRowKey={(row) => row.project}
                rows={[
                  { project: 'Northstar', owner: 'Avery Chen', status: 'Healthy', variant: 'success' },
                  { project: 'Beacon', owner: 'Sam Rivera', status: 'Review', variant: 'warning' },
                  { project: 'Atlas', owner: 'Morgan Lee', status: 'Blocked', variant: 'danger' },
                ]}
              />
              <Separator />
              <Table caption="Loading projects" columns={tableColumns} getRowKey={(row) => row.project} loading rows={[]} />
            </div>
          </Section>
        </div>
      </main>
      <Toaster />
    </TooltipProvider>
  )
}
