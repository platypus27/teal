import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, type JestAxeConfigureOptions } from 'jest-axe'
import {
  Accordion,
  AccountMenu,
  ActionBar,
  ActionSheet,
  ActivityFeed,
  Alert,
  AlertDialog,
  AnchorNav,
  Announcer,
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
  AppSwitcher,
  AspectRatio,
  Avatar,
  AvatarGroup,
  BackTop,
  Badge,
  BarChart,
  BlockingOverlay,
  BottomNav,
  BottomNavItem,
  Box,
  Breadcrumb,
  BulkActionBar,
  Button,
  ButtonGroup,
  Calendar,
  CalendarHeatmap,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  Center,
  ChartContainer,
  Checkbox,
  Chip,
  CodeBlock,
  Collapse,
  ColorPicker,
  Columns,
  Combobox,
  Command,
  CommentThread,
  Container,
  CookieConsent,
  CopyButton,
  CountdownTimer,
  CurrencyInput,
  DatePicker,
  DescriptionList,
  Dialog,
  DiffViewer,
  Dock,
  DockItem,
  Editable,
  EmptyState,
  EcosystemRail,
  ErrorBoundary,
  ExpandableCard,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  FloatingActionButton,
  FloatingPanel,
  FloatingToolbar,
  FocusTrap,
  Form,
  FormErrorSummary,
  FunnelChart,
  GanttChart,
  GaugeChart,
  Grid,
  HealthIndicator,
  Heatmap,
  HighlightText,
  IconButton,
  ImageViewer,
  InfiniteScroll,
  Input,
  InputAddon,
  InputGroup,
  JsonViewer,
  KanbanBoard,
  Kbd,
  LauncherCard,
  LazyImage,
  Lightbox,
  LineChart,
  Link,
  List,
  ListItem,
  LoadingBar,
  LoadingState,
  LogViewer,
  MarkdownView,
  Marquee,
  MaskedInput,
  Masonry,
  Menubar,
  Menu,
  MentionInput,
  Meter,
  NavigationMenu,
  NavRail,
  NavRailItem,
  NetworkStatus,
  NotificationCenter,
  NotificationItem,
  NumberInput,
  NumberTicker,
  OfflineBanner,
  OrgChart,
  PageHeader,
  Pagination,
  PasswordStrengthMeter,
  PermissionMatrix,
  PhoneInput,
  PieChart,
  PinInput,
  Popconfirm,
  Popover,
  Portal,
  Presence,
  Progress,
  PromptDialog,
  QrCode,
  RadarChart,
  RadioGroup,
  Rating,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Reveal,
  RichTextEditor,
  SaveStatus,
  ScatterChart,
  ScrollArea,
  ScrollShadow,
  Section,
  Select,
  Separator,
  ShareButton,
  Sidebar,
  SidebarCollapseButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  Skeleton,
  SkipLink,
  Slider,
  Sparkline,
  Spinner,
  SplitButton,
  Stack,
  Stat,
  StatusDot,
  StepUpNotice,
  Steps,
  StickyHeader,
  SubNav,
  SubNavItem,
  Switch,
  Table,
  Tabs,
  TagsInput,
  TextArea,
  ThemeToggle,
  TimeAgo,
  Timeline,
  TimePicker,
  TimezoneSelect,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Tour,
  TransferList,
  TreeGrid,
  TreeSelect,
  TreeView,
  Tooltip,
  TooltipProvider,
  TopBar,
  TopBarActions,
  TopBarBrand,
  TopBarSearch,
  TruncatedText,
  UploadProgress,
  VirtualList,
  VisuallyHidden,
  type CommandRenderState,
  dismissToast,
  toast,
} from '../src/index'

// color-contrast needs real layout (covered by tokens.test.ts); region is a page-level concern.
const axeOptions: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
}

const tableColumns = [
  { key: 'name', header: 'Name', cell: (row: { name: string; role: string }) => row.name },
  { key: 'role', header: 'Role', cell: (row: { name: string; role: string }) => row.role },
]

