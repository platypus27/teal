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
        description: 'A compact semantic status indicator using canonical information variants.',
        usage: '<Badge variant="success">Deployed</Badge>',
        examples: [
          {
            title: 'Variants',
            description:
              'Five variants cover neutral, informational, success, warning, and danger statuses.',
          },
        ],
      },
      {
        id: 'accordion',
        name: 'Accordion',
        apiNames: ['Accordion'],
        description: 'A stacked disclosure list with single and multi-open modes driven by a compact item interface.',
        usage: `<Accordion
  defaultValue="sign-in"
  items={[
    { value: 'sign-in', title: 'Sign-in notifications', content: 'Get alerted when a new device signs in.' },
    { value: 'sessions', title: 'Active sessions', content: 'Review and revoke sessions.' },
  ]}
/>`,
        examples: [
          {
            title: 'Single-open',
            description: 'At most one item is open, and the open item can be collapsed again.',
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
        apiNames: ['Tooltip', 'TooltipProvider'],
        imports: ['Tooltip', 'TooltipProvider', 'IconButton'],
        description: 'A short contextual hint with accessible trigger association and collision handling.',
        usage: `// Mount once near the app root so tooltips share open-delay grouping
<TooltipProvider>
  <App />
</TooltipProvider>

// Per-instance delayDuration overrides the provider when needed
<Tooltip content="Refresh search results">
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
    { id: 'archive', label: 'Archive', variant: 'danger', onSelect: () => undefined },
  ]}
/>`,
        examples: [
          {
            title: 'Project actions',
            description: 'Items support icons, separators, and a danger variant for destructive actions.',
          },
        ],
      },
      {
        id: 'popover',
        name: 'Popover',
        apiNames: ['Popover'],
        imports: ['Popover', 'Button', 'Checkbox'],
        description: 'An anchored surface for arbitrary controls and supplemental content.',
        usage: `<Popover label="Filter projects" trigger={<Button variant="secondary">Filters</Button>}>
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
        description: 'Imperative, announced feedback with semantic variants, optional actions, and dismissal.',
        usage: `// Mount once near the app root
<Toaster />

// Call toast() from anywhere
toast({ title: 'Changes saved', variant: 'success' })`,
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
      {
        id: 'alert',
        name: 'Alert',
        apiNames: ['Alert'],
        description: 'An inline feedback banner with semantic variants, an optional title, and dismissal.',
        usage: `<Alert variant="warning" title="Payment method expiring">
  The workspace card ends in 04/25. Update billing details to avoid interruption.
</Alert>`,
        examples: [
          {
            title: 'Variants',
            description: 'Semantic variants pair a standard icon with a matching surface treatment.',
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
          'A compound vertical navigation with icon-rail and full-text modes.',
        usage: `<VerticalNav mode="rail">
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
        description: 'A sticky top bar with brand, search, and action slots.',
        usage: `<TopBar sticky>
  <TopBarBrand>...</TopBarBrand>
  <TopBarSearch>...</TopBarSearch>
  <TopBarActions>...</TopBarActions>
</TopBar>`,
        examples: [
          {
            title: 'Brand, search, and actions',
            description: 'Slots compose into full and compact headers; sticky keeps the bar visible while scrolling.',
          },
        ],
      },
      {
        id: 'breadcrumb',
        name: 'Breadcrumb',
        apiNames: ['Breadcrumb'],
        description: 'A hierarchical trail with router-ready items and automatic middle-item collapse.',
        usage: `<Breadcrumb
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Orion' },
  ]}
/>`,
        examples: [
          {
            title: 'Hierarchy',
            description: 'Items render in order; the last item is the current page.',
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
      {
        id: 'avatar',
        name: 'Avatar',
        apiNames: ['Avatar'],
        description: 'A compact identity image with initials and icon fallbacks.',
        usage: `<Avatar src="/users/avery.png" name="Avery Chen" />
<Avatar name="Morgan" size="sm" />`,
        examples: [
          {
            title: 'Sizes',
            description: 'Three sizes share the same image and initials fallback behavior.',
          },
        ],
      },
    ],
  },
]

export const modules = moduleGroups.flatMap((group) => group.modules)

/** @type {Record<string, Array<{ title: string, description: string, demo?: string }>>} */
const additionalExamples = {
  button: [{ title: 'Disabled actions', description: 'Use disabled state when the action cannot be completed yet, and explain why nearby.' }],
  field: [{ title: 'Account profile', description: 'Pair a required profile value with a clear validation message.' }],
  input: [{ title: 'Search and inline validation', description: 'Use a compact search control alongside an input that reports its invalid state.' }],
  select: [{ title: 'Role assignment', description: 'Use a labeled picker when a person must choose one role.' }, { title: 'Keyboard selection', description: 'Typeahead and arrow-key navigation keep long option lists efficient.' }],
  checkbox: [{ title: 'Bulk selection', description: 'Use indeterminate state when a table selection contains both checked and unchecked rows.', demo: 'checkbox-bulk' }, { title: 'Permission groups', description: 'Group independent permissions under one clear label and description.' }],
  switch: [{ title: 'Application settings', description: 'Use switches in a settings list for changes that apply immediately.' }, { title: 'Compact settings', description: 'The small size keeps dense preference lists scannable without losing the accessible label.' }],
  card: [{ title: 'Report summary', description: 'Use a card to group a short summary and one related action.' }],
  badge: [{ title: 'Table statuses', description: 'Keep status text explicit when badges appear in dense data rows.' }],
  accordion: [{ title: 'Multi-open and disabled', description: 'multiple allows any number of open items; disabled items cannot be toggled.' }],
  dialog: [{ title: 'Destructive confirmation', description: 'Use a danger action only when the consequence is clear and reversible where possible.' }, { title: 'Long-form task', description: 'For focused tasks, keep the title visible and let the dialog body own its scroll.' }],
  tooltip: [{ title: 'Pure hover and focus hint', description: 'Use Tooltip for short, non-interactive context around an unfamiliar icon.', demo: 'tooltip-pure' }, { title: 'Action context', description: 'Keep the hint short when it sits beside an unfamiliar product action.', demo: 'tooltip-actions' }],
  menu: [{ title: 'Separated destructive action', description: 'Keep destructive actions at the end of the menu behind a separator.' }, { title: 'Keyboard action menu', description: 'Menus preserve arrow-key navigation and Escape dismissal.' }],
  popover: [{ title: 'Inline filters', description: 'Keep a small set of filters anchored to the toolbar that owns them.' }, { title: 'Supplemental controls', description: 'Use a popover for controls that do not deserve a full route or dialog.' }],
  toast: [{ title: 'Failure feedback', description: 'Use a danger variant for a failed action and keep the recovery path in context.' }, { title: 'Undo feedback', description: 'Offer a short action when users may want to reverse a completed operation.' }],
  'empty-state': [{ title: 'Filtered empty result', description: 'Explain that filters produced no results and offer a way to adjust them.' }],
  loading: [{ title: 'Skeleton region', description: 'Reserve the eventual layout with Skeleton when content shape is known.' }],
  alert: [{ title: 'Dismissible', description: 'Pass onDismiss to render a close button for feedback the user can clear.' }],
  tabs: [{ title: 'Profile sections', description: 'Use tabs for peer views that share the same route context.' }, { title: 'Responsive tab list', description: 'Long tab labels remain reachable through horizontal scrolling.', demo: 'tabs-responsive' }],
  pagination: [{ title: 'Boundary pages', description: 'Disable previous and next controls at the collection boundaries.' }],
  'page-header': [{ title: 'Responsive actions', description: 'Let actions wrap beneath the title on narrow screens.' }],
  'vertical-nav': [{ title: 'Application shell', description: 'Compose a persistent rail with a full navigation drawer for responsive products.' }, { title: 'Router integration', description: 'Use VerticalNavItem with a router link and pass active state from the route.' }],
  'top-bar': [{ title: 'Application shell header', description: 'Combine brand, global search, and account actions in one persistent header.' }, { title: 'Compact shell', description: 'Use the same slots for a focused route header with fewer global actions.', demo: 'top-bar-shell' }],
  breadcrumb: [{ title: 'Collapsed middle items', description: 'Trails longer than collapseAfter move middle items into a labeled menu.' }],
  table: [{ title: 'Loading rows', description: 'Skeleton rows stand in for data while loading; the region is marked busy and announced through loadingLabel.' }],
  separator: [{ title: 'Vertical grouping', description: 'Use a vertical separator only when adjacent controls form one horizontal group.' }],
  avatar: [{ title: 'Fallbacks', description: 'Initials replace a missing or failed image; a generic icon covers unnamed users.' }],
}

for (const module of modules) {
  module.examples = [...module.examples, ...(additionalExamples[module.id] ?? [])]
}

/** Editorial guidance is kept beside the canonical module registry. */
/** @type {Record<string, { useWhen: string, avoidWhen: string, behavior: string, responsive: string }>} */
const guidanceById = {
  button: { useWhen: 'A user needs to take an explicit action.', avoidWhen: 'The control is only communicating status or navigation.', behavior: 'Loading disables the native button until the action completes.', responsive: 'Let actions wrap in narrow toolbars instead of shrinking their labels.' },
  field: { useWhen: 'A control needs a visible label, help text, or validation message.', avoidWhen: 'The control already owns an equivalent form-label composition.', behavior: 'Field provides the id and ARIA relationships consumed by its child control.', responsive: 'Keep labels readable and let long error messages wrap.' },
  input: { useWhen: 'Users enter or search for short text.', avoidWhen: 'A constrained set of choices or a long-form editor is clearer.', behavior: 'Native input behavior is preserved, including browser validation and refs.', responsive: 'Use full width on small screens and constrain width at larger sizes.' },
  select: { useWhen: 'Users choose one value from a known list.', avoidWhen: 'There are only two choices or users need to compare all options at once.', behavior: 'Radix manages keyboard navigation, typeahead, focus, and collision handling.', responsive: 'The trigger fills its parent width and the menu follows its measured width.' },
  checkbox: { useWhen: 'Users can select independent items or a tri-state group.', avoidWhen: 'Changing the value should take effect immediately as a setting.', behavior: 'Checked, unchecked, and indeterminate states remain native and form-friendly.', responsive: 'Allow supporting text to wrap beside the control.' },
  switch: { useWhen: 'A boolean setting takes effect immediately.', avoidWhen: 'The user must submit several values together as a form.', behavior: 'The label and description remain associated with the switch control.', responsive: 'Keep the control at a fixed size while the setting copy takes available width.' },
  card: { useWhen: 'Related content needs a structural surface.', avoidWhen: 'A card is being used only to decorate every section or hide a primary action.', behavior: 'Card is non-interactive by default and accepts an explicit polymorphic element.', responsive: 'Use compact padding and let card content define its width.' },
  badge: { useWhen: 'A short status or category needs quick visual scanning.', avoidWhen: 'The content needs an action or a sentence of explanation.', behavior: 'Variant changes meaning without changing the content semantics.', responsive: 'Keep labels short so badges do not dominate dense rows.' },
  accordion: { useWhen: 'Sections of related content should be progressively disclosed.', avoidWhen: 'All content must be visible at once or sections are compared side by side.', behavior: 'Single mode keeps at most one item open and is collapsible; multiple mode opens any number.', responsive: 'Keep titles short so triggers stay on one line.' },
  dialog: { useWhen: 'A decision or focused task must temporarily block the page.', avoidWhen: 'The content can be inline or handled by a popover.', behavior: 'Focus is trapped, Escape dismisses, and focus returns to the trigger.', responsive: 'Use the built-in size and allow the body to scroll inside the panel.' },
  tooltip: { useWhen: 'An unfamiliar icon or abbreviated label needs a brief hint.', avoidWhen: 'The user must read or interact with the content.', behavior: 'Hover and focus reveal a short non-interactive description.', responsive: 'Never rely on hover alone; provide a visible label on touch layouts.' },
  menu: { useWhen: 'Several related actions belong behind one trigger.', avoidWhen: 'The actions should remain visible for frequent workflows.', behavior: 'Keyboard navigation and dismissal are managed by Radix.', responsive: 'Keep destructive actions separated and easy to reach on touch.' },
  popover: { useWhen: 'Supplemental controls should stay anchored to a trigger.', avoidWhen: 'The content is a blocking task or a simple one-line hint.', behavior: 'Focus returns to the trigger after dismissal.', responsive: 'Keep panels within the viewport and avoid overly wide forms.' },
  toast: { useWhen: 'A completed or failed action needs brief asynchronous feedback.', avoidWhen: 'The message is required to continue or must be read in context.', behavior: 'Toaster announces messages and supports timed or manual dismissal.', responsive: 'Position toasts away from mobile browser controls and safe areas.' },
  'empty-state': { useWhen: 'A product surface has no results or has not been configured.', avoidWhen: 'Content is merely loading or filtered temporarily.', behavior: 'Explain what happened and give one clear next action when useful.', responsive: 'Keep the message readable and center the action beneath it.' },
  loading: { useWhen: 'Users need feedback while content or work is in progress.', avoidWhen: 'The operation is instant or no meaningful progress exists.', behavior: 'Use Spinner for local work, Skeleton for layout, and Progress for measurable work.', responsive: 'Prefer local indicators so small screens retain useful content.' },
  alert: { useWhen: 'Feedback must stay visible in context until it is read or dismissed.', avoidWhen: 'A brief confirmation is enough; use a toast for transient feedback.', behavior: 'Danger renders role="alert" for immediate announcement; other variants render role="status".', responsive: 'Let the body text wrap and keep the title to a short phrase.' },
  tabs: { useWhen: 'Related views share a context and users switch between them.', avoidWhen: 'Views need independent URLs or a long sequence of steps.', behavior: 'Arrow keys move between tabs and the active panel is announced.', responsive: 'Allow tab labels to scroll rather than wrap into ambiguous rows.' },
  pagination: { useWhen: 'A large collection is split into stable pages.', avoidWhen: 'Users need continuous search, sorting, or infinite history.', behavior: 'The page is controlled by the consumer and unavailable directions are disabled.', responsive: 'Keep controls large enough for touch and preserve the current page label.' },
  'page-header': { useWhen: 'A route needs a consistent title, context, and primary actions.', avoidWhen: 'The content is a small inline section without route-level actions.', behavior: 'Actions remain aligned with the title and wrap below it when needed.', responsive: 'Let actions wrap naturally below the heading at narrow widths.' },
  'vertical-nav': { useWhen: 'An application needs persistent section navigation.', avoidWhen: 'There are only a few inline links or a short wizard.', behavior: 'Rail mode expands on hover or focus and item active state sets aria-current.', responsive: 'Use full navigation in a drawer on mobile and close it after route changes.' },
  'top-bar': { useWhen: 'An application needs a consistent global header and action slots.', avoidWhen: 'A page has only local controls that belong in its header.', behavior: 'Sticky mode keeps the bar visible while its slots remain composable.', responsive: 'Collapse secondary actions and move search to a dedicated mobile trigger.' },
  breadcrumb: { useWhen: 'Users need to see and move within a deep page hierarchy.', avoidWhen: 'The structure is flat or the trail would duplicate primary navigation.', behavior: 'The last item is the current page; middle items collapse into a menu past collapseAfter.', responsive: 'Let items wrap and prefer collapsing over shrinking labels.' },
  table: { useWhen: 'Rows and columns are the clearest way to compare records.', avoidWhen: 'The content is a single object or needs a narrative layout.', behavior: 'Columns own rendering and rows require stable keys.', responsive: 'Keep the table readable with horizontal scrolling or a deliberate compact projection.' },
  separator: { useWhen: 'Related groups need a clear visual or semantic boundary.', avoidWhen: 'Spacing alone communicates hierarchy.', behavior: 'Use decorative mode when the divider carries no document meaning.', responsive: 'Prefer horizontal separators in stacked mobile layouts.' },
  avatar: { useWhen: 'A person or entity needs a compact visual identity.', avoidWhen: 'The image carries information beyond identity and needs a caption.', behavior: 'Falls back from image to initials to a generic icon; alt text defaults to the name.', responsive: 'Pick one size per context and keep it fixed across breakpoints.' },
}

export const moduleGuidance = Object.fromEntries(
  modules.map((module) => [module.id, guidanceById[module.id] ?? {
    useWhen: `When ${module.name} is the clearest fit for the interaction.`,
    avoidWhen: 'When a simpler native element communicates the intent better.',
    behavior: 'Preserve the component contract and native keyboard behavior.',
    responsive: 'Let the consumer control layout while retaining the component semantics.',
  }]),
)

for (const module of modules) module.guidance = moduleGuidance[module.id]
