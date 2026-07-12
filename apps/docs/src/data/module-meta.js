/**
 * Plain module metadata shared by the docs app and the build-time generators
 * (llms.txt). No components or ?raw imports here so Node scripts can import
 * this file directly. catalog.jsx attaches demos, sources, and playgrounds.
 */

export const moduleGroups = [
  {
    name: 'Actions',
    modules: [
      {
        id: 'button',
        name: 'Button',
        apiNames: ['Button', 'IconButton'],
        description: 'Actions with consistent hierarchy, sizing, loading, and accessible icon treatment.',
        usage: `<Button variant="primary">Save changes</Button>
<IconButton label="More options"><MoreHorizontal /></IconButton>`,
        examples: [
          {
            title: 'Variants and sizes',
            description:
              'Primary, secondary, ghost, and danger variants with a dedicated IconButton for icon-only actions.',
          },
        ],
      },
    ],
  },
  {
    name: 'Forms',
    modules: [
      {
        id: 'field',
        name: 'Field',
        apiNames: ['Field', 'Label'],
        imports: ['Field', 'Input'],
        description: 'A deep form seam that connects labels, descriptions, errors, and required state.',
        usage: `<Field label="Display name" description="Shown to other workspace members" required>
  <Input defaultValue="Avery Chen" />
</Field>`,
        examples: [
          {
            title: 'Label, description, and error',
            description:
              'Field wires the label, help text, and error message to the control inside it automatically.',
          },
        ],
      },
      {
        id: 'input',
        name: 'Input and TextArea',
        apiNames: ['Input', 'TextArea'],
        description: 'Native text controls with Teal sizing, invalid states, and forwarded refs.',
        usage: `<Input placeholder="Project name" />
<TextArea placeholder="Notes" rows={4} />`,
        examples: [
          {
            title: 'States',
            description: 'Default, invalid, and disabled inputs share the same sizing and focus treatment.',
          },
        ],
      },
      {
        id: 'select',
        name: 'Select',
        apiNames: ['Select'],
        description:
          'An accessible single-value picker with keyboard navigation, typeahead, and collision-aware positioning.',
        usage: `<Select
  aria-label="Role"
  defaultValue="viewer"
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>`,
        examples: [
          {
            title: 'Controlled selection',
            description: 'Select is controlled through value and onValueChange with an options array.',
          },
        ],
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        apiNames: ['Checkbox'],
        description: 'Boolean and indeterminate selection with an integrated label and description.',
        usage: '<Checkbox label="Include archived projects" defaultChecked />',
        examples: [
          {
            title: 'Checked, indeterminate, and disabled',
            description: 'Checkbox supports a tri-state checked prop for select-all patterns.',
          },
        ],
      },
      {
        id: 'switch',
        name: 'Switch',
        apiNames: ['Switch'],
        description:
          'An immediate boolean setting with explicit labeling and controlled or uncontrolled state.',
        usage:
          '<Switch label="Security notifications" description="High-risk account activity" defaultChecked />',
        examples: [
          {
            title: 'Settings',
            description:
              'Switches apply immediately, so label them as settings rather than form fields.',
          },
        ],
      },
    ],
  },
  {
    name: 'Surfaces',
    modules: [
      {
        id: 'card',
        name: 'Card',
        apiNames: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
        description: 'A structural surface for related content without ambiguous interactive behavior.',
        usage: `<Card>
  <CardHeader>
    <CardTitle>Security report</CardTitle>
    <CardDescription>Updated five minutes ago</CardDescription>
  </CardHeader>
  <CardContent>No critical findings were detected.</CardContent>
</Card>`,
        examples: [
          {
            title: 'Composition',
            description: 'Cards compose header, content, and footer regions with consistent rhythm.',
          },
        ],
      },
      {
        id: 'badge',
        name: 'Badge',
        apiNames: ['Badge'],
        description: 'A compact semantic status indicator using canonical information tones.',
        usage: '<Badge tone="success">Deployed</Badge>',
        examples: [
          {
            title: 'Tones',
            description:
              'Five tones cover neutral, informational, success, warning, and danger statuses.',
          },
        ],
      },
    ],
  },
  {
    name: 'Overlays',
    modules: [
      {
        id: 'dialog',
        name: 'Dialog',
        apiNames: ['Dialog'],
        description: 'A modal surface that owns focus management, naming, dismissal, and scroll locking.',
        usage: `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open dialog</Button>
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Archive project?"
  description="The project can be restored later."
>
  <p>Project Orion will leave the active workspace.</p>
</Dialog>`,
        examples: [
          {
            title: 'Confirmation',
            description:
              'Dialog traps focus, restores it on close, and dismisses with Escape or the scrim.',
          },
        ],
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        apiNames: ['Tooltip'],
        imports: ['Tooltip', 'IconButton'],
        description: 'A short contextual hint with accessible trigger association and collision handling.',
        usage: `<Tooltip content="Refresh search results">
  <IconButton label="Refresh results">
    <Search />
  </IconButton>
</Tooltip>`,
        examples: [
          {
            title: 'Icon button hint',
            description:
              'Tooltips label icon-only controls on hover and keyboard focus. Click the icon to expand the search field.',
          },
        ],
      },
      {
        id: 'menu',
        name: 'Menu',
        apiNames: ['Menu'],
        imports: ['Menu', 'IconButton'],
        description:
          'A structured action menu with keyboard navigation, disabled items, icons, and danger styling.',
        usage: `<Menu
  trigger={<IconButton label="Project actions"><MoreVertical /></IconButton>}
  items={[
    { id: 'settings', label: 'Settings', onSelect: () => undefined },
    { id: 'archive', label: 'Archive', tone: 'danger', onSelect: () => undefined },
  ]}
/>`,
        examples: [
          {
            title: 'Project actions',
            description: 'Items support icons, separators, and a danger tone for destructive actions.',
          },
        ],
      },
      {
        id: 'popover',
        name: 'Popover',
        apiNames: ['Popover'],
        imports: ['Popover', 'Button', 'Checkbox'],
        description: 'An anchored surface for arbitrary controls and supplemental content.',
        usage: `<Popover trigger={<Button variant="secondary">Filters</Button>}>
  <div className="grid gap-3">
    <Checkbox label="Active only" defaultChecked />
    <Button size="sm">Apply filters</Button>
  </div>
</Popover>`,
        examples: [
          {
            title: 'Filter panel',
            description: 'Popover anchors interactive content to a trigger with collision-aware placement.',
          },
        ],
      },
    ],
  },
  {
    name: 'Feedback',
    modules: [
      {
        id: 'toast',
        name: 'Toast',
        apiNames: ['Toaster'],
        imports: ['Toaster', 'toast'],
        description: 'Imperative, announced feedback with semantic tones, optional actions, and dismissal.',
        usage: `// Mount once near the app root
<Toaster />

// Call toast() from anywhere
toast({ title: 'Changes saved', tone: 'success' })`,
        examples: [
          {
            title: 'Saving feedback',
            description: 'Call toast() from anywhere once a Toaster is mounted near the app root.',
          },
        ],
      },
      {
        id: 'empty-state',
        name: 'Empty State',
        apiNames: ['EmptyState'],
        imports: ['EmptyState', 'Button'],
        description: 'An explanatory empty result with an optional action and SVG icon.',
        usage: `<EmptyState
  title="No reports"
  description="Create a report to begin tracking results."
  action={<Button>Create report</Button>}
/>`,
        examples: [
          {
            title: 'First-run',
            description: 'Pair a short explanation with a single primary action.',
          },
        ],
      },
      {
        id: 'loading',
        name: 'Loading',
        apiNames: ['LoadingState', 'Spinner', 'Skeleton', 'Progress'],
        imports: ['Spinner', 'Progress', 'Skeleton', 'LoadingState'],
        description: 'Named progress and loading treatments for local, skeleton, and full-surface states.',
        usage: `<Spinner label="Saving" />
<Progress label="Import progress" value={64} />
<Skeleton className="h-4 w-40" />
<LoadingState label="Loading reports" />`,
        examples: [
          {
            title: 'Loading treatments',
            description:
              'Spinner and Progress for active work, Skeleton for layout placeholders, LoadingState for regions.',
          },
        ],
      },
    ],
  },
  {
    name: 'Navigation',
    modules: [
      {
        id: 'tabs',
        name: 'Tabs',
        apiNames: ['Tabs'],
        description: 'Keyboard-navigable content switching through a compact item interface.',
        usage: `<Tabs
  aria-label="Account sections"
  defaultValue="profile"
  items={[
    { value: 'profile', label: 'Profile', content: <ProfilePanel /> },
    { value: 'billing', label: 'Billing', content: <BillingPanel /> },
  ]}
/>`,
        examples: [
          {
            title: 'Sections',
            description: 'Tabs follow the ARIA authoring practices keyboard pattern out of the box.',
          },
        ],
      },
      {
        id: 'pagination',
        name: 'Pagination',
        apiNames: ['Pagination'],
        description: 'A controlled page navigator with compact ranges and unavailable directions.',
        usage:
          'const [page, setPage] = useState(1)\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />',
        examples: [
          {
            title: 'Controlled pages',
            description: 'Pagination is fully controlled through page and onPageChange.',
          },
        ],
      },
      {
        id: 'page-header',
        name: 'Page Header',
        apiNames: ['PageHeader'],
        imports: ['PageHeader', 'Button'],
        description: 'A responsive page title, supporting text, and action area.',
        usage: `<PageHeader
  title="Workspace settings"
  subtitle="Manage security and notifications"
  actions={<Button>Save changes</Button>}
/>`,
        examples: [
          {
            title: 'Settings header',
            description: 'Actions wrap below the title on narrow screens automatically.',
          },
        ],
      },
      {
        id: 'vertical-nav',
        name: 'Vertical Nav',
        apiNames: ['VerticalNav', 'VerticalNavBrand', 'VerticalNavList', 'VerticalNavSection', 'VerticalNavItem', 'VerticalNavFooter'],
        imports: ['VerticalNav', 'VerticalNavBrand', 'VerticalNavList', 'VerticalNavSection', 'VerticalNavItem', 'VerticalNavFooter'],
        description:
          'A compound vertical navigation with icon-rail and full-text modes and a solid variant.',
        usage: `<VerticalNav mode="rail" variant="solid">
  <VerticalNavBrand>...</VerticalNavBrand>
  <VerticalNavList>
    <VerticalNavSection label="Workspace">
      <VerticalNavItem active icon={<LayoutDashboard />}>Overview</VerticalNavItem>
    </VerticalNavSection>
  </VerticalNavList>
  <VerticalNavFooter>...</VerticalNavFooter>
</VerticalNav>`,
        examples: [
          {
            title: 'Rail and full modes',
            description:
              'Rail mode collapses to an icon strip and expands on hover or keyboard focus. Full mode shows labels always.',
          },
        ],
      },
      {
        id: 'top-bar',
        name: 'Top Bar',
        apiNames: ['TopBar', 'TopBarBrand', 'TopBarSearch', 'TopBarActions'],
        imports: ['TopBar', 'TopBarBrand', 'TopBarSearch', 'TopBarActions'],
        description: 'A sticky top bar with a solid variant and brand, search, and action slots.',
        usage: `<TopBar variant="solid" sticky>
  <TopBarBrand>...</TopBarBrand>
  <TopBarSearch>...</TopBarSearch>
  <TopBarActions>...</TopBarActions>
</TopBar>`,
        examples: [
          {
            title: 'Solid variant',
            description: 'Solid renders an opaque bar with a border.',
          },
        ],
      },
    ],
  },
  {
    name: 'Data',
    modules: [
      {
        id: 'table',
        name: 'Table',
        apiNames: ['Table'],
        description:
          'Accessible data presentation driven by column definitions, density, loading, and empty state.',
        usage: `<Table
  caption="Team members"
  columns={[{ key: 'name', header: 'Name', cell: (row) => row.name }]}
  rows={rows}
  getRowKey={(row) => row.id}
/>`,
        examples: [
          {
            title: 'Column definitions',
            description: 'Columns declare their header and cell renderer; rows need a stable key.',
          },
        ],
      },
      {
        id: 'separator',
        name: 'Separator',
        apiNames: ['Separator'],
        description: 'A semantic or decorative divider for related content.',
        usage: '<Separator />',
        examples: [
          {
            title: 'Content divider',
            description: 'Separator renders a horizontal rule that can be decorative or semantic.',
          },
        ],
      },
    ],
  },
]

export const modules = moduleGroups.flatMap((group) => group.modules)