describe('axe: actions and forms', () => {
  it('buttons have no violations in every state', async () => {
    const { baseElement } = render(
      <>
        <Button>Save</Button>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button variant="danger" loading>Deleting</Button>
        <Button disabled>Disabled</Button>
        <IconButton label="Refresh">
          <svg aria-hidden="true" />
        </IconButton>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('field, input, and textarea have no violations with description and error', async () => {
    const { baseElement } = render(
      <>
        <Field label="Project name" description="Shown on the dashboard" required>
          <Input placeholder="Apollo" />
        </Field>
        <Field label="Slug" error="Slug is already taken">
          <Input defaultValue="apollo" />
        </Field>
        <Field label="Notes">
          <TextArea />
        </Field>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('checkbox and switch have no violations', async () => {
    const { baseElement } = render(
      <>
        <Checkbox label="Email me updates" description="Sent weekly" />
        <Checkbox label="Indeterminate" defaultChecked="indeterminate" />
        <Switch label="Enable alerts" description="Browser notifications" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('select has no violations closed and open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <Select
        aria-label="Environment"
        options={[
          { value: 'prod', label: 'Production' },
          { value: 'staging', label: 'Staging', disabled: true },
        ]}
      />,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()

    await user.click(screen.getByRole('combobox', { name: 'Environment' }))
    await screen.findByRole('listbox')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: display modules', () => {
  it('badges have no violations in every variant', async () => {
    const { baseElement } = render(
      <>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('card has no violations, including the disabled state', async () => {
    const { baseElement } = render(
      <>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Card as="button" type="button" disabled>
          Disabled action card
        </Card>
        <Card disabled>Disabled plain card</Card>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('page header and empty state have no violations', async () => {
    const header = render(<PageHeader title="Settings" subtitle="Manage your account" />)
    expect(await axe(header.baseElement, axeOptions)).toHaveNoViolations()
    header.unmount()

    const empty = render(
      <EmptyState
        title="No reports"
        description="Create your first report."
        icon={<svg data-testid="custom-icon" />}
        action={<Button>Create report</Button>}
      />,
    )
    expect(await axe(empty.baseElement, axeOptions)).toHaveNoViolations()
  })

  it('loading modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <LoadingState label="Loading reports" />
        <Spinner label="Refreshing" size="sm" />
        <Skeleton className="h-4 w-24" />
        <Progress label="Upload progress" value={40} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('separator has no violations', async () => {
    const { baseElement } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: data and navigation', () => {
  it('table has no violations with data, loading, and empty states', async () => {
    const { baseElement } = render(
      <>
        <Table
          caption="Team members"
          columns={tableColumns}
          getRowKey={(row) => row.name}
          rows={[{ name: 'Ada', role: 'Engineer' }]}
        />
        <Table caption="Loading members" columns={tableColumns} getRowKey={(row) => row.name} rows={[]} loading />
        <Table caption="Empty members" columns={tableColumns} getRowKey={(row) => row.name} rows={[]} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('pagination has no violations', async () => {
    const { baseElement } = render(<Pagination page={3} pageCount={12} onPageChange={() => {}} />)
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('tabs have no violations', async () => {
    const { baseElement } = render(
      <Tabs
        aria-label="Settings sections"
        items={[
          { value: 'general', label: 'General', content: <p>General settings</p> },
          { value: 'security', label: 'Security', content: <p>Security settings</p> },
          { value: 'billing', label: 'Billing', disabled: true, content: <p>Billing</p> },
        ]}
      />,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('sidebar and top bar have no violations in rail and full modes', async () => {
    const { baseElement } = render(
      <>
        <TopBar>
          <TopBarBrand>Teal</TopBarBrand>
          <TopBarSearch>
            <Input aria-label="Search" />
          </TopBarSearch>
          <TopBarActions>
            <IconButton label="Notifications">
              <svg aria-hidden="true" />
            </IconButton>
          </TopBarActions>
        </TopBar>
        <Sidebar aria-label="Primary" mode="rail">
          <SidebarHeader>Teal</SidebarHeader>
          <SidebarContent>
            <SidebarSection label="Main">
              <SidebarItem href="/" active icon={<svg aria-hidden="true" />}>
                Home
              </SidebarItem>
              <SidebarItem href="/settings" icon={<svg aria-hidden="true" />}>
                Settings
              </SidebarItem>
            </SidebarSection>
          </SidebarContent>
        </Sidebar>
        <Sidebar aria-label="Secondary" mode="full">
          <SidebarHeader>Teal</SidebarHeader>
          <SidebarContent>
            <SidebarSection label="Main">
              <SidebarItem href="/" active icon={<svg aria-hidden="true" />}>
                Home
              </SidebarItem>
              <SidebarItem href="/settings" icon={<svg aria-hidden="true" />}>
                Settings
              </SidebarItem>
            </SidebarSection>
          </SidebarContent>
        </Sidebar>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('app switcher has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <AppSwitcher
        trigger={<button type="button">Apps</button>}
        homeHref="https://home.example"
        homeLabel="Home"
        apps={[
          { id: 'yang', label: 'Yang Operations', href: 'https://yang.example', current: true },
          { id: 'photos', label: 'Photos', href: 'https://photos.example' },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Apps' }))
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('ecosystem rail has no violations with status and account controls', async () => {
    const { baseElement } = render(
      <EcosystemRail
        home={{ href: '/', label: 'Home', current: true }}
        destinations={[
          { id: 'yang', href: '/yang', label: 'Yang', status: 'degraded' },
          { id: 'photos', href: '/photos', label: 'Photos', status: 'healthy' },
        ]}
        footer={<button type="button">Avery account</button>}
      />,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('account menu has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <AccountMenu
        user={{ name: 'Avery Chen', email: 'avery@example.com' }}
        items={[{ id: 'sessions', label: 'Active sessions', onSelect: () => {} }]}
        appSignOut={{ label: 'Sign out of Photos', onSelect: () => {} }}
        ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => {} }}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Avery Chen' }))
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('launcher card has no violations in available and unavailable states', async () => {
    const { baseElement } = render(
      <>
        <LauncherCard href="https://photos.example" label="Photos" description="Household media" />
        <LauncherCard href="https://trict.example" label="Trict" disabled />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('permission matrix has no violations', async () => {
    const { baseElement } = render(
      <PermissionMatrix
        caption="Household application access"
        columns={[
          { id: 'photos', label: 'Photos' },
          { id: 'trict', label: 'Trict' },
        ]}
        rows={[
          { id: 'avery', label: 'Avery', cells: { photos: <Badge variant="success">Owner</Badge>, trict: 'Research' } },
          { id: 'blair', label: 'Blair', cells: { photos: 'Member' } },
        ]}
      />,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: overlays and feedback', () => {
  it('dialog has no violations', async () => {
    const { baseElement } = render(
      <Dialog open title="Archive project?" description="You can restore it later.">
        Project details
      </Dialog>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('menu has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <Menu
        label="Project actions"
        trigger={<button type="button">Open menu</button>}
        items={[
          { id: 'rename', label: 'Rename', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', separatorBefore: true, onSelect: () => {} },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('popover has no violations when open', async () => {
    const { baseElement } = render(
      <Popover label="Filter options" defaultOpen trigger={<button type="button">Filters</button>}>
        <p>Filter content</p>
      </Popover>,
    )
    await screen.findByRole('dialog', { name: 'Filter options' })
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('tooltip has no violations when visible', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <Tooltip content="Refresh results" delayDuration={0}>
        <button type="button">Refresh</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Refresh' }))
    await screen.findByRole('tooltip')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('toasts have no violations', async () => {
    const { baseElement } = render(<Toaster />)
    let id = ''
    act(() => {
      id = toast({ title: 'Changes saved', description: 'Draft updated', variant: 'success', duration: Infinity })
    })
    await screen.findByText('Changes saved')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
    act(() => dismissToast(id))
  })
})


describe('axe: hardening regressions', () => {
  it('default heading outline (page header, card title, empty state) has no violations', async () => {
    const { baseElement } = render(
      <>
        <PageHeader title="Settings" subtitle="Manage your account" />
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState title="No aliases" description="Aliases appear here." />
          </CardContent>
        </Card>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('field-wrapped checkbox and switch have no violations', async () => {
    const { baseElement } = render(
      <>
        <Field label="Include archived" description="Shows completed projects">
          <Checkbox defaultChecked />
        </Field>
        <Field label="Enable alerts">
          <Switch />
        </Field>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('modal menu has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <Menu
        modal
        label="Project actions"
        trigger={<button type="button">Open menu</button>}
        items={[{ id: 'rename', label: 'Rename', onSelect: () => {} }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('tooltips under a shared provider have no violations', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip content="Refresh results" delayDuration={0}>
          <button type="button">Refresh</button>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByRole('button', { name: 'Refresh' }))
    await screen.findByRole('tooltip')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})


describe('axe: catalog expansion', () => {
  it('alerts have no violations in every variant', async () => {
    const { baseElement } = render(
      <>
        <Alert variant="neutral" title="Neutral">Neutral body</Alert>
        <Alert variant="info" title="Info">Info body</Alert>
        <Alert variant="success" title="Success">Success body</Alert>
        <Alert variant="warning" title="Warning" onDismiss={() => {}}>Warning body</Alert>
        <Alert variant="danger" title="Danger">Danger body</Alert>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('notification items have no violations in read and unread states', async () => {
    const { baseElement } = render(
      <>
        <NotificationItem
          severity="warning"
          appLabel="Yang Operations"
          timestamp="2 hours ago"
          title="photos-api restarted unexpectedly"
          href="https://yang.example/incidents/photos-api"
          onMute={() => {}}
          onArchive={() => {}}
        />
        <NotificationItem
          severity="success"
          appLabel="Photos"
          timestamp="just now"
          title="Import finished"
          href="https://photos.example/imports/1"
          read
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('health indicators have no violations across statuses', async () => {
    const { baseElement } = render(
      <>
        <HealthIndicator status="healthy" label="Photos" />
        <HealthIndicator status="degraded" label="Yang Operations" />
        <HealthIndicator status="down" label="Trict" />
        <HealthIndicator status="stale" />
        <HealthIndicator status="unknown" />
        <HealthIndicator status="loading" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('step-up notice has no violations with and without dismissal', async () => {
    const { baseElement } = render(
      <>
        <StepUpNotice title="Confirm it's you" action={<button type="button">Verify with passkey</button>}>
          Approving a repair requires fresh verification.
        </StepUpNotice>
        <StepUpNotice title="Session expiring" onDismiss={() => {}}>
          Verify again to keep this session.
        </StepUpNotice>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('avatars have no violations', async () => {
    const { baseElement } = render(
      <>
        <Avatar name="Ada Lovelace" src="/ada.png" />
        <Avatar name="Grace Hopper" />
        <Avatar />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('breadcrumbs have no violations flat and collapsed', async () => {
    const { baseElement } = render(
      <>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Orion' },
          ]}
        />
        <Breadcrumb
          label="Project hierarchy"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Alpha', href: '/alpha' },
            { label: 'Beta', href: '/beta' },
            { label: 'Gamma', href: '/gamma' },
            { label: 'Delta', href: '/delta' },
            { label: 'Current' },
          ]}
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('accordions have no violations open and closed', async () => {
    const { baseElement } = render(
      <Accordion
        defaultValue="one"
        items={[
          { value: 'one', title: 'First', content: 'First panel' },
          { value: 'two', title: 'Second', content: 'Second panel' },
          { value: 'three', title: 'Locked', content: 'Hidden panel', disabled: true },
        ]}
      />,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: second catalog expansion', () => {
  it('new form controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <RadioGroup
          label="Home region"
          defaultValue="eu"
          options={[
            { value: 'eu', label: 'Europe (Frankfurt)' },
            { value: 'us', label: 'United States (Virginia)' },
          ]}
        />
        <Slider label="Notification volume" defaultValue={60} showValue />
        <Input clearable label="Search projects" defaultValue="orion" />
        <Combobox
          label="Assignee"
          options={[
            { value: 'avery', label: 'Avery Chen' },
            { value: 'morgan', label: 'Morgan Reyes' },
          ]}
        />
        <Chip label="Active only" selected onRemove={() => {}} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new actions and display modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <ButtonGroup>
          <Button variant="secondary">Day</Button>
          <Button variant="secondary">Week</Button>
        </ButtonGroup>
        <ToggleGroup
          type="single"
          variant="segmented"
          aria-label="Billing period"
          defaultValue="monthly"
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
        <p>
          Read the <Link href="/docs">documentation</Link> or visit the{' '}
          <Link href="https://status.example" external>
            status page
          </Link>
          . Save with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>.
        </p>
        <DescriptionList
          items={[
            { label: 'Owner', value: 'Avery Chen' },
            { label: 'Created', value: 'March 4, 2026' },
          ]}
        />
        <Steps current={1} steps={[{ label: 'Workspace' }, { label: 'Members' }, { label: 'Review' }]} />
        <Alert appearance="banner" variant="warning" title="Scheduled maintenance">
          The workspace is read-only on Saturday.
        </Alert>
        <Alert appearance="banner" variant="danger" title="Sign-in blocked" onDismiss={() => {}}>
          We stopped a sign-in attempt.
        </Alert>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new overlay modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Dialog placement="right" open onOpenChange={() => {}} title="Project settings">
          <p>Drawer body content.</p>
        </Dialog>
        <Popover openOn="hover" label="Profile preview" trigger={<button type="button">@avery</button>} openDelay={0} closeDelay={0}>
          <p>Avery Chen, workspace owner.</p>
        </Popover>
        <ScrollArea maxHeight="8rem">
          <p>Scrollable content region.</p>
        </ScrollArea>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: third catalog expansion', () => {
  it('new form controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <DatePicker label="Start date" defaultValue={new Date(2026, 6, 15)} />
        <NumberInput label="Seats" defaultValue={4} min={1} max={12} />
        <Input type="password" label="Password" defaultValue="hunter2" />
        <Combobox
          multiple
          label="Project roles"
          defaultValue={['editor']}
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
        <FileUpload label="Attachments" value={[{ name: 'report.pdf', size: 240_000 }]} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new actions and display modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Toolbar>
          <ToolbarGroup>
            <IconButton label="Undo"><span>U</span></IconButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <Toggle aria-label="Bold">B</Toggle>
        </Toolbar>
        <SplitButton
          label="Deploy"
          onClick={() => {}}
          items={[{ id: 'staging', label: 'Deploy to staging', onSelect: () => {} }]}
        />
        <AvatarGroup names={['Avery Chen', 'Morgan Reyes', 'Riley Okafor', 'Sam Whitfield', 'Jo Park']} />
        <Timeline
          items={[
            { id: '1', title: 'Deploy finished', timestamp: '2 min ago', tone: 'success' },
            { id: '2', title: 'Deploy started', timestamp: '9 min ago', tone: 'primary' },
          ]}
        />
        <Progress shape="circle" value={64} label="Import progress" />
        <Progress shape="circle" label="Loading" />
        <CodeBlock language="bash" code="npm install @kryv/teal" showLineNumbers />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new data and overlay modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Table
          caption="Projects"
          columns={[
            { key: 'name', header: 'Name', cell: (row: { id: string; name: string }) => row.name, sortable: true },
          ]}
          rows={[{ id: 'orion', name: 'Orion' }]}
          getRowKey={(row: { id: string }) => row.id}
          sort={{ key: 'name', direction: 'asc' }}
          selectable
          selectedKeys={['orion']}
        />
        <TreeView
          aria-label="Project files"
          defaultExpandedIds={['src']}
          items={[{ id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] }]}
        />
        <Command
          open
          onOpenChange={() => {}}
          groups={[
            { label: 'Projects', items: [{ id: 'orion', label: 'Open Orion', onSelect: () => {} }] },
          ]}
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

describe('axe: fourth catalog expansion', () => {
  it('new feedback modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Meter label="Storage used" value={72} low={60} high={85} optimum={20} />
        <Meter label="Bandwidth" value={0.4} max={1} formatValue={(v) => `${Math.round(v * 100)}%`} />
        <Rating label="Rate this report" defaultValue={3} />
        <Rating readOnly value={4} aria-label="Rated 4 out of 5" />
        <Announcer message="Changes saved" />
        <Announcer message="Saving failed" politeness="assertive" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new form controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <PinInput label="Verification code" length={6} defaultValue="123" />
        <PinInput label="Security PIN" length={4} masked />
        <TagsInput label="Add label" value={['design', 'security']} onChange={() => {}} placeholder="Add a label…" />
        <InputGroup>
          <InputAddon position="leading">https://</InputAddon>
          <Input aria-label="Domain" placeholder="workspace.example" />
        </InputGroup>
        <Editable label="Project name" defaultValue="Orion" />
        <TimePicker label="Start time" defaultValue="09:30" />
        <TimePicker label="Reminder time" hourCycle={12} defaultValue="18:45" />
        <DatePicker label="Report period" selection="range" />
        <ColorPicker label="Brand color" defaultValue="#006a6c" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('alert dialog, popconfirm, and tour have no violations when open', async () => {
    const { baseElement } = render(
      <>
        <AlertDialog
          defaultOpen
          trigger={<button type="button">Delete project</button>}
          title="Delete project?"
          description="This removes Orion permanently."
          tone="danger"
          confirmText="Delete"
        />
        <Popconfirm
          defaultOpen
          trigger={<button type="button">Remove member</button>}
          title="Remove Avery?"
          message="They lose access immediately."
        />
        <Tour
          open
          onOpenChange={() => {}}
          steps={[{ target: '#not-in-dom', title: 'Welcome', content: 'This walkthrough introduces the workspace.' }]}
        />
      </>,
    )
    await screen.findByRole('alertdialog')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('nav rail has no violations', async () => {
    const { baseElement } = render(
      <NavRail aria-label="Primary">
        <NavRailItem icon={<svg aria-hidden="true" />} label="Home" href="/" active />
        <NavRailItem icon={<svg aria-hidden="true" />} label="Notifications" href="/notifications" badge />
        <NavRailItem icon={<svg aria-hidden="true" />} label="Settings" onClick={() => {}} />
      </NavRail>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('context menu has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <Menu
        mode="context"
        label="Project actions"
        items={[
          { id: 'rename', label: 'Rename', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', separatorBefore: true, onSelect: () => {} },
        ]}
      >
        <div>Right-click area</div>
      </Menu>,
    )
    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Right-click area') })
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('menubar and navigation menu have no violations', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <>
        <Menubar
          label="Application"
          menus={[
            { label: 'File', items: [{ id: 'new', label: 'New project', onSelect: () => {} }] },
            { label: 'Edit', items: [{ id: 'undo', label: 'Undo', onSelect: () => {} }] },
          ]}
        />
        <NavigationMenu
          label="Primary"
          items={[
            { type: 'link', label: 'Overview', href: '/', active: true },
            { type: 'panel', label: 'Products', content: <p>Product panel content</p> },
          ]}
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()

    await user.click(screen.getByRole('menuitem', { name: 'File' }))
    await screen.findByRole('menu')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new data modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Stat label="Monthly recurring revenue" value="$48.2k" delta={{ direction: 'up', value: '+12.4%' }} description="vs. previous month" />
        <Stat label="Open reports" value="14" delta={{ direction: 'flat', value: '0' }} />
        <List>
          <ListItem title="Reports" secondary="12 files" trailing="2 GB" />
          <ListItem title="Archive" onClick={() => {}} />
        </List>
        <List dense>
          <ListItem title="Compact row" onClick={() => {}} />
        </List>
        <Sparkline aria-label="Sign-ups trending up" data={[4, 8, 6, 12, 9, 14]} variant="area" />
        <Sparkline aria-label="Deploys per day" data={[2, 5, 3, 8]} variant="bar" />
        <Calendar value={new Date(2026, 6, 15)} onSelect={() => {}} visibleMonth={new Date(2026, 6, 1)} />
        <EmptyState status="success" title="Report published" description="Visible to all members." />
        <EmptyState status="404" title="Page not found" action={<Button>Back to projects</Button>} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('layout primitives have no violations', async () => {
    const { baseElement } = render(
      <>
        <Stack direction="row" gap={4} align="center">
          <span>First</span>
          <span>Second</span>
        </Stack>
        <Grid columns={3} gap={3}>
          <span>One</span>
          <span>Two</span>
          <span>Three</span>
        </Grid>
        <div style={{ height: 160, width: 480 }}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={15}>
              <p>Sidebar</p>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={30}>
              <p>Content</p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <AspectRatio ratio={16 / 9}>
          <p>Media area</p>
        </AspectRatio>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('utility modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <button type="button">
          <svg aria-hidden="true" />
          <VisuallyHidden>Delete report</VisuallyHidden>
        </button>
        <CopyButton value="npm install @kryv/teal" />
        <CopyButton iconOnly value="npm install @kryv/teal" label="Copy install command" />
        <ThemeToggle />
        <Carousel label="Quarterly reports">
          <p>Q1 security</p>
          <p>Q2 reliability</p>
        </Carousel>
        <BackTop threshold={-1} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})

const commandSearchPages = ['Getting started', 'Components', 'Foundations']

function renderCommandSearchResults({ activeIndex, listId, optionId, query }: CommandRenderState) {
  const visible = commandSearchPages.filter((page) => page.toLowerCase().includes(query.toLowerCase()))
  return (
    <ul id={listId} role="listbox" aria-label="Results">
      {visible.map((page, index) => (
        <li key={page} id={optionId(index)} role="option" aria-selected={index === activeIndex}>
          {page}
        </li>
      ))}
    </ul>
  )
}

describe('axe: fifth catalog expansion', () => {
  it('new action modules have no violations, including the open speed dial', async () => {
    const { baseElement } = render(
      <>
        <ActionBar label="Edit actions">
          <Button>Save</Button>
          <Button variant="secondary">Cancel</Button>
        </ActionBar>
        <BulkActionBar count={3} onClear={() => {}}>
          <Button variant="danger">Delete</Button>
        </BulkActionBar>
        <FloatingActionButton label="Create item" />
        <ShareButton url="https://example.com/post/1" />
        <FloatingActionButton
          label="Quick actions"
          defaultOpen
          actions={[{ label: 'New file' }, { label: 'New folder' }]}
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new form structure modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Form aria-label="Profile">
          <Field label="Display name" required>
            <Input defaultValue="Avery" />
          </Field>
          <Button type="submit">Save</Button>
        </Form>
        <Fieldset legend="Notifications" description="Choose how we reach you">
          <Checkbox label="Email digest" />
        </Fieldset>
        <FormErrorSummary
          errors={[
            { fieldId: 'email', label: 'Email', message: 'Enter a valid email address.' },
            { fieldId: 'password', label: 'Password', message: 'Use at least 12 characters.' },
          ]}
        />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new form controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" defaultValue={['bold']} aria-label="Formatting">
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        </ToggleGroup>
        <RadioGroup
          variant="card"
          label="Choose a plan"
          defaultValue="starter"
          options={[
            { value: 'starter', label: 'Starter', description: 'For side projects' },
            { value: 'pro', label: 'Pro', description: 'For growing teams' },
            { value: 'enterprise', label: 'Enterprise', description: 'For large orgs', disabled: true },
          ]}
        />
        <Checkbox variant="card" label="Email digest" description="A weekly summary" />
        <CurrencyInput label="Invoice total" defaultValue={10} />
        <MaskedInput label="Expiry date" mask="##/##" />
        <PhoneInput label="Phone" defaultValue="+14155552671" />
        <TextArea autosize label="Bio" description="Markdown is supported" />
        <PasswordStrengthMeter password="Abcdefgh1!23" />
        <Slider range label="Price range" defaultValue={[20, 80]} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new selection controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <TreeSelect
          display="columns"
          label="Team"
          placeholder="Pick a team"
          options={[
            {
              value: 'engineering',
              label: 'Engineering',
              children: [
                { value: 'frontend', label: 'Frontend' },
                { value: 'backend', label: 'Backend' },
              ],
            },
            { value: 'ops', label: 'Operations' },
          ]}
        />
        <TreeSelect
          label="Department"
          options={[
            {
              value: 'engineering',
              label: 'Engineering',
              children: [{ value: 'frontend', label: 'Frontend' }],
            },
            { value: 'design', label: 'Design' },
          ]}
        />
        <TransferList
          options={[
            { value: 'design', label: 'Design' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'ops', label: 'Operations' },
          ]}
          defaultValue={['design']}
        />
        <MentionInput
          label="Comment"
          options={[
            { value: 'ada', label: 'Ada Lovelace' },
            { value: 'grace', label: 'Grace Hopper' },
          ]}
        />
        <TimezoneSelect label="Time zone" defaultValue="Europe/Berlin" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new editor and date controls have no violations', async () => {
    const { baseElement } = render(
      <>
        <RichTextEditor label="Body" defaultValue={'## Draft\n\nhello world'} />
        <DatePicker label="Starts at" mode="datetime" defaultValue={new Date(2024, 0, 15, 9, 30)} />
        <DatePicker label="Billing month" mode="month" defaultValue={new Date(2024, 5, 1)} />
        <DatePicker label="Graduation year" mode="year" defaultValue={new Date(2024, 0, 1)} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new chart modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <ChartContainer
          label="Revenue trend"
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'revenue', label: 'Revenue' },
          ]}
          data={[
            { month: 'Jan', revenue: 10 },
            { month: 'Feb', revenue: 14 },
          ]}
        />
        <LineChart
          label="Quarterly finances"
          labels={['Jan', 'Feb', 'Mar']}
          series={[
            { name: 'Revenue', data: [10, 14, 12] },
            { name: 'Costs', data: [6, 8, 7] },
          ]}
        />
        <LineChart type="area" label="Growth" labels={['Jan', 'Feb', 'Mar']} series={[{ name: 'Signups', data: [10, 14, 12] }]} />
        <BarChart label="Quarterly costs" labels={['Q1', 'Q2']} series={[{ name: 'Costs', data: [6, 8] }]} />
        <PieChart
          label="Traffic by device"
          data={[
            { name: 'Desktop', value: 50 },
            { name: 'Mobile', value: 30 },
            { name: 'Tablet', value: 20 },
          ]}
        />
        <ScatterChart
          aria-label="Latency by payload size"
          series={[
            {
              name: 'Alpha',
              data: [
                { x: 1, y: 2 },
                { x: 2, y: 5 },
              ],
            },
          ]}
        />
        <Heatmap
          aria-label="Requests by day and time"
          rows={[
            { label: 'Mon', values: [1, 4, 7] },
            { label: 'Tue', values: [2, 5, 8] },
          ]}
          columnLabels={['Morning', 'Afternoon', 'Evening']}
        />
        <FunnelChart
          aria-label="Signup funnel"
          stages={[
            { name: 'Visited', value: 1000 },
            { name: 'Signed up', value: 400 },
            { name: 'Paid', value: 50 },
          ]}
        />
        <GaugeChart aria-label="CPU utilization" value={64} label="CPU" />
        <RadarChart aria-label="Team comparison" axes={['Speed', 'Quality', 'Cost']} series={[{ name: 'Team A', values: [4, 3, 5] }]} />
        <CalendarHeatmap aria-label="Commit activity in 2025" year={2025} data={[{ date: '2025-03-14', level: 3 }]} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new data display modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <KanbanBoard
          label="Sprint board"
          defaultColumns={[
            { id: 'todo', title: 'To do', cards: [{ id: 'a', title: 'Design tokens' }] },
            { id: 'done', title: 'Done', cards: [] },
          ]}
        />
        <GanttChart
          label="Release plan"
          today="2025-03-04"
          tasks={[
            { id: 'design', label: 'Design', start: '2025-03-03', end: '2025-03-05' },
            { id: 'build', label: 'Build', start: '2025-03-06', end: '2025-03-12' },
          ]}
        />
        <OrgChart
          root={{
            id: 'ceo',
            name: 'Ada',
            title: 'CEO',
            children: [
              { id: 'cto', name: 'Ben', title: 'CTO', children: [{ id: 'dev', name: 'Cleo', title: 'Engineer' }] },
              { id: 'cfo', name: 'Dana', title: 'CFO' },
            ],
          }}
        />
        <TreeGrid
          aria-label="Project files"
          defaultExpandedIds={['src']}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'size', label: 'Size' },
          ]}
          rows={[
            { id: 'src', name: 'src', size: '—', children: [{ id: 'app', name: 'app.ts', size: '2 KB' }] },
            { id: 'pkg', name: 'package.json', size: '3 KB' },
          ]}
        />
        <ActivityFeed
          label="Project activity"
          formatTime={() => 'just now'}
          items={[{ id: '1', actor: 'Ada Lovelace', action: 'merged the parser rewrite', timestamp: new Date(2026, 7, 6) }]}
        />
        <CommentThread
          formatTime={() => '2h ago'}
          comments={[
            {
              id: '1',
              author: 'Ada Lovelace',
              body: 'The parser rewrite looks good overall.',
              timestamp: '2026-08-01T10:00:00Z',
              replies: [
                { id: '1a', author: 'Alan Turing', body: 'Agreed, but the lexer needs tests.', timestamp: '2026-08-01T11:00:00Z' },
              ],
            },
            { id: '2', author: 'Edsger Dijkstra', body: 'Please keep the public API unchanged.' },
          ]}
        />
        <JsonViewer data={{ name: 'teal', version: 5, author: { name: 'Ada', active: true } }} />
        <DiffViewer label="Config changes" oldValue={'line one\nline two'} newValue={'line one\nline 2'} />
        <LogViewer
          label="Deploy logs"
          lines={[
            { id: '1', level: 'info', message: 'server started on port 3000', timestamp: '10:00:01' },
            { id: '2', level: 'error', message: 'failed to reach cache node', timestamp: '10:00:13' },
          ]}
        />
        <MarkdownView content={'# Release notes\n\nSome **bold** text and a [link](https://example.com/docs).'} />
        <QrCode value="https://example.com" label="QR code for example.com" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new navigation modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Sidebar>
          <SidebarHeader>
            <span>Acme</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarSection label="Workspace">
              <SidebarItem active href="#overview">
                Overview
              </SidebarItem>
              <SidebarItem href="#projects">Projects</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
        <Dock>
          <DockItem active icon={<svg aria-hidden="true" />} label="Mail" />
          <DockItem icon={<svg aria-hidden="true" />} label="Files" />
        </Dock>
        <NavigationMenu
          label="Sections"
          items={[
            {
              type: 'panel',
              label: 'Products',
              content: (
                <div>
                  <a href="#editor">Editor</a>
                  <a href="#preview">Preview</a>
                </div>
              ),
            },
          ]}
        />
        <SubNav aria-label="Settings">
          <SubNavItem active href="#general">
            General
          </SubNavItem>
          <SubNavItem href="#billing">Billing</SubNavItem>
        </SubNav>
        <div>
          <AnchorNav
            items={[
              { id: 'overview', label: 'Overview' },
              { id: 'usage', label: 'Usage' },
            ]}
          />
          <section id="overview">Overview section</section>
          <section id="usage">Usage section</section>
        </div>
        <BottomNav aria-label="App">
          <BottomNavItem active href="#home" icon={<svg aria-hidden="true" />} label="Home" />
          <BottomNavItem badge={3} href="#alerts" icon={<svg aria-hidden="true" />} label="Alerts" />
        </BottomNav>
        <div>
          <AnchorNav
            aria-label="Table of contents"
            items={[
              {
                id: 'install-guide',
                label: 'Installation',
                children: [{ id: 'npm-guide', label: 'With npm' }],
              },
              { id: 'usage-guide', label: 'Usage' },
            ]}
          />
          <section id="install-guide">Installation section</section>
          <section id="npm-guide">npm section</section>
          <section id="usage-guide">Usage section</section>
        </div>
        <FloatingToolbar>
          <button type="button">Bold</button>
          <button type="button">Italic</button>
        </FloatingToolbar>
        <div>
          <SkipLink />
          <a href="#other">Other link</a>
        </div>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new layout primitives have no violations', async () => {
    const { baseElement } = render(
      <>
        <Box p={4}>Content</Box>
        <Flex gap={2}>
          <span>First</span>
          <span>Second</span>
        </Flex>
        <Container>Body</Container>
        <Section>
          <p>Section content</p>
        </Section>
        <Center>Middle</Center>
        <Masonry>
          <p>Card one</p>
          <p>Card two</p>
        </Masonry>
        <Columns>
          <span>One</span>
          <span>Two</span>
        </Columns>
        <StickyHeader>Title</StickyHeader>
        <ScrollShadow>
          <p>Scrollable content</p>
        </ScrollShadow>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('app shell has no violations', async () => {
    const { baseElement } = render(
      <AppShell>
        <AppShellHeader>Header</AppShellHeader>
        <AppShellSidebar>Sidebar</AppShellSidebar>
        <AppShellMain>Main</AppShellMain>
        <AppShellFooter>Footer</AppShellFooter>
      </AppShell>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new surface modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Card title="Usage summary" actions={<button type="button">Invite</button>}>
          Body copy
        </Card>
        <ExpandableCard title="Release notes" defaultExpanded>
          Full changelog
        </ExpandableCard>
        <Card variant="glass">Frosted content</Card>
        <Alert appearance="callout" variant="warning" title="Heads up">
          New pricing starts next month.
        </Alert>
        <StatusDot variant="success" label="Active" />
        <StatusDot variant="info" aria-label="Syncing" />
        <StatusDot pulse />
        <StatusDot pulse label="3 editors online" variant="info" />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new feedback modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <p>All good</p>
        </ErrorBoundary>
        <NetworkStatus />
        <BlockingOverlay visible label="Saving changes">
          <p>Editable content</p>
        </BlockingOverlay>
        <SaveStatus status="saving" />
        <SaveStatus savedAt={new Date(2026, 0, 1, 10, 0, 0)} formatSavedAt={(date) => date.toISOString()} />
        <UploadProgress fileName="report.pdf" progress={40} size={1572864} onCancel={() => {}} />
        <LoadingBar />
        <LoadingBar value={60} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('offline banner has no violations when the browser is offline', async () => {
    const { baseElement } = render(<OfflineBanner onDismiss={() => {}} />)
    fireEvent(window, new Event('offline'))
    await screen.findByRole('status')
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
    fireEvent(window, new Event('online'))
  })

  it('sheet and panel overlays have no violations when open', async () => {
    const bottomSheet = render(
      <Dialog
        placement="bottom"
        open
        onOpenChange={() => {}}
        title="Share report"
        description="Choose who gets access"
        footer={<Button variant="secondary">Done</Button>}
      >
        <p>Sheet body</p>
      </Dialog>,
    )
    await screen.findByRole('dialog', { name: 'Share report' })
    expect(await axe(bottomSheet.baseElement, axeOptions)).toHaveNoViolations()
    bottomSheet.unmount()

    const actionSheet = render(
      <ActionSheet
        open
        onOpenChange={() => {}}
        title="Report options"
        actions={[{ label: 'Duplicate' }, { label: 'Archive' }, { label: 'Delete', destructive: true }]}
      />,
    )
    await screen.findByRole('dialog', { name: 'Report options' })
    expect(await axe(actionSheet.baseElement, axeOptions)).toHaveNoViolations()
    actionSheet.unmount()

    const floatingPanel = render(
      <FloatingPanel open onOpenChange={() => {}} title="Clipboard history">
        <p>Panel body</p>
      </FloatingPanel>,
    )
    await screen.findByRole('dialog', { name: 'Clipboard history' })
    expect(await axe(floatingPanel.baseElement, axeOptions)).toHaveNoViolations()
    floatingPanel.unmount()

    const promptDialog = render(
      <PromptDialog
        open
        onOpenChange={() => {}}
        title="Rename report"
        description="The new name appears everywhere the report is shared."
        label="Report name"
        defaultValue="Q3 revenue"
        confirmLabel="Rename"
      />,
    )
    await screen.findByRole('dialog', { name: 'Rename report' })
    expect(await axe(promptDialog.baseElement, axeOptions)).toHaveNoViolations()
    promptDialog.unmount()

    const fullscreenDialog = render(
      <Dialog placement="fullscreen" open onOpenChange={() => {}} title="Edit report" footer={<Button variant="secondary">Done</Button>}>
        <p>Editor body</p>
      </Dialog>,
    )
    await screen.findByRole('dialog', { name: 'Edit report' })
    expect(await axe(fullscreenDialog.baseElement, axeOptions)).toHaveNoViolations()
    fullscreenDialog.unmount()
  })

  it('media and search overlays have no violations when open', async () => {
    const { baseElement } = render(
      <>
        <Lightbox
          open
          onOpenChange={() => {}}
          label="Vacation photos"
          images={[
            { src: '/a.jpg', alt: 'First photo' },
            { src: '/b.jpg', alt: 'Second photo', caption: 'Sunset over the bay' },
          ]}
        />
        <ImageViewer src="/photo.jpg" alt="Studio photo" label="Studio viewer" />
        <Command open onOpenChange={() => {}} resultCount={3} label="Site search">
          {renderCommandSearchResults}
        </Command>
        <CookieConsent message="We use cookies to improve your experience." manageHref="/settings/cookies" />
      </>,
    )
    await screen.findByRole('dialog', { name: 'Vacation photos' })
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('notification center has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <NotificationCenter
        trigger={<Button>Open notifications</Button>}
        items={[
          { id: '1', title: 'Deploy finished', appLabel: 'Orion', timestamp: '2 min ago', href: '/deploys/42', severity: 'success' },
          { id: '2', title: 'Quota almost reached', appLabel: 'Billing', timestamp: '1 hour ago', href: '/billing', severity: 'warning', read: true },
        ]}
        onMarkAllRead={() => {}}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open notifications' }))
    await screen.findByRole('list', { name: 'Notifications' })
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new utility modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Portal>
          <p>Portalled content</p>
        </Portal>
        <FocusTrap>
          <button type="button">First</button>
          <button type="button">Last</button>
        </FocusTrap>
        <Collapse open>
          <p>Collapsible body</p>
        </Collapse>
        <Presence present>
          <p>Appearing content</p>
        </Presence>
        <Reveal>
          <p>Lazy content</p>
        </Reveal>
        <TruncatedText text="A short summary" />
        <p>
          <HighlightText text="Report the report" query="report" />
        </p>
        <InfiniteScroll hasMore onLoadMore={() => {}}>
          <p>Row one</p>
        </InfiniteScroll>
        <VirtualList
          items={['Item 0', 'Item 1', 'Item 2']}
          itemHeight={20}
          height={100}
          label="Roster"
          renderItem={(item) => <span>{item}</span>}
        />
        <LazyImage src="/chart.png" alt="Quarterly chart" width={320} height={180} />
        <CountdownTimer targetDate={new Date(Date.now() + 3_600_000)} />
        <Marquee>
          <span>Status update</span>
        </Marquee>
        <TimeAgo date={new Date(Date.now() - 5 * 60 * 1000)} />
        <NumberTicker value={100} />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })
})
