import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, type JestAxeConfigureOptions } from 'jest-axe'
import {
  Accordion,
  AccountMenu,
  Alert,
  AlertDialog,
  Announcer,
  AppSwitcher,
  AspectRatio,
  Avatar,
  AvatarGroup,
  BackTop,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  Checkbox,
  Chip,
  CodeBlock,
  ColorPicker,
  Combobox,
  Command,
  ContextMenu,
  CopyButton,
  DataTable,
  DatePicker,
  DateRangePicker,
  DescriptionList,
  Dialog,
  Drawer,
  Editable,
  EmptyState,
  EcosystemRail,
  Field,
  FileUpload,
  Grid,
  HealthIndicator,
  HoverCard,
  IconButton,
  Input,
  InputAddon,
  InputGroup,
  Kbd,
  LauncherCard,
  Link,
  List,
  ListItem,
  LoadingState,
  Menubar,
  Menu,
  Meter,
  MultiSelect,
  NavigationMenu,
  NotificationItem,
  NumberInput,
  PageHeader,
  Pagination,
  PasswordInput,
  PermissionMatrix,
  PinInput,
  Popconfirm,
  Popover,
  Progress,
  ProgressCircle,
  RadioGroup,
  Rating,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Result,
  ScrollArea,
  SearchInput,
  SegmentedControl,
  Select,
  Separator,
  Skeleton,
  Slider,
  Sparkline,
  Spinner,
  SplitButton,
  Stack,
  Stat,
  StepUpNotice,
  Steps,
  Switch,
  Table,
  Tabs,
  TagsInput,
  TextArea,
  ThemeToggle,
  Timeline,
  TimePicker,
  Toaster,
  Toggle,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Tour,
  TreeView,
  Tooltip,
  TooltipProvider,
  TopBar,
  TopBarActions,
  TopBarBrand,
  TopBarSearch,
  VerticalNav,
  VerticalNavBrand,
  VerticalNavItem,
  VerticalNavList,
  VerticalNavSection,
  VisuallyHidden,
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

  it('vertical nav and top bar have no violations', async () => {
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
        <VerticalNav aria-label="Primary">
          <VerticalNavBrand>Teal</VerticalNavBrand>
          <VerticalNavList>
            <VerticalNavSection label="Main">
              <VerticalNavItem href="/" active icon={<svg aria-hidden="true" />}>
                Home
              </VerticalNavItem>
              <VerticalNavItem href="/settings" icon={<svg aria-hidden="true" />}>
                Settings
              </VerticalNavItem>
            </VerticalNavSection>
          </VerticalNavList>
        </VerticalNav>
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
        <Slider label="Notification volume" defaultValue={[60]} showValue />
        <SearchInput label="Search projects" defaultValue="orion" />
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
        <SegmentedControl
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
        <Banner variant="warning" title="Scheduled maintenance">
          The workspace is read-only on Saturday.
        </Banner>
        <Banner variant="danger" title="Sign-in blocked" onDismiss={() => {}}>
          We stopped a sign-in attempt.
        </Banner>
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new overlay modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <Drawer open onOpenChange={() => {}} title="Project settings">
          <p>Drawer body content.</p>
        </Drawer>
        <HoverCard trigger={<button type="button">@avery</button>} openDelay={0} closeDelay={0}>
          <p>Avery Chen, workspace owner.</p>
        </HoverCard>
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
        <PasswordInput label="Password" defaultValue="hunter2" />
        <MultiSelect
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
        <ProgressCircle value={64} label="Import progress" />
        <ProgressCircle label="Loading" />
        <CodeBlock language="bash" code="npm install @kryv/teal" showLineNumbers />
      </>,
    )
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations()
  })

  it('new data and overlay modules have no violations', async () => {
    const { baseElement } = render(
      <>
        <DataTable
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
        <DateRangePicker label="Report period" />
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

  it('context menu has no violations when open', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(
      <ContextMenu
        label="Project actions"
        items={[
          { id: 'rename', label: 'Rename', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', separatorBefore: true, onSelect: () => {} },
        ]}
      >
        <div>Right-click area</div>
      </ContextMenu>,
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
        <Result status="success" title="Report published" description="Visible to all members." />
        <Result status="404" title="Page not found" actions={<Button>Back to projects</Button>} />
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
