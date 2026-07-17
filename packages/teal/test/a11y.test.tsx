import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, type JestAxeConfigureOptions } from 'jest-axe'
import {
  Badge,
  Button,
  Card,
  CardContent,
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
  TopBar,
  TopBarActions,
  TopBarBrand,
  TopBarSearch,
  VerticalNav,
  VerticalNavBrand,
  VerticalNavItem,
  VerticalNavList,
  VerticalNavSection,
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
