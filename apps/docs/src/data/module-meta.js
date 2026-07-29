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
      {
        id: 'button-group',
        name: 'Button Group',
        apiNames: ['ButtonGroup'],
        imports: ['ButtonGroup', 'Button'],
        description: 'An attached cluster of related actions with hairline seams and shared corner radius.',
        usage: `<ButtonGroup>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`,
        examples: [
          {
            title: 'Attached actions',
            description: 'Buttons butt together with shared seams; vertical stacks work too.',
          },
        ],
      },
      {
        id: 'segmented-control',
        name: 'Segmented Control',
        apiNames: ['SegmentedControl'],
        description: 'A mutually exclusive option switcher with a sliding selection pill.',
        usage: `<SegmentedControl
  aria-label="Billing period"
  defaultValue="monthly"
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ]}
/>`,
        examples: [
          {
            title: 'View switcher',
            description: 'A measured pill slides behind the active option, honoring reduced motion.',
          },
        ],
      },
      {
        id: 'link',
        name: 'Link',
        apiNames: ['Link'],
        description: 'Themed inline and standalone links with an external indicator.',
        usage: `<Link href="/projects">View projects</Link>
<Link href="https://status.example" external>Status page</Link>`,
        examples: [
          {
            title: 'Inline and external',
            description: 'Inline links underline within prose; external links open a new tab with an icon.',
          },
        ],
      },
      {
        id: 'toggle',
        name: 'Toggle',
        apiNames: ['Toggle'],
        description: 'A pressed-state button for binary preferences in toolbars and filter rows.',
        usage: `<Toggle aria-label="Bold"><Bold /></Toggle>`,
        examples: [
          {
            title: 'Pressed state',
            description: 'aria-pressed and data-state reflect the current value; tint follows.',
          },
        ],
      },
      {
        id: 'toolbar',
        name: 'Toolbar',
        apiNames: ['Toolbar', 'ToolbarGroup', 'ToolbarSeparator'],
        imports: ['Toolbar', 'ToolbarGroup', 'ToolbarSeparator', 'IconButton'],
        description: 'A horizontal action bar with grouped controls and hairline separators.',
        usage: `<Toolbar>
  <ToolbarGroup>
    <IconButton label="Undo"><Undo2 /></IconButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup>
    <IconButton label="Bold"><Bold /></IconButton>
  </ToolbarGroup>
</Toolbar>`,
        examples: [
          {
            title: 'Editor actions',
            description: 'role="toolbar" with groups keeps related controls navigable.',
          },
        ],
      },
      {
        id: 'split-button',
        name: 'Split Button',
        apiNames: ['SplitButton'],
        description: 'A primary action joined to a menu of related alternatives.',
        usage: `<SplitButton
  label="Deploy"
  onClick={() => undefined}
  items={[{ id: 'staging', label: 'Deploy to staging', onSelect: () => undefined }]}
/>`,
        examples: [
          {
            title: 'Default plus alternatives',
            description: 'The main action fires directly; the chevron opens the related menu.',
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
      {
        id: 'radio-group',
        name: 'Radio Group',
        apiNames: ['RadioGroup'],
        description: 'A single-choice option set with an integrated label, description, and subtle borders.',
        usage: `<RadioGroup
  label="Home region"
  defaultValue="eu"
  options={[
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
  ]}
/>`,
        examples: [
          {
            title: 'Single choice',
            description: 'Keyboard arrows move and select within the group following the roving-focus pattern.',
          },
        ],
      },
      {
        id: 'slider',
        name: 'Slider',
        apiNames: ['Slider'],
        description: 'A numeric value scrubber with an optional live value readout.',
        usage: '<Slider label="Notification volume" defaultValue={[60]} showValue />',
        examples: [
          {
            title: 'Value selection',
            description: 'Pointer and keyboard both adjust the value; showValue mirrors it as text.',
          },
        ],
      },
      {
        id: 'search-input',
        name: 'Search Input',
        apiNames: ['SearchInput'],
        description: 'A text field with a leading search affordance, clear action, and loading state.',
        usage: '<SearchInput label="Search projects" placeholder="Name or owner…" />',
        examples: [
          {
            title: 'Clearable search',
            description: 'The clear button appears once the field has a value; loading swaps in a spinner.',
          },
        ],
      },
      {
        id: 'combobox',
        name: 'Combobox',
        apiNames: ['Combobox'],
        description: 'A filterable single-value picker combining free text with a suggestion list.',
        usage: `<Combobox
  label="Assignee"
  options={[
    { value: 'avery', label: 'Avery Chen' },
    { value: 'morgan', label: 'Morgan Reyes' },
  ]}
/>`,
        examples: [
          {
            title: 'Filter and select',
            description: 'Type to filter, arrows to highlight, Enter to select; Escape keeps the current value.',
          },
        ],
      },
      {
        id: 'multi-select',
        name: 'Multi Select',
        apiNames: ['MultiSelect'],
        description: 'A filterable picker for several values, shown as removable pills.',
        usage: `<MultiSelect
  label="Project roles"
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>`,
        examples: [
          {
            title: 'Multiple values',
            description: 'Options toggle without closing; pills remove individual values.',
          },
        ],
      },
      {
        id: 'date-picker',
        name: 'Date Picker',
        apiNames: ['DatePicker'],
        description: 'A single-date field with a keyboard-navigable calendar popover.',
        usage: '<DatePicker label="Start date" onValueChange={(date) => undefined} />',
        examples: [
          {
            title: 'Calendar selection',
            description: 'Arrows move between days, Enter selects, min and max bound the range.',
          },
        ],
      },
      {
        id: 'number-input',
        name: 'Number Input',
        apiNames: ['NumberInput'],
        description: 'A numeric field with stepper buttons and min/max clamping.',
        usage: '<NumberInput label="Seats" defaultValue={4} min={1} max={12} />',
        examples: [
          {
            title: 'Steppers and bounds',
            description: 'Steppers disable at the bounds; typing re-clamps on blur.',
          },
        ],
      },
      {
        id: 'password-input',
        name: 'Password Input',
        apiNames: ['PasswordInput'],
        description: 'A secret field with an accessible visibility toggle.',
        usage: '<PasswordInput label="Password" />',
        examples: [
          {
            title: 'Visibility toggle',
            description: 'The eye button exposes its state through aria-pressed.',
          },
        ],
      },
      {
        id: 'file-upload',
        name: 'File Upload',
        apiNames: ['FileUpload'],
        description: 'A drag-and-drop zone with a browse action and a removable file list.',
        usage: '<FileUpload label="Attachments" multiple onFilesAdded={(files) => undefined} />',
        examples: [
          {
            title: 'Drop or browse',
            description: 'Drag-over highlights the zone; files list with sizes and remove actions.',
          },
        ],
      },
      {
        id: 'pin-input',
        name: 'PIN Input',
        apiNames: ['PinInput'],
        description: 'A segmented one-time code field with per-cell navigation, paste support, and masking.',
        usage: `<PinInput label="Verification code" length={6} onComplete={(code) => undefined} />`,
        examples: [
          {
            title: 'One-time code',
            description: 'Typing advances to the next cell, Backspace retreats, and paste fills from the focused cell.',
          },
        ],
      },
      {
        id: 'tags-input',
        name: 'Tags Input',
        apiNames: ['TagsInput'],
        description: 'A token entry field that turns typed text into removable chips.',
        usage: `const [tags, setTags] = useState(['design'])

<TagsInput label="Add label" value={tags} onChange={setTags} placeholder="Add a label…" />`,
        examples: [
          {
            title: 'Token entry',
            description: 'Enter or comma commits a tag; Backspace on an empty draft removes the last one.',
          },
        ],
      },
      {
        id: 'input-group',
        name: 'Input Group',
        apiNames: ['InputGroup', 'InputAddon'],
        imports: ['InputGroup', 'InputAddon', 'Input'],
        description: 'An input joined with leading or trailing addons such as protocols and units.',
        usage: `<InputGroup>
  <InputAddon position="leading">https://</InputAddon>
  <Input aria-label="Domain" placeholder="workspace.example" />
</InputGroup>`,
        examples: [
          {
            title: 'Addons',
            description: 'The group squares the joined input corners automatically on the attached side.',
          },
        ],
      },
      {
        id: 'editable',
        name: 'Editable',
        apiNames: ['Editable'],
        description: 'Click-to-edit text that commits on Enter or blur and cancels with Escape.',
        usage: `<Editable label="Project name" defaultValue="Orion" onSubmit={(value) => undefined} />`,
        examples: [
          {
            title: 'Inline rename',
            description: 'Preview stays a button; editing autofocuses and selects the draft.',
          },
        ],
      },
      {
        id: 'time-picker',
        name: 'Time Picker',
        apiNames: ['TimePicker'],
        description: 'A segmented hour and minute field with 12- and 24-hour cycles.',
        usage: `<TimePicker label="Start time" defaultValue="09:30" onChange={(value) => undefined} />`,
        examples: [
          {
            title: 'Segmented time',
            description: 'Fields clamp as you type; the 12-hour cycle adds an AM/PM toggle.',
          },
        ],
      },
      {
        id: 'date-range-picker',
        name: 'Date Range Picker',
        apiNames: ['DateRangePicker'],
        description: 'A two-click range field with presets and a keyboard-navigable calendar popover.',
        usage: `<DateRangePicker label="Report period" onChange={(range) => undefined} />`,
        examples: [
          {
            title: 'Range selection',
            description: 'The first click starts the range and the second completes it; presets fill common windows.',
          },
        ],
      },
      {
        id: 'color-picker',
        name: 'Color Picker',
        apiNames: ['ColorPicker'],
        description: 'A swatch trigger with preset colors and a validated hex field.',
        usage: `<ColorPicker label="Brand color" defaultValue="#006a6c" onChange={(value) => undefined} />`,
        examples: [
          {
            title: 'Presets and hex',
            description: 'Presets commit immediately; the hex field normalizes #rgb and #rrggbb on Enter or blur.',
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
        id: 'launcher-card',
        name: 'Launcher Card',
        apiNames: ['LauncherCard'],
        imports: ['LauncherCard', 'Badge'],
        description:
          'An interactive application destination card with an icon, description, optional status, and an honest unavailable state.',
        usage: `<LauncherCard
  href="https://photos.example"
  label="Photos"
  description="Household media, albums, and sharing"
  icon={<Camera />}
  status={<Badge variant="success">Healthy</Badge>}
/>`,
        examples: [
          {
            title: 'Available application',
            description: 'The whole card navigates; status content stays caller-supplied and sanitized.',
          },
          {
            title: 'Unavailable application',
            description: 'A disabled card is removed from focus order and blocks navigation.',
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
      {
        id: 'chip',
        name: 'Chip',
        apiNames: ['Chip'],
        description: 'A compact filter or selection token with an optional remove affordance.',
        usage: `<Chip label="Active only" selected onRemove={() => undefined} />`,
        examples: [
          {
            title: 'Removable filters',
            description: 'Selected chips tint primary; the remove button is labeled from the chip text.',
          },
        ],
      },
      {
        id: 'kbd',
        name: 'Kbd',
        apiNames: ['Kbd'],
        description: 'An inline keyboard shortcut hint with a raised keycap treatment.',
        usage: 'Save with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>',
        examples: [
          {
            title: 'Shortcut hints',
            description: 'Kbd scales with surrounding text through em-based sizing.',
          },
        ],
      },
      {
        id: 'scroll-area',
        name: 'Scroll Area',
        apiNames: ['ScrollArea'],
        description: 'A scrollable region with styled, theme-consistent scrollbars.',
        usage: `<ScrollArea maxHeight="16rem">
  <LongList />
</ScrollArea>`,
        examples: [
          {
            title: 'Bounded lists',
            description: 'Cap the height and the custom scrollbar appears only while scrolling is possible.',
          },
        ],
      },
      {
        id: 'code-block',
        name: 'Code Block',
        apiNames: ['CodeBlock'],
        description: 'A code panel with a language label, optional line numbers, and copy-to-clipboard.',
        usage: '<CodeBlock language="bash" code="npm install @kryv/teal" />',
        examples: [
          {
            title: 'Copy affordance',
            description: 'The copy button confirms with a check icon for two seconds.',
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
      {
        id: 'drawer',
        name: 'Drawer',
        apiNames: ['Drawer'],
        imports: ['Drawer', 'Button'],
        description: 'A slide-over panel for focused side tasks, built on the dialog focus model.',
        usage: `<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Project settings"
  side="right"
>
  <SettingsForm />
</Drawer>`,
        examples: [
          {
            title: 'Side panel',
            description: 'The drawer slides from either edge and traps focus like a dialog.',
          },
        ],
      },
      {
        id: 'hover-card',
        name: 'Hover Card',
        apiNames: ['HoverCard'],
        imports: ['HoverCard', 'Link'],
        description: 'A rich preview surface revealed on hover or focus, for context without navigation.',
        usage: `<HoverCard trigger={<Link href="/projects/orion">Orion</Link>}>
  <ProjectSummary />
</HoverCard>`,
        examples: [
          {
            title: 'Preview on hover',
            description: 'Delays are tunable; keyboard focus opens the card too.',
          },
        ],
      },
      {
        id: 'command',
        name: 'Command',
        apiNames: ['Command'],
        imports: ['Command', 'Button'],
        description: 'A command palette dialog with grouped, filterable actions and keyboard navigation.',
        usage: `<Command
  open={open}
  onOpenChange={setOpen}
  groups={[
    { label: 'Projects', items: [{ id: 'orion', label: 'Open Orion', onSelect: () => undefined }] },
  ]}
/>`,
        examples: [
          {
            title: 'Palette',
            description: 'Arrows cycle filtered items, Enter runs the action, state resets on open.',
          },
        ],
      },
      {
        id: 'alert-dialog',
        name: 'Alert Dialog',
        apiNames: ['AlertDialog'],
        imports: ['AlertDialog', 'Button'],
        description: 'A blocking confirmation that holds focus until an explicit choice is made.',
        usage: `<AlertDialog
  trigger={<Button variant="danger">Delete project</Button>}
  title="Delete project?"
  description="This removes Orion and its reports permanently."
  tone="danger"
  confirmText="Delete"
  onConfirm={() => undefined}
/>`,
        examples: [
          {
            title: 'Destructive confirmation',
            description: 'Alertdialog semantics keep focus inside; tone="danger" styles the confirm action.',
          },
        ],
      },
      {
        id: 'popconfirm',
        name: 'Popconfirm',
        apiNames: ['Popconfirm'],
        imports: ['Popconfirm', 'Button'],
        description: 'A lightweight anchored confirmation for small destructive or irreversible actions.',
        usage: `<Popconfirm
  trigger={<Button variant="secondary">Remove member</Button>}
  title="Remove Avery?"
  message="They lose access to this workspace."
  tone="danger"
  confirmText="Remove"
  onConfirm={() => undefined}
/>`,
        examples: [
          {
            title: 'Inline confirmation',
            description: 'Built on Popover, so it anchors to the trigger without taking over the page.',
          },
        ],
      },
      {
        id: 'context-menu',
        name: 'Context Menu',
        apiNames: ['ContextMenu'],
        description: 'A right-click action menu attached to any element, sharing the Menu item contract.',
        usage: `<ContextMenu
  label="Project actions"
  items={[{ id: 'rename', label: 'Rename', onSelect: () => undefined }]}
>
  <div>Right-click this project row</div>
</ContextMenu>`,
        examples: [
          {
            title: 'Right-click actions',
            description: 'Items support icons, separators, disabled states, and the danger variant like Menu.',
          },
        ],
      },
      {
        id: 'tour',
        name: 'Tour',
        apiNames: ['Tour'],
        imports: ['Tour', 'Button'],
        description: 'A guided walkthrough that highlights target elements step by step.',
        usage: `const [open, setOpen] = useState(false)

<Tour
  open={open}
  onOpenChange={setOpen}
  steps={[
    { target: '#search-field', title: 'Search everything', content: 'Find projects and people from one field.' },
  ]}
/>`,
        examples: [
          {
            title: 'Onboarding steps',
            description: 'Each step anchors to a selector; missing targets fall back to a centered dialog.',
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
      {
        id: 'notification-item',
        name: 'Notification Item',
        apiNames: ['NotificationItem'],
        imports: ['NotificationItem'],
        description:
          'A sanitized ecosystem inbox row with severity, source application, read state, deep link, and delivery-state controls.',
        usage: `<NotificationItem
  severity="warning"
  appLabel="Yang Operations"
  timestamp="2 hours ago"
  title="photos-api restarted unexpectedly"
  href="https://yang.example/incidents/photos-api"
  onMute={() => undefined}
  onArchive={() => undefined}
/>`,
        examples: [
          {
            title: 'Unread with controls',
            description:
              'Unread items are emphasized and announced; mute and archive only touch delivery state, never the source event.',
          },
          {
            title: 'Read',
            description: 'Read items drop the emphasis and the unread announcement.',
          },
        ],
      },
      {
        id: 'health-indicator',
        name: 'Health Indicator',
        apiNames: ['HealthIndicator'],
        imports: ['HealthIndicator'],
        description:
          'An explicit ecosystem health status that reports unknown and stale evidence instead of implying health.',
        usage: `<HealthIndicator status="healthy" label="Photos" />
<HealthIndicator status="unknown" label="Trict" />`,
        examples: [
          {
            title: 'Reported statuses',
            description: 'Healthy, degraded, and down come straight from source evidence.',
          },
          {
            title: 'Missing evidence',
            description: 'Stale, unknown, and checking states stay visible; health is never inferred.',
          },
        ],
      },
      {
        id: 'step-up-notice',
        name: 'Step-Up Notice',
        apiNames: ['StepUpNotice'],
        imports: ['StepUpNotice', 'Button'],
        description:
          'An inline warning that explains a required fresh verification and hosts the caller’s verification action.',
        usage: `<StepUpNotice
  title="Confirm it's you"
  action={<Button size="sm">Verify with passkey</Button>}
>
  Approving a repair requires fresh verification.
</StepUpNotice>`,
        examples: [
          {
            title: 'Verification required',
            description: 'The action is caller-supplied; the notice never starts verification on its own.',
          },
          {
            title: 'Dismissible',
            description: 'Pass onDismiss when the notice is informational rather than blocking.',
          },
        ],
      },
      {
        id: 'banner',
        name: 'Banner',
        apiNames: ['Banner'],
        imports: ['Banner', 'Button'],
        description: 'A page-level notice strip for workspace-wide feedback that owns the top of a view.',
        usage: `<Banner variant="warning" title="Scheduled maintenance">
  The workspace is read-only on Saturday, 02:00–03:00 UTC.
</Banner>`,
        examples: [
          {
            title: 'Page-level feedback',
            description: 'A stronger accent than Alert, for notices that apply to the whole view.',
          },
        ],
      },
      {
        id: 'progress-circle',
        name: 'Progress Circle',
        apiNames: ['ProgressCircle'],
        description: 'A radial progress indicator with determinate and indeterminate modes.',
        usage: '<ProgressCircle value={64} label="Import progress" />',
        examples: [
          {
            title: 'Radial progress',
            description: 'role="progressbar" carries the value; omit value for a spinning indeterminate arc.',
          },
        ],
      },
      {
        id: 'timeline',
        name: 'Timeline',
        apiNames: ['Timeline'],
        description: 'A vertical activity feed with tone dots, connectors, and timestamps.',
        usage: `<Timeline
  items={[
    { id: '1', title: 'Deploy finished', timestamp: '2 min ago', tone: 'success' },
  ]}
/>`,
        examples: [
          {
            title: 'Activity feed',
            description: 'Tone dots mark event semantics; connectors link the sequence.',
          },
        ],
      },
      {
        id: 'meter',
        name: 'Meter',
        apiNames: ['Meter'],
        description: 'A scalar gauge for a known range with optimum-zone coloring.',
        usage: `<Meter label="Storage used" value={72} low={60} high={85} optimum={20} />`,
        examples: [
          {
            title: 'Zones',
            description: 'low, high, and optimum map the value onto neutral, success, warning, and danger fills.',
          },
        ],
      },
      {
        id: 'rating',
        name: 'Rating',
        apiNames: ['Rating'],
        description: 'A star rating input with radio semantics, arrow keys, and a read-only display mode.',
        usage: `<Rating label="Rate this report" defaultValue={3} onChange={(value) => undefined} />`,
        examples: [
          {
            title: 'Interactive rating',
            description: 'Stars behave as a radiogroup with roving tab index; arrows move and select.',
          },
        ],
      },
      {
        id: 'announcer',
        name: 'Announcer',
        apiNames: ['Announcer'],
        imports: ['Announcer', 'Button'],
        description: 'A visually hidden live region that re-announces a message whenever it changes.',
        usage: `<Announcer message={statusMessage} politeness="polite" />`,
        examples: [
          {
            title: 'Status updates',
            description: 'The region clears and rewrites so a repeated message is announced again.',
          },
        ],
      },
    ],
  },
  {
    name: 'Navigation',
    modules: [
      {
        id: 'app-switcher',
        name: 'App Switcher',
        apiNames: ['AppSwitcher'],
        imports: ['AppSwitcher', 'Button'],
        description:
          'An entitlement-filtered application switcher with an explicit Home destination and keyboard navigation.',
        usage: `<AppSwitcher
  trigger={<Button variant="secondary">Switch application</Button>}
  homeHref="https://home.example"
  homeLabel="Home"
  apps={[
    { id: 'yang', label: 'Yang Operations', href: 'https://yang.example' },
    { id: 'photos', label: 'Photos', href: 'https://photos.example', current: true },
  ]}
/>`,
        examples: [
          {
            title: 'Household applications',
            description:
              'The caller filters applications by entitlement first; the switcher renders only what it is given plus the explicit Home destination.',
          },
          {
            title: 'Single application',
            description: 'A member with one entitled application still gets the explicit Home destination.',
          },
        ],
      },
      {
        id: 'account-menu',
        name: 'Account Menu',
        apiNames: ['AccountMenu'],
        imports: ['AccountMenu'],
        description:
          'A household account menu with an identity header, product items, and distinct app and SSO sign-out actions.',
        usage: `<AccountMenu
  user={{ name: 'Avery Chen', email: 'avery@example.com' }}
  items={[{ id: 'sessions', label: 'Active sessions', onSelect: () => undefined }]}
  appSignOut={{ label: 'Sign out of Photos', onSelect: () => undefined }}
  ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => undefined }}
/>`,
        examples: [
          {
            title: 'Household account',
            description:
              'Sign-out actions are labeled by the product so people can tell an application session from the shared SSO session.',
          },
          {
            title: 'Without product items',
            description: 'The items list is optional; the identity header and sign-out actions remain.',
          },
        ],
      },
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
      {
        id: 'steps',
        name: 'Steps',
        apiNames: ['Steps'],
        description: 'A numbered flow indicator with done, current, and upcoming states.',
        usage: `<Steps
  current={1}
  steps={[
    { label: 'Workspace' },
    { label: 'Members' },
    { label: 'Review' },
  ]}
/>`,
        examples: [
          {
            title: 'Flow progress',
            description: 'Completed steps can be clickable; the current step sets aria-current.',
          },
        ],
      },
      {
        id: 'tree-view',
        name: 'Tree View',
        apiNames: ['TreeView'],
        description: 'A hierarchical disclosure list with keyboard navigation and selection.',
        usage: `<TreeView
  aria-label="Project files"
  items={[
    { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },
  ]}
/>`,
        examples: [
          {
            title: 'Hierarchy',
            description: 'Arrows expand, collapse, and move; Enter selects with aria-selected.',
          },
        ],
      },
      {
        id: 'menubar',
        name: 'Menubar',
        apiNames: ['Menubar'],
        description: 'An application command bar of labeled dropdown menus with full keyboard navigation.',
        usage: `<Menubar
  label="Application"
  menus={[
    { label: 'File', items: [{ id: 'new', label: 'New project', onSelect: () => undefined }] },
    { label: 'Edit', items: [{ id: 'undo', label: 'Undo', onSelect: () => undefined }] },
  ]}
/>`,
        examples: [
          {
            title: 'Application commands',
            description: 'Arrows move across menus and through items following the menubar pattern.',
          },
        ],
      },
      {
        id: 'navigation-menu',
        name: 'Navigation Menu',
        apiNames: ['NavigationMenu'],
        description: 'A top-level navigation bar mixing links with rich content panels in a shared viewport.',
        usage: `<NavigationMenu
  label="Primary"
  items={[
    { type: 'link', label: 'Overview', href: '/', active: true },
    { type: 'panel', label: 'Products', content: <ProductsPanel /> },
  ]}
/>`,
        examples: [
          {
            title: 'Links and panels',
            description: 'Link items navigate with aria-current; panel items reveal content in one viewport.',
          },
        ],
      },
      {
        id: 'back-top',
        name: 'Back Top',
        apiNames: ['BackTop'],
        description: 'A floating button that appears after scrolling and returns to the top of the page.',
        usage: `<BackTop threshold={400} />`,
        examples: [
          {
            title: 'Scroll recovery',
            description: 'Appears past the threshold and honors reduced motion when scrolling back up.',
          },
        ],
      },
    ],
  },
  {
    name: 'Data',
    modules: [
      {
        id: 'permission-matrix',
        name: 'Permission Matrix',
        apiNames: ['PermissionMatrix'],
        imports: ['PermissionMatrix', 'Badge'],
        description:
          'A people-by-applications access matrix with caller-supplied cell content and explicit no-access cells.',
        usage: `<PermissionMatrix
  caption="Household application access"
  columns={[
    { id: 'photos', label: 'Photos' },
    { id: 'trict', label: 'Trict' },
  ]}
  rows={[
    { id: 'avery', label: 'Avery', cells: { photos: <Badge variant="success">Owner</Badge> } },
  ]}
/>`,
        examples: [
          {
            title: 'Household access',
            description: 'Cells carry caller-rendered content such as badges; missing entries show an explicit em dash.',
          },
          {
            title: 'Entitlement review',
            description: 'Capability rows work the same way, keeping entitlement policy in the calling product.',
          },
        ],
      },
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
      {
        id: 'description-list',
        name: 'Description List',
        apiNames: ['DescriptionList'],
        description: 'A label/value definition list for detail pages, stacked or two-column.',
        usage: `<DescriptionList
  items={[
    { label: 'Owner', value: 'Avery Chen' },
    { label: 'Created', value: 'March 4, 2026' },
  ]}
/>`,
        examples: [
          {
            title: 'Detail summary',
            description: 'Real dl markup; grid layout splits into two columns on wider screens.',
          },
        ],
      },
      {
        id: 'data-table',
        name: 'Data Table',
        apiNames: ['DataTable'],
        description: 'A data grid with sortable columns and row selection, built on the Table contract.',
        usage: `<DataTable
  caption="Projects"
  columns={[{ key: 'name', header: 'Name', cell: (row) => row.name, sortable: true }]}
  rows={rows}
  getRowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  selectable
/>`,
        examples: [
          {
            title: 'Sorting and selection',
            description: 'Sortable headers set aria-sort; the header checkbox handles indeterminate bulk state.',
          },
        ],
      },
      {
        id: 'avatar-group',
        name: 'Avatar Group',
        apiNames: ['AvatarGroup'],
        description: 'An overlapping identity stack with an overflow count.',
        usage: '<AvatarGroup names={["Avery Chen", "Morgan Reyes", "Riley Okafor"]} />',
        examples: [
          {
            title: 'Overflow',
            description: 'Past max, a +N bubble summarizes the rest; the group label lists everyone.',
          },
        ],
      },
      {
        id: 'stat',
        name: 'Stat',
        apiNames: ['Stat'],
        description: 'A labeled metric with a trend delta and optional supporting content.',
        usage: `<Stat
  label="Monthly recurring revenue"
  value="$48.2k"
  delta={{ direction: 'up', value: '+12.4%' }}
  description="vs. previous month"
/>`,
        examples: [
          {
            title: 'Trend delta',
            description: 'Direction picks the icon and default tone; assistive technology hears an explicit up or down prefix.',
          },
        ],
      },
      {
        id: 'list',
        name: 'List',
        apiNames: ['List', 'ListItem'],
        description: 'A vertical item list with leading and trailing slots, secondary text, and a dense mode.',
        usage: `<List>
  <ListItem leading={<Folder />} title="Reports" secondary="12 files" trailing="2 GB" />
  <ListItem title="Archive" onClick={() => undefined} />
</List>`,
        examples: [
          {
            title: 'Slots and actions',
            description: 'onClick turns the row into a button; dense tightens every item.',
          },
        ],
      },
      {
        id: 'sparkline',
        name: 'Sparkline',
        apiNames: ['Sparkline'],
        description: 'A tiny inline trend chart in line, area, or bar form with an accessible summary.',
        usage: `<Sparkline aria-label="Sign-ups trending up" data={[4, 8, 6, 12, 9, 14]} variant="area" />`,
        examples: [
          {
            title: 'Trends at a glance',
            description: 'role="img" carries the label; a visually hidden min, max, and last summary backs it up.',
          },
        ],
      },
      {
        id: 'calendar',
        name: 'Calendar',
        apiNames: ['Calendar'],
        description: 'A month grid for picking a single date with bounds and disabled days.',
        usage: `const [date, setDate] = useState(new Date())

<Calendar value={date} onSelect={setDate} />`,
        examples: [
          {
            title: 'Date grid',
            description: 'min, max, and disabledDates constrain selection; the month label announces changes.',
          },
        ],
      },
      {
        id: 'result',
        name: 'Result',
        apiNames: ['Result'],
        imports: ['Result', 'Button'],
        description: 'A full-area outcome state for success, error, and HTTP results with a standard icon and actions.',
        usage: `<Result
  status="404"
  title="Page not found"
  description="The report may have been moved or deleted."
  actions={<Button>Back to projects</Button>}
/>`,
        examples: [
          {
            title: 'Outcome states',
            description: 'Seven statuses pair a standard icon with a matching tint and optional actions.',
          },
        ],
      },
    ],
  },
  {
    name: 'Layout',
    modules: [
      {
        id: 'stack',
        name: 'Stack',
        apiNames: ['Stack'],
        imports: ['Stack', 'Badge'],
        description: 'A flex primitive that stacks children along one axis with consistent spacing and alignment.',
        usage: `<Stack direction="row" gap={4} align="center">
  <Badge variant="success">Ready</Badge>
  <Badge>Paused</Badge>
</Stack>`,
        examples: [
          {
            title: 'Axis and spacing',
            description: 'Numeric gaps follow the spacing scale; direction, align, justify, and wrap map to flexbox.',
          },
        ],
      },
      {
        id: 'grid',
        name: 'Grid',
        apiNames: ['Grid'],
        imports: ['Grid', 'Card'],
        description: 'A grid primitive with fixed columns or responsive auto-fit tracks.',
        usage: `<Grid minChildWidth="14rem" gap={4}>
  <Card>...</Card>
  <Card>...</Card>
</Grid>`,
        examples: [
          {
            title: 'Responsive tracks',
            description: 'minChildWidth collapses columns automatically as the container narrows.',
          },
        ],
      },
      {
        id: 'resizable',
        name: 'Resizable',
        apiNames: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
        imports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
        description: 'Pointer- and keyboard-resizable panes with percentage sizing and double-click reset.',
        usage: `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>`,
        examples: [
          {
            title: 'Split panes',
            description: 'The handle exposes separator semantics with arrow-key steps and aria-valuenow.',
          },
        ],
      },
      {
        id: 'aspect-ratio',
        name: 'Aspect Ratio',
        apiNames: ['AspectRatio'],
        description: 'Keeps media or content at a consistent width-to-height ratio.',
        usage: `<AspectRatio ratio={16 / 9}>
  <img src="/charts/usage.png" alt="Weekly usage chart" />
</AspectRatio>`,
        examples: [
          {
            title: 'Consistent media',
            description: 'The box holds its ratio while content stays clipped with rounded corners.',
          },
        ],
      },
    ],
  },
  {
    name: 'Utilities',
    modules: [
      {
        id: 'visually-hidden',
        name: 'Visually Hidden',
        apiNames: ['VisuallyHidden'],
        imports: ['VisuallyHidden'],
        description: 'Hides content visually while keeping it available to assistive technology.',
        usage: `<button type="button">
  <Trash aria-hidden="true" />
  <VisuallyHidden>Delete report</VisuallyHidden>
</button>`,
        examples: [
          {
            title: 'Screen-reader text',
            description: 'Use for extra context that would clutter the visual design.',
          },
        ],
      },
      {
        id: 'copy-button',
        name: 'Copy Button',
        apiNames: ['CopyButton'],
        description: 'A button that copies a value to the clipboard and confirms with an icon swap and live feedback.',
        usage: `<CopyButton value="npm install @kryv/teal" />`,
        examples: [
          {
            title: 'Copy feedback',
            description: 'The label swaps to the copied text briefly and announces through a hidden live region.',
          },
        ],
      },
      {
        id: 'theme-toggle',
        name: 'Theme Toggle',
        apiNames: ['ThemeToggle'],
        description: 'An icon button that toggles the dark class on the document root and reports its state.',
        usage: `<ThemeToggle onChange={(theme) => persistTheme(theme)} />`,
        examples: [
          {
            title: 'Light and dark',
            description: 'aria-pressed reflects the current theme; persisting the choice stays with the app.',
          },
        ],
      },
      {
        id: 'carousel',
        name: 'Carousel',
        apiNames: ['Carousel', 'CarouselSlide'],
        description: 'A scroll-snap carousel with previous and next controls, dot indicators, and arrow-key support.',
        usage: `<Carousel label="Featured reports">
  <ReportCard title="Q1 security" />
  <ReportCard title="Q2 reliability" />
</Carousel>`,
        examples: [
          {
            title: 'Paged content',
            description: 'Slides announce their position; loop wraps around at the ends.',
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
  'button-group': [{ title: 'Vertical cluster', description: 'Use vertical orientation when the actions stack in a narrow panel.' }],
  'segmented-control': [{ title: 'Compact periods', description: 'The small size keeps dense toolbars scannable.' }],
  link: [{ title: 'Standalone navigation', description: 'Use the standalone variant outside prose, where underline-on-hover signals the affordance.' }],
  'radio-group': [{ title: 'Horizontal options', description: 'Use horizontal orientation for two or three short options.' }],
  slider: [{ title: 'Bounded ranges', description: 'Set min, max, and step when the meaningful range is narrower than 0–100.' }],
  'search-input': [{ title: 'Loading results', description: 'The loading state replaces the clear action while results refresh.' }],
  combobox: [{ title: 'Disabled options', description: 'Options can be disabled with an explanatory empty message for no matches.' }],
  chip: [{ title: 'Locked filters', description: 'Disabled chips communicate filters managed elsewhere.' }],
  kbd: [{ title: 'Combinations', description: 'Join keys with plain-text separators for multi-key shortcuts.' }],
  'scroll-area': [{ title: 'Panel lists', description: 'Pair with a fixed maxHeight so the page itself keeps its own scroll.' }],
  drawer: [{ title: 'Left edge', description: 'Use side="left" when the panel continues a left-side navigation context.' }],
  'hover-card': [{ title: 'Identity preview', description: 'Show a person or project summary without leaving the list.' }],
  banner: [{ title: 'Dismissible notices', description: 'Pass onDismiss for notices the user can clear for the session.' }],
  steps: [{ title: 'Clickable completed steps', description: 'Allow returning to completed steps with onStepClick.' }],
  'description-list': [{ title: 'Two-column details', description: 'Use the grid layout for wider detail panels.' }],
  toggle: [{ title: 'Filter rows', description: 'Use toggles in a toolbar for independent on/off preferences.' }],
  toolbar: [{ title: 'Formatting groups', description: 'Group related controls and separate them with hairlines.' }],
  'split-button': [{ title: 'Secondary and danger variants', description: 'The menu can carry a danger item behind the separator.' }],
  'multi-select': [{ title: 'Disabled options', description: 'Individual options can be disabled while the rest stay selectable.' }],
  'date-picker': [{ title: 'Bounded dates', description: 'Use minDate and maxDate for booking-style windows.' }],
  'number-input': [{ title: 'Custom steps', description: 'Set step for increments that match the domain, like 0.5 or 10.' }],
  'password-input': [{ title: 'Current password', description: 'Pair with autocomplete="current-password" for sign-in forms.' }],
  'file-upload': [{ title: 'Accepted types', description: 'Constrain with accept when only certain file types are valid.' }],
  'data-table': [{ title: 'Bulk selection', description: 'Combine selectable rows with a toolbar for bulk actions.' }],
  'avatar-group': [{ title: 'Compact stacks', description: 'Use the small size and a lower max inside table rows.' }],
  'tree-view': [{ title: 'Default expansion', description: 'Open key branches on first render with defaultExpandedIds.' }],
  command: [{ title: 'Keyboard first', description: 'Bind a global shortcut to open the palette; keep item hints scannable.' }],
  'progress-circle': [{ title: 'Indeterminate work', description: 'Omit value while progress cannot be measured.' }],
  timeline: [{ title: 'Event tones', description: 'Use success and warning tones to mark outcomes in a feed.' }],
  'code-block': [{ title: 'Line numbers', description: 'Enable line numbers for walkthroughs that reference specific lines.' }],
  meter: [{ title: 'Custom formatting', description: 'formatValue renders units such as GB in the readout and the accessible value text.' }],
  rating: [{ title: 'Read-only display', description: 'readOnly renders static stars with an img role for review summaries.' }],
  announcer: [{ title: 'Assertive updates', description: 'Use politeness="assertive" only for urgent changes that should interrupt.' }],
  'pin-input': [{ title: 'Masked codes', description: 'masked renders password-style cells for codes that should not linger on screen.' }],
  'tags-input': [{ title: 'Capped lists', description: 'Set max when the domain allows only a fixed number of tags.' }],
  'input-group': [{ title: 'Trailing units', description: 'A trailing addon works for units like GB or currency codes.' }],
  editable: [{ title: 'Empty values', description: 'The placeholder keeps an empty value discoverable and clickable.' }],
  'time-picker': [{ title: '12-hour cycle', description: 'hourCycle={12} swaps the 0–23 hour field for 1–12 with an AM/PM toggle.' }],
  'date-range-picker': [{ title: 'Bounded ranges', description: 'Use isDateDisabled to exclude days such as weekends or past dates.' }],
  'color-picker': [{ title: 'Controlled color', description: 'Pair value with onChange when the color drives other UI.' }],
  'alert-dialog': [{ title: 'Custom actions', description: 'Pass actions to replace the default cancel and confirm buttons entirely.' }],
  popconfirm: [{ title: 'Default tone', description: 'Use the default tone for non-destructive confirmations such as publishing.' }],
  'context-menu': [{ title: 'Separated danger', description: 'Keep destructive context actions at the end behind a separator.' }],
  tour: [{ title: 'Placement', description: 'Use placement="top" when the step target sits near the bottom of the viewport.' }],
  menubar: [{ title: 'Menu items', description: 'Items share the Menu contract, including icons, disabled states, and danger.' }],
  'navigation-menu': [{ title: 'Panel content', description: 'Panel items accept arbitrary content such as feature grids or promoted links.' }],
  'back-top': [{ title: 'Custom threshold', description: 'Lower the threshold on short pages so the control still appears.' }],
  stat: [{ title: 'With a sparkline', description: 'Pass a Sparkline as children when the metric benefits from a trend shape.' }],
  list: [{ title: 'Dense lists', description: 'Use dense inside popovers and panels where vertical space is tight.' }],
  sparkline: [{ title: 'Bar variant', description: 'Use variant="bar" for discrete periods such as daily totals.' }],
  calendar: [{ title: 'Bounded dates', description: 'Use min and max for booking-style windows like Calendar inside pickers.' }],
  result: [{ title: 'HTTP states', description: '404, 403, and 500 statuses cover routing and server outcomes.' }],
  stack: [{ title: 'Wrapping rows', description: 'wrap lets a row flow onto multiple lines on narrow screens.' }],
  grid: [{ title: 'Fixed columns', description: 'Use columns when the layout must hold an exact track count.' }],
  resizable: [{ title: 'Vertical stacks', description: 'direction="vertical" splits panes top to bottom with the same handle behavior.' }],
  'aspect-ratio': [{ title: 'Media placeholders', description: 'Reserve space for media that has not loaded to avoid layout shift.' }],
  'visually-hidden': [{ title: 'Extra context', description: 'Add location or status context to links whose visible text stays short.' }],
  'copy-button': [{ title: 'Icon-only copy', description: 'iconOnly fits copy actions inside table rows and code headers.' }],
  'theme-toggle': [{ title: 'Persisting choice', description: 'Store the theme in onChange and reapply the class on load.' }],
  carousel: [{ title: 'Looping', description: 'loop keeps prev and next enabled by wrapping past the ends.' }],
}

for (const module of modules) {
  module.examples = [...module.examples, ...(additionalExamples[module.id] ?? [])]
}

/** Editorial guidance is kept beside the canonical module registry. */
/** @type {Record<string, { useWhen: string, avoidWhen: string, behavior: string, responsive: string }>} */
const guidanceById = {
  'app-switcher': { useWhen: 'People move between entitled ecosystem applications.', avoidWhen: 'The navigation is inside one application; use vertical nav or tabs instead.', behavior: 'The caller filters applications by entitlement first; the switcher always includes the explicit Home destination.', responsive: 'The dropdown collision-handles to stay on screen; keep labels short on narrow layouts.' },
  'account-menu': { useWhen: 'A signed-in household identity needs session and account actions.', avoidWhen: 'The surface has no identity concept or is public.', behavior: 'App-session and SSO sign-out stay distinct actions with product-supplied labels.', responsive: 'The trigger stays a compact avatar so it fits top bars at any width.' },
  'launcher-card': { useWhen: 'An application destination needs a prominent, scannable entry point.', avoidWhen: 'The destination is a minor link inside prose; use a plain link instead.', behavior: 'Disabled cards leave the focus order and block navigation instead of hiding.', responsive: 'Cards stack single-column on mobile and grid at larger widths under the caller’s layout.' },
  'permission-matrix': { useWhen: 'Owners review who can reach which application or capability.', avoidWhen: 'The data is a flat list rather than a people-by-applications grid; use Table instead.', behavior: 'Cells are caller-rendered; missing entries show an explicit em dash rather than a blank.', responsive: 'The table region scrolls horizontally on narrow screens and becomes focusable only when it overflows.' },
  'notification-item': { useWhen: 'An inbox lists sanitized pointers to application events.', avoidWhen: 'The feedback is local to the current task; use Alert or Toast instead.', behavior: 'Mute and archive touch delivery state only; the deep link never mutates the source.', responsive: 'Text wraps and controls stay reachable at mobile widths.' },
  'health-indicator': { useWhen: 'A surface reports one application or ecosystem health status.', avoidWhen: 'The status is decorative; omit it instead of implying health.', behavior: 'Unknown, stale, and checking are explicit states; health is never inferred from missing evidence.', responsive: 'The badge and label wrap naturally in compact headers.' },
  'step-up-notice': { useWhen: 'A sensitive action requires fresh strong authentication first.', avoidWhen: 'A plain warning suffices; use Alert instead.', behavior: 'The verification action is caller-supplied; the notice never starts or auto-submits verification.', responsive: 'The action wraps beneath the explanation on narrow screens.' },
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
  'button-group': { useWhen: 'Two to four tightly related actions belong to one decision.', avoidWhen: 'The actions are unrelated or need distinct visual priority; space them normally.', behavior: 'Seams collapse to hairlines and only the outer corners keep their radius.', responsive: 'Let the cluster wrap or switch to vertical orientation on narrow screens.' },
  'segmented-control': { useWhen: 'Users switch one setting between a few mutually exclusive options.', avoidWhen: 'Options navigate to different views; use Tabs, or toggle independent flags with Checkbox.', behavior: 'A measured pill slides behind the active option and the group behaves as radiogroup semantics.', responsive: 'Keep option labels short so the control never wraps.' },
  link: { useWhen: 'Navigation happens inline in prose or as a lightweight standalone action.', avoidWhen: 'The affordance performs an action; use Button instead.', behavior: 'External links open a new tab with rel="noreferrer" and an indicator icon.', responsive: 'Let inline links wrap naturally with their surrounding text.' },
  'radio-group': { useWhen: 'Users pick exactly one option from a small visible set.', avoidWhen: 'The list is long or needs filtering; use Select or Combobox.', behavior: 'Arrow keys move and select within the group; the label is wired through aria-labelledby.', responsive: 'Switch to horizontal orientation only when labels stay on one line.' },
  slider: { useWhen: 'A value inside a known range is more natural to scrub than to type.', avoidWhen: 'Precision matters more than speed; pair with or use Input instead.', behavior: 'Pointer and keyboard adjust the value and showValue mirrors it live.', responsive: 'The track fills its container width, so constrain it in the layout.' },
  'search-input': { useWhen: 'A field exists specifically to query a collection.', avoidWhen: 'The input is general-purpose text entry; use Input.', behavior: 'The clear action appears only with a value, and loading swaps it for a spinner.', responsive: 'Icons stay pinned inside the field at any width.' },
  combobox: { useWhen: 'Users choose one value from a list long enough to need filtering.', avoidWhen: 'The list is short; use Select, or the value is free text; use Input.', behavior: 'Typing filters, arrows highlight, Enter selects, Escape preserves the current value.', responsive: 'The suggestion list matches the field width and collision-handles vertically.' },
  chip: { useWhen: 'Active filters or selections need compact, removable tokens.', avoidWhen: 'The status is informational only; use Badge.', behavior: 'The remove action is labeled from the chip text for screen readers.', responsive: 'Chips wrap in rows; keep labels to one or two words.' },
  kbd: { useWhen: 'A keyboard shortcut is referenced in help or onboarding copy.', avoidWhen: 'The key is part of a form value; use plain text.', behavior: 'Sizing is em-based so the keycap scales with its context.', responsive: 'Keep combinations short; wrap groups of keys with separators as text.' },
  'scroll-area': { useWhen: 'A panel needs a bounded height with theme-consistent scrollbars.', avoidWhen: 'The page itself should scroll; do not nest page-level scrolling.', behavior: 'The custom thumb appears over a transparent track only where scrolling is possible.', responsive: 'Set maxHeight in relative units so the region adapts to viewport height.' },
  drawer: { useWhen: 'A focused side task needs more room than a dialog but should not navigate away.', avoidWhen: 'The task is a simple confirmation; use Dialog.', behavior: 'Focus is trapped and restored, Escape dismisses, and the panel slides from the chosen edge.', responsive: 'The default width caps at the viewport; forms inside own their own scroll.' },
  'hover-card': { useWhen: 'Rich preview context helps before committing to navigation.', avoidWhen: 'The content is a short hint; use Tooltip, or must be interacted with on touch; use Popover.', behavior: 'Hover and keyboard focus open the card after a tunable delay.', responsive: 'Provide the same content through another path on touch layouts.' },
  banner: { useWhen: 'Feedback applies to the entire view, not one field or task.', avoidWhen: 'The message is local to a control or a transient confirmation; use Field, Alert, or Toast.', behavior: 'Danger renders role="alert" for immediate announcement; other variants render role="status".', responsive: 'The action wraps beneath the message on narrow screens.' },
  steps: { useWhen: 'A flow has a clear sequence and the user benefits from seeing progress.', avoidWhen: 'Steps are independent views; use Tabs or navigation.', behavior: 'The current step sets aria-current and completed steps can be made clickable.', responsive: 'Steps wrap with their labels on narrow screens; keep labels short.' },
  'description-list': { useWhen: 'A detail view lists labeled values for one entity.', avoidWhen: 'Records need column comparison; use Table.', behavior: 'Real dl/dt/dd markup keeps the relationship semantic.', responsive: 'Stacked layout is default; grid splits to two columns on wider screens.' },
  toggle: { useWhen: 'A preference flips between two states inside a toolbar or filter row.', avoidWhen: 'The choice needs a label with explanation; use Switch or Checkbox.', behavior: 'aria-pressed reflects the value and the pressed tint follows.', responsive: 'Keep toggle content icon-sized so rows stay compact.' },
  toolbar: { useWhen: 'Several small controls act on one editor or view.', avoidWhen: 'The actions are unrelated page actions; use a header action area.', behavior: 'role="toolbar" groups controls; separators are decorative hairlines.', responsive: 'Let groups wrap or scroll horizontally on narrow screens.' },
  'split-button': { useWhen: 'One default action has a few close alternatives.', avoidWhen: 'The actions are unrelated; use separate buttons or a plain Menu.', behavior: 'The main button fires the default; the chevron owns the menu.', responsive: 'Keep the label short so the joined control stays one line.' },
  'multi-select': { useWhen: 'Users pick several values from a filterable list.', avoidWhen: 'Only one value is allowed; use Select or Combobox.', behavior: 'Options toggle without closing and pills remove single values.', responsive: 'Pills wrap inside the control as values accumulate.' },
  'date-picker': { useWhen: 'Users pick a single calendar date.', avoidWhen: 'The value is free-form or a range; use Input or a dedicated range flow.', behavior: 'The calendar supports full keyboard navigation and min/max bounds.', responsive: 'The popover collision-handles; the field keeps its layout width.' },
  'number-input': { useWhen: 'A numeric value benefits from quick stepping.', avoidWhen: 'The value is an identifier, not a quantity; use Input.', behavior: 'Steppers and blur clamp to min/max; empty means undefined.', responsive: 'The field fills its container; constrain it in the form layout.' },
  'password-input': { useWhen: 'The user enters a secret they may want to verify visually.', avoidWhen: 'The content is not sensitive; use Input or SearchInput.', behavior: 'The visibility toggle reports state through aria-pressed.', responsive: 'The toggle stays pinned inside the field at any width.' },
  'file-upload': { useWhen: 'Users attach files to a form.', avoidWhen: 'A single URL or text reference suffices; use Input.', behavior: 'Drag-over highlights the zone; the list mirrors the caller-owned value.', responsive: 'The zone fills its container and the file list wraps below.' },
  'data-table': { useWhen: 'Rows need sorting or bulk selection beyond Table.', avoidWhen: 'The data is read-only and simple; use Table.', behavior: 'Sorting is caller-owned; the header checkbox tracks indeterminate state.', responsive: 'The region scrolls horizontally like Table on narrow screens.' },
  'avatar-group': { useWhen: 'Several identities belong to one row or card.', avoidWhen: 'One identity needs emphasis; use Avatar.', behavior: 'Overflow collapses into a +N bubble; the group label names everyone.', responsive: 'Lower max in dense contexts like tables.' },
  'tree-view': { useWhen: 'Content is genuinely hierarchical, like files or nested categories.', avoidWhen: 'The list is flat; use a plain list or Tabs.', behavior: 'Arrow keys expand, collapse, and move; Enter selects.', responsive: 'Indent scales with depth; keep labels truncating, not wrapping.' },
  command: { useWhen: 'Power users need fast keyboard access to many actions.', avoidWhen: 'There are few actions; use visible buttons or a Menu.', behavior: 'Filtering, highlight, and selection reset on every open.', responsive: 'The panel caps at viewport width with its own internal scroll.' },
  'progress-circle': { useWhen: 'Progress needs a compact radial treatment.', avoidWhen: 'A precise value matters in a table; use Progress.', behavior: 'Determinate mode exposes aria-valuenow; omit value for indeterminate.', responsive: 'Set an explicit size per context instead of scaling.' },
  timeline: { useWhen: 'Events form a chronological feed.', avoidWhen: 'Items are peers without time order; use a plain list.', behavior: 'Tone dots carry semantics; connectors skip the last item.', responsive: 'Content wraps while the rail stays fixed width.' },
  'code-block': { useWhen: 'Code or commands should be readable and copyable.', avoidWhen: 'A single identifier in prose; use inline code styling.', behavior: 'The copy action confirms with an icon swap and announces via its label.', responsive: 'Long lines scroll horizontally instead of wrapping.' },
  meter: { useWhen: 'A quantity within a known range needs a glanceable gauge.', avoidWhen: 'Progress toward completing a task is shown; use Progress.', behavior: 'role="meter" carries min, max, and now; zones color the fill from low, high, and optimum.', responsive: 'The track fills its container, so constrain width in the layout.' },
  rating: { useWhen: 'Users score something on a small fixed scale.', avoidWhen: 'The input is numeric but not a rating; use Slider or NumberInput.', behavior: 'Stars form a radiogroup with roving tab index and arrow-key selection.', responsive: 'Pick a size per context; the inline group never wraps.' },
  announcer: { useWhen: 'State changes off-screen must reach screen-reader users.', avoidWhen: 'The change is already visible and focused; announcement would duplicate it.', behavior: 'The region clears and rewrites so identical messages re-announce.', responsive: 'The region is visually hidden and has no layout impact.' },
  'pin-input': { useWhen: 'The user enters a fixed-length numeric code.', avoidWhen: 'The value is free-form text; use Input.', behavior: 'Typing, Backspace, arrows, and paste move between cells; onComplete fires when full.', responsive: 'Cells keep a fixed tap size; reduce length on narrow screens.' },
  'tags-input': { useWhen: 'A field collects an open-ended list of short tokens.', avoidWhen: 'Values come from a fixed set; use MultiSelect.', behavior: 'Enter or comma commits; duplicates are ignored and chips remove individually.', responsive: 'Chips wrap inside the field as the list grows.' },
  'input-group': { useWhen: 'An input needs a fixed prefix or suffix such as a protocol or unit.', avoidWhen: 'The accessory is interactive; use separate controls instead.', behavior: 'The group detects addons and squares the matching input corners.', responsive: 'Addons stay fixed width while the input flexes.' },
  editable: { useWhen: 'A displayed value is renamed or corrected in place.', avoidWhen: 'The value is edited alongside others in a form; use Field and Input.', behavior: 'Enter and blur commit, Escape cancels, and the draft is preselected.', responsive: 'The preview truncates within its container width.' },
  'time-picker': { useWhen: 'The user enters a time of day.', avoidWhen: 'A date or a date range is needed; use DatePicker or DateRangePicker.', behavior: 'Hour and minute fields clamp while typing; the 12-hour cycle adds a period toggle.', responsive: 'The segmented group stays inline and fits compact forms.' },
  'date-range-picker': { useWhen: 'The user picks a start and end date.', avoidWhen: 'Only one date is needed; use DatePicker.', behavior: 'Two clicks define the range; presets fill common windows and arrows move by day or week.', responsive: 'The popover collision-handles; the field keeps its layout width.' },
  'color-picker': { useWhen: 'The user picks a color from presets or a hex value.', avoidWhen: 'A full design-token editor is required.', behavior: 'Presets commit immediately; hex input validates and normalizes on Enter or blur.', responsive: 'The trigger fits toolbars; the panel caps at the preset grid width.' },
  'alert-dialog': { useWhen: 'An action needs an explicit, blocking confirmation.', avoidWhen: 'The consequence is minor; use Popconfirm or inline feedback.', behavior: 'Focus stays trapped until cancel or confirm; tone styles the confirm action.', responsive: 'The panel caps at the viewport with its own scroll.' },
  popconfirm: { useWhen: 'A small action benefits from confirmation without a modal.', avoidWhen: 'The consequence is severe; use AlertDialog.', behavior: 'Anchored to its trigger and dismisses on confirm, cancel, or Escape.', responsive: 'The panel stays within the viewport near the trigger.' },
  'context-menu': { useWhen: 'An element has secondary actions discoverable on right-click.', avoidWhen: 'The actions are primary; keep them visible instead.', behavior: 'Shares the Menu item contract with icons, separators, and danger styling.', responsive: 'Provide a visible alternative on touch layouts.' },
  tour: { useWhen: 'New users need a guided introduction to key areas.', avoidWhen: 'The hint is local to one control; use Tooltip.', behavior: 'Steps anchor to selectors, Escape or Skip closes, and missing targets center the dialog.', responsive: 'Steps scroll targets into view; keep step content short.' },
  menubar: { useWhen: 'A desktop-style application exposes many commands in labeled menus.', avoidWhen: 'There are few actions; use a Toolbar or Menu.', behavior: 'Arrows traverse triggers and items following the menubar pattern.', responsive: 'Collapse into a single menu on narrow screens.' },
  'navigation-menu': { useWhen: 'Top-level destinations mix links with rich preview panels.', avoidWhen: 'The navigation is flat links only; use simpler link styling.', behavior: 'Panels open in a shared viewport; the active link sets aria-current.', responsive: 'Fall back to a vertical nav or drawer on narrow screens.' },
  'back-top': { useWhen: 'Pages grow long enough that returning to the top is tedious.', avoidWhen: 'The page is short or has its own scroll container.', behavior: 'Appears past the threshold and scrolls smoothly unless reduced motion is preferred.', responsive: 'The floating position clears content on all viewport sizes.' },
  stat: { useWhen: 'A headline metric needs a label and trend context.', avoidWhen: 'Several metrics compare in rows; use Table.', behavior: 'Delta direction picks the icon and tone; an sr-only prefix states the direction.', responsive: 'Value and delta wrap together; let stats stack in narrow grids.' },
  list: { useWhen: 'Items share one row structure with optional leading and trailing content.', avoidWhen: 'Records need column alignment; use Table.', behavior: 'onClick rows become buttons; dense reduces padding via context.', responsive: 'Text truncates rather than wrapping; trailing content stays pinned.' },
  sparkline: { useWhen: 'A trend shape adds context next to a metric.', avoidWhen: 'Precise values matter; pair with Stat or use a full chart.', behavior: 'role="img" with an aria-label plus a hidden min, max, and last summary.', responsive: 'Set explicit width and height per context.' },
  calendar: { useWhen: 'The user picks one date directly from a month grid.', avoidWhen: 'A date typed in a field is enough, or a range is needed.', behavior: 'min, max, and disabledDates constrain days; the month label is announced.', responsive: 'The grid keeps a fixed comfortable cell size.' },
  result: { useWhen: 'A route or panel resolves to a single outcome such as success, error, or 404.', avoidWhen: 'The message is local to a field or task; use Alert or Field.', behavior: 'The icon is decorative; title and description carry the meaning with optional actions.', responsive: 'Content centers and wraps within a readable measure.' },
  stack: { useWhen: 'Children flow along one axis with even spacing.', avoidWhen: 'The layout needs two-dimensional tracks; use Grid.', behavior: 'Numeric gaps follow the spacing scale; alignment maps to flexbox values.', responsive: 'Combine wrap with row direction for adaptive toolbars.' },
  grid: { useWhen: 'Children distribute across columns, fixed or responsive.', avoidWhen: 'Items flow in one line; use Stack.', behavior: 'minChildWidth enables auto-fit tracks; columns fixes the count.', responsive: 'Auto-fit collapses tracks as the container narrows.' },
  resizable: { useWhen: 'Users adjust the split between two panes.', avoidWhen: 'The layout is fixed; do not add interaction without a need.', behavior: 'Handles drag, step with arrow keys, and reset on double-click; sizes are percentages.', responsive: 'Set min sizes so panes stay usable on narrow screens.' },
  'aspect-ratio': { useWhen: 'Media must hold a consistent shape across widths.', avoidWhen: 'Content should size naturally.', behavior: 'The wrapper reserves the ratio and clips overflow with rounded corners.', responsive: 'The box scales with its container while holding the ratio.' },
  'visually-hidden': { useWhen: 'Assistive technology needs context the visual design omits.', avoidWhen: 'The text should be visible; show it instead.', behavior: 'Content stays in the accessibility tree without layout impact.', responsive: 'No visual footprint at any viewport.' },
  'copy-button': { useWhen: 'A value such as a command or id is copied often.', avoidWhen: 'The value is editable; use an Input with a copy recipe.', behavior: 'Clipboard failures still give feedback; a hidden live region announces the copy.', responsive: 'iconOnly mode fits dense rows and headers.' },
  'theme-toggle': { useWhen: 'The app offers a light and dark theme switch.', avoidWhen: 'Theme follows the system only.', behavior: 'Toggles the dark class on the document root and reports state through aria-pressed.', responsive: 'Icon-sized control fits any header.' },
  carousel: { useWhen: 'Peer items page through a bounded region.', avoidWhen: 'All content should be visible at once; use Grid.', behavior: 'Scroll-snap track with buttons, dots, and arrow keys; slides announce their position.', responsive: 'Slides take full track width; keep content readable at mobile widths.' },
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
