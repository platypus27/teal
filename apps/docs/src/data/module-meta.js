/**
 * Plain module metadata shared by the docs app and the build-time generators
 * (llms.txt). No components or ?raw imports here so Node scripts can import
 * this file directly. catalog.jsx attaches demos, sources, and playgrounds.
 *
 * Module shape:
 * - id: string, name: string, apiNames: string[], description: string,
 *   usage: string, examples: Array<{ title: string, description: string }>
 * - imports?: string[] (when the usage imports differ from apiNames)
 * - anatomy?: Array<{ part: string, description: string }> — the component's
 *   named parts and their roles; renders an "Anatomy" section when non-empty
 * - dosDonts?: { dos: string[], donts: string[] } — usage do's and don'ts;
 *   renders a "Do and don't" section when either list is non-empty
 * - related?: string[] — ids of related modules; renders "Related modules"
 *   links at the bottom of the page when non-empty
 * All three optional fields flow through docs-module-registry.js unchanged.
 */

export const moduleGroups = [
	{
		name: "Actions",
		modules: [
			{
				id: "button",
				name: "Button",
				apiNames: ["Button", "IconButton"],
				description:
					"Actions with consistent hierarchy, sizing, loading, and accessible icon treatment.",
				usage: `<Button variant="primary">Save changes</Button>
<IconButton label="More options"><MoreHorizontal /></IconButton>`,
				anatomy: [
					{ part: "Label", description: "The visible text naming the action; required unless the button is icon-only." },
					{ part: "Icon", description: "An optional leading or trailing glyph that supports the label, hidden from assistive technology." },
					{ part: "Spinner", description: "Replaces the content while loading and keeps the button disabled until the action settles." },
					{ part: "IconButton", description: "The icon-only variant; its label prop becomes the aria-label and the tooltip text." },
				],
				dosDonts: {
					dos: [
						"Use one primary button per view so the main action is unambiguous.",
						"Write verb-led labels that say what happens, like \"Save changes\".",
						"Use IconButton with a descriptive label for icon-only actions.",
					],
					donts: [
						"Don't use a button for navigation; use a Link instead.",
						"Don't rely on the danger color alone; keep the destructive label explicit.",
						"Don't disable a button without explaining why nearby.",
					],
				},
				related: ["link", "button-group", "toolbar", "split-button"],
				examples: [
					{
						title: "Variants and sizes",
						description:
							"Primary, secondary, ghost, and danger variants with a dedicated IconButton for icon-only actions.",
					},
				],
			},
			{
				id: "button-group",
				name: "Button Group",
				apiNames: ["ButtonGroup"],
				imports: ["ButtonGroup", "Button"],
				description:
					"An attached cluster of related actions with hairline seams and shared corner radius.",
				usage: `<ButtonGroup>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`,
				anatomy: [
					{ part: "Buttons", description: "Two to four sibling Buttons rendered flush against each other." },
					{ part: "Seams", description: "Hairline borders between buttons that replace the usual gap." },
					{ part: "Shared radius", description: "Only the first and last buttons keep their outer corner rounding." },
				],
				dosDonts: {
					dos: [
						"Use for closely related options of equal weight, like Day / Week / Month.",
						"Keep labels to one word so the cluster stays compact.",
						"Switch to the vertical orientation in narrow side panels.",
					],
					donts: [
						"Don't mix variants inside a group; the cluster reads as one control.",
						"Don't group unrelated actions just to save space.",
						"Don't exceed four buttons; use a Menu for larger sets.",
					],
				},
				related: ["button", "toggle-group", "toolbar"],
				examples: [
					{
						title: "Attached actions",
						description:
							"Buttons butt together with shared seams; vertical stacks work too.",
					},
				],
			},
			{
				id: "link",
				name: "Link",
				apiNames: ["Link"],
				description:
					"Themed inline and standalone links with an external indicator.",
				usage: `<Link href="/projects">View projects</Link>
<Link href="https://status.example" external>Status page</Link>`,
				anatomy: [
					{ part: "Anchor text", description: "The underlined link text, inline within prose or standalone." },
					{ part: "External indicator", description: "The icon appended to links that open a new tab, paired with rel=\"noreferrer\"." },
				],
				dosDonts: {
					dos: [
						"Use links for navigation, even when the destination opens in a new tab.",
						"Use the external prop for off-site links so the new-tab behavior is signposted.",
						"Write link text that makes sense out of context, not \"click here\".",
					],
					donts: [
						"Don't use a link to perform an action like saving or deleting; use a Button.",
						"Don't wrap whole sentences or paragraphs in a link.",
					],
				},
				related: ["button", "breadcrumb", "skip-link"],
				examples: [
					{
						title: "Inline and external",
						description:
							"Inline links underline within prose; external links open a new tab with an icon.",
					},
				],
			},
			{
				id: "toggle",
				name: "Toggle",
				apiNames: ["Toggle"],
				description:
					"A pressed-state button for binary preferences in toolbars and filter rows.",
				usage: `<Toggle aria-label="Bold"><Bold /></Toggle>`,
				anatomy: [
					{ part: "Button", description: "The pressable control carrying aria-pressed for its on/off state." },
					{ part: "Icon or label", description: "Compact content, usually icon-sized, named by aria-label when icon-only." },
					{ part: "Pressed tint", description: "The data-state styling that visually distinguishes on from off." },
				],
				dosDonts: {
					dos: [
						"Use for binary states that apply immediately, like Bold or a filter flag.",
						"Give icon-only toggles an aria-label naming the option.",
						"Group related toggles in a Toolbar or ToggleGroup.",
					],
					donts: [
						"Don't use for settings that need explanation; use Switch with a label.",
						"Don't use a toggle to fire a one-shot action; use a Button.",
					],
				},
				related: ["toggle-group", "switch", "toolbar"],
				examples: [
					{
						title: "Pressed state",
						description:
							"aria-pressed and data-state reflect the current value; tint follows.",
					},
				],
			},
			{
				id: "toolbar",
				name: "Toolbar",
				apiNames: ["Toolbar", "ToolbarGroup", "ToolbarSeparator"],
				imports: ["Toolbar", "ToolbarGroup", "ToolbarSeparator", "IconButton"],
				description:
					"A horizontal action bar with grouped controls and hairline separators.",
				usage: `<Toolbar>
  <ToolbarGroup>
    <IconButton label="Undo"><Undo2 /></IconButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup>
    <IconButton label="Bold"><Bold /></IconButton>
  </ToolbarGroup>
</Toolbar>`,
				anatomy: [
					{ part: "Toolbar", description: "The role=\"toolbar\" container holding all groups." },
					{ part: "ToolbarGroup", description: "A role=\"group\" cluster of related controls within the bar." },
					{ part: "ToolbarSeparator", description: "A decorative hairline between groups, hidden from assistive technology." },
				],
				dosDonts: {
					dos: [
						"Group related controls with ToolbarGroup and separate clusters with ToolbarSeparator.",
						"Label every icon-only control with IconButton's label prop.",
						"Keep the bar to one row of compact controls that act on one view.",
					],
					donts: [
						"Don't put page-level commit actions here; use an ActionBar.",
						"Don't use a toolbar as a general layout row.",
						"Don't nest toolbars inside each other.",
					],
				},
				related: ["toggle", "button", "floating-toolbar", "menubar"],
				examples: [
					{
						title: "Editor actions",
						description:
							'role="toolbar" with groups keeps related controls navigable.',
					},
				],
			},
			{
				id: "split-button",
				name: "Split Button",
				apiNames: ["SplitButton"],
				description:
					"A primary action joined to a menu of related alternatives.",
				usage: `<SplitButton
  label="Deploy"
  onClick={() => undefined}
  items={[{ id: 'staging', label: 'Deploy to staging', onSelect: () => undefined }]}
/>`,
				anatomy: [
					{ part: "Main action", description: "The button that fires the default action on click." },
					{ part: "Menu trigger", description: "The chevron button named by menuLabel (\"More actions\" by default)." },
					{ part: "Menu", description: "The list of alternative actions sharing the main action's context." },
				],
				dosDonts: {
					dos: [
						"Make the default the action most people want most of the time.",
						"Keep alternatives to a handful of close variants of the same action.",
						"Keep the main label short so the joined control stays on one line.",
					],
					donts: [
						"Don't put unrelated actions in the menu; use separate buttons or a plain Menu.",
						"Don't hide the only way to do something behind the chevron.",
					],
				},
				related: ["button", "menu", "button-group"],
				examples: [
					{
						title: "Default plus alternatives",
						description:
							"The main action fires directly; the chevron opens the related menu.",
					},
				],
			},
				{
					id: "action-bar",
					name: "Action Bar",
					apiNames: ["ActionBar"],
					description:
						"A horizontal bar for contextual page-level actions such as a sticky save/cancel bar at the bottom of an editing surface.",
					usage: `<ActionBar sticky label="Edit actions">
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Save changes</Button>
</ActionBar>`,
					anatomy: [
						{ part: "Region", description: "The labelled landmark (role=\"region\") wrapping the bar, named by the label prop." },
						{ part: "Actions", description: "The caller-supplied buttons aligned to the end of the bar." },
						{ part: "Sticky edge", description: "The optional sticky positioning that pins the bar to the top or bottom of its scroll container." },
					],
					dosDonts: {
						dos: [
							"Label the region so multiple landmarks stay distinguishable.",
							"Place the primary commit action last in the bar.",
							"Keep the bar to two or three actions that apply to the whole surface.",
						],
						donts: [
							"Don't use it for actions scoped to one field or card; place those inline.",
							"Don't stack more than one action bar on a page.",
						],
					},
					related: ["toolbar", "bulk-action-bar", "page-header"],
					examples: [
						{
							title: "Sticky bottom bar",
							description:
								"The default bottom-positioned bar stays pinned while the surrounding form scrolls, keeping commit actions reachable.",
						},
						{
							title: "Top bar",
							description:
								"Positioned above the content for toolbars whose actions scope everything below them.",
						},
					],
				},
				{
					id: "bulk-action-bar",
					name: "Bulk Action Bar",
					apiNames: ["BulkActionBar"],
					description:
						"A bar that appears when list or table rows are selected, announcing the selection count and offering bulk actions.",
					usage: `<BulkActionBar count={selected.length} onClear={clearSelection}>
  <Button variant="secondary" size="sm">Archive</Button>
  <Button variant="danger" size="sm">Delete</Button>
</BulkActionBar>`,
					anatomy: [
						{ part: "Count", description: "The selection total, announced politely through a live region as it changes." },
						{ part: "Actions", description: "The bulk operations applied to every selected row at once." },
						{ part: "Clear", description: "The control that resets the selection; the bar unmounts itself at zero." },
					],
					dosDonts: {
						dos: [
							"Offer only actions that are safe to apply to many rows at once.",
							"Pair destructive bulk actions with a confirmation step.",
							"Keep labels to two or three short words on narrow screens.",
						],
						donts: [
							"Don't render the bar with an empty selection; it handles that itself.",
							"Don't put row-specific navigation or links in the bar.",
						],
					},
					related: ["action-bar", "table", "checkbox"],
					examples: [
						{
							title: "Selection actions",
							description:
								"Shows the selected row count alongside destructive and neutral bulk actions with a clear button.",
						},
						{
							title: "Clearing the selection",
							description:
								"The bar unmounts itself when the count drops to zero, so the list returns to its idle state.",
						},
					],
				},
				{
					id: "floating-action-button",
					name: "Floating Action Button",
					apiNames: ["FloatingActionButton"],
					description:
						"A fixed-position primary action button for the single most important creation task on a screen.",
					usage: `<FloatingActionButton
  label="Create item"
  tooltip="Add a new item"
  position="bottom-right"
  onClick={createItem}
/>`,
					anatomy: [
						{ part: "Button", description: "The round, fixed-position button named by the required label prop." },
						{ part: "Icon", description: "The centered glyph, a plus by default, hidden from assistive technology." },
						{ part: "Tooltip", description: "The optional hover and focus hint defaulting to the label." },
						{ part: "Extended label", description: "The optional text that turns the round button into a labelled pill." },
					],
					dosDonts: {
						dos: [
							"Reserve it for the single most important creation action on a screen.",
							"Always provide label so the icon-only button has an accessible name.",
							"Use extendedLabel where space allows for extra clarity.",
						],
						donts: [
							"Don't use it for destructive or secondary actions.",
							"Don't show more than one floating action button per screen.",
							"Don't let it cover primary content; pick the corner that stays clear.",
						],
					},
					related: ["speed-dial", "action-bar", "button"],
					examples: [
						{
							title: "Round FAB with tooltip",
							description:
								"Icon-only button fixed to a viewport corner; the tooltip supplies the visible name on hover.",
						},
						{
							title: "Extended FAB",
							description:
								"An extendedLabel turns the round button into a pill with text for extra clarity.",
						},
					],
				},
				{
					id: "share-button",
					name: "Share Button",
					apiNames: ["ShareButton"],
					description:
						"A button that opens a small popover with a copy-link action and, where supported, the native share sheet.",
					usage: `<ShareButton
  url="https://example.com/report/42"
  title="Q3 report"
/>`,
					anatomy: [
						{ part: "Trigger", description: "The button that opens the share popover." },
						{ part: "Popover", description: "The small panel holding the copy-link action and, where supported, the native share action." },
						{ part: "Confirmation", description: "The swapped label plus a visually hidden live region announcing that the link was copied." },
					],
					dosDonts: {
						dos: [
							"Pass a canonical URL for the record rather than relying on the current page URL.",
							"Keep the title short; it is forwarded to the native share sheet.",
							"Let the native share action appear automatically where navigator.share exists.",
						],
						donts: [
							"Don't use it to duplicate content inside the app; add a dedicated duplicate action.",
							"Don't build custom copy feedback; the announced confirmation is built in.",
						],
					},
					related: ["popover", "button", "toast"],
					examples: [
						{
							title: "Copy link",
							description:
								"The popover copies the URL to the clipboard and confirms with a swapped label and live-region announcement.",
						},
						{
							title: "Native share fallback",
							description:
								"Where navigator.share exists a Share via action appears; elsewhere the popover quietly offers copy only.",
						},
					],
				},
				{
					id: "speed-dial",
					name: "Speed Dial",
					apiNames: ["SpeedDial", "SpeedDialAction"],
					description:
						"A floating button that expands into a fan of related creation actions with full keyboard support.",
					usage: `<SpeedDial label="Create actions" position="bottom-right">
  <SpeedDialAction label="New file" icon={<FilePlus />} />
  <SpeedDialAction label="New folder" icon={<FolderPlus />} />
</SpeedDial>`,
					anatomy: [
						{ part: "Trigger", description: "The floating button with aria-haspopup=\"menu\" that expands the fan." },
						{ part: "Menu", description: "The role=\"menu\" container whose orientation matches the fan direction." },
						{ part: "Actions", description: "SpeedDialAction items rendered as labelled menuitems, each with an icon and label." },
					],
					dosDonts: {
						dos: [
							"Keep the fan to three to six related creation actions.",
							"Choose the direction that fans into the page rather than off-screen.",
							"Give every action a short, distinct label.",
						],
						donts: [
							"Don't use a speed dial for a single action; a FloatingActionButton is faster.",
							"Don't mix destructive actions into a creation fan.",
						],
					},
					related: ["floating-action-button", "menu", "action-sheet"],
					examples: [
						{
							title: "Vertical fan",
							description:
								"The default dial expands upward from the bottom-right corner into a stack of labelled actions.",
						},
						{
							title: "Horizontal fan",
							description:
								"Direction left or right fans the actions out sideways, useful near screen edges.",
						},
					],
				},
		],
	},
	{
		name: "Forms",
		modules: [
			{
				id: "field",
				name: "Field",
				apiNames: ["Field", "Label"],
				imports: ["Field", "Input"],
				description:
					"A deep form seam that connects labels, descriptions, errors, and required state.",
				usage: `<Field label="Display name" description="Shown to other workspace members" required>
  <Input defaultValue="Avery Chen" />
</Field>`,
				anatomy: [
					{ part: "Label", description: "Visible label wired to the control with htmlFor; carries the required marker when required is set." },
					{ part: "Control", description: "The single child that receives the generated id, aria-describedby, and aria-invalid wiring." },
					{ part: "Description", description: "Optional help text linked to the control through aria-describedby." },
					{ part: "Error", description: "Validation message that marks the control aria-invalid and renders in error color." },
				],
				dosDonts: {
					dos: [
						"Wrap every free-standing control in a Field so labels and errors stay wired automatically.",
						"Write errors that say how to fix the value, not just that it is invalid.",
						"Keep descriptions to one sentence; move longer explanations to an Alert with appearance=\"callout\" or a help page.",
					],
					donts: [
						"Don't nest more than one control in a Field; use Fieldset for groups.",
						"Don't mark a field required visually without the required prop, or the attribute and marker drift apart.",
						"Don't clear the error while the value is still invalid; re-validate on change.",
					],
				},
				related: ["input", "fieldset", "form", "form-error-summary"],
				examples: [
					{
						title: "Label, description, and error",
						description:
							"Field wires the label, help text, and error message to the control inside it automatically.",
					},
					{
						title: "Choice controls",
						description:
							"Checkbox and Switch render the Field label instead of their own when nested inside one.",
					},
				],
			},
			{
				id: "input",
				name: "Input and TextArea",
				apiNames: ["Input", "TextArea"],
				description:
					"Native text controls with Teal sizing, invalid states, and forwarded refs.",
				usage: `<Input placeholder="Project name" />
<TextArea placeholder="Notes" rows={4} />`,
				anatomy: [
					{ part: "Control", description: "The native input or textarea element with Teal sizing, focus ring, and a forwarded ref." },
					{ part: "Placeholder", description: "A short hint that disappears on entry; never a substitute for a label." },
					{ part: "Invalid state", description: "Error styling applied through aria-invalid, either directly or from the surrounding Field." },
				],
				dosDonts: {
					dos: [
						"Set type, inputMode, and autoComplete to match the value, like email or tel.",
						"Wrap the control in a Field so the label and messages stay associated.",
						"Set rows on TextArea to roughly the expected answer length.",
					],
					donts: [
						"Don't use placeholder text as the only label.",
						"Don't disable a field the user must fix; show an error instead.",
						"Don't use free text for a constrained choice; use Select or RadioGroup.",
					],
				},
				related: ["field", "search-input", "autosize-textarea", "input-group"],
				examples: [
					{
						title: "States",
						description:
							"Default, invalid, and disabled inputs share the same sizing and focus treatment.",
					},
					{
						title: "Semantic types",
						description:
							"type, inputMode, and autoComplete steer the on-screen keyboard and autofill.",
					},
				],
			},
			{
				id: "select",
				name: "Select",
				apiNames: ["Select"],
				description:
					"An accessible single-value picker with keyboard navigation, typeahead, and collision-aware positioning.",
				usage: `<Select
  aria-label="Role"
  defaultValue="viewer"
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>`,
				anatomy: [
					{ part: "Trigger", description: "The button that shows the current value or placeholder and opens the listbox." },
					{ part: "Content", description: "The collision-aware listbox popup, sized to the trigger's measured width." },
					{ part: "Option", description: "A selectable row with a check indicator on the current value; disabled options are skipped." },
				],
				dosDonts: {
					dos: [
						"Order options predictably, such as alphabetically or most common first.",
						"Provide an aria-label when the select has no visible Field label.",
						"Keep option labels short so the trigger stays on one line.",
					],
					donts: [
						"Don't use Select for two or three options; use RadioGroup or ToggleGroup.",
						"Don't use it when typing should filter a long list; use Combobox.",
						"Don't hide critical context in the placeholder; it disappears once a value is chosen.",
					],
				},
				related: ["combobox", "radio-group", "multi-select"],
				examples: [
					{
						title: "Controlled selection",
						description:
							"Select is controlled through value and onValueChange with an options array.",
					},
					{
						title: "Placeholder and disabled option",
						description:
							"An uncontrolled select can show placeholder text, and individual options can be disabled.",
					},
				],
			},
			{
				id: "checkbox",
				name: "Checkbox",
				apiNames: ["Checkbox"],
				description:
					"Boolean and indeterminate selection with an integrated label and description.",
				usage: '<Checkbox label="Include archived projects" defaultChecked />',
				anatomy: [
					{ part: "Control", description: "The checkbox button holding checked, unchecked, or indeterminate state." },
					{ part: "Indicator", description: "The check or dash mark that mirrors the tri-state value." },
					{ part: "Label", description: "Clickable text wired to the control." },
					{ part: "Description", description: "Optional supporting text linked through aria-describedby." },
				],
				dosDonts: {
					dos: [
						"Use indeterminate for a select-all parent whose children are partially checked.",
						"Phrase labels as positive statements so checked always means yes.",
						"Use Checkbox for choices that are saved on submit, not applied instantly.",
					],
					donts: [
						"Don't use checkboxes for mutually exclusive options; use RadioGroup.",
						"Don't use one for a setting that applies immediately; use Switch.",
						"Don't put interactive content inside the label or description.",
					],
				},
				related: ["checkbox-card", "switch", "radio-group", "field"],
				examples: [
					{
						title: "Checked, indeterminate, and disabled",
						description:
							"Checkbox supports a tri-state checked prop for select-all patterns.",
					},
					{
						title: "Select-all parent",
						description:
							"A parent checkbox mirrors its children as checked, unchecked, or indeterminate and toggles them all.",
					},
				],
			},
			{
				id: "switch",
				name: "Switch",
				apiNames: ["Switch"],
				description:
					"An immediate boolean setting with explicit labeling and controlled or uncontrolled state.",
				usage:
					'<Switch label="Security notifications" description="High-risk account activity" defaultChecked />',
				anatomy: [
					{ part: "Track", description: "The pill that tints with the checked state." },
					{ part: "Thumb", description: "The knob that slides between the off and on ends of the track." },
					{ part: "Label", description: "Text wired to the control so clicking it toggles the setting." },
					{ part: "Description", description: "Optional supporting text linked through aria-describedby." },
				],
				dosDonts: {
					dos: [
						"Use switches for settings that take effect the moment they change.",
						"Name the setting, not the action, so on and off stay unambiguous.",
						"Keep the description to one line explaining the effect.",
					],
					donts: [
						"Don't use a switch inside a form that submits several values together; use Checkbox.",
						"Don't gate a switch behind a separate Save button.",
						"Don't use one for hard-to-reverse actions without a confirmation step.",
					],
				},
				related: ["checkbox", "toggle", "field"],
				examples: [
					{
						title: "Settings",
						description:
							"Switches apply immediately, so label them as settings rather than form fields.",
					},
					{
						title: "Dependent settings",
						description:
							"A secondary switch disables itself while its prerequisite setting is off.",
					},
				],
			},
			{
				id: "radio-group",
				name: "Radio Group",
				apiNames: ["RadioGroup"],
				description:
					"A single-choice option set with an integrated label, description, and subtle borders.",
				usage: `<RadioGroup
  label="Home region"
  defaultValue="eu"
  options={[
    { value: 'eu', label: 'Europe (Frankfurt)' },
    { value: 'us', label: 'United States (Virginia)' },
  ]}
/>`,
				anatomy: [
					{ part: "Group label", description: "The legend-style label wired to the group through aria-labelledby." },
					{ part: "Item control", description: "The circular radio that fills when its option is selected." },
					{ part: "Item label", description: "Clickable text naming each option." },
					{ part: "Item description", description: "Optional per-option supporting text." },
				],
				dosDonts: {
					dos: [
						"Set a defaultValue so exactly one option is always selected.",
						"Keep the set to about two to five options so every choice stays visible.",
						"Use per-option descriptions when the choices need explanation.",
					],
					donts: [
						"Don't use radios for long or filterable lists; use Select or Combobox.",
						"Don't leave all options unselected to imply a none state; add an explicit option.",
						"Don't switch to horizontal orientation when labels would wrap.",
					],
				},
				related: ["radio-card", "select", "checkbox", "toggle-group"],
				examples: [
					{
						title: "Single choice",
						description:
							"Keyboard arrows move and select within the group following the roving-focus pattern.",
					},
					{
						title: "Horizontal options",
						description:
							"A horizontal orientation suits short labels like digest frequencies.",
					},
				],
			},
			{
				id: "slider",
				name: "Slider",
				apiNames: ["Slider"],
				description:
					"A numeric value scrubber with an optional live value readout; range mode adds a second thumb for low/high pairs.",
				usage:
					'<Slider label="Notification volume" defaultValue={60} showValue />',
				anatomy: [
					{ part: "Track", description: "The rail that spans the full range." },
					{ part: "Range", description: "The filled portion from the minimum up to the thumb." },
					{ part: "Thumb", description: "The draggable handle exposing slider semantics and value attributes." },
					{ part: "Value readout", description: "Optional live text mirror of the value, enabled with showValue." },
				],
				dosDonts: {
					dos: [
						"Enable showValue when the exact number matters.",
						"Constrain the slider width in the layout so the track stays scannable.",
						"Pick min, max, and step that match meaningful stops for the value.",
					],
					donts: [
						"Don't use a slider for precise entry; pair it with or use NumberInput.",
						"Don't use one for unbounded values; sliders need a known range.",
						"Don't rely on track color alone to carry meaning.",
					],
				},
				related: ["number-input", "rating", "meter"],
				examples: [
					{
						title: "Value selection",
						description:
							"Pointer and keyboard both adjust the value; showValue mirrors it as text.",
					},
					{
						title: "Description and disabled",
						description:
							"A described quota slider beside a disabled one that keeps its layout.",
					},
					{
						title: "Range selection",
						description:
							"range adds a second thumb for a low/high pair; thumbLabels give each end an accessible name.",
					},
				],
			},
			{
				id: "search-input",
				name: "Search Input",
				apiNames: ["SearchInput"],
				description:
					"A text field with a leading search affordance, clear action, and loading state.",
				usage:
					'<SearchInput label="Search projects" placeholder="Name or owner…" />',
				anatomy: [
					{ part: "Leading icon", description: "The decorative search glyph pinned inside the field." },
					{ part: "Input", description: "The native text field that owns the query." },
					{ part: "Clear button", description: "A labeled action that appears once the field has a value and resets it." },
					{ part: "Loading spinner", description: "Replaces the clear button while results load." },
				],
				dosDonts: {
					dos: [
						"Handle onClear and reset the caller-owned value when the clear action fires.",
						"Use the loading state while fetching so typing stays uninterrupted.",
						"Write placeholders as examples, like Name or owner….",
					],
					donts: [
						"Don't use SearchInput for general text entry; use Input.",
						"Don't navigate on every keystroke without debouncing the query.",
						"Don't keep the spinner on after results arrive; it hides the clear action.",
					],
				},
				related: ["input", "combobox", "search-overlay", "command"],
				examples: [
					{
						title: "Clearable search",
						description:
							"The clear button appears once the field has a value; loading swaps in a spinner.",
					},
					{
						title: "Filled, loading, and disabled",
						description:
							"The clear action shows on filled fields, swaps for a spinner while loading, and disappears when disabled.",
					},
				],
			},
			{
				id: "combobox",
				name: "Combobox",
				apiNames: ["Combobox"],
				description:
					"A filterable single-value picker combining free text with a suggestion list.",
				usage: `<Combobox
  label="Assignee"
  options={[
    { value: 'avery', label: 'Avery Chen' },
    { value: 'morgan', label: 'Morgan Reyes' },
  ]}
/>`,
				anatomy: [
					{ part: "Input", description: "The text field with combobox semantics that filters the list as you type." },
					{ part: "Listbox", description: "The suggestion popup matched to the field width." },
					{ part: "Option", description: "A filterable row with a check mark on the selected value." },
					{ part: "Empty message", description: "The text shown when no option matches the filter." },
				],
				dosDonts: {
					dos: [
						"Use Combobox when the list is long enough to need filtering.",
						"Write an emptyMessage that suggests what to try next.",
						"Keep the committed value readable as the input text.",
					],
					donts: [
						"Don't use it for short lists; use Select.",
						"Don't treat unmatched text as a value; use TagsInput for free entry.",
						"Don't clear the current value on Escape; it should restore, not wipe.",
					],
				},
				related: ["select", "multi-select", "mention-input", "input"],
				examples: [
					{
						title: "Filter and select",
						description:
							"Type to filter, arrows to highlight, Enter to select; Escape keeps the current value.",
					},
					{
						title: "Filter with empty state",
						description:
							"A project picker with a disabled option and a custom message when nothing matches.",
					},
				],
			},
			{
				id: "multi-select",
				name: "Multi Select",
				apiNames: ["MultiSelect"],
				description:
					"A filterable picker for several values, shown as removable pills.",
				usage: `<MultiSelect
  label="Project roles"
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>`,
				anatomy: [
					{ part: "Control", description: "The combobox-role trigger that hosts the selected pills." },
					{ part: "Pills", description: "Removable tokens, one per value, each with its own labeled remove button." },
					{ part: "Filter field", description: "The inline text input inside the open popup." },
					{ part: "Listbox", description: "The multi-selectable option list with check marks on chosen rows." },
				],
				dosDonts: {
					dos: [
						"Show every selected value as a pill so removal stays one click away.",
						"Let the pill row wrap instead of truncating selections.",
						"Keep the popup open between picks so multi-selection stays fast.",
					],
					donts: [
						"Don't use it when only one value is allowed; use Select or Combobox.",
						"Don't collapse selections into a +N summary; the pills are the value.",
						"Don't disable the whole control when only some options are unavailable.",
					],
				},
				related: ["combobox", "tags-input", "select", "transfer-list"],
				examples: [
					{
						title: "Multiple values",
						description:
							"Options toggle without closing; pills remove individual values.",
					},
					{
						title: "Filtering a label set",
						description:
							"A filterable label picker with a caller-owned value and one unavailable option.",
					},
				],
			},
			{
				id: "date-picker",
				name: "Date Picker",
				apiNames: ["DatePicker"],
				description:
					"A date field with a keyboard-navigable popover: day, month, year, or datetime modes, plus two-click range selection.",
				usage:
					'<DatePicker label="Start date" onValueChange={(date) => undefined} />',
				anatomy: [
					{ part: "Field", description: "The button-like input showing the formatted date." },
					{ part: "Calendar popover", description: "The month grid with full keyboard navigation." },
					{ part: "Month navigation", description: "Previous and next buttons around an announced month label." },
					{ part: "Day cells", description: "Grid buttons bounded by the min and max dates." },
				],
				dosDonts: {
					dos: [
						"Set minDate and maxDate when only a planning window is valid.",
						"Explain what the date drives, like a milestone, in the description.",
						"Keep the caller-owned value as a Date, not a string.",
					],
					donts: [
						"Don't stack two pickers for a range; set selection=\"range\".",
						"Don't expect free-typed input; the calendar is the parser.",
						"Don't disable dates silently; state the valid window in the description.",
					],
				},
				related: ["calendar", "time-picker"],
				examples: [
					{
						title: "Calendar selection",
						description:
							"Arrows move between days, Enter selects, min and max bound the range.",
					},
					{
						title: "Bounded planning window",
						description:
							"minDate and maxDate limit picking to the current sprint window.",
					},
					{
						title: "Month mode",
						description:
							'mode="month" shows twelve months with a year stepper and commits the first of the chosen month.',
					},
					{
						title: "Year mode",
						description:
							'mode="year" pages years by decade and commits January 1 of the chosen year.',
					},
					{
						title: "Date and time",
						description:
							'mode="datetime" pairs the day grid with time fields; the popover stays open until Done.',
					},
					{
						title: "Range selection",
						description:
							'selection="range" turns two clicks into {from, to}, with presets and a connected band between the endpoints.',
					},
				],
			},
			{
				id: "number-input",
				name: "Number Input",
				apiNames: ["NumberInput"],
				description:
					"A numeric field with stepper buttons and min/max clamping.",
				usage:
					'<NumberInput label="Seats" defaultValue={4} min={1} max={12} />',
				anatomy: [
					{ part: "Input", description: "The numeric text field that re-clamps to the bounds on blur." },
					{ part: "Steppers", description: "Increment and decrement buttons that step the value and disable at min and max." },
				],
				dosDonts: {
					dos: [
						"Set min and max so clamping matches the business rule.",
						"Choose a step that matches how people think, like 5 for story points.",
						"Treat an empty field as undefined in the caller, not as zero.",
					],
					donts: [
						"Don't use it for identifiers like codes or phone numbers; use Input.",
						"Don't use it when the value needs currency formatting; use CurrencyInput.",
						"Don't hide the bounds; state them in the description.",
					],
				},
				related: ["currency-input", "slider", "input", "meter"],
				examples: [
					{
						title: "Steppers and bounds",
						description:
							"Steppers disable at the bounds; typing re-clamps on blur.",
					},
					{
						title: "Custom step",
						description:
							"A step of 5 with 0–100 bounds for story-point entry.",
					},
				],
			},
			{
				id: "password-input",
				name: "Password Input",
				apiNames: ["PasswordInput"],
				description: "A secret field with an accessible visibility toggle.",
				usage: '<PasswordInput label="Password" />',
				anatomy: [
					{ part: "Input", description: "The secret field rendered with type password." },
					{ part: "Visibility toggle", description: "The eye button that flips the field type and reports its state through aria-pressed." },
				],
				dosDonts: {
					dos: [
						"Set autoComplete to new-password or current-password so password managers fill correctly.",
						"State the requirements in the description, not only after a failed submit.",
						"Pair new-password fields with PasswordStrengthMeter when strength matters.",
					],
					donts: [
						"Don't reveal the password by default.",
						"Don't block paste; password managers depend on it.",
						"Don't use it for non-sensitive masked text; masking here is about secrecy.",
					],
				},
				related: ["password-strength-meter", "input", "pin-input", "form"],
				examples: [
					{
						title: "Visibility toggle",
						description:
							"The eye button exposes its state through aria-pressed.",
					},
					{
						title: "Current password",
						description:
							"The current-password autocomplete variant used in security settings flows.",
					},
				],
			},
			{
				id: "file-upload",
				name: "File Upload",
				apiNames: ["FileUpload"],
				description:
					"A drag-and-drop zone with a browse action and a removable file list.",
				usage:
					'<FileUpload label="Attachments" multiple onFilesAdded={(files) => undefined} />',
				anatomy: [
					{ part: "Drop zone", description: "The drag target that highlights on drag-over and holds the browse action." },
					{ part: "Browse action", description: "The explicit button that opens the file picker without drag-and-drop." },
					{ part: "File list", description: "Rows with the name, size, and a remove action per file." },
				],
				dosDonts: {
					dos: [
						"State accepted types and size limits in the description.",
						"Mirror the caller-owned value so removals stay in sync.",
						"Use accept to narrow the picker, then validate again on the server.",
					],
					donts: [
						"Don't auto-upload on selection without telling the user.",
						"Don't use it for a single text reference; use Input.",
						"Don't swallow rejected files silently; surface why a file was refused.",
					],
				},
				related: ["upload-progress", "input", "field", "form"],
				examples: [
					{
						title: "Drop or browse",
						description:
							"Drag-over highlights the zone; files list with sizes and remove actions.",
					},
					{
						title: "Multiple attachments",
						description:
							"A controlled multi-file zone seeded with an existing file and a removal action.",
					},
				],
			},
			{
				id: "pin-input",
				name: "PIN Input",
				apiNames: ["PinInput"],
				description:
					"A segmented one-time code field with per-cell navigation, paste support, and masking.",
				usage: `<PinInput label="Verification code" length={6} onComplete={(code) => undefined} />`,
				anatomy: [
					{ part: "Group", description: "The labeled container with group semantics wrapping the cells." },
					{ part: "Cells", description: "One single-character input per digit, each labeled by its position." },
				],
				dosDonts: {
					dos: [
						"Set length to the code your service actually issues.",
						"Handle onComplete to submit as soon as the last digit lands.",
						"Use masked for PINs that should not linger on screen.",
					],
					donts: [
						"Don't use it for free-form codes; use Input.",
						"Don't split long secrets into cells; keep it for short numeric codes.",
						"Don't rely on per-cell placeholders as labels; each cell is already labeled by position.",
					],
				},
				related: ["password-input", "input", "form"],
				examples: [
					{
						title: "One-time code",
						description:
							"Typing advances to the next cell, Backspace retreats, and paste fills from the focused cell.",
					},
					{
						title: "Masked PIN",
						description:
							"A four-digit masked entry for codes that should stay hidden.",
					},
				],
			},
			{
				id: "tags-input",
				name: "Tags Input",
				apiNames: ["TagsInput"],
				description:
					"A token entry field that turns typed text into removable chips.",
				usage: `const [tags, setTags] = useState(['design'])

<TagsInput label="Add label" value={tags} onChange={setTags} placeholder="Add a label…" />`,
				anatomy: [
					{ part: "Field", description: "The container hosting the committed chips and the draft input." },
					{ part: "Chips", description: "Committed tokens with individual remove actions." },
					{ part: "Draft input", description: "The inline text field where the next tag is typed." },
				],
				dosDonts: {
					dos: [
						"Commit on Enter and comma so both habits work.",
						"Set max when the backend caps the list, and say so nearby.",
						"Keep tokens to one or two words so chips stay scannable.",
					],
					donts: [
						"Don't use it for a fixed option set; use MultiSelect.",
						"Don't commit empty or whitespace-only tags.",
						"Don't expect fuzzy dedupe; exact duplicates are ignored, so normalize case before commit if needed.",
					],
				},
				related: ["multi-select", "chip", "input", "combobox"],
				examples: [
					{
						title: "Token entry",
						description:
							"Enter or comma commits a tag; Backspace on an empty draft removes the last one.",
					},
					{
						title: "Capped list",
						description:
							"max limits the reviewer list to three entries and the cap is stated nearby.",
					},
				],
			},
			{
				id: "input-group",
				name: "Input Group",
				apiNames: ["InputGroup", "InputAddon"],
				imports: ["InputGroup", "InputAddon", "Input"],
				description:
					"An input joined with leading or trailing addons such as protocols and units.",
				usage: `<InputGroup>
  <InputAddon position="leading">https://</InputAddon>
  <Input aria-label="Domain" placeholder="workspace.example" />
</InputGroup>`,
				anatomy: [
					{ part: "Group", description: "The wrapper that owns the border and focus ring so the box reads as one control." },
					{ part: "Addon", description: "Fixed leading or trailing content such as a protocol or unit." },
					{ part: "Input", description: "The flexing field whose joined corners square automatically." },
				],
				dosDonts: {
					dos: [
						"Use addons for static text like https://, units, or currency codes.",
						"Give the input an aria-label, since addon text is presentational context.",
						"Keep addon text to a few characters so the field keeps most of the width.",
					],
					donts: [
						"Don't put interactive controls in an addon; compose separate controls instead.",
						"Don't use an addon as a substitute for a real label.",
						"Don't join more than one input into a group.",
					],
				},
				related: ["input", "currency-input", "phone-input", "field"],
				examples: [
					{
						title: "Addons",
						description:
							"The group squares the joined input corners automatically on the attached side.",
					},
					{
						title: "Trailing units",
						description:
							"Trailing addons carry units like GB or USD/h beside the value.",
					},
				],
			},
			{
				id: "editable",
				name: "Editable",
				apiNames: ["Editable"],
				description:
					"Click-to-edit text that commits on Enter or blur and cancels with Escape.",
				usage: `<Editable label="Project name" defaultValue="Orion" onSubmit={(value) => undefined} />`,
				anatomy: [
					{ part: "Preview", description: "The button that shows the current value and starts editing on activation." },
					{ part: "Edit input", description: "The autofocused field with the current draft preselected." },
					{ part: "Edit affordance", description: "The labeled edit button with a pencil icon marking the value as changeable." },
				],
				dosDonts: {
					dos: [
						"Use Editable for single values renamed in place, like project titles.",
						"Commit on Enter and blur so keyboard and pointer flows both save.",
						"Show a placeholder so empty values stay discoverable.",
					],
					donts: [
						"Don't use it inside multi-field forms; use Field and Input.",
						"Don't validate on cancel; Escape always restores the committed value.",
						"Don't hide the edit affordance; the pencil communicates interactivity.",
					],
				},
				related: ["input", "field", "form"],
				examples: [
					{
						title: "Inline rename",
						description:
							"Preview stays a button; editing autofocuses and selects the draft.",
					},
					{
						title: "Empty value",
						description:
							"A placeholder keeps an empty value discoverable and inviting.",
					},
				],
			},
			{
				id: "time-picker",
				name: "Time Picker",
				apiNames: ["TimePicker"],
				description:
					"A segmented hour and minute field with 12- and 24-hour cycles.",
				usage: `<TimePicker label="Start time" defaultValue="09:30" onChange={(value) => undefined} />`,
				anatomy: [
					{ part: "Group", description: "The labeled container with group semantics around the segments." },
					{ part: "Hour field", description: "The clamped hour segment labeled Hour." },
					{ part: "Minute field", description: "The clamped minute segment labeled Minutes." },
					{ part: "Period toggle", description: "The AM/PM switch shown with the 12-hour cycle." },
				],
				dosDonts: {
					dos: [
						"Match hourCycle to the audience's locale.",
						"Bind a string value like 09:30 and let the segments clamp while typing.",
						"Pair with DatePicker; its datetime mode covers full timestamps.",
					],
					donts: [
						"Don't use it for durations; use NumberInput with a unit.",
						"Don't use it for time zones; pair with TimezoneSelect.",
						"Don't prefill the current time unless now is a sensible default.",
					],
				},
				related: ["date-picker", "timezone-select", "number-input"],
				examples: [
					{
						title: "Segmented time",
						description:
							"Fields clamp as you type; the 12-hour cycle adds an AM/PM toggle.",
					},
					{
						title: "12-hour clock",
						description:
							"hourCycle={12} swaps the hour range and adds an AM/PM toggle.",
					},
				],
			},
			{
				id: "color-picker",
				name: "Color Picker",
				apiNames: ["ColorPicker"],
				description:
					"A swatch trigger with preset colors and a validated hex field.",
				usage: `<ColorPicker label="Brand color" defaultValue="#006a6c" onChange={(value) => undefined} />`,
				anatomy: [
					{ part: "Trigger", description: "The swatch button that shows the current color and opens the panel." },
					{ part: "Preset grid", description: "Named swatches that commit immediately on activation." },
					{ part: "Hex field", description: "The validated input that normalizes #rgb and #rrggbb on Enter or blur." },
				],
				dosDonts: {
					dos: [
						"Name presets so each choice is announced by more than its color.",
						"Curate presets to the palette users should actually pick from.",
						"Accept typed hex when brand precision matters.",
					],
					donts: [
						"Don't use it as a theme editor; it is a single-value picker.",
						"Don't rely on the swatch alone; keep the value text visible for verification.",
						"Don't reject shorthand hex; normalize it instead of erroring.",
					],
				},
				related: ["input", "popover", "field"],
				examples: [
					{
						title: "Presets and hex",
						description:
							"Presets commit immediately; the hex field normalizes #rgb and #rrggbb on Enter or blur.",
					},
					{
						title: "Live preview",
						description:
							"A controlled value mirrored on a swatch so the picked color previews in context.",
					},
				],
			},
				{
					id: "autosize-textarea",
					name: "Autosize Textarea",
					apiNames: ["AutosizeTextarea"],
					description:
						"A textarea that grows and shrinks with its content, capped by a maximum row count.",
					usage: `<AutosizeTextarea
  label="Bio"
  minRows={2}
  maxRows={6}
  placeholder="Tell us about yourself"
/>`,
					anatomy: [
						{ part: "Label", description: "The visible label associated with the textarea, wired to any description or error text." },
						{ part: "Textarea", description: "The native textarea whose height tracks scrollHeight on every edit, clamped between minRows and maxRows." },
						{ part: "Help or error text", description: "Optional description or validation message linked to the field with aria-describedby." },
					],
					dosDonts: {
						dos: [
							"Set minRows so the empty field hints at the expected entry length.",
							"Set maxRows on fields that can grow long, so the form below is not pushed down.",
							"Pair with Field when the entry needs validation messages.",
						],
						donts: [
							"Don't use it when the layout needs a fixed, user-resizable field; use TextArea instead.",
							"Don't leave maxRows unset on comment or log-style inputs with unbounded length.",
						],
					},
					related: ["input", "field", "mention-input"],
					examples: [
						{
							title: "Grow with content",
							description:
								"The height tracks scrollHeight on every edit, so the field never clips short notes or wastes space on long ones.",
						},
						{
							title: "Capped growth",
							description:
								"maxRows stops the growth and switches to scrolling, keeping long entries from pushing the form down.",
						},
					],
				},
				{
					id: "checkbox-card",
					name: "Checkbox Card",
					apiNames: ["CheckboxCard"],
					description:
						"A checkbox rendered as a selectable card with a title, description, and optional icon; works standalone or stacked in groups.",
					usage: `<CheckboxCard
  title="Email digest"
  description="A weekly summary of activity"
  defaultChecked
  onCheckedChange={(checked) => console.log(checked)}
/>`,
					anatomy: [
						{ part: "Card", description: "A button with checkbox semantics (role and aria-checked) that owns the whole click target." },
						{ part: "Check indicator", description: "A decorative corner check that mirrors the state; assistive technology reads aria-checked instead." },
						{ part: "Title", description: "The card's accessible name and primary label." },
						{ part: "Description and icon", description: "Supporting text and an optional icon that explain what the toggle does." },
					],
					dosDonts: {
						dos: [
							"Give every card a specific title that states what turns on or off.",
							"Stack related opt-ins, such as notification channels, as a group of cards.",
							"Keep unavailable options visible but disabled.",
						],
						donts: [
							"Don't use cards for mutually exclusive choices; use RadioCard.",
							"Don't use a card when a plain Checkbox with a label says enough.",
						],
					},
					related: ["checkbox", "radio-card", "switch"],
					examples: [
						{
							title: "Standalone card",
							description:
								"One self-contained toggle with a visible check indicator in the corner.",
						},
						{
							title: "Stacked group",
							description:
								"Several independent cards, including icons and a disabled unavailable option.",
						},
					],
				},
				{
					id: "currency-input",
					name: "Currency Input",
					apiNames: ["CurrencyInput"],
					description:
						"A numeric amount field with a leading currency symbol that formats the value with Intl.NumberFormat on blur.",
					usage: `<CurrencyInput
  label="Invoice total"
  currency="USD"
  locale="en-US"
  defaultValue={1234.5}
  onChange={(amount) => console.log(amount)}
/>`,
					anatomy: [
						{ part: "Label", description: "The visible label associated with the amount field." },
						{ part: "Currency symbol", description: "A fixed-width leading addon derived from the currency code; decorative and hidden from assistive technology." },
						{ part: "Amount input", description: "A decimal text field that emits the parsed number and reformats with Intl.NumberFormat on blur." },
						{ part: "Help or error text", description: "Optional description, for example the min and max limits, linked with aria-describedby." },
					],
					dosDonts: {
						dos: [
							"Set the currency and locale from the user's account, not the server's location.",
							"Clamp with min and max when a budget or limit exists, and say so in the description.",
							"Store the emitted number, not the formatted display string.",
						],
						donts: [
							"Don't use it for values without a currency; use NumberInput.",
							"Don't use one field for multi-currency entry; pair a currency Select with the amount.",
						],
					},
					related: ["number-input", "masked-input", "input-group"],
					examples: [
						{
							title: "Currency and locale",
							description:
								"The symbol and fraction digits follow the currency code, while grouping and separators follow the locale.",
						},
						{
							title: "Clamped budget",
							description:
								"min and max clamp the committed amount on blur, and a description explains the limits.",
						},
					],
				},
				{
					id: "fieldset",
					name: "Fieldset",
					apiNames: ["Fieldset"],
					imports: ["Fieldset", "Field", "Input"],
					description:
						"A semantic fieldset/legend group for related fields, with optional help text linked to the whole group.",
					usage: `<Fieldset legend="Shipping address">
  <Field label="Street" required>
    <Input />
  </Field>
</Fieldset>`,
					anatomy: [
						{ part: "Fieldset", description: "The native grouping element; setting disabled on it disables every control inside." },
						{ part: "Legend", description: "Names the group so screen readers announce it when focus enters any field." },
						{ part: "Description", description: "Optional help text for the whole group, linked with aria-describedby." },
						{ part: "Children", description: "The related Fields or controls, laid out in a single-column grid by default." },
					],
					dosDonts: {
						dos: [
							"Group controls that together answer one question, like an address block.",
							"Keep the legend short; it is repeated before every field inside.",
							"Nest Field components inside so labels and errors still work per control.",
						],
						donts: [
							"Don't wrap a single control in a Fieldset; Field alone is enough.",
							"Don't use Fieldset as a visual card for unrelated content; use Card.",
						],
					},
					related: ["field", "form", "card"],
					examples: [
						{
							title: "Grouping fields",
							description:
								"Related Fields sit under one legend so the group is announced as a unit.",
						},
						{
							title: "Group description",
							description:
								"Help text below the legend is linked to the fieldset with aria-describedby.",
						},
					],
				},
				{
					id: "form",
					name: "Form",
					apiNames: ["Form"],
					imports: ["Form", "Field", "Input", "Button"],
					description:
						"A lightweight form wrapper that collects field values on submit and shares an error map through context, with no form library.",
					usage: `<Form
  errors={{ email: 'Use your work email' }}
  onSubmit={(values) => console.log(values)}
>
  <Field label="Work email" required>
    <Input name="email" type="email" />
  </Field>
  <Button type="submit" variant="primary">Save</Button>
</Form>`,
					anatomy: [
						{ part: "Form element", description: "A semantic form that prevents the default navigation and collects named values with FormData on submit." },
						{ part: "Error context", description: "The errors map shared with descendants, read through useFormFieldError without prop drilling." },
						{ part: "Fields and controls", description: "Named inputs whose values arrive in the onSubmit payload; repeated names become arrays." },
						{ part: "Actions", description: "Submit and reset buttons supplied by the caller." },
					],
					dosDonts: {
						dos: [
							"Give every collected control a name attribute; unnamed controls are skipped.",
							"Render server errors next to their fields, and add a FormErrorSummary for long forms.",
							"Put the submit Button inside the Form so Enter submission works.",
						],
						donts: [
							"Don't reach for it when you need async per-field validation or dependent fields; adopt a form library.",
							"Don't duplicate the errors map into local state; pass it straight to the errors prop.",
						],
					},
					related: ["field", "fieldset", "form-error-summary"],
					examples: [
						{
							title: "Submitting values",
							description:
								"onSubmit receives every named field value collected with FormData; the default page navigation is prevented.",
						},
						{
							title: "Server error map",
							description:
								"The errors prop is exposed through context so descendants can render per-field messages without prop drilling.",
						},
					],
				},
				{
					id: "form-error-summary",
					name: "Form Error Summary",
					apiNames: ["FormErrorSummary"],
					description:
						"A top-of-form alert that lists validation errors as anchor links which focus the offending field.",
					usage: `<FormErrorSummary
  errors={[
    { fieldId: "email", label: "Email", message: "Enter a valid email address." },
  ]}
/>`,
					anatomy: [
						{ part: "Alert container", description: "A role=alert region, so new validation failures are announced as soon as it renders." },
						{ part: "Heading", description: "A customizable title summarizing the failure count or context." },
						{ part: "Error list", description: "Anchor links, one per error, whose targets are the offending field ids." },
						{ part: "Icon", description: "A decorative alert icon; the message text carries the meaning." },
					],
					dosDonts: {
						dos: [
							"Place it at the top of the form and move focus there after a failed submit.",
							"Keep each link's message identical to the error shown at its field.",
							"Pass real field ids so activating a link focuses the control.",
						],
						donts: [
							"Don't render it for a single inline error; the field message is enough.",
							"Don't link to fields that are hidden or disabled on the current step.",
						],
					},
					related: ["form", "field", "alert"],
					examples: [
						{
							title: "Multiple field errors",
							description:
								"Each error becomes a link whose target is the field id, so activating it moves focus straight to the control.",
						},
						{
							title: "Single error with custom title",
							description:
								"The heading can be tailored to the error count or form context while the linking behavior stays the same.",
						},
					],
				},
				{
					id: "masked-input",
					name: "Masked Input",
					apiNames: ["MaskedInput"],
					description:
						"A text field that enforces a simple digit mask, inserting separators automatically as the user types.",
					usage: `<MaskedInput
  label="Date"
  mask="##/##/####"
  onChange={(value) => console.log(value)}
/>`,
					anatomy: [
						{ part: "Label", description: "The visible label associated with the field." },
						{ part: "Masked input", description: "A text field that accepts digits for # slots, inserts literal separators automatically, and keeps the caret after the last filled slot." },
						{ part: "Mask placeholder", description: "The mask itself renders as the placeholder, so the expected shape is visible before typing." },
						{ part: "Help or error text", description: "Optional description documenting the expected format, linked with aria-describedby." },
					],
					dosDonts: {
						dos: [
							"Use it for fixed digit-count formats like dates, card expiries, or US phone numbers.",
							"Add a description when the format is ambiguous across regions, such as day-first dates.",
							"Validate the completed value on submit; the mask only enforces shape.",
						],
						donts: [
							"Don't use it for formats with letters or variable length; the mask only handles digits.",
							"Don't use it for international phone numbers; use PhoneInput instead.",
						],
					},
					related: ["input", "phone-input", "pin-input"],
					examples: [
						{
							title: "Date and expiry masks",
							description:
								"'#' marks a digit slot and every other character is a literal; the mask itself is the placeholder.",
						},
						{
							title: "Phone and ZIP masks",
							description:
								"Longer regional formats work the same way, and a description can document the expected shape.",
						},
					],
				},
				{
					id: "mention-input",
					name: "Mention Input",
					apiNames: ["MentionInput"],
					description:
						"A textarea with @-mention autocomplete that inserts chosen people as plain text tokens.",
					usage: `<MentionInput
  label="Comment"
  placeholder="Type @ to mention a teammate…"
  options={[{ value: 'ada', label: 'Ada Lovelace' }]}
  onMentionSelect={(option) => undefined}
/>`,
					anatomy: [
						{ part: "Label", description: "The visible label associated with the textarea." },
						{ part: "Textarea", description: "A plain multi-line field that keeps focus while the popup is open, with aria-autocomplete list." },
						{ part: "Mention popup", description: "A listbox of options filtered by the query after an @ that starts a new token." },
						{ part: "Inserted mention", description: "Plain @Label text at the caret, so drafts round-trip through any storage." },
					],
					dosDonts: {
						dos: [
							"Feed options from the people or records directory of the current context.",
							"Use onMentionSelect to record the chosen id alongside the plain text.",
							"Keep option labels as display names people recognize.",
						],
						donts: [
							"Don't use it when mentions must stay structured or deletable as chips; that needs a tokenized editor.",
							"Don't dump hundreds of options in the popup; filter server-side for large directories.",
						],
					},
					related: ["autosize-textarea", "combobox", "input"],
					examples: [
						{
							title: "Mention autocomplete",
							description:
								"Typing @ opens the popup; the query filters options and Enter inserts the highlighted person.",
						},
						{
							title: "Prefilled conversation",
							description:
								"Existing mentions are plain text, so drafts round-trip through any storage without a rich text format.",
						},
					],
				},
				{
					id: "password-strength-meter",
					name: "Password Strength Meter",
					apiNames: ["PasswordStrengthMeter"],
					description:
						"A progressbar-style meter that visualizes password strength from a caller-supplied or built-in score.",
					usage: `<PasswordStrengthMeter
  password={password}
  score={(value) => zxcvbn(value).score}
/>`,
					anatomy: [
						{ part: "Label row", description: "The meter label and the current strength band text, spaced apart on one row." },
						{ part: "Meter track", description: "A progressbar with aria-valuemin 0, aria-valuemax 4, and the band name as aria-valuetext." },
						{ part: "Fill", description: "The colored portion reflecting the clamped 0–4 score; never the only signal, since the band is also text." },
					],
					dosDonts: {
						dos: [
							"Place it directly under the PasswordInput it scores and pass the live password value.",
							"Supply a real estimator such as zxcvbn through the score prop for sign-up flows.",
							"Keep the visible band text on; hide it only when space is truly constrained.",
						],
						donts: [
							"Don't use the meter as the only statement of password requirements; list the rules too.",
							"Don't block submission on the meter alone; enforce policy server-side.",
						],
					},
					related: ["password-input", "meter", "form"],
					examples: [
						{
							title: "Default heuristic",
							description:
								"The built-in scorer rewards length and character variety, mapping passwords onto five labeled bands.",
						},
						{
							title: "Custom scorer",
							description:
								"Bring your own scoring function (for example zxcvbn) or hide the visible text while keeping the accessible value.",
						},
					],
				},
				{
					id: "phone-input",
					name: "Phone Input",
					apiNames: ["PhoneInput"],
					description:
						"A country calling-code dropdown paired with a national number field that emits an E.164-ish string.",
					usage: `<PhoneInput
  label="Phone number"
  defaultValue="+14155552671"
  onChange={(value) => console.log(value)}
/>`,
					anatomy: [
						{ part: "Country dropdown", description: "A select of curated calling codes with its own accessible name, preceding the number field in tab order." },
						{ part: "Number field", description: "A type=tel input that strips non-digits and emits +dial plus national number on every edit." },
						{ part: "Label", description: "The visible label, associated with the number field." },
						{ part: "Help or error text", description: "Optional description or validation message linked with aria-describedby." },
					],
					dosDonts: {
						dos: [
							"Store the emitted E.164-ish string so numbers stay normalized across regions.",
							"Prefill existing values; the component parses them back into country and number.",
							"Validate the final number on submit; the field only normalizes shape.",
						],
						donts: [
							"Don't use it for domestic-only entry; a MaskedInput with the national format is less UI.",
							"Don't split the value yourself; read the combined string from onChange.",
						],
					},
					related: ["masked-input", "input", "select"],
					examples: [
						{
							title: "Basic entry",
							description:
								"A curated calling-code list keeps the dropdown short while covering the most common regions.",
						},
						{
							title: "Prefilled international number",
							description:
								"An existing E.164-ish value is parsed back into the right country and national number.",
						},
					],
				},
				{
					id: "radio-card",
					name: "Radio Card",
					apiNames: ["RadioCard"],
					description:
						"A radio group rendered as selectable cards with a title, description, and optional icon, for choices that need explanation.",
					usage: `<RadioCard
  label="Choose a plan"
  defaultValue="pro"
  options={[
    { value: 'starter', title: 'Starter', description: 'For side projects' },
    { value: 'pro', title: 'Pro', description: 'For growing teams' },
  ]}
/>`,
					anatomy: [
						{ part: "Group", description: "A radiogroup named by the required label prop, with roving focus on the checked card." },
						{ part: "Card", description: "A radio-role button per option; arrow keys move and check, skipping disabled cards." },
						{ part: "Title and description", description: "The option's name and supporting explanation inside each card." },
						{ part: "Icon", description: "An optional decorative icon above the title." },
					],
					dosDonts: {
						dos: [
							"Use it for two to five choices that each need a sentence of explanation, like plans.",
							"Write descriptions that contrast the options, not restate the titles.",
							"Keep unavailable options visible but disabled.",
						],
						donts: [
							"Don't use it for more than a handful of options; use Select or Combobox.",
							"Don't use it when several selections are allowed; use CheckboxCard.",
						],
					},
					related: ["radio-group", "checkbox-card", "toggle-group"],
					examples: [
						{
							title: "Plan picker",
							description:
								"Vertical cards with descriptions and a disabled unavailable option.",
						},
						{
							title: "Horizontal with icons",
							description:
								"A horizontal layout with an icon above each card title.",
						},
					],
				},
				{
					id: "rich-text-editor",
					name: "Rich Text Editor",
					apiNames: ["RichTextEditor"],
					description:
						"A lightweight markdown editor whose toolbar formats the textarea selection, with an optional live preview pane.",
					usage: `<RichTextEditor
  label="Release notes"
  preview
  defaultValue="## Highlights\n\n- Faster sync for **large workspaces**"
  onChange={(value) => undefined}
/>`,
					anatomy: [
						{ part: "Toolbar", description: "A labelled toolbar of format actions that wrap the current selection with markdown syntax." },
						{ part: "Textarea", description: "The plain-text editing surface; the markdown source is the value." },
						{ part: "Preview pane", description: "An optional labelled region rendering headings, lists, links, and inline marks as you type." },
						{ part: "Label", description: "The visible label associated with the textarea." },
					],
					dosDonts: {
						dos: [
							"Turn on the preview for long-form writing like release notes or docs.",
							"Store the markdown output as-is so it stays portable.",
							"Keep the default toolbar; it covers the marks the preview renders.",
						],
						donts: [
							"Don't promise WYSIWYG behavior; editing stays in plain markdown.",
							"Don't use it for short plain answers; a TextArea is lighter.",
						],
					},
					related: ["markdown-view", "input", "mention-input"],
					examples: [
						{
							title: "Markdown toolbar",
							description:
								"Bold, italic, heading, list, and link actions wrap the current selection with markdown syntax and restore the selection.",
						},
						{
							title: "Live preview",
							description:
								"The preview pane renders headings, lists, links, and inline marks next to the textarea as you type.",
						},
					],
				},
				{
					id: "timezone-select",
					name: "Timezone Select",
					apiNames: ["TimezoneSelect"],
					description:
						"A searchable select over a curated set of IANA timezones with UTC offset labels.",
					usage: `<TimezoneSelect
  label="Workspace time zone"
  value={zone}
  onValueChange={setZone}
/>`,
					anatomy: [
						{ part: "Combobox input", description: "The filterable field, built on Combobox, that shows the chosen city with its UTC offset." },
						{ part: "Option list", description: "Roughly thirty curated IANA zones, each labeled with its current offset." },
						{ part: "Selected value", description: "The IANA zone id, such as Europe/Berlin, emitted for direct storage." },
					],
					dosDonts: {
						dos: [
							"Store the IANA id, not the offset; offsets change with daylight saving.",
							"Default to the detected zone so most users never open the list.",
							"Keep offsets visible to disambiguate cities that share a name.",
						],
						donts: [
							"Don't use it when the full IANA database is required; build on Combobox with custom options.",
							"Don't sort or label zones by fixed offsets; labels follow the current offset.",
						],
					},
					related: ["combobox", "select", "date-picker"],
					examples: [
						{
							title: "Searchable timezone list",
							description:
								"Typing a city name filters roughly thirty common IANA zones, each labeled with its current UTC offset.",
						},
						{
							title: "Controlled selection",
							description:
								"The value is the IANA zone id, so it can be stored directly and shown back to the user.",
						},
					],
				},
				{
					id: "toggle-group",
					name: "Toggle Group",
					apiNames: ["ToggleGroup", "ToggleGroupItem"],
					description:
						"A cluster of Toggle-styled options with roving focus, in mutually exclusive single mode or independent multiple mode; variant=\"segmented\" renders an options array with a sliding selection pill.",
					usage: `<ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`,
					anatomy: [
						{ part: "Group", description: "A roving-focus container that needs an accessible name, usually through aria-label." },
						{ part: "Item", description: "A Toggle-styled option; single mode exposes aria-checked, multiple mode aria-pressed." },
						{ part: "Size variant", description: "The sm size for compact toolbars." },
					],
					dosDonts: {
						dos: [
							"Name the group with aria-label, since items are often icon-only.",
							"Use type=single for mutually exclusive modes like text alignment.",
							"Keep groups to two to five items so every option stays visible.",
						],
						donts: [
							"Don't use it for settings that need explanatory text; use RadioCard or CheckboxCard.",
							"Don't use it to submit form choices; it is a control cluster, not a fieldset.",
						],
					},
					related: ["toggle", "radio-group"],
					examples: [
						{
							title: "Single selection",
							description:
								"type=\"single\" behaves like a radio group: one item stays checked at a time.",
						},
						{
							title: "Multiple selection",
							description:
								"type=\"multiple\" lets any combination of items stay pressed, plus a compact sm size.",
						},
						{
							title: "Segmented options",
							description:
								"variant=\"segmented\" renders an options array on a pill track; a measured pill slides behind the active option.",
						},
					],
				},
				{
					id: "transfer-list",
					name: "Transfer List",
					apiNames: ["TransferList"],
					description:
						"A dual listbox that moves options between an available list and a chosen list with buttons or the keyboard.",
					usage: `<TransferList
  sourceLabel="Available"
  targetLabel="Selected"
  options={[
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
  ]}
  onValueChange={(values) => undefined}
/>`,
					anatomy: [
						{ part: "Source listbox", description: "The available options, a multiselectable listbox named by sourceLabel." },
						{ part: "Target listbox", description: "The chosen options, whose values are the component's value." },
						{ part: "Move buttons", description: "Arrow buttons labelled from the list names; Enter moves the selection too." },
						{ part: "Option rows", description: "Clickable, keyboard-selectable rows; moved items stay selected for an immediate send-back." },
					],
					dosDonts: {
						dos: [
							"Name both lists for the domain, such as Available roles and Granted roles.",
							"Use it when seeing both states side by side helps, like permissions or skills.",
							"Keep option values stable so moved items keep their original order.",
						],
						donts: [
							"Don't use it for a handful of options; checkboxes or a MultiSelect are lighter.",
							"Don't expect reordering within the target list; order follows the source.",
						],
					},
					related: ["multi-select", "checkbox", "list"],
					examples: [
						{
							title: "Uncontrolled transfer",
							description:
								"Click options to select them, then move them with the arrow buttons or Enter.",
						},
						{
							title: "Controlled with custom labels",
							description:
								"A controlled value seeds the target list and renames both listboxes for the domain.",
						},
					],
				},
				{
					id: "tree-select",
					name: "Tree Select",
					apiNames: ["TreeSelect"],
					description:
						"A single-select control whose popover shows an expandable, typeahead-enabled tree of options; display=\"columns\" walks the hierarchy one column per level.",
					usage: `<TreeSelect
  label="Office"
  options={[
    { value: 'emea', label: 'EMEA', children: [{ value: 'berlin', label: 'Berlin' }] },
    { value: 'singapore', label: 'Singapore' },
  ]}
  onValueChange={(value) => undefined}
/>`,
					anatomy: [
						{ part: "Trigger", description: "A combobox-styled button showing the selected leaf's label." },
						{ part: "Tree popover", description: "A tree of options with typeahead, matching the trigger width and scrolling vertically." },
						{ part: "Branch node", description: "An expandable group with a chevron; it only expands or collapses, never commits." },
						{ part: "Leaf node", description: "A terminal item that commits its value, closes the popover, and shows a check when selected." },
					],
					dosDonts: {
						dos: [
							"Use it when intermediate grouping aids orientation, like regions or org units.",
							"Pre-expand the ancestors of a controlled value so the selection is visible on open.",
							"Keep disabled nodes visible so users see what exists but is unavailable.",
						],
						donts: [
							"Don't use it for flat or small option sets; use Select.",
							"Don't make branch nodes selectable; set display=\"columns\" if drilling should scan faster.",
						],
					},
					related: ["select", "tree-view"],
					examples: [
						{
							title: "Basic tree select",
							description:
								"Branches expand and collapse; only leaf nodes commit the selection.",
						},
						{
							title: "Controlled with pre-expanded branches",
							description:
								"A controlled value is revealed and highlighted on open; disabled nodes stay visible but cannot be chosen.",
						},
						{
							title: "Columns display",
							description:
								"display=\"columns\" renders one labelled column per level; choosing a leaf commits the full path of values.",
						},
					],
				},
		],
	},
	{
		name: "Surfaces",
		modules: [
			{
				id: "card",
				name: "Card",
				apiNames: [
					"Card",
					"CardHeader",
					"CardTitle",
					"CardDescription",
					"CardContent",
					"CardFooter",
				],
				description:
					"A structural surface for related content without ambiguous interactive behavior.",
				usage: `<Card>
  <CardHeader>
    <CardTitle>Security report</CardTitle>
    <CardDescription>Updated five minutes ago</CardDescription>
  </CardHeader>
  <CardContent>No critical findings were detected.</CardContent>
</Card>`,
				anatomy: [
					{ part: "CardHeader", description: "The heading block holding CardTitle and CardDescription." },
					{ part: "CardContent", description: "The main body region of the card." },
					{ part: "CardFooter", description: "The trailing region for metadata or secondary actions." },
				],
				dosDonts: {
					dos: [
						"Compose with the header, content, and footer parts so spacing rhythm stays consistent.",
						"Set the polymorphic as prop (article, section, li) to fit the page outline.",
						"Keep one clear topic per card.",
					],
					donts: [
						"Don't make the whole card clickable when it also contains links or buttons.",
						"Don't wrap every section in a card just for decoration.",
						"Don't bury the page's primary action inside a card footer.",
					],
				},
				related: ["panel", "launcher-card", "expandable-card"],
				examples: [
					{
						title: "Composition",
						description:
							"Cards compose header, content, and footer regions with consistent rhythm.",
					},
				],
			},
			{
				id: "launcher-card",
				name: "Launcher Card",
				apiNames: ["LauncherCard"],
				imports: ["LauncherCard", "Badge"],
				description:
					"An interactive application destination card with an icon, description, optional status, and an honest unavailable state.",
				usage: `<LauncherCard
  href="https://photos.example"
  label="Photos"
  description="Household media, albums, and sharing"
  icon={<Camera />}
  status={<Badge variant="success">Healthy</Badge>}
/>`,
				anatomy: [
					{ part: "Icon", description: "The application glyph at the start of the card." },
					{ part: "Label and description", description: "The destination name and its one-line summary." },
					{ part: "Status", description: "Caller-supplied status content, such as a Badge, rendered below the summary." },
					{ part: "Unavailable state", description: "The disabled treatment that blocks navigation and leaves the focus order." },
				],
				dosDonts: {
					dos: [
						"Use it for application or destination grids where the whole card navigates.",
						"Keep descriptions to one scannable line.",
						"Show an honest unavailable state instead of hiding the destination.",
					],
					donts: [
						"Don't use it for minor links inside prose; use a plain Link.",
						"Don't nest interactive controls inside; the whole card is the link.",
					],
				},
				related: ["card", "badge", "app-switcher"],
				examples: [
					{
						title: "Available application",
						description:
							"The whole card navigates; status content stays caller-supplied and sanitized.",
					},
					{
						title: "Unavailable application",
						description:
							"A disabled card is removed from focus order and blocks navigation.",
					},
				],
			},
			{
				id: "badge",
				name: "Badge",
				apiNames: ["Badge"],
				description:
					"A compact semantic status indicator using canonical information variants.",
				usage: '<Badge variant="success">Deployed</Badge>',
				anatomy: [
					{ part: "Label", description: "The short status or category text, announced verbatim." },
					{ part: "Variant tint", description: "The semantic color pairing: neutral, info, success, warning, or danger." },
				],
				dosDonts: {
					dos: [
						"Keep labels to one or two words so badges scan quickly.",
						"Match the variant to the meaning of the status, not the decor.",
						"Place the badge next to the thing it describes.",
					],
					donts: [
						"Don't use a badge as a button or link; use a Chip for removable filters.",
						"Don't rely on color alone; the text must carry the status.",
						"Don't stack several badges competing for attention on one row.",
					],
				},
				related: ["chip", "status-dot", "health-indicator"],
				examples: [
					{
						title: "Variants",
						description:
							"Five variants cover neutral, informational, success, warning, and danger statuses.",
					},
				],
			},
			{
				id: "accordion",
				name: "Accordion",
				apiNames: ["Accordion"],
				description:
					"A stacked disclosure list with single and multi-open modes driven by a compact item interface.",
				usage: `<Accordion
  defaultValue="sign-in"
  items={[
    { value: 'sign-in', title: 'Sign-in notifications', content: 'Get alerted when a new device signs in.' },
    { value: 'sessions', title: 'Active sessions', content: 'Review and revoke sessions.' },
  ]}
/>`,
				anatomy: [
					{ part: "Item", description: "One disclosure unit, keyed by a unique value." },
					{ part: "Trigger", description: "The header button with the title and chevron, exposing aria-expanded." },
					{ part: "Content", description: "The panel revealed while the item is open." },
				],
				dosDonts: {
					dos: [
						"Use single-open mode for settings groups that are read one at a time.",
						"Switch to multiple mode when readers compare sections side by side.",
						"Keep titles short so triggers stay on one line.",
					],
					donts: [
						"Don't hide required form fields inside collapsed items.",
						"Don't use an accordion when all content must be visible at once.",
						"Don't nest accordions inside accordion content.",
					],
				},
				related: ["expandable-card", "tabs", "card"],
				examples: [
					{
						title: "Single-open",
						description:
							"At most one item is open, and the open item can be collapsed again.",
					},
				],
			},
			{
				id: "chip",
				name: "Chip",
				apiNames: ["Chip"],
				description:
					"A compact filter or selection token with an optional remove affordance.",
				usage: `<Chip label="Active only" selected onRemove={() => undefined} />`,
				anatomy: [
					{ part: "Label", description: "The token text naming the filter or selection." },
					{ part: "Selected tint", description: "The primary tint marking the chip as active." },
					{ part: "Remove button", description: "The X control rendered when onRemove is set, labelled \"Remove <label>\"." },
				],
				dosDonts: {
					dos: [
						"Use chips for active filters above a list or table.",
						"Keep labels to one or two words.",
						"Use selected to reflect state instead of adding and removing chips.",
					],
					donts: [
						"Don't use a chip for passive status; use a Badge.",
						"Don't use chips as primary actions; they are tokens, not buttons.",
					],
				},
				related: ["badge", "tags-input", "multi-select"],
				examples: [
					{
						title: "Removable filters",
						description:
							"Selected chips tint primary; the remove button is labeled from the chip text.",
					},
				],
			},
			{
				id: "kbd",
				name: "Kbd",
				apiNames: ["Kbd"],
				description:
					"An inline keyboard shortcut hint with a raised keycap treatment.",
				usage: "Save with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>",
				anatomy: [
					{ part: "Keycap", description: "The raised kbd element sized in ems so it scales with surrounding text." },
					{ part: "Separator", description: "Plain text between keycaps, like +, keeping combinations readable." },
				],
				dosDonts: {
					dos: [
						"Use Kbd for shortcuts referenced in help, onboarding, or settings copy.",
						"Write platform-appropriate key names, like Cmd on macOS and Ctrl elsewhere.",
						"Keep combinations to two or three keys.",
					],
					donts: [
						"Don't use Kbd for user-entered values; use plain or inline-code styling.",
						"Don't style non-keyboard text as a keycap.",
					],
				},
				related: ["code-block", "tooltip", "alert"],
				examples: [
					{
						title: "Shortcut hints",
						description:
							"Kbd scales with surrounding text through em-based sizing.",
					},
				],
			},
			{
				id: "scroll-area",
				name: "Scroll Area",
				apiNames: ["ScrollArea"],
				description:
					"A scrollable region with styled, theme-consistent scrollbars.",
				usage: `<ScrollArea maxHeight="16rem">
  <LongList />
</ScrollArea>`,
				anatomy: [
					{ part: "Viewport", description: "The keyboard-focusable scrollable region, capped by maxHeight." },
					{ part: "Scrollbar", description: "The styled vertical and horizontal tracks shown while scrolling is possible." },
					{ part: "Thumb", description: "The draggable indicator sized to the visible fraction of the content." },
				],
				dosDonts: {
					dos: [
						"Cap the height in relative units so the region adapts to the viewport.",
						"Use it for bounded panels, sidebars, and pickers.",
						"Keep one scroll region per panel.",
					],
					donts: [
						"Don't nest scroll areas inside each other.",
						"Don't use it for page-level scrolling; let the page scroll natively.",
						"Don't hide critical actions below the fold without a visible affordance.",
					],
				},
				related: ["panel", "card", "table"],
				examples: [
					{
						title: "Bounded lists",
						description:
							"Cap the height and the custom scrollbar appears only while scrolling is possible.",
					},
				],
			},
			{
				id: "code-block",
				name: "Code Block",
				apiNames: ["CodeBlock"],
				description:
					"A code panel with a language label, optional line numbers, and copy-to-clipboard.",
				usage: '<CodeBlock language="bash" code="npm install @kryv/teal" />',
				anatomy: [
					{ part: "Language label", description: "The header tag naming the language of the snippet." },
					{ part: "Code", description: "The preformatted, horizontally scrolling content with optional line numbers." },
					{ part: "Copy button", description: "The clipboard action that confirms with a check icon for two seconds." },
				],
				dosDonts: {
					dos: [
						"Set the language so readers know what they are looking at.",
						"Turn on line numbers for longer snippets people will reference.",
						"Keep snippets self-contained and runnable.",
					],
					donts: [
						"Don't paste secrets, tokens, or real credentials into examples.",
						"Don't use a code block for a single identifier in prose; use inline code.",
					],
				},
				related: ["kbd", "markdown-view", "log-viewer"],
				examples: [
					{
						title: "Copy affordance",
						description:
							"The copy button confirms with a check icon for two seconds.",
					},
				],
			},
				{
					id: "expandable-card",
					name: "Expandable Card",
					apiNames: ["ExpandableCard"],
					description:
						"A card that expands and collapses its extra content with a built-in trigger, chevron affordance, and smooth height animation.",
					usage: `<ExpandableCard title="Release notes">\n  <p>Version 2.4 adds dark surface tokens and fixes drawer scroll locking.</p>\n</ExpandableCard>`,
					anatomy: [
						{ part: "Header", description: "The always-visible title area, rendered as a configurable heading (h2 by default)." },
						{ part: "Trigger", description: "The button with aria-expanded and the rotating chevron affordance." },
						{ part: "Region", description: "The collapsible content area, aria-hidden and inert while collapsed." },
					],
					dosDonts: {
						dos: [
							"Use it for secondary detail most readers skip, like changelogs or advanced settings.",
							"Rename the trigger with domain wording when it is clearer, like \"View shortcuts\".",
							"Keep the default collapsed so the summary stays scannable.",
						],
						donts: [
							"Don't put primary content in the collapsible region.",
							"Don't stack several as a pseudo-accordion; use Accordion so sections are grouped.",
						],
					},
					related: ["accordion", "card", "panel"],
					examples: [
						{
							title: "Collapsible extra content",
							description:
								"The header stays visible while the trigger smoothly reveals or folds away the secondary content.",
						},
						{
							title: "Initially expanded with custom labels",
							description:
								"Start open and rename the trigger when the action is clearer with domain wording such as 'View shortcuts'.",
						},
					],
				},
				{
					id: "glass-panel",
					name: "Glass Panel",
					apiNames: ["GlassPanel"],
					description:
						"A frosted-glass surface with backdrop blur and a translucent background, for content floating over imagery or color.",
					usage: `<GlassPanel>\n  <p>Content stays readable over busy backgrounds.</p>\n</GlassPanel>`,
					anatomy: [
						{ part: "Surface", description: "The translucent background with backdrop blur that lets imagery show through." },
						{ part: "Border highlight", description: "The hairline edge keeping the panel visible over busy backgrounds." },
						{ part: "Overlay shadow", description: "The deeper shadow separating the panel from what sits behind it." },
					],
					dosDonts: {
						dos: [
							"Use it over imagery, gradients, or video where the backdrop adds depth.",
							"Constrain the width with a wrapper or className.",
							"Check text contrast against the busiest part of the backdrop.",
						],
						donts: [
							"Don't use it on plain app backgrounds; use Panel or Card instead.",
							"Don't stack multiple blurred layers; backdrop blur is expensive to render.",
						],
					},
					related: ["panel", "card", "dialog"],
					examples: [
						{
							title: "Frosted content block",
							description:
								"A glass panel over a colorful gradient, showing how the blur and translucency keep text legible.",
						},
						{
							title: "Centered floating panel",
							description:
								"A narrower, centered glass panel, the shape typically used for floating cards over hero imagery.",
						},
					],
				},
				{
					id: "panel",
					name: "Panel",
					apiNames: ["Panel"],
					description:
						"A lightweight bordered surface with optional header and actions, for grouping content without Card's elevation.",
					usage: `<Panel\n  title="Storage usage"\n  actions={<Button size="sm" variant="ghost">Manage</Button>}\n>\n  <p>You have used 6.2 GB of your 10 GB quota.</p>\n</Panel>`,
					anatomy: [
						{ part: "Header row", description: "The title-plus-actions row, rendered only when title or actions are provided." },
						{ part: "Title", description: "The heading naming the grouped content, adjustable to fit the page outline." },
						{ part: "Actions", description: "The trailing slot for one small related control." },
						{ part: "Body", description: "The bordered content region without Card's elevation." },
					],
					dosDonts: {
						dos: [
							"Use it for quiet grouping like settings blocks and summaries.",
							"Keep header actions to a single small control.",
							"Choose Panel over Card when elevation would add noise.",
						],
						donts: [
							"Don't make the panel itself clickable; put a real link or button inside.",
							"Don't nest panels inside panels; flatten the grouping instead.",
						],
					},
					related: ["card", "glass-panel", "accordion"],
					examples: [
						{
							title: "Panel with header and actions",
							description:
								"A titled panel with a trailing action, the default way to frame a self-contained block of content.",
						},
						{
							title: "Headerless and action-only panels",
							description:
								"Omit the title for a simple bordered group, or pass actions alone when the content speaks for itself.",
						},
					],
				},
		],
	},
	{
		name: "Overlays",
		modules: [
			{
				id: "dialog",
				name: "Dialog",
				apiNames: ["Dialog"],
				description:
					"A modal surface that owns focus management, naming, dismissal, and scroll locking; placement renders it centered, fullscreen, as a left/right drawer, or as a bottom sheet.",
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
				anatomy: [
					{ part: "Trigger", description: "The control that opens the dialog, usually a Button; callers own it." },
					{ part: "Scrim", description: "The dimmed backdrop that blocks the page and dismisses on click." },
					{ part: "Content", description: "The modal surface that traps focus and carries the title, description, and children." },
					{ part: "Title and description", description: "Header text wired to aria-labelledby and aria-describedby automatically." },
				],
				dosDonts: {
					dos: [
						"Use a verb-led title that states the outcome, like \"Archive project?\".",
						"Keep the content short; move long forms into a dedicated page or placement=\"fullscreen\".",
						"Restore focus to the trigger when the dialog closes (built in).",
					],
					donts: [
						"Don't stack a second dialog on top of an open one.",
						"Don't use a dialog for destructive confirmations; use AlertDialog.",
						"Don't hide required information behind the scrim dismissal.",
					],
				},
				related: ["alert-dialog", "action-sheet", "popover"],
				examples: [
					{
						title: "Confirmation",
						description:
							"Dialog traps focus, restores it on close, and dismisses with Escape or the scrim.",
					},
					{
						title: "Form dialog",
						description:
							"size=\"lg\" gives a short form room; Field wraps each Input with a label and description.",
					},
				],
			},
			{
				id: "tooltip",
				name: "Tooltip",
				apiNames: ["Tooltip", "TooltipProvider"],
				imports: ["Tooltip", "TooltipProvider", "IconButton"],
				description:
					"A short contextual hint with accessible trigger association and collision handling.",
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
				anatomy: [
					{ part: "Trigger", description: "The wrapped element, usually an IconButton; must be focusable so keyboard users get the hint." },
					{ part: "Content", description: "The floating hint text, associated with the trigger through aria-describedby and never interactive." },
					{ part: "Provider", description: "TooltipProvider mounted once near the root so adjacent tooltips share open-delay grouping." },
				],
				dosDonts: {
					dos: [
						"Keep the content to one short line that names or explains the trigger.",
						"Mirror the accessible label of icon-only buttons so sighted users get the same name.",
						"Mount TooltipProvider once near the app root so moving between triggers skips the delay.",
					],
					donts: [
						"Don't place links, buttons, or any interactive content inside a tooltip.",
						"Don't rely on a tooltip for information touch users need; show a visible label instead.",
						"Don't repeat text that is already visible next to the trigger.",
					],
				},
				related: ["hover-card", "popover", "tour"],
				examples: [
					{
						title: "Icon button hint",
						description:
							"Tooltips label icon-only controls on hover and keyboard focus. Click the icon to expand the search field.",
					},
					{
						title: "Placement sides",
						description:
							"The side prop points the hint left, right, or bottom when the default top placement would collide with neighbors.",
					},
				],
			},
			{
				id: "menu",
				name: "Menu",
				apiNames: ["Menu"],
				imports: ["Menu", "IconButton"],
				description:
					"A structured action menu with keyboard navigation, disabled items, icons, and danger styling.",
				usage: `<Menu
  trigger={<IconButton label="Project actions"><MoreVertical /></IconButton>}
  items={[
    { id: 'settings', label: 'Settings', onSelect: () => undefined },
    { id: 'archive', label: 'Archive', variant: 'danger', onSelect: () => undefined },
  ]}
/>`,
				anatomy: [
					{ part: "Trigger", description: "The element that opens the menu; give icon-only triggers an accessible label via IconButton." },
					{ part: "Content", description: "The floating list that follows the menu pattern with roving highlight and typeahead." },
					{ part: "Item", description: "One action with a label, optional leading icon, disabled state, and a danger variant." },
					{ part: "Separator", description: "A hairline inserted with separatorBefore to group related actions and isolate destructive ones." },
				],
				dosDonts: {
					dos: [
						"Group related actions with separatorBefore and put destructive items last with the danger variant.",
						"Keep labels short and verb-led, like \"Duplicate\" or \"Export as PDF\".",
						"Disable unavailable items instead of hiding them so the menu stays stable.",
					],
					donts: [
						"Don't hide frequently used primary actions behind a menu; keep them visible.",
						"Don't use a menu for navigation links; use NavigationMenu or plain links instead.",
						"Don't open dialogs from a menu item without closing the menu first (onSelect handles this).",
					],
				},
				related: ["menubar", "popover"],
				examples: [
					{
						title: "Project actions",
						description:
							"Items support icons, separators, and a danger variant for destructive actions.",
					},
					{
						title: "Text trigger with disabled item",
						description:
							"A labelled Button can replace the icon trigger; disabled items stay visible but skip the highlight.",
					},
				],
			},
			{
				id: "popover",
				name: "Popover",
				apiNames: ["Popover"],
				imports: ["Popover", "Button", "Checkbox"],
				description:
					"An anchored surface for arbitrary controls and supplemental content.",
				usage: `<Popover label="Filter projects" trigger={<Button variant="secondary">Filters</Button>}>
  <div className="grid gap-3">
    <Checkbox label="Active only" defaultChecked />
    <Button size="sm">Apply filters</Button>
  </div>
</Popover>`,
				anatomy: [
					{ part: "Trigger", description: "The control that toggles the panel; exposes aria-expanded and aria-controls." },
					{ part: "Content", description: "The anchored panel holding arbitrary controls, named by the required label prop." },
				],
				dosDonts: {
					dos: [
						"Always pass a label so the panel has an accessible name even without a visible heading.",
						"Keep the content to one small task, like a filter set or a share action.",
						"Let collision handling flip placement; only set side or align when the default reads wrong.",
					],
					donts: [
						"Don't use a popover for blocking decisions; use Dialog or AlertDialog.",
						"Don't build multi-step flows inside a popover; focus is not trapped by design.",
						"Don't use it for a one-line hint; use Tooltip instead.",
					],
				},
				related: ["tooltip", "menu", "popconfirm"],
				examples: [
					{
						title: "Filter panel",
						description:
							"Popover anchors interactive content to a trigger with collision-aware placement.",
					},
					{
						title: "Share panel",
						description:
							"side=\"top\" opens the panel above the trigger; a read-only Input holds the share link.",
					},
				],
			},
			{
				id: "hover-card",
				name: "Hover Card",
				apiNames: ["HoverCard"],
				imports: ["HoverCard", "Link"],
				description:
					"A rich preview surface revealed on hover or focus, for context without navigation.",
				usage: `<HoverCard trigger={<Link href="/projects/orion">Orion</Link>}>
  <ProjectSummary />
</HoverCard>`,
				anatomy: [
					{ part: "Trigger", description: "The inline element, often a Link or handle, that opens the card on hover or keyboard focus." },
					{ part: "Content", description: "The rich preview surface with identity or summary content; read-only by convention." },
				],
				dosDonts: {
					dos: [
						"Use for entity previews, like a person or project summary, that help before navigating.",
						"Tune openDelay and closeDelay when cards sit in dense lists so they don't flicker.",
						"Keep the content a short read-only summary.",
					],
					donts: [
						"Don't put required actions inside; touch users can't hover, so offer another path.",
						"Don't use it for a one-line hint; use Tooltip.",
						"Don't rely on a hover card for information that only exists there.",
					],
				},
				related: ["tooltip", "popover", "link"],
				examples: [
					{
						title: "Preview on hover",
						description:
							"Delays are tunable; keyboard focus opens the card too.",
					},
					{
						title: "Tuned delays and placement",
						description:
							"openDelay, closeDelay, side, and align adapt the card to dense layouts like member lists.",
					},
				],
			},
			{
				id: "command",
				name: "Command",
				apiNames: ["Command"],
				imports: ["Command", "Button"],
				description:
					"A command palette dialog with grouped, filterable actions and keyboard navigation.",
				usage: `<Command
  open={open}
  onOpenChange={setOpen}
  groups={[
    { label: 'Projects', items: [{ id: 'orion', label: 'Open Orion', onSelect: () => undefined }] },
  ]}
/>`,
				anatomy: [
					{ part: "Dialog shell", description: "The modal surface that owns focus, dismissal, and scroll locking while the palette is open." },
					{ part: "Input", description: "The filter field, focused on open, with a caller-set placeholder." },
					{ part: "Group", description: "A labelled cluster of related commands, like \"Project\" or \"Danger zone\"." },
					{ part: "Item", description: "One command with a label, optional icon, and a keyboard hint such as ⌘N." },
				],
				dosDonts: {
					dos: [
						"Group commands under short labels so filtering reads as structured sections.",
						"Write verb-led item labels and show shortcut hints where they exist.",
						"Set placeholder and emptyMessage to match the palette's scope.",
					],
					donts: [
						"Don't use the palette as site search over content; use SearchOverlay.",
						"Don't run destructive commands without a follow-up AlertDialog confirmation.",
						"Don't overload it with every possible action; keep it to high-frequency commands.",
					],
				},
				related: ["search-overlay", "menu", "dialog"],
				examples: [
					{
						title: "Palette",
						description:
							"Arrows cycle filtered items, Enter runs the action, state resets on open.",
					},
					{
						title: "Scoped palette",
						description:
							"A palette scoped to admin commands with its own placeholder and empty message.",
					},
				],
			},
			{
				id: "alert-dialog",
				name: "Alert Dialog",
				apiNames: ["AlertDialog"],
				imports: ["AlertDialog", "Button"],
				description:
					"A blocking confirmation that holds focus until an explicit choice is made.",
				usage: `<AlertDialog
  trigger={<Button variant="danger">Delete project</Button>}
  title="Delete project?"
  description="This removes Orion and its reports permanently."
  tone="danger"
  confirmText="Delete"
  onConfirm={() => undefined}
/>`,
				anatomy: [
					{ part: "Trigger", description: "The caller-supplied control that opens the confirmation, like a danger Button." },
					{ part: "Content", description: "The blocking panel that holds focus until cancel or confirm is chosen." },
					{ part: "Title and description", description: "The question and its consequence, wired as the dialog's accessible name and description." },
					{ part: "Cancel and confirm", description: "The explicit choice pair; tone=\"danger\" styles the confirm action for irreversible operations." },
				],
				dosDonts: {
					dos: [
						"State the consequence in the description, including whether it can be undone.",
						"Use tone=\"danger\" and a verb-led confirmText like \"Delete\" for irreversible actions.",
						"Keep the default focus on the safe action so keyboard users confirm deliberately.",
					],
					donts: [
						"Don't use an alert dialog for routine or minor confirmations; use Popconfirm.",
						"Don't use generic confirm text like \"OK\"; name the action.",
						"Don't chain a second alert dialog from the confirm handler.",
					],
				},
				related: ["dialog", "popconfirm", "prompt-dialog"],
				examples: [
					{
						title: "Destructive confirmation",
						description:
							'Alertdialog semantics keep focus inside; tone="danger" styles the confirm action.',
					},
					{
						title: "Neutral confirmation",
						description:
							"Without tone, the confirm action stays primary for blocking but non-destructive decisions like publishing.",
					},
				],
			},
			{
				id: "popconfirm",
				name: "Popconfirm",
				apiNames: ["Popconfirm"],
				imports: ["Popconfirm", "Button"],
				description:
					"A lightweight anchored confirmation for small destructive or irreversible actions.",
				usage: `<Popconfirm
  trigger={<Button variant="secondary">Remove member</Button>}
  title="Remove Avery?"
  message="They lose access to this workspace."
  tone="danger"
  confirmText="Remove"
  onConfirm={() => undefined}
/>`,
				anatomy: [
					{ part: "Trigger", description: "The control whose action needs a quick confirmation, like \"Remove member\"." },
					{ part: "Panel", description: "The popover-anchored surface that stays near the trigger without blocking the page." },
					{ part: "Title and message", description: "A short question naming the target plus one line of consequence." },
					{ part: "Confirm and cancel", description: "The inline choice pair; tone=\"danger\" marks irreversible confirms." },
				],
				dosDonts: {
					dos: [
						"Use for small row-level actions like removing a member or discarding a draft.",
						"Phrase the title as a question that names the target, like \"Remove Avery?\".",
						"Keep the message to one line of consequence.",
					],
					donts: [
						"Don't use a popconfirm for severe or hard-to-reverse consequences; use AlertDialog.",
						"Don't stack popconfirms or open one from inside a popover.",
						"Don't use it for informational content; there is nothing to confirm.",
					],
				},
				related: ["alert-dialog", "popover", "menu"],
				examples: [
					{
						title: "Inline confirmation",
						description:
							"Built on Popover, so it anchors to the trigger without taking over the page.",
					},
					{
						title: "Neutral action",
						description:
							"Without tone, the confirm suits routine decisions like publishing a report.",
					},
				],
			},
			{
				id: "tour",
				name: "Tour",
				apiNames: ["Tour"],
				imports: ["Tour", "Button"],
				description:
					"A guided walkthrough that highlights target elements step by step.",
				usage: `const [open, setOpen] = useState(false)

<Tour
  open={open}
  onOpenChange={setOpen}
  steps={[
    { target: '#search-field', title: 'Search everything', content: 'Find projects and people from one field.' },
  ]}
/>`,
				anatomy: [
					{ part: "Step target", description: "A CSS selector the step anchors to; the target scrolls into view and gets highlighted." },
					{ part: "Step card", description: "The floating panel with the step's title and content, positioned by the optional placement." },
					{ part: "Progress controls", description: "Back, next, and skip actions that walk the steps or end the tour early." },
				],
				dosDonts: {
					dos: [
						"Keep tours to a handful of steps that each name a benefit, not just a control.",
						"Use onFinish to record completion so the tour doesn't replay on every visit.",
						"Choose stable selectors for targets; a missing target falls back to a centered dialog.",
					],
					donts: [
						"Don't tour every feature at once; split introductions by context.",
						"Don't use a tour for a persistent single-control hint; use Tooltip.",
						"Don't put required setup inside a tour; users can skip it.",
					],
				},
				related: ["tooltip", "dialog", "popover"],
				examples: [
					{
						title: "Onboarding steps",
						description:
							"Each step anchors to a selector; missing targets fall back to a centered dialog.",
					},
					{
						title: "Single-step change highlight",
						description:
							"A one-step tour with placement points returning users at a relocated feature.",
					},
				],
			},
				{
					id: "action-sheet",
					name: "Action Sheet",
					apiNames: ["ActionSheet"],
					description:
						"An iOS-style bottom sheet listing actions with a destructive option and a separated cancel button.",
					usage: `<ActionSheet
  open={open}
  onOpenChange={setOpen}
  title="Report options"
  actions={[
    { label: 'Duplicate' },
    { label: 'Delete', destructive: true },
  ]}
/>`,
					anatomy: [
						{ part: "Title", description: "Optional heading that names the action set and the sheet's accessible name." },
						{ part: "Action list", description: "The stacked actions; each fires its onSelect and closes the sheet." },
						{ part: "Destructive action", description: "An action marked destructive, rendered in the error color." },
						{ part: "Cancel button", description: "A visually separated button below the list that closes without selecting." },
					],
					dosDonts: {
						dos: [
							"Keep the list to a handful of actions that all apply to the same object.",
							"Mark irreversible actions destructive so they render in the error color.",
							"Prefer it on touch layouts where bottom-anchored actions sit in the thumb zone.",
						],
						donts: [
							"Don't put forms or rich content inside; use Dialog with placement=\"bottom\" and custom children.",
							"Don't use it as a desktop action menu; use Menu instead.",
							"Don't hide the only safe exit; the cancel button is always visible.",
						],
					},
					related: ["dialog", "menu", "alert-dialog"],
					examples: [
						{
							title: "Action list",
							description:
								"A stack of related actions with a cancel button visually separated below.",
						},
						{
							title: "Destructive action",
							description:
								"Destructive actions render in the error color so irreversible choices stand out.",
						},
					],
				},
				{
					id: "cookie-consent",
					name: "Cookie Consent",
					apiNames: ["CookieConsent"],
					description: "Polite, non-modal bottom banner for cookie consent with accept and decline actions and an optional preferences link.",
					usage: `<CookieConsent
  message="We use cookies to improve your experience."
  manageHref="/settings/cookies"
  onAccept={allowAll}
  onDecline={allowEssential}
/>`,
					anatomy: [
						{ part: "Message", description: "The plain-language disclosure of what cookies or tracking are used for." },
						{ part: "Manage link", description: "An optional link to granular preferences, via manageHref." },
						{ part: "Accept and decline", description: "Equal-weight actions that report the choice through onAccept and onDecline and dismiss the banner." },
					],
					dosDonts: {
						dos: [
							"Write the message in plain language and keep it to one or two sentences.",
							"Wire onAccept and onDecline to real consent state, not just dismissal.",
							"Control visibility so users can re-open consent from a settings page later.",
						],
						donts: [
							"Don't block the page until consent; the banner is intentionally non-modal.",
							"Don't style accept and decline asymmetrically to nudge one choice.",
							"Don't show the banner again after a recorded choice unless consent expires.",
						],
					},
					related: ["alert", "dialog"],
					examples: [
						{ title: "Consent banner", description: "Pins to the bottom of the viewport with a message, manage link, and accept/decline actions that dismiss it." },
						{ title: "Custom labels, controlled", description: "Controlled visibility with tailored action labels and no manage link." },
					],
				},
				{
					id: "floating-panel",
					name: "Floating Panel",
					apiNames: ["FloatingPanel"],
					description:
						"A non-modal panel anchored to a viewport corner for tools that coexist with the page.",
					usage: `<FloatingPanel
  open={open}
  onOpenChange={setOpen}
  anchor="bottom-right"
  title="Clipboard history"
>
  <p>Panel content</p>
</FloatingPanel>`,
					anatomy: [
						{ part: "Panel", description: "The non-modal surface pinned to a viewport corner; the page stays interactive behind it." },
						{ part: "Header", description: "The title row with a close button, naming the panel for assistive technology." },
						{ part: "Body", description: "The caller's companion content, like clipboard history or shortcuts." },
					],
					dosDonts: {
						dos: [
							"Use for companion tooling the user keeps open while working, like history or inspectors.",
							"Pick an anchor corner that doesn't cover the page's primary navigation.",
							"Keep the content compact; the panel has a fixed, viewport-capped width.",
						],
						donts: [
							"Don't use it for decisions that need full attention; use Dialog.",
							"Don't open several floating panels that overlap each other.",
							"Don't put transient feedback in it; use Toast.",
						],
					},
					related: ["dialog", "popover"],
					examples: [
						{
							title: "Corner panel",
							description:
								"A closable panel floats above the page without trapping focus or dimming content.",
						},
						{
							title: "Alternate anchor",
							description:
								"The anchor prop moves the panel to any viewport corner.",
						},
					],
				},
				{
					id: "image-viewer",
					name: "Image Viewer",
					apiNames: ["ImageViewer"],
					description: "Inline viewer for a single image with toolbar and keyboard zoom plus pointer-drag panning while zoomed.",
					usage: `<ImageViewer
  src="/blueprint.svg"
  alt="Floor plan"
  maxZoom={4}
/>`,
					anatomy: [
						{ part: "Stage", description: "The container the image renders into, sized by the caller's layout." },
						{ part: "Toolbar", description: "Zoom-in, zoom-out, and reset controls that mirror the keyboard shortcuts." },
						{ part: "Image", description: "The asset itself; panning by pointer drag engages once zoom passes the minimum." },
					],
					dosDonts: {
						dos: [
							"Write alt text that describes the image content, not just \"image\".",
							"Clamp maxZoom to the asset's real resolution so zooming stays meaningful.",
							"Use for single diagrams, maps, or exports that users inspect in place.",
						],
						donts: [
							"Don't use it to page through a set of images; use Lightbox.",
							"Don't wrap decorative images; a plain img is enough.",
							"Don't rely on drag alone; the toolbar and keyboard zoom cover pointer-free use.",
						],
					},
					related: ["lightbox", "dialog"],
					examples: [
						{ title: "Default viewer", description: "Zoom in and out with the toolbar buttons or the + and − keys, and drag to pan once past 100%." },
						{ title: "Custom bounds", description: "Starts pre-zoomed with finer zoom steps and a lower maximum for detail inspection." },
					],
				},
				{
					id: "lightbox",
					name: "Lightbox",
					apiNames: ["Lightbox"],
					description: "Full-screen gallery overlay for paging through images with arrow keys, on-screen controls, and a live counter.",
					usage: `<Lightbox
  open={open}
  onOpenChange={setOpen}
  images={[{ src: "/photo.jpg", alt: "Team offsite", caption: "Spring offsite" }]}
/>`,
					anatomy: [
						{ part: "Overlay", description: "The full-screen dialog surface that dims the page and traps focus while open." },
						{ part: "Image stage", description: "The current image, scaled to fit the viewport, with its alt and optional caption." },
						{ part: "Prev/next controls", description: "Chevron buttons that mirror the arrow keys and wrap around the ends." },
						{ part: "Counter", description: "The live \"n of m\" indicator tracking the current position." },
					],
					dosDonts: {
						dos: [
							"Give every image meaningful alt text and a short caption where it adds context.",
							"Open at the clicked thumbnail's index via the controlled index prop.",
							"Let the overlay own paging; arrow keys and buttons stay in sync.",
						],
						donts: [
							"Don't use a lightbox for a single image that needs zoom inspection; use ImageViewer.",
							"Don't write long prose captions; keep them to a short label.",
							"Don't hide the close path; Escape and the backdrop always close it.",
						],
					},
					related: ["image-viewer", "dialog"],
					examples: [
						{ title: "Gallery overlay", description: "A button opens the lightbox; arrow keys and the chevron buttons page through images while the counter tracks position." },
						{ title: "Thumbnail entry points", description: "Each thumbnail opens the gallery at its own index via the controlled index prop." },
					],
				},
				{
					id: "notification-center",
					name: "Notification Center",
					apiNames: ["NotificationCenter"],
					description: "Popover panel that lists recent notifications with read states and a mark-all-read action.",
					usage: `<NotificationCenter
  trigger={<Button variant="secondary">Notifications</Button>}
  items={notifications}
  onMarkAllRead={markAllRead}
/>`,
					anatomy: [
						{ part: "Trigger", description: "The caller-supplied button, often a bell icon, that opens the panel." },
						{ part: "Panel", description: "The popover surface listing notifications, capped in width with internal scrolling." },
						{ part: "Notification rows", description: "NotificationItem rows with read state emphasis for unread items." },
						{ part: "Mark-all-read", description: "An action shown only while unread items remain; the caller applies the change via onMarkAllRead." },
					],
					dosDonts: {
						dos: [
							"Keep items sanitized pointers to source events, with severity and app labels.",
							"Apply onMarkAllRead in caller state so read changes persist.",
							"Show the empty state message instead of an empty list when nothing remains.",
						],
						donts: [
							"Don't mutate the source events from the panel; it reports intent only.",
							"Don't use it for transient feedback; use Toast.",
							"Don't let the list grow unbounded; trim to recent notifications.",
						],
					},
					related: ["notification-item", "popover", "toast"],
					examples: [
						{ title: "Inbox with unread items", description: "Unread rows stay emphasized and the mark-all-read action appears only while unread items remain." },
						{ title: "Empty center", description: "With no notifications the panel shows a catch-up message instead of a list." },
					],
				},
				{
					id: "prompt-dialog",
					name: "Prompt Dialog",
					apiNames: ["PromptDialog"],
					description:
						"A modal dialog with a single labeled input that returns the entered value on confirm.",
					usage: `<PromptDialog
  open={open}
  onOpenChange={setOpen}
  title="Rename report"
  label="Report name"
  defaultValue="Q3 revenue"
  onSubmit={(value) => rename(value)}
/>`,
					anatomy: [
						{ part: "Title", description: "The verb-led heading that names the dialog, like \"Rename report\"." },
						{ part: "Input", description: "The single labeled text field, focused on open and optionally prefilled with defaultValue." },
						{ part: "Confirm and cancel", description: "The action pair; confirm or Enter submits the value, cancel and Escape discard it." },
					],
					dosDonts: {
						dos: [
							"Prefill defaultValue when editing an existing name so users adjust rather than retype.",
							"Use a verb-led title and a visible input label, not placeholder-only naming.",
							"Validate the submitted value in onSubmit and give feedback on empty or invalid input.",
						],
						donts: [
							"Don't use it for multi-field or validation-heavy forms; compose Dialog with Field instead.",
							"Don't submit on behalf of the user; Enter is the only implicit submit.",
							"Don't reuse one prompt for unrelated actions; keep one intent per dialog.",
						],
					},
					related: ["dialog", "alert-dialog", "field"],
					examples: [
						{
							title: "Rename flow",
							description:
								"The input is prefilled with the current value and focused on open.",
						},
						{
							title: "Create flow",
							description:
								"An empty input with a placeholder collects a brand-new name.",
						},
					],
				},
				{
					id: "search-overlay",
					name: "Search Overlay",
					apiNames: ["SearchOverlay"],
					description: "Full-screen search overlay with a large input and caller-rendered results navigated entirely from the keyboard.",
					usage: `<SearchOverlay
  open={open}
  onOpenChange={setOpen}
  resultCount={results.length}
  onSelect={(index) => openResult(results[index])}
>
  {({ query, activeIndex, optionId }) => <ResultList results={results} query={query} activeIndex={activeIndex} optionId={optionId} />}
</SearchOverlay>`,
					anatomy: [
						{ part: "Overlay", description: "The full-screen labelled dialog that traps focus and owns the search session." },
						{ part: "Input", description: "The large query field, focused on open; query and highlight reset on every open." },
						{ part: "Results", description: "Caller-rendered rows driven by the render prop's query, activeIndex, and optionId." },
						{ part: "Highlight", description: "The keyboard-driven active result, cycled with arrows and submitted with Enter via onSelect." },
					],
					dosDonts: {
						dos: [
							"Trigger it from a global shortcut like ⌘K when search is a primary task.",
							"Use the render prop's optionId for the active-descendant wiring on result rows.",
							"Render an explicit no-results state; the caller owns what empty means.",
						],
						donts: [
							"Don't use it as a command picker; use Command.",
							"Don't use it for inline form autocomplete; use Combobox.",
							"Don't make results mouse-only; Enter must activate the highlighted row.",
						],
					},
					related: ["command", "combobox", "input"],
					examples: [
						{ title: "Docs search", description: "A render prop receives the query and highlight state so the caller renders and filters its own result rows." },
						{ title: "Empty state", description: "The caller owns what shows when nothing matches, such as a 'no results' message." },
					],
				},
		],
	},
	{
		name: "Feedback",
		modules: [
			{
				id: "toast",
				name: "Toast",
				apiNames: ["Toaster"],
				imports: ["Toaster", "toast"],
				description:
					"Imperative, announced feedback with semantic variants, optional actions, and dismissal.",
				usage: `// Mount once near the app root
<Toaster />

// Call toast() from anywhere
toast({ title: 'Changes saved', variant: 'success' })`,
				anatomy: [
					{ part: "Toaster viewport", description: "Fixed container mounted once near the app root; stacks incoming toasts and owns their live region." },
					{ part: "Toast", description: "The announced surface carrying the message; auto-dismisses after its duration unless made persistent." },
					{ part: "Variant icon", description: "Decorative severity glyph matched to the neutral, info, success, warning, or danger variant." },
					{ part: "Title and description", description: "The message text; the title is required and the description carries detail." },
					{ part: "Action and close", description: "An optional action button plus a labeled dismiss control." },
				],
				dosDonts: {
					dos: [
						"Mount exactly one Toaster near the app root so every toast() call shares it.",
						"Match the variant to the outcome, such as success for a completed save.",
						"Pass duration: Infinity for messages the user must not miss, and pair them with an action.",
					],
					donts: [
						"Don't toast information the user must act on later; use Alert so it stays in context.",
						"Don't fire several toasts for one operation; collapse retries into a single final message.",
						"Don't put long copy in a toast; keep the title to a phrase and move detail into the description.",
					],
				},
				related: ["alert", "announcer"],
				examples: [
					{
						title: "Saving feedback",
						description:
							"Call toast() from anywhere once a Toaster is mounted near the app root.",
					},
				],
			},
			{
				id: "empty-state",
				name: "Empty State",
				apiNames: ["EmptyState"],
				imports: ["EmptyState", "Button"],
				description:
					"An explanatory empty result with an optional action and SVG icon.",
				usage: `<EmptyState
  title="No reports"
  description="Create a report to begin tracking results."
  action={<Button>Create report</Button>}
/>`,
				anatomy: [
					{ part: "Icon well", description: "Rounded container holding a decorative SVG icon; hidden from assistive technology." },
					{ part: "Title", description: "Heading naming the empty condition; renders h3 by default and adjusts with titleAs." },
					{ part: "Description", description: "Short explanation of why the surface is empty and what happens next." },
					{ part: "Action", description: "Caller-supplied next step, usually a single primary Button." },
				],
				dosDonts: {
					dos: [
						"Lead with what happened, then offer one clear next action.",
						"Distinguish a first-run empty surface from a filtered no-results state in the copy.",
					],
					donts: [
						"Don't use an empty state while content is still loading; use Skeleton or LoadingState.",
						"Don't stack several competing actions under one empty state.",
					],
				},
				related: ["loading", "alert"],
				examples: [
					{
						title: "First-run",
						description:
							"Pair a short explanation with a single primary action.",
					},
				],
			},
			{
				id: "loading",
				name: "Loading",
				apiNames: ["LoadingState", "Spinner", "Skeleton", "Progress"],
				imports: ["Spinner", "Progress", "Skeleton", "LoadingState"],
				description:
					"Named progress and loading treatments for local, skeleton, and full-surface states.",
				usage: `<Spinner label="Saving" />
<Progress label="Import progress" value={64} />
<Skeleton className="h-4 w-40" />
<LoadingState label="Loading reports" />`,
				anatomy: [
					{ part: "Spinner", description: "role=\"status\" glyph with an accessible label for local, short waits." },
					{ part: "Progress", description: "Determinate bar that exposes aria-valuenow for measurable work." },
					{ part: "Skeleton", description: "aria-hidden placeholder block that reserves the shape of incoming content." },
					{ part: "LoadingState", description: "Centered role=\"status\" treatment that stands in for a whole region or panel." },
				],
				dosDonts: {
					dos: [
						"Match the treatment to the wait: Skeleton when the layout is known, Progress when it is measurable.",
						"Give Spinner and LoadingState a label that names the work, such as \"Saving\".",
					],
					donts: [
						"Don't show a spinner for operations that usually resolve instantly; it reads as flicker.",
						"Don't layer Skeleton and Spinner over the same region at once.",
					],
				},
				related: ["progress-circle", "loading-bar", "blocking-overlay"],
				examples: [
					{
						title: "Loading treatments",
						description:
							"Spinner and Progress for active work, Skeleton for layout placeholders, LoadingState for regions.",
					},
				],
			},
			{
				id: "alert",
				name: "Alert",
				apiNames: ["Alert"],
				imports: ["Alert", "Button"],
				description:
					"An inline feedback surface with semantic variants, an optional title, and dismissal; appearance renders it as a raised surface, a page-level banner strip, or a presentational callout.",
				usage: `<Alert variant="warning" title="Payment method expiring">
  The workspace card ends in 04/25. Update billing details to avoid interruption.
</Alert>`,
				anatomy: [
					{ part: "Variant icon", description: "Decorative severity glyph, hidden from assistive technology; not rendered for the banner appearance." },
					{ part: "Title", description: "Optional bold lead-in naming the condition." },
					{ part: "Body", description: "The explanatory message; wraps within the surface." },
					{ part: "Action", description: "Caller-supplied trailing control, such as a Button." },
					{ part: "Dismiss", description: "Optional labeled IconButton rendered when onDismiss is passed." },
				],
				dosDonts: {
					dos: [
						"Keep the alert mounted until the condition resolves or the user dismisses it.",
						"Use the danger variant for failures that need immediate attention; it announces assertively.",
						"Use appearance=\"banner\" for workspace-wide conditions and appearance=\"callout\" for quiet guidance that should not announce itself.",
					],
					donts: [
						"Don't use Alert for brief confirmations; use Toast instead.",
						"Don't rely on the icon or color alone; the text must carry the meaning.",
					],
				},
				related: ["offline-banner", "toast", "step-up-notice"],
				examples: [
					{
						title: "Variants",
						description:
							"Semantic variants pair a standard icon with a matching surface treatment.",
					},
				],
			},
			{
				id: "notification-item",
				name: "Notification Item",
				apiNames: ["NotificationItem"],
				imports: ["NotificationItem"],
				description:
					"A sanitized ecosystem inbox row with severity, source application, read state, deep link, and delivery-state controls.",
				usage: `<NotificationItem
  severity="warning"
  appLabel="Yang Operations"
  timestamp="2 hours ago"
  title="photos-api restarted unexpectedly"
  href="https://yang.example/incidents/photos-api"
  onMute={() => undefined}
  onArchive={() => undefined}
/>`,
				anatomy: [
					{ part: "Severity dot", description: "Small colored marker matched to the severity variant." },
					{ part: "Severity icon", description: "Decorative status icon beside the content; hidden from assistive technology." },
					{ part: "Title link", description: "Deep link to the source application event; unread items are bold and append a screen-reader-only unread marker." },
					{ part: "Metadata", description: "Source application label and caller-supplied timestamp." },
					{ part: "Mute and archive", description: "Optional IconButtons that change delivery state only, never the source event." },
				],
				dosDonts: {
					dos: [
						"Pass sanitized title and appLabel from the ecosystem payload; the row renders what it is given.",
						"Wire mute and archive to delivery-state endpoints only.",
					],
					donts: [
						"Don't mutate the source event from onMute or onArchive.",
						"Don't use NotificationItem for feedback local to the current task; use Alert or Toast.",
					],
				},
				related: ["notification-center", "health-indicator", "toast"],
				examples: [
					{
						title: "Unread with controls",
						description:
							"Unread items are emphasized and announced; mute and archive only touch delivery state, never the source event.",
					},
					{
						title: "Read",
						description:
							"Read items drop the emphasis and the unread announcement.",
					},
				],
			},
			{
				id: "health-indicator",
				name: "Health Indicator",
				apiNames: ["HealthIndicator"],
				imports: ["HealthIndicator"],
				description:
					"An explicit ecosystem health status that reports unknown and stale evidence instead of implying health.",
				usage: `<HealthIndicator status="healthy" label="Photos" />
<HealthIndicator status="unknown" label="Trict" />`,
				anatomy: [
					{ part: "Status badge", description: "Badge whose text and variant come straight from the reported status." },
					{ part: "Label", description: "Optional application name rendered beside the badge." },
				],
				dosDonts: {
					dos: [
						"Report missing evidence as unknown rather than implying healthy.",
						"Keep the status mapping on the evidence side; the indicator never infers.",
					],
					donts: [
						"Don't hide stale or unknown states to keep a dashboard green.",
						"Don't show a healthy badge without fresh evidence behind it.",
					],
				},
				related: ["status-dot", "badge", "notification-item"],
				examples: [
					{
						title: "Reported statuses",
						description:
							"Healthy, degraded, and down come straight from source evidence.",
					},
					{
						title: "Missing evidence",
						description:
							"Stale, unknown, and checking states stay visible; health is never inferred.",
					},
				],
			},
			{
				id: "step-up-notice",
				name: "Step-Up Notice",
				apiNames: ["StepUpNotice"],
				imports: ["StepUpNotice", "Button"],
				description:
					"An inline warning that explains a required fresh verification and hosts the caller’s verification action.",
				usage: `<StepUpNotice
  title="Confirm it's you"
  action={<Button size="sm">Verify with passkey</Button>}
>
  Approving a repair requires fresh verification.
</StepUpNotice>`,
				anatomy: [
					{ part: "Warning surface", description: "Built on Alert with the warning variant and its status semantics." },
					{ part: "Title", description: "Bold lead-in naming the verification requirement." },
					{ part: "Explanation", description: "Children text describing why fresh verification is required." },
					{ part: "Action", description: "Caller-supplied verification control, such as a passkey Button; the notice never starts verification itself." },
					{ part: "Dismiss", description: "Optional dismiss control rendered when onDismiss is passed." },
				],
				dosDonts: {
					dos: [
						"State which action needs verification and why in the body copy.",
						"Render the caller's verification control as the action so the flow stays product-owned.",
					],
					donts: [
						"Don't use StepUpNotice for plain warnings; use Alert.",
						"Don't make the notice dismissible when verification is mandatory to proceed.",
					],
				},
				related: ["alert", "dialog", "button"],
				examples: [
					{
						title: "Verification required",
						description:
							"The action is caller-supplied; the notice never starts verification on its own.",
					},
					{
						title: "Dismissible",
						description:
							"Pass onDismiss when the notice is informational rather than blocking.",
					},
				],
			},
			{
				id: "progress-circle",
				name: "Progress Circle",
				apiNames: ["ProgressCircle"],
				description:
					"A radial progress indicator with determinate and indeterminate modes.",
				usage: '<ProgressCircle value={64} label="Import progress" />',
				anatomy: [
					{ part: "Track", description: "Muted full circle that anchors the fill." },
					{ part: "Fill", description: "Primary arc whose dash offset encodes the value; spins as a dashed arc when indeterminate." },
					{ part: "Value label", description: "Centered percentage readout shown in determinate mode; hidden from assistive technology because the progressbar value carries it." },
				],
				dosDonts: {
					dos: [
						"Set an explicit size per context instead of scaling the circle.",
						"Always pass a label so the progressbar has an accessible name.",
					],
					donts: [
						"Don't use it for precise values in dense tables; use Progress or plain text.",
						"Don't shrink it below the size where the percentage label stays legible.",
					],
				},
				related: ["loading", "loading-bar", "meter"],
				examples: [
					{
						title: "Radial progress",
						description:
							'role="progressbar" carries the value; omit value for a spinning indeterminate arc.',
					},
				],
			},
			{
				id: "timeline",
				name: "Timeline",
				apiNames: ["Timeline"],
				description:
					"A vertical activity feed with tone dots, connectors, and timestamps.",
				usage: `<Timeline
  items={[
    { id: '1', title: 'Deploy finished', timestamp: '2 min ago', tone: 'success' },
  ]}
/>`,
				anatomy: [
					{ part: "Rail", description: "Fixed-width left column holding the dots and connectors; hidden from assistive technology." },
					{ part: "Tone dot", description: "Colored marker per item: neutral, primary, success, warning, or danger." },
					{ part: "Connector", description: "Hairline linking an item to the next; skipped after the last item." },
					{ part: "Content", description: "Title, optional description, and timestamp stacked per entry inside an ordered list." },
				],
				dosDonts: {
					dos: [
						"Order items chronologically and give each a stable id.",
						"Use tone dots to mark outcomes, such as success for a finished deploy.",
					],
					donts: [
						"Don't use Timeline for unordered peer items; use a plain List.",
						"Don't rely on the dot color alone; the title must state the outcome.",
					],
				},
				related: ["activity-feed", "list", "status-dot"],
				examples: [
					{
						title: "Activity feed",
						description:
							"Tone dots mark event semantics; connectors link the sequence.",
					},
				],
			},
			{
				id: "meter",
				name: "Meter",
				apiNames: ["Meter"],
				description:
					"A scalar gauge for a known range with optimum-zone coloring.",
				usage: `<Meter label="Storage used" value={72} low={60} high={85} optimum={20} />`,
				anatomy: [
					{ part: "Label and readout", description: "Heading text and formatted value on one row; the label names the meter through aria-labelledby." },
					{ part: "Track", description: "Rounded container bar that holds the fill." },
					{ part: "Zone fill", description: "Colored fill whose tone maps the value against low, high, and optimum into neutral, success, warning, or danger." },
				],
				dosDonts: {
					dos: [
						"Set low, high, and optimum together so the zone colors mean something.",
						"Use formatValue for units such as GB; it also feeds the accessible value text.",
					],
					donts: [
						"Don't use Meter for task completion; use Progress.",
						"Don't pass only one or two thresholds; without all three the fill stays neutral.",
					],
				},
				related: ["progress-circle", "loading", "stat"],
				examples: [
					{
						title: "Zones",
						description:
							"low, high, and optimum map the value onto neutral, success, warning, and danger fills.",
					},
				],
			},
			{
				id: "rating",
				name: "Rating",
				apiNames: ["Rating"],
				description:
					"A star rating input with radio semantics, arrow keys, and a read-only display mode.",
				usage: `<Rating label="Rate this report" defaultValue={3} onChange={(value) => undefined} />`,
				anatomy: [
					{ part: "Group", description: "role=\"radiogroup\" container named by the label prop; owns the arrow-key handling." },
					{ part: "Star buttons", description: "One role=\"radio\" button per star with aria-checked; only the checked star stays in the tab order." },
					{ part: "Read-only display", description: "Static stars rendered as role=\"img\" with an \"x out of y stars\" label when readOnly is set." },
				],
				dosDonts: {
					dos: [
						"Name the group with label, such as \"Rate this report\".",
						"Use readOnly for review summaries so scores display without entering the tab order.",
					],
					donts: [
						"Don't use Rating for arbitrary numeric input; use Slider or NumberInput.",
						"Don't change max away from five without a reason; users expect a familiar scale.",
					],
				},
				related: ["slider", "radio-group", "number-input"],
				examples: [
					{
						title: "Interactive rating",
						description:
							"Stars behave as a radiogroup with roving tab index; arrows move and select.",
					},
				],
			},
			{
				id: "announcer",
				name: "Announcer",
				apiNames: ["Announcer"],
				imports: ["Announcer", "Button"],
				description:
					"A visually hidden live region that re-announces a message whenever it changes.",
				usage: `<Announcer message={statusMessage} politeness="polite" />`,
				anatomy: [
					{ part: "Live region", description: "Visually hidden role=\"status\" element with aria-live set from politeness and aria-atomic." },
					{ part: "Clear-and-rewrite", description: "The message is emptied and then re-written so a repeated message is announced again." },
				],
				dosDonts: {
					dos: [
						"Keep one Announcer per message channel and update its message prop as state changes.",
						"Use assertive only for urgent changes that must interrupt the user.",
					],
					donts: [
						"Don't announce changes that are already visible and focused; that duplicates the information.",
						"Don't mount a new Announcer per message; reuse a single region.",
					],
				},
				related: ["toast", "alert", "save-status"],
				examples: [
					{
						title: "Status updates",
						description:
							"The region clears and rewrites so a repeated message is announced again.",
					},
				],
			},
				{
					id: "blocking-overlay",
					name: "Blocking Overlay",
					apiNames: ["BlockingOverlay"],
					description: "A full-surface overlay with a spinner that blocks interaction with the wrapped content during async work.",
					usage: `<BlockingOverlay\n  visible={isSaving}\n  label="Saving changes"\n>\n  <SettingsForm />\n</BlockingOverlay>`,
					anatomy: [
						{ part: "Wrapper", description: "Relative container around the protected content; sets aria-busy while the overlay is visible." },
						{ part: "Scrim", description: "Full-surface layer that blocks pointer interaction and traps Tab while shown." },
						{ part: "Status", description: "Centered spinner in a role=\"status\" region labeled by the label prop." },
					],
					dosDonts: {
						dos: [
							"Use it when concurrent edits would corrupt state, such as during a bulk save.",
							"Keep the label specific to the work in progress, such as \"Saving changes\".",
						],
						donts: [
							"Don't block the whole page for one control's work; use a Button loading state instead.",
							"Don't leave the overlay visible without a failure or timeout path.",
						],
					},
					related: ["loading", "error-boundary", "dialog"],
					examples: [
						{ title: "Always-on overlay", description: "The overlay covering placeholder content while visible." },
						{ title: "Triggered by work", description: "A simulated save that shows and hides the overlay around real async work." },
					],
				},
				{
					id: "error-boundary",
					name: "Error Boundary",
					apiNames: ["ErrorBoundary"],
					description: "A class-based error boundary that isolates render failures behind a fallback UI with reset support.",
					usage: `<ErrorBoundary\n  fallback={(error, reset) => <Fallback error={error} onRetry={reset} />}\n  onError={(error, info) => log(error)}\n  resetKeys={[pageId]}\n>\n  <Report />\n</ErrorBoundary>`,
					anatomy: [
						{ part: "Boundary", description: "Class component that catches render errors from its subtree and reports them through onError." },
						{ part: "Fallback", description: "Node or render prop receiving (error, reset) that is shown while the subtree is failed." },
						{ part: "Reset", description: "Re-renders the children when reset() is called or any resetKey changes." },
					],
					dosDonts: {
						dos: [
							"Place boundaries around independently failing subtrees such as widgets or third-party embeds.",
							"Give the fallback a recovery path through the reset callback.",
						],
						donts: [
							"Don't catch expected async errors here; handle those in data-loading code with EmptyState or Alert.",
							"Don't wrap the entire app in one boundary; a single failure then blanks the whole page.",
						],
					},
					related: ["empty-state", "alert", "blocking-overlay"],
					examples: [
						{ title: "Recoverable fallback", description: "A render-prop fallback that shows the error and offers a retry via the reset callback." },
						{ title: "Static fallback", description: "A plain React node shown whenever the protected subtree throws." },
					],
				},
				{
					id: "loading-bar",
					name: "Loading Bar",
					apiNames: ["LoadingBar"],
					description: "A thin top-of-page progress bar with determinate and indeterminate modes.",
					usage: `<LoadingBar\n  value={65}\n  label="Loading assets"\n/>`,
					anatomy: [
						{ part: "Track", description: "Thin 2px strip pinned to the top of the page." },
						{ part: "Fill", description: "Primary bar whose width animates to the value; pulses across the track when indeterminate." },
					],
					dosDonts: {
						dos: [
							"Use it for route transitions and page-level loads where the content stays on screen.",
							"Switch to determinate mode as soon as a measurable percentage exists.",
						],
						donts: [
							"Don't use it for region-local waits; use LoadingState or Spinner there.",
							"Don't fake smooth increments; jump to the real value when it is known.",
						],
					},
					related: ["loading", "progress-circle", "blocking-overlay"],
					examples: [
						{ title: "Determinate", description: "A known percentage pinned to the top of the page, for example while assets stream in." },
						{ title: "Indeterminate", description: "A pulsing bar for route transitions where progress cannot be measured." },
					],
				},
				{
					id: "network-status",
					name: "Network Status",
					apiNames: ["NetworkStatus"],
					description: "An inline indicator of the browser's online/offline state with a render prop for custom display.",
					usage: `<NetworkStatus\n  onlineLabel="Connected"\n  offlineLabel="No connection"\n/>`,
					anatomy: [
						{ part: "Icon", description: "Decorative connectivity glyph that flips with the online state." },
						{ part: "Label", description: "Online and offline text supplied through onlineLabel and offlineLabel." },
						{ part: "Render prop", description: "Optional custom output receiving the current online boolean." },
					],
					dosDonts: {
						dos: [
							"Place it near sync or save controls where connectivity changes the outcome.",
							"Expose the state as text in custom renders, never as color alone.",
						],
						donts: [
							"Don't use it as the only offline signal when unsaved work is at risk; use OfflineBanner.",
							"Don't poll navigator.onLine yourself; the component already listens to online and offline events.",
						],
					},
					related: ["offline-banner", "save-status", "status-dot"],
					examples: [
						{ title: "Default indicator", description: "An icon and label that track online/offline browser events." },
						{ title: "Custom render prop", description: "Fully custom output driven by the current online boolean." },
					],
				},
				{
					id: "offline-banner",
					name: "Offline Banner",
					apiNames: ["OfflineBanner"],
					description: "A dismissible banner that appears at the top of the page when the browser loses connectivity.",
					usage: `<OfflineBanner\n  message="You are offline. Changes may not be saved."\n  onDismiss={() => logDismiss()}\n/>`,
					anatomy: [
						{ part: "Status strip", description: "Top-of-page role=\"status\" banner with aria-live=\"polite\" that appears on the offline event and clears when the connection returns." },
						{ part: "Message", description: "Caller-supplied warning text; wraps at narrow widths." },
						{ part: "Dismiss", description: "Labeled close button; the banner stays dismissed until the next offline transition." },
					],
					dosDonts: {
						dos: [
							"Say what offline means for the user's work, such as \"Changes may not be saved\".",
							"Let the banner reappear on the next drop even if it was dismissed.",
						],
						donts: [
							"Don't show it when the app is fully local and connectivity is irrelevant.",
							"Don't auto-hide it on a timer; it clears itself when the connection returns.",
						],
					},
					related: ["network-status", "alert"],
					examples: [
						{ title: "Default banner", description: "Appears automatically on the offline event and disappears when the connection returns." },
						{ title: "Custom message", description: "Tailored copy and dismiss label for product-specific offline behavior." },
					],
				},
				{
					id: "save-status",
					name: "Save Status",
					apiNames: ["SaveStatus"],
					description: "An inline saved/saving/error indicator with an optional relative timestamp.",
					usage: `<SaveStatus\n  status="saved"\n  savedAt={lastSavedAt}\n/>`,
					anatomy: [
						{ part: "Status icon", description: "Check, spinner, or error glyph matched to the status; aria-hidden." },
						{ part: "Status text", description: "Saved, Saving, or Save failed wording rendered by the component." },
						{ part: "Timestamp", description: "Optional relative saved-at time appended after \"Saved\", with a custom formatter option." },
					],
					dosDonts: {
						dos: [
							"Place it in the header or toolbar of an autosaving editor where it stays visible.",
							"Pass the real savedAt time so the relative timestamp stays honest.",
						],
						donts: [
							"Don't use it for an explicit save action; show the result with a Toast instead.",
							"Don't show the saved state before the persistence request actually resolves.",
						],
					},
					related: ["toast", "network-status", "status-dot"],
					examples: [
						{ title: "All three states", description: "Saved, saving, and error side by side — the full lifecycle of an autosave." },
						{ title: "Relative timestamp", description: "A saved-at time rendered as relative text, with a custom formatter option." },
					],
				},
				{
					id: "status-dot",
					name: "Status Dot",
					apiNames: ["StatusDot"],
					description: "A small colored dot with an optional text label for compact entity status; pass pulse for live presence or ongoing activity.",
					usage: `<StatusDot\n  variant="success"\n  label="Online"\n/>`,
					anatomy: [
						{ part: "Dot", description: "Small colored marker with variant and size options; aria-hidden. In pulse mode it renders as a ping ring over a solid dot, both aria-hidden." },
						{ part: "Label", description: "Optional visible text that carries the status meaning; in pulse mode it becomes the aria-label on the role=\"status\" element (default \"Live\")." },
					],
					dosDonts: {
						dos: [
							"Pair the dot with a text label so color is never the only signal.",
							"Use the success, warning, and danger variants for health-style readouts.",
							"Pass pulse with a label that says what is live, such as \"3 editors online\".",
						],
						donts: [
							"Don't use a bare dot for a status users must act on; use Alert.",
							"Don't animate a static status dot; reserve pulse for live activity.",
						],
					},
					related: ["health-indicator", "badge", "network-status"],
					examples: [
						{ title: "Labeled statuses", description: "Dots paired with text labels for scanable inline status in lists and headers." },
						{ title: "Semantic variants", description: "The success, warning, and danger variants for health-style readouts." },
						{ title: "Live pulse", description: "Pulse mode for live presence or streaming activity, announced via an accessible label." },
					],
				},
				{
					id: "upload-progress",
					name: "Upload Progress",
					apiNames: ["UploadProgress"],
					description: "A file upload progress row with file name, determinate bar, formatted size, and a cancel button.",
					usage: `<UploadProgress\n  fileName="design-spec.fig"\n  progress={62}\n  size={4718592}\n  onCancel={cancelUpload}\n/>`,
					anatomy: [
						{ part: "File icon and name", description: "Decorative file glyph plus the file name, which truncates with ellipsis." },
						{ part: "Progress bar", description: "role=\"progressbar\" labeled \"Uploading <file name>\" with values clamped to 0–100." },
						{ part: "Size", description: "Byte size formatted into KB, MB, or GB." },
						{ part: "Cancel", description: "Trailing button that calls onCancel; its accessible name includes the file name." },
					],
					dosDonts: {
						dos: [
							"Keep one row per in-flight upload and wire onCancel to abort the request.",
							"Pass raw bytes and percentages; the component clamps and formats them.",
						],
						donts: [
							"Don't use it for a single overall progress figure; use Progress or LoadingBar.",
							"Don't remove the row the instant it hits 100%; give the completion a beat.",
						],
					},
					related: ["file-upload", "loading", "progress-circle"],
					examples: [
						{ title: "In-flight uploads", description: "Rows with progress, size, and a cancel action for active uploads." },
						{ title: "Completed and large files", description: "A finished upload at 100% and a large file with formatted GB size." },
					],
				},
		],
	},
	{
		name: "Navigation",
		modules: [
			{
				id: "app-switcher",
				name: "App Switcher",
				apiNames: ["AppSwitcher"],
				imports: ["AppSwitcher", "Button"],
				description:
					"An entitlement-filtered application switcher with an explicit Home destination and keyboard navigation.",
				usage: `<AppSwitcher
  trigger={<Button variant="secondary">Switch application</Button>}
  homeHref="https://home.example"
  homeLabel="Home"
  apps={[
    { id: 'yang', label: 'Yang Operations', href: 'https://yang.example' },
    { id: 'photos', label: 'Photos', href: 'https://photos.example', current: true },
  ]}
/>`,
				anatomy: [
					{ part: "Trigger", description: "The caller-supplied element, usually a Button, that opens the switcher menu." },
					{ part: "Home destination", description: "The explicit Home link rendered first; homeCurrent marks it with aria-current." },
					{ part: "Separator", description: "A divider shown only when at least one entitled application follows Home." },
					{ part: "Application items", description: "Entitlement-filtered links with optional icons; the current application sets aria-current=\"page\"." },
				],
				dosDonts: {
					dos: [
						"Filter apps by entitlement before passing them in; the switcher renders only what it receives.",
						"Always provide homeHref and homeLabel so people can return to the stable Home destination.",
						"Mark the application in use with current so it is announced as the current page.",
					],
					donts: [
						"Don't use it for navigation within one application; use Sidebar or Tabs instead.",
						"Don't hide the current application from the list; show it marked current instead.",
						"Don't put actions in the menu; every item navigates to a product destination.",
					],
				},
				related: ["ecosystem-rail", "launcher-card", "menu"],
				examples: [
					{
						title: "Household applications",
						description:
							"The caller filters applications by entitlement first; the switcher renders only what it is given plus the explicit Home destination.",
					},
					{
						title: "Single application",
						description:
							"A member with one entitled application still gets the explicit Home destination.",
					},
				],
			},
			{
				id: "account-menu",
				name: "Account Menu",
				apiNames: ["AccountMenu"],
				imports: ["AccountMenu"],
				description:
					"A household account menu with an identity header, product items, and distinct app and SSO sign-out actions.",
				usage: `<AccountMenu
  user={{ name: 'Avery Chen', email: 'avery@example.com' }}
  items={[{ id: 'sessions', label: 'Active sessions', onSelect: () => undefined }]}
  appSignOut={{ label: 'Sign out of Photos', onSelect: () => undefined }}
  ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => undefined }}
/>`,
				anatomy: [
					{ part: "Trigger", description: "Compact avatar button named after the signed-in user." },
					{ part: "Identity header", description: "Name and email block that anchors the menu to an account." },
					{ part: "Product items", description: "Caller-defined account actions such as active sessions or settings." },
					{ part: "Sign-out actions", description: "Distinct app-session and SSO sign-out items with product-supplied labels." },
				],
				dosDonts: {
					dos: [
						"Label both sign-out actions by product so sessions stay distinguishable.",
						"Keep the identity header even when there are no product items.",
						"Order neutral account items before the sign-out actions.",
					],
					donts: [
						"Don't merge app and SSO sign-out into one ambiguous action.",
						"Don't show the menu on public surfaces with no signed-in identity.",
						"Don't bury primary navigation here; it is for account and session actions.",
					],
				},
				related: ["app-switcher", "menu", "top-bar"],
				examples: [
					{
						title: "Household account",
						description:
							"Sign-out actions are labeled by the product so people can tell an application session from the shared SSO session.",
					},
					{
						title: "Without product items",
						description:
							"The items list is optional; the identity header and sign-out actions remain.",
					},
				],
			},
			{
				id: "tabs",
				name: "Tabs",
				apiNames: ["Tabs"],
				description:
					"Keyboard-navigable content switching through a compact item interface.",
				usage: `<Tabs
  aria-label="Account sections"
  defaultValue="profile"
  items={[
    { value: 'profile', label: 'Profile', content: <ProfilePanel /> },
    { value: 'billing', label: 'Billing', content: <BillingPanel /> },
  ]}
/>`,
				anatomy: [
					{ part: "Tab list", description: "The tablist row that owns arrow-key movement between tabs." },
					{ part: "Tab", description: "Each trigger; the selected one sets aria-selected and drives the visible panel." },
					{ part: "Tab panel", description: "The content region labelled by its tab, shown one at a time." },
				],
				dosDonts: {
					dos: [
						"Keep tab labels to one or two words.",
						"Set defaultValue so a sensible panel is visible on first render.",
						"Control selection with value and onValueChange when a route or parent owns it.",
					],
					donts: [
						"Don't use tabs to navigate between routes; use Sub Nav so links stay links.",
						"Don't nest a tab list inside another tab panel.",
						"Don't use tabs for a sequential flow; use Steps.",
					],
				},
				related: ["sub-nav", "toggle-group", "accordion"],
				examples: [
					{
						title: "Sections",
						description:
							"Tabs follow the ARIA authoring practices keyboard pattern out of the box.",
					},
				],
			},
			{
				id: "pagination",
				name: "Pagination",
				apiNames: ["Pagination"],
				description:
					"A controlled page navigator with compact ranges and unavailable directions.",
				usage:
					"const [page, setPage] = useState(1)\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />",
				anatomy: [
					{ part: "Previous and next", description: "Directional controls that disable at the first and last page." },
					{ part: "Page buttons", description: "Numbered pages; the current one sets aria-current=\"page\"." },
					{ part: "Ellipsis", description: "Collapsed ranges that keep long page counts compact." },
				],
				dosDonts: {
					dos: [
						"Drive it from state with page and onPageChange; it is fully controlled.",
						"Pair it with a result count so the page numbers have context.",
						"Reset to page one when filters or sorting change.",
					],
					donts: [
						"Don't use it for a linear wizard; use Steps.",
						"Don't paginate content that streams better with infinite scroll.",
						"Don't render it for a single page of results.",
					],
				},
				related: ["table", "steps"],
				examples: [
					{
						title: "Controlled pages",
						description:
							"Pagination is fully controlled through page and onPageChange.",
					},
				],
			},
			{
				id: "page-header",
				name: "Page Header",
				apiNames: ["PageHeader"],
				imports: ["PageHeader", "Button"],
				description:
					"A responsive page title, supporting text, and action area.",
				usage: `<PageHeader
  title="Workspace settings"
  subtitle="Manage security and notifications"
  actions={<Button>Save changes</Button>}
/>`,
				anatomy: [
					{ part: "Title", description: "Page heading rendered as h1 by default; adjust with titleAs to fit the page outline." },
					{ part: "Subtitle", description: "Supporting text rendered under the title." },
					{ part: "Actions", description: "Trailing action area that wraps below the title on narrow screens." },
				],
				dosDonts: {
					dos: [
						"Keep one primary action in the actions slot; demote the rest.",
						"Set titleAs so the heading level fits the page outline.",
						"Pair with Breadcrumb above when the page sits deep in a hierarchy.",
					],
					donts: [
						"Don't repeat the global Top Bar actions here; keep them page-level.",
						"Don't stack multiple page headers on one route.",
					],
				},
				related: ["breadcrumb", "top-bar", "sub-nav"],
				examples: [
					{
						title: "Settings header",
						description:
							"Actions wrap below the title on narrow screens automatically.",
					},
				],
			},
			{
				id: "nav-rail",
				name: "Nav Rail",
				apiNames: ["NavRail", "NavRailItem"],
				description:
					"A fully rounded floating icon rail for dense product navigation.",
				usage: `<NavRail aria-label="Primary">
  <NavRailItem icon={<Home />} label="Home" href="/" active />
  <NavRailItem icon={<Search />} label="Search" href="/search" />
  <NavRailItem icon={<Settings />} label="Settings" href="/settings" />
</NavRail>`,
				anatomy: [
					{ part: "Rail landmark", description: "The rounded floating nav container named through aria-label, defaulting to \"Primary\"." },
					{ part: "Items", description: "Circular icon links or buttons; each requires a label applied as aria-label and mirrored in a tooltip." },
					{ part: "Badge dot", description: "An attention dot in the item corner, flagged with badge and hidden from assistive technology." },
				],
				dosDonts: {
					dos: [
						"Give every item a short label; it is the accessible name and the tooltip text.",
						"Render items as links with href for real destinations so open-in-new-tab works.",
						"Use badge sparingly to flag a destination that needs attention without carrying a count.",
					],
					donts: [
						"Don't use it when destinations need visible labels or grouped sections; use Sidebar.",
						"Don't crowd in more than a handful of destinations; the rail is for top-level navigation only.",
						"Don't rely on the badge dot alone to convey meaning; pair it with a notification surface.",
					],
				},
				related: ["sidebar", "ecosystem-rail", "tooltip"],
				examples: [
					{
						title: "Icon destinations",
						description:
							"Circular items tint the active destination; every icon carries an accessible label and a tooltip.",
					},
				],
			},
			{
				id: "ecosystem-rail",
				name: "Ecosystem Rail",
				apiNames: ["EcosystemRail"],
				imports: ["EcosystemRail", "SidebarItem"],
				description:
					"A persistent cross-product rail with a stable Home destination, caller-filtered applications, and honest health status.",
				usage: `<EcosystemRail
  home={{ href: 'https://home.example', label: 'Home', icon: <Home /> }}
  destinations={[
    { id: 'yang', label: 'Yang Operations', href: 'https://yang.example', icon: <Gauge />, current: true },
    { id: 'photos', label: 'Photos', href: 'https://photos.example', icon: <Camera />, status: 'degraded' },
  ]}
/>`,
				anatomy: [
					{ part: "Brand", description: "Optional product-family mark rendered above the list, supplied through the brand prop." },
					{ part: "Home destination", description: "The stable Home link, always rendered first; pass current when Home is the active product." },
					{ part: "Destinations", description: "Caller-filtered application links with icons; an optional HealthIndicator shows an honest status beside each label." },
					{ part: "Footer", description: "Optional account or session controls pinned to the bottom of the rail." },
				],
				dosDonts: {
					dos: [
						"Filter destinations by entitlement before passing them in; the rail renders exactly what it is given.",
						"Mark the product the person is currently using with current so the item sets aria-current.",
						"Pass status only with real evidence; omit it or use unknown when health is not measured.",
					],
					donts: [
						"Don't use it for navigation inside one application; use Sidebar instead.",
						"Don't derive or hide entitlements inside the rail; it never filters destinations itself.",
						"Don't reorder Home into the destination list; it is always rendered first by design.",
					],
				},
				related: ["app-switcher", "sidebar", "health-indicator"],
				examples: [
					{
						title: "Rail mode with health status",
						description:
							"The default icon rail expands on hover or focus; destinations carry an honest HealthIndicator status only when evidence exists.",
					},
					{
						title: "Full mode with a degraded destination",
						description:
							"mode=\"full\" keeps labels visible; Home is marked current and the degraded Photos status stays readable beside its label.",
					},
				],
			},
			{
				id: "top-bar",
				name: "Top Bar",
				apiNames: ["TopBar", "TopBarBrand", "TopBarSearch", "TopBarActions"],
				imports: ["TopBar", "TopBarBrand", "TopBarSearch", "TopBarActions"],
				description: "A sticky top bar with brand, search, and action slots.",
				usage: `<TopBar sticky>
  <TopBarBrand>...</TopBarBrand>
  <TopBarSearch>...</TopBarSearch>
  <TopBarActions>...</TopBarActions>
</TopBar>`,
				anatomy: [
					{ part: "Bar", description: "The sticky container that keeps its slots visible while scrolling." },
					{ part: "Brand", description: "TopBarBrand slot for product identity on the leading edge." },
					{ part: "Search", description: "TopBarSearch slot for global search in the middle." },
					{ part: "Actions", description: "TopBarActions slot for trailing controls such as the account menu." },
				],
				dosDonts: {
					dos: [
						"Use sticky for apps where global actions must stay reachable while scrolling.",
						"Collapse secondary actions into a menu on narrow screens.",
					],
					donts: [
						"Don't put page-level actions here; they belong in Page Header.",
						"Don't stack multiple top bars; compose the slots into one.",
					],
				},
				related: ["page-header", "app-switcher", "account-menu"],
				examples: [
					{
						title: "Brand, search, and actions",
						description:
							"Slots compose into full and compact headers; sticky keeps the bar visible while scrolling.",
					},
				],
			},
			{
				id: "breadcrumb",
				name: "Breadcrumb",
				apiNames: ["Breadcrumb"],
				description:
					"A hierarchical trail with router-ready items and automatic middle-item collapse.",
				usage: `<Breadcrumb
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Orion' },
  ]}
/>`,
				anatomy: [
					{ part: "Trail", description: "Nav landmark rendering the items in order as links." },
					{ part: "Separators", description: "Chevron icons between items, hidden from assistive technology." },
					{ part: "Current page", description: "The last item, rendered as text with aria-current=\"page\"." },
					{ part: "Collapse menu", description: "Middle items fold into an overflow menu past collapseAfter." },
				],
				dosDonts: {
					dos: [
						"Keep the last item as plain text; it is the current page, not a link.",
						"Prefer collapsing middle items over truncating labels on narrow screens.",
					],
					donts: [
						"Don't use breadcrumbs on flat structures or as a back button.",
						"Don't duplicate the primary navigation in the trail.",
					],
				},
				related: ["page-header", "sub-nav", "anchor-nav"],
				examples: [
					{
						title: "Hierarchy",
						description:
							"Items render in order; the last item is the current page.",
					},
				],
			},
			{
				id: "steps",
				name: "Steps",
				apiNames: ["Steps"],
				description:
					"A numbered flow indicator with done, current, and upcoming states.",
				usage: `<Steps
  current={1}
  steps={[
    { label: 'Workspace' },
    { label: 'Members' },
    { label: 'Review' },
  ]}
/>`,
				anatomy: [
					{ part: "Markers", description: "Numbered circles that switch to a check once a step is done." },
					{ part: "Labels", description: "Step names; the current step sets aria-current=\"step\"." },
					{ part: "Connectors", description: "Lines between markers that fill as steps complete." },
				],
				dosDonts: {
					dos: [
						"Provide onStepClick so people can return to completed steps.",
						"Keep step labels to short nouns.",
					],
					donts: [
						"Don't let people jump ahead; only completed steps become clickable.",
						"Don't use it as page navigation; it tracks one flow's progress.",
					],
				},
				related: ["pagination", "breadcrumb", "timeline"],
				examples: [
					{
						title: "Flow progress",
						description:
							"Completed steps can be clickable; the current step sets aria-current.",
					},
				],
			},
			{
				id: "tree-view",
				name: "Tree View",
				apiNames: ["TreeView"],
				description:
					"A hierarchical disclosure list with keyboard navigation and selection.",
				usage: `<TreeView
  aria-label="Project files"
  items={[
    { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },
  ]}
/>`,
				anatomy: [
					{ part: "Tree", description: "The role=\"tree\" list, named by a required aria-label." },
					{ part: "Tree items", description: "role=\"treeitem\" rows with aria-expanded on parents and aria-selected on the selection." },
					{ part: "Toggle", description: "Chevron that expands or collapses a parent without selecting it." },
					{ part: "Groups", description: "role=\"group\" lists holding each parent's children." },
				],
				dosDonts: {
					dos: [
						"Always pass an aria-label naming the tree.",
						"Use it only for genuinely hierarchical data like files or categories.",
					],
					donts: [
						"Don't render flat lists as trees; use List instead.",
						"Don't put interactive controls inside rows; keep the single-focus tree pattern.",
					],
				},
				related: ["accordion", "list", "tree-grid"],
				examples: [
					{
						title: "Hierarchy",
						description:
							"Arrows expand, collapse, and move; Enter selects with aria-selected.",
					},
				],
			},
			{
				id: "menubar",
				name: "Menubar",
				apiNames: ["Menubar"],
				description:
					"An application command bar of labeled dropdown menus with full keyboard navigation.",
				usage: `<Menubar
  label="Application"
  menus={[
    { label: 'File', items: [{ id: 'new', label: 'New project', onSelect: () => undefined }] },
    { label: 'Edit', items: [{ id: 'undo', label: 'Undo', onSelect: () => undefined }] },
  ]}
/>`,
				anatomy: [
					{ part: "Menu bar", description: "The menubar root row, named by the label prop." },
					{ part: "Triggers", description: "Labeled menu buttons such as File and Edit." },
					{ part: "Menu panels", description: "Dropdown lists of items with optional icons, separators, and a danger variant." },
				],
				dosDonts: {
					dos: [
						"Group commands the way desktop users expect: File, Edit, View.",
						"Use separatorBefore to split destructive commands from safe ones.",
					],
					donts: [
						"Don't use it for site navigation; use Navigation Menu.",
						"Don't use it for a handful of actions; use a Toolbar.",
					],
				},
				related: ["menu", "toolbar", "command"],
				examples: [
					{
						title: "Application commands",
						description:
							"Arrows move across menus and through items following the menubar pattern.",
					},
				],
			},
			{
				id: "navigation-menu",
				name: "Navigation Menu",
				apiNames: ["NavigationMenu"],
				description:
					"A top-level navigation bar mixing links with rich content panels in a shared viewport.",
				usage: `<NavigationMenu
  label="Primary"
  items={[
    { type: 'link', label: 'Overview', href: '/', active: true },
    { type: 'panel', label: 'Products', content: <ProductsPanel /> },
  ]}
/>`,
				anatomy: [
					{ part: "List", description: "Top-level row mixing link items and panel triggers." },
					{ part: "Link items", description: "Plain navigation links; the active one sets aria-current=\"page\"." },
					{ part: "Panel triggers", description: "Buttons that open rich content in the shared viewport." },
					{ part: "Viewport", description: "One shared surface that animates between open panels." },
				],
				dosDonts: {
					dos: [
						"Keep panels to scannable groups of links, not forms.",
						"Mark the current page's link item active.",
					],
					donts: [
						"Don't use it when everything is a flat link; simpler link styling suffices.",
						"Don't put commands or forms inside panels; they are for navigation content.",
					],
				},
				related: ["mega-menu", "menubar", "top-bar"],
				examples: [
					{
						title: "Links and panels",
						description:
							"Link items navigate with aria-current; panel items reveal content in one viewport.",
					},
				],
			},
			{
				id: "back-top",
				name: "Back Top",
				apiNames: ["BackTop"],
				description:
					"A floating button that appears after scrolling and returns to the top of the page.",
				usage: `<BackTop threshold={400} />`,
				anatomy: [
					{ part: "Button", description: "Floating circular button fixed near the bottom corner, revealed past the scroll threshold." },
					{ part: "Icon", description: "Up arrow hidden from assistive technology; the button carries its own accessible label." },
				],
				dosDonts: {
					dos: [
						"Set the threshold to roughly one viewport of scrolling.",
						"Keep it clear of other floating controls like chat widgets.",
					],
					donts: [
						"Don't show it on short pages where it adds noise.",
						"Don't place it inside a nested scroll container it cannot observe.",
					],
				},
				related: ["floating-action-button", "scroll-area", "anchor-nav"],
				examples: [
					{
						title: "Scroll recovery",
						description:
							"Appears past the threshold and honors reduced motion when scrolling back up.",
					},
				],
			},
				{
					id: "anchor-nav",
					name: "Anchor Nav",
					apiNames: ["AnchorNav"],
					description:
						"A scroll-spy nav of page section anchors that highlights the section in view and smooth-scrolls on click.",
					usage: `<AnchorNav
  containerRef={scrollBoxRef}
  items={[
    { id: 'overview', label: 'Overview' },
    {
      id: 'features',
      label: 'Features',
      children: [{ id: 'feature-flags', label: 'Feature flags' }],
    },
    { id: 'pricing', label: 'Pricing' },
  ]}
/>`,
					anatomy: [
						{ part: "Nav", description: "Landmark labelled \"On this page\" by default." },
						{ part: "Items", description: "Anchor links to page sections; the section in view sets aria-current=\"location\"." },
						{ part: "Children", description: "Optional nested sections rendered as an indented sub-list under their parent item." },
					],
					dosDonts: {
						dos: [
							"Give each section a stable id that matches its item.",
							"Seed defaultActiveId when deep links should start highlighted.",
							"Pass containerRef when the sections live in their own scroll box instead of the window.",
						],
						donts: [
							"Don't nest deeper than two levels; a deeper outline becomes hard to scan.",
							"Don't render sections inside the nav; it only points at them.",
						],
					},
					related: ["scroll-area", "sub-nav", "back-top"],
					examples: [
						{
							title: "Scroll-spy sections",
							description:
								"An IntersectionObserver rooted at the scroll box tracks the rendered sections and moves the highlight as the page scrolls.",
						},
						{
							title: "Seeded active item",
							description:
								"defaultActiveId controls the initial highlight before any scrolling happens, useful for deep links.",
						},
						{
							title: "Nested sections",
							description:
								"Items accept children to mirror the page outline; nested sections are indented and tracked by the same scroll spy.",
						},
					],
				},
				{
					id: "bottom-nav",
					name: "Bottom Nav",
					apiNames: ["BottomNav", "BottomNavItem"],
					description:
						"A mobile bottom navigation bar of three to five icon-and-label items with aria-current and safe-area padding.",
					usage: `<BottomNav>
  <BottomNavItem active href="/home" icon={<Home />} label="Home" />
  <BottomNavItem href="/search" icon={<Search />} label="Search" />
  <BottomNavItem badge={3} href="/alerts" icon={<Bell />} label="Alerts" />
  <BottomNavItem href="/profile" icon={<User />} label="Profile" />
</BottomNav>`,
					anatomy: [
						{ part: "Bar", description: "Fixed bottom nav landmark with safe-area padding for notched devices." },
						{ part: "Items", description: "Icon-and-label links sharing the width equally; the active one sets aria-current=\"page\"." },
						{ part: "Badge", description: "Optional count bubble on an item for unseen activity." },
					],
					dosDonts: {
						dos: [
							"Keep it to three to five top-level destinations.",
							"Hide it at desktop widths and switch to a Sidebar or Top Bar.",
						],
						donts: [
							"Don't use it for hierarchical or numerous destinations.",
							"Don't put creation actions like compose here; it switches destinations.",
						],
					},
					related: ["nav-rail", "sidebar", "dock"],
					examples: [
						{
							title: "Four destinations",
							description:
								"The default mobile pattern with an active destination and a badge count on the alerts icon.",
						},
						{
							title: "Five destinations",
							description:
								"Items share the bar width equally up to the recommended maximum of five destinations.",
						},
					],
				},
				{
					id: "dock",
					name: "Dock",
					apiNames: ["Dock", "DockItem"],
					description:
						"A macOS-style dock of icon buttons with hover tooltips, accessible names, and an active-app indicator dot.",
					usage: `<Dock>
  <DockItem active icon={<Mail />} label="Mail" />
  <DockItem icon={<Music />} label="Music" />
  <DockItem icon={<Folder />} label="Files" />
</Dock>`,
					anatomy: [
						{ part: "Dock", description: "Centered icon bar rendered as a named navigation landmark." },
						{ part: "Items", description: "Icon buttons whose label is both the accessible name and the tooltip text." },
						{ part: "Active dot", description: "Non-interactive indicator under the current app." },
					],
					dosDonts: {
						dos: [
							"Keep the set small; every icon must stay recognizable.",
							"Give the dock a distinct aria-label when other nav landmarks share the page.",
						],
						donts: [
							"Don't use it when items need visible text labels; use Bottom Nav.",
							"Don't overload it with destinations; it is a launcher, not a full nav.",
						],
					},
					related: ["nav-rail", "bottom-nav", "floating-toolbar"],
					examples: [
						{
							title: "App dock",
							description:
								"Icon buttons lift on hover and show a tooltip label; active apps get a dot underneath.",
						},
						{
							title: "Custom landmark name",
							description:
								"A custom aria-label scopes the dock when several navigation landmarks share the page.",
						},
					],
				},
				{
					id: "floating-toolbar",
					name: "Floating Toolbar",
					apiNames: ["FloatingToolbar"],
					description:
						"A floating contextual toolbar that appears near a selection or anchored element, with roving tabindex and arrow-key navigation.",
					usage: `<FloatingToolbar open={hasSelection} className="left-1/2 top-2 -translate-x-1/2">
  <button aria-label="Bold"><Bold /></button>
  <button aria-label="Italic"><Italic /></button>
  <button aria-label="Underline"><Underline /></button>
</FloatingToolbar>`,
					anatomy: [
						{ part: "Toolbar", description: "Floating toolbar surface positioned by the caller near its anchor." },
						{ part: "Controls", description: "Caller-supplied buttons reached with arrow keys through a roving tabindex." },
					],
					dosDonts: {
						dos: [
							"Render it only while its context exists; pass open={hasSelection}.",
							"Label every icon-only button with aria-label.",
						],
						donts: [
							"Don't use it for always-visible controls; use Toolbar.",
							"Don't trap focus; it stays a single tab stop with arrow-key movement.",
						],
					},
					related: ["toolbar", "menu", "dock"],
					examples: [
						{
							title: "Selection formatting",
							description:
								"Anchored above highlighted text with the classic bold, italic, and underline controls.",
						},
						{
							title: "Custom action set",
							description:
								"Any buttons work inside; the toolbar manages focus movement across whatever controls it contains.",
						},
					],
				},
				{
					id: "mega-menu",
					name: "Mega Menu",
					apiNames: ["MegaMenu", "MegaMenuItem", "MegaMenuColumn", "MegaMenuLink"],
					description:
						"A top-level navigation item that opens a multi-column link panel on hover, focus, or click, with full keyboard support.",
					usage: `<MegaMenu>
  <MegaMenuItem label="Products">
    <MegaMenuColumn heading="Build">
      <MegaMenuLink href="/editor">Editor</MegaMenuLink>
      <MegaMenuLink href="/preview">Preview</MegaMenuLink>
    </MegaMenuColumn>
    <MegaMenuColumn heading="Ship">
      <MegaMenuLink href="/hosting">Hosting</MegaMenuLink>
    </MegaMenuColumn>
  </MegaMenuItem>
</MegaMenu>`,
					anatomy: [
						{ part: "Trigger", description: "Top-level item button exposing aria-expanded and aria-haspopup." },
						{ part: "Panel", description: "Multi-column surface opened on hover, focus, or click." },
						{ part: "Columns", description: "MegaMenuColumn groups with headings that organize the links." },
						{ part: "Links", description: "MegaMenuLink destinations inside each column." },
					],
					dosDonts: {
						dos: [
							"Group links under a heading per column so wide panels stay scannable.",
							"Keep panels to links; move actions into a Menu.",
						],
						donts: [
							"Don't use it for a single short list; use Menu.",
							"Don't try to pin several panels open; only one is open at a time by design.",
						],
					},
					related: ["navigation-menu", "menu", "accordion"],
					examples: [
						{
							title: "Two-column panel",
							description:
								"Grouped columns of links under a single trigger; opens on hover, focus, or click.",
						},
						{
							title: "Three-column panel",
							description:
								"Wider panels stay scannable with headings per column, useful for solution or industry menus.",
						},
					],
				},
				{
					id: "sidebar",
					name: "Sidebar",
					apiNames: ["Sidebar", "SidebarHeader", "SidebarContent", "SidebarFooter", "SidebarSection", "SidebarItem", "SidebarCollapseButton"],
					description:
						"A full app sidebar with header, content, and footer slots. It collapses to an icon rail through the collapsed state, switches to a hover-expanding rail with mode=\"rail\", floats as a glass pill with floating, and sets aria-current on the active item.",
					usage: `<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarContent>
    <SidebarSection label="Workspace">
      <SidebarItem active href="/overview" icon={<LayoutDashboard />}>
        Overview
      </SidebarItem>
      <SidebarItem href="/projects" icon={<FolderKanban />}>
        Projects
      </SidebarItem>
    </SidebarSection>
  </SidebarContent>
  <SidebarFooter>
    <SidebarCollapseButton />
  </SidebarFooter>
</Sidebar>`,
					anatomy: [
						{ part: "Header", description: "SidebarHeader slot for product identity." },
						{ part: "Content", description: "SidebarContent holding SidebarSection groups of items." },
						{ part: "Items", description: "SidebarItem links; the active one sets aria-current=\"page\"." },
						{ part: "Footer", description: "SidebarFooter slot, usually holding the SidebarCollapseButton." },
					],
					dosDonts: {
						dos: [
							"Persist the collapsed state so it survives navigation.",
							"Keep icons on every item so the collapsed rail stays usable.",
						],
						donts: [
							"Don't hide critical destinations only in the expanded state.",
							"Don't use it as a dense icon-only strip with tooltips; use Nav Rail instead.",
						],
					},
					related: ["nav-rail", "ecosystem-rail", "dialog"],
					examples: [
						{
							title: "Expanded sidebar",
							description:
								"Full labels with header, sectioned items, and a collapse button pinned in the footer.",
						},
						{
							title: "Collapsed icon rail",
							description:
								"defaultCollapsed starts the sidebar as an icon-only rail; item labels hide and icons stay centered.",
						},
						{
							title: "Rail mode",
							description:
								"mode=\"rail\" collapses to an icon strip that expands on hover or keyboard focus; the active item shows a circular background around its icon.",
						},
						{
							title: "Floating glass rail",
							description:
								"floating turns the rail into a translucent, blurred pill that glides over content; position it with className.",
						},
					],
				},
				{
					id: "skip-link",
					name: "Skip Link",
					apiNames: ["SkipLink"],
					description:
						"A visually-hidden-until-focused \"Skip to content\" link that becomes the first tab stop of the page.",
					usage: `<SkipLink href="#main" />`,
					anatomy: [
						{ part: "Link", description: "Anchor to the main landmark, visually hidden off-screen until it receives focus." },
						{ part: "Target", description: "The #main element it points to, which must exist on the page." },
					],
					dosDonts: {
						dos: [
							"Make it the first focusable element on the page.",
							"Point it at a landmark that exists, such as <main id=\"main\">.",
						],
						donts: [
							"Don't add one on pages with no repeated blocks before the content.",
							"Don't hide it with display: none; it must stay focusable while off-screen.",
						],
					},
					related: ["app-shell", "top-bar", "page-header"],
					examples: [
						{
							title: "Default skip link",
							description:
								"Hidden off-screen until focused, then slides into view at the top corner; targets #main by default.",
						},
						{
							title: "Custom target and label",
							description:
								"Point at a different landmark and rename the link for multi-landmark pages.",
						},
					],
				},
				{
					id: "sub-nav",
					name: "Sub Nav",
					apiNames: ["SubNav", "SubNavItem"],
					description:
						"A secondary horizontal nav row with an underline indicator for the active item that scrolls when items overflow.",
					usage: `<SubNav aria-label="Project settings">
  <SubNavItem active href="#general">General</SubNavItem>
  <SubNavItem href="#members">Members</SubNavItem>
  <SubNavItem href="#billing">Billing</SubNavItem>
</SubNav>`,
					anatomy: [
						{ part: "Nav row", description: "Secondary landmark row under the header, named by aria-label." },
						{ part: "Items", description: "Real links; the active one sets aria-current=\"page\"." },
						{ part: "Underline", description: "Primary indicator on the active item, aligned with the row's bottom border." },
					],
					dosDonts: {
						dos: [
							"Use it for a second level of navigation below the primary nav.",
							"Let long rows scroll horizontally rather than wrap.",
						],
						donts: [
							"Don't use it to switch panels of content; use Tabs for tab semantics.",
							"Don't stack several sub-navs; one secondary level is enough.",
						],
					},
					related: ["tabs", "breadcrumb", "page-header"],
					examples: [
						{
							title: "Section navigation",
							description:
								"A row of page-level links under the header; the active item keeps a primary underline.",
						},
						{
							title: "Scrollable overflow",
							description:
								"Long rows scroll horizontally instead of wrapping, so narrow containers keep one line.",
						},
					],
				},
		],
	},
	{
		name: "Data",
		modules: [
			{
				id: "permission-matrix",
				name: "Permission Matrix",
				apiNames: ["PermissionMatrix"],
				imports: ["PermissionMatrix", "Badge"],
				description:
					"A people-by-applications access matrix with caller-supplied cell content and explicit no-access cells.",
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
				anatomy: [
					{ part: "Caption and region", description: "A visually hidden table caption inside a labelled region states whose access the matrix shows." },
					{ part: "Row-label column", description: "The first column names each person or capability; its header stays visually hidden and defaults to \"Name\"." },
					{ part: "Application columns", description: "One column per application, rendered in the order the columns array supplies." },
					{ part: "Access cells", description: "Caller-rendered content per row and column, such as badges or short words; policy stays in the calling product." },
					{ part: "Empty cells", description: "Missing entries render an explicit em dash, overridable through emptyCell." },
				],
				dosDonts: {
					dos: [
						"Keep cell content short — a Badge or a single word like \"Operate\" reads best in a grid.",
						"Write a caption that names the people and applications being compared.",
						"Override emptyCell when \"no access\" deserves explicit wording rather than a dash.",
					],
					donts: [
						"Don't encode access policy in color alone; render it as text or badges.",
						"Don't use the matrix for a flat, single-resource list; use Table instead.",
						"Don't leave cells blank; a blank reads as missing data, not as \"no access\".",
					],
				},
				related: ["table", "badge"],
				examples: [
					{
						title: "Household access",
						description:
							"Cells carry caller-rendered content such as badges; missing entries show an explicit em dash.",
					},
					{
						title: "Entitlement review",
						description:
							"Capability rows work the same way, keeping entitlement policy in the calling product.",
					},
				],
			},
			{
				id: "table",
				name: "Table",
				apiNames: ["Table"],
				description:
					"Accessible data presentation driven by column definitions, with caller-owned sorting and row selection, density, loading, and empty state.",
				usage: `<Table
  caption="Team members"
  columns={[{ key: 'name', header: 'Name', cell: (row) => row.name, sortable: true }]}
  rows={rows}
  getRowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  selectable
/>`,
				anatomy: [
					{ part: "Scroll region", description: "The overflow wrapper with role=\"region\" named after the caption; it takes keyboard focus only when it actually scrolls." },
					{ part: "Caption", description: "Visually hidden caption announcing the table's subject to screen readers." },
					{ part: "Header row", description: "Uppercase th cells with scope=\"col\", one per column definition, on a raised surface." },
					{ part: "Sort headers", description: "Buttons inside sortable th cells that toggle ascending/descending and expose aria-sort on the column." },
					{ part: "Selection column", description: "A header checkbox with indeterminate state plus one checkbox per row, added by selectable." },
					{ part: "Body rows", description: "One tr per record keyed by getRowKey; each column's cell renderer produces the td content; selected rows are tinted and expose aria-selected." },
					{ part: "Loading and empty states", description: "Skeleton rows with a busy region while loading, or the empty content spanning all columns when rows is empty." },
				],
				dosDonts: {
					dos: [
						"Always pass a caption; it names both the region and the table for assistive technology.",
						"Keep sort and selectedKeys controlled; the component reports intent, you re-sort the rows.",
						"Use density=\"compact\" in dashboards and side panels where vertical space is scarce.",
						"Give empty a helpful message that explains why there are no rows.",
					],
					donts: [
						"Don't expect Table to sort for you; onSortChange only reports the next sort state.",
						"Don't derive row keys from array indexes; getRowKey should return a stable id.",
						"Don't put unlabeled icon buttons in cells; every interactive cell needs an accessible name.",
					],
				},
				related: ["permission-matrix", "list", "pagination"],
				examples: [
					{
						title: "Column definitions",
						description:
							"Columns declare their header and cell renderer; rows need a stable key.",
					},
					{
						title: "Loading state",
						description:
							"loading swaps in skeleton rows, marks the region busy, and announces the loadingLabel.",
					},
					{
						title: "Sorting and selection",
						description:
							"Sortable headers set aria-sort and report through onSortChange; selectable adds a header checkbox with indeterminate bulk state.",
					},
				],
			},
			{
				id: "separator",
				name: "Separator",
				apiNames: ["Separator"],
				description: "A semantic or decorative divider for related content.",
				usage: "<Separator />",
				anatomy: [
					{ part: "Horizontal rule", description: "A full-width 1px hairline in the outline-variant color for stacking contexts." },
					{ part: "Vertical rule", description: "A full-height 1px hairline for inline groups such as toolbars and metadata rows." },
				],
				dosDonts: {
					dos: [
						"Keep the default decorative behavior unless the break marks a true content boundary.",
						"Use orientation=\"vertical\" between items in a row, with a parent that has a defined height.",
					],
					donts: [
						"Don't stack separators back to back; one hairline is enough between two sections.",
						"Don't use separators as a general spacing tool; prefer layout gaps and padding.",
					],
				},
				related: ["list", "toolbar", "card"],
				examples: [
					{
						title: "Content divider",
						description:
							"Separator renders a horizontal rule that can be decorative or semantic.",
					},
					{
						title: "Inline divider",
						description:
							"orientation=\"vertical\" splits items in a row, such as metadata in a toolbar.",
					},
				],
			},
			{
				id: "avatar",
				name: "Avatar",
				apiNames: ["Avatar"],
				description:
					"A compact identity image with initials and icon fallbacks.",
				usage: `<Avatar src="/users/avery.png" name="Avery Chen" />
<Avatar name="Morgan" size="sm" />`,
				anatomy: [
					{ part: "Image", description: "The photo shown when src loads; alt text defaults to the name." },
					{ part: "Initials fallback", description: "Up to two uppercase letters derived from name when there is no image or the image fails to load." },
					{ part: "Icon fallback", description: "A generic user glyph shown when neither src nor name is available." },
				],
				dosDonts: {
					dos: [
						"Always pass name so the initials fallback and default alt text work.",
						"Pass alt=\"\" when the avatar repeats a name already shown next to it.",
						"Use AvatarGroup when several identities share one slot.",
					],
					donts: [
						"Don't rely on the image always loading; a failed src swaps to initials by design.",
						"Don't make the avatar itself interactive; wrap it in a button or link if it must act.",
					],
				},
				related: ["avatar-group", "list", "comment-thread"],
				examples: [
					{
						title: "Sizes",
						description:
							"Three sizes share the same image and initials fallback behavior.",
					},
					{
						title: "Fallback chain",
						description:
							"Without src the initials render; without a name the generic user icon takes over.",
					},
				],
			},
			{
				id: "description-list",
				name: "Description List",
				apiNames: ["DescriptionList"],
				description:
					"A label/value definition list for detail pages, stacked or two-column.",
				usage: `<DescriptionList
  items={[
    { label: 'Owner', value: 'Avery Chen' },
    { label: 'Created', value: 'March 4, 2026' },
  ]}
/>`,
				anatomy: [
					{ part: "Term (dt)", description: "The muted label on the left of each row." },
					{ part: "Definition (dd)", description: "The right-aligned value in semibold, paired with its term." },
					{ part: "Row", description: "A hairline-separated flex row; the last row drops its border." },
				],
				dosDonts: {
					dos: [
						"Keep labels short and scannable; the value carries the detail.",
						"Order items so the most identifying facts come first.",
						"Switch to layout=\"grid\" on detail pages with more than a handful of rows.",
					],
					donts: [
						"Don't compare several records in one list; use Table for columnar comparison.",
						"Don't fill values with long paragraphs; link out to full content instead.",
					],
				},
				related: ["table", "stat", "card"],
				examples: [
					{
						title: "Detail summary",
						description:
							"Real dl markup; grid layout splits into two columns on wider screens.",
					},
					{
						title: "Two-column grid",
						description:
							"layout=\"grid\" splits rows into two columns from the small breakpoint up.",
					},
				],
			},
			{
				id: "avatar-group",
				name: "Avatar Group",
				apiNames: ["AvatarGroup"],
				description: "An overlapping identity stack with an overflow count.",
				usage:
					'<AvatarGroup names={["Avery Chen", "Morgan Reyes", "Riley Okafor"]} />',
				anatomy: [
					{ part: "Avatar stack", description: "Overlapping Avatars with a surface ring keeping each identity separate." },
					{ part: "Overflow bubble", description: "A +N count for hidden members, aria-hidden because the group label already names everyone." },
					{ part: "Group label", description: "role=\"group\" with an aria-label joining every name, so overflowed members are still announced." },
				],
				dosDonts: {
					dos: [
						"Lower max in dense contexts like table rows so the stack stays compact.",
						"Order names by relevance; the tail collapses into the overflow bubble.",
					],
					donts: [
						"Don't repeat the member list next to the group; the accessible label already exposes it.",
						"Don't use a group for a single identity; use Avatar.",
					],
				},
				related: ["avatar", "list", "tooltip"],
				examples: [
					{
						title: "Overflow",
						description:
							"Past max, a +N bubble summarizes the rest; the group label lists everyone.",
					},
					{
						title: "Compact overflow",
						description:
							"size=\"sm\" with a low max collapses the rest into a small +N bubble.",
					},
				],
			},
			{
				id: "stat",
				name: "Stat",
				apiNames: ["Stat"],
				description:
					"A labeled metric with a trend delta and optional supporting content.",
				usage: `<Stat
  label="Monthly recurring revenue"
  value="$48.2k"
  delta={{ direction: 'up', value: '+12.4%' }}
  description="vs. previous month"
/>`,
				anatomy: [
					{ part: "Label", description: "Small muted text naming the metric." },
					{ part: "Value", description: "The large figure in tabular numerals so updates don't shift layout." },
					{ part: "Delta", description: "Trend icon plus change text; direction picks the icon and default tone unless tone overrides it." },
					{ part: "Supporting content", description: "Optional description line or children such as a Sparkline below the value." },
				],
				dosDonts: {
					dos: [
						"Pair the delta with a time reference like \"vs. previous month\" in the description.",
						"Override the delta tone when a downward trend is good news, such as falling incidents.",
						"Pass a Sparkline as children to show the trend behind the number.",
					],
					donts: [
						"Don't rely on delta color alone; the direction prefix is what screen readers announce.",
						"Don't compare many categories with stats; use a chart or Table.",
					],
				},
				related: ["sparkline", "meter", "progress-circle"],
				examples: [
					{
						title: "Trend delta",
						description:
							"Direction picks the icon and default tone; assistive technology hears an explicit up or down prefix.",
					},
					{
						title: "With sparkline",
						description:
							"Children render below the value, so a Sparkline can show the trend behind the delta.",
					},
				],
			},
			{
				id: "list",
				name: "List",
				apiNames: ["List", "ListItem"],
				description:
					"A vertical item list with leading and trailing slots, secondary text, and a dense mode.",
				usage: `<List>
  <ListItem leading={<Folder />} title="Reports" secondary="12 files" trailing="2 GB" />
  <ListItem title="Archive" onClick={() => undefined} />
</List>`,
				anatomy: [
					{ part: "Leading slot", description: "An icon or avatar rendered before the text at a fixed width." },
					{ part: "Text block", description: "A semibold title with an optional muted secondary line; both truncate." },
					{ part: "Trailing slot", description: "Metadata or an action pinned to the end of the row." },
					{ part: "Row", description: "A hairline-separated li that becomes a full-width button when onClick is set." },
				],
				dosDonts: {
					dos: [
						"Use onClick rows instead of small inline buttons so the whole row is the target.",
						"Switch on dense in side panels and other space-tight contexts.",
						"Keep secondary text to one short line; it truncates beyond that.",
					],
					donts: [
						"Don't nest additional interactive elements inside an onClick row.",
						"Don't use List for site navigation; use a navigation component with a nav landmark.",
					],
				},
				related: ["table", "tree-view", "menu"],
				examples: [
					{
						title: "Slots and actions",
						description:
							"onClick turns the row into a button; dense tightens every item.",
					},
					{
						title: "Dense actions",
						description:
							"A dense list of clickable rows for compact file or settings pickers.",
					},
				],
			},
			{
				id: "sparkline",
				name: "Sparkline",
				apiNames: ["Sparkline"],
				description:
					"A tiny inline trend chart in line, area, or bar form with an accessible summary.",
				usage: `<Sparkline aria-label="Sign-ups trending up" data={[4, 8, 6, 12, 9, 14]} variant="area" />`,
				anatomy: [
					{ part: "Trend shape", description: "A line, filled area, or one bar per data point, drawn in the primary color and scaled to the data's min/max range." },
					{ part: "Accessible label", description: "role=\"img\" carrying the required aria-label that summarizes the trend." },
					{ part: "Hidden summary", description: "Visually hidden text stating the min, max, and last values." },
				],
				dosDonts: {
					dos: [
						"Write an aria-label that states the takeaway, like \"Sign-ups trending up\".",
						"Use the bar variant for discrete counts such as deploys per day.",
						"Pair with a Stat when the exact current figure matters.",
					],
					donts: [
						"Don't plot multiple series in one sparkline; use LineChart instead.",
						"Don't use it where users need exact values or axes; it is a glanceable trend only.",
					],
				},
				related: ["stat", "line-chart", "meter"],
				examples: [
					{
						title: "Trends at a glance",
						description:
							'role="img" carries the label; a visually hidden min, max, and last summary backs it up.',
					},
					{
						title: "Bars and falling trends",
						description:
							"The bar variant suits discrete daily counts; the area variant reads well for a falling trend.",
					},
				],
			},
			{
				id: "calendar",
				name: "Calendar",
				apiNames: ["Calendar"],
				description:
					"A month grid for picking a single date with bounds and disabled days.",
				usage: `const [date, setDate] = useState(new Date())

<Calendar value={date} onSelect={setDate} />`,
				anatomy: [
					{ part: "Month header", description: "Previous and next IconButtons around an aria-live month-and-year label that announces navigation." },
					{ part: "Weekday row", description: "Locale narrow weekday names, aria-hidden so only the day buttons are read." },
					{ part: "Day grid", description: "Forty-two day buttons covering six weeks; outside-month days are dimmed and out-of-bounds days are disabled." },
					{ part: "Selection and today", description: "The selected day exposes aria-pressed; today exposes aria-current=\"date\" with a primary ring." },
				],
				dosDonts: {
					dos: [
						"Set min and max for booking-style flows so out-of-range days render disabled.",
						"Control visibleMonth when the calendar must sync with external navigation.",
						"Explain the disabling rule nearby when disabledDates rejects days.",
					],
					donts: [
						"Don't use Calendar for ranges; use DatePicker with selection=\"range\".",
						"Don't run expensive work in disabledDates; it runs once per rendered day.",
					],
				},
				related: ["date-picker"],
				examples: [
					{
						title: "Date grid",
						description:
							"min, max, and disabledDates constrain selection; the month label announces changes.",
					},
					{
						title: "Bounded range",
						description:
							"min and max constrain selection to the next thirty days; out-of-range days render disabled.",
					},
				],
			},
				{
					id: "activity-feed",
					name: "Activity Feed",
					apiNames: ["ActivityFeed"],
					description:
						"Chronological list of actor-plus-action events with avatars or icons and timestamps, optionally grouped under day headings.",
					usage: `<ActivityFeed\n  label="Project activity"\n  groupByDay\n  items={[\n    { id: "1", actor: "Ada Lovelace", action: "merged the parser rewrite", timestamp: new Date() },\n  ]}\n/>`,
					anatomy: [
						{ part: "Feed container", description: "A role=\"feed\" region with an accessible label describing whose activity it lists." },
						{ part: "Event article", description: "One focusable article per event; its accessible name combines actor, action, and time, with aria-posinset and aria-setsize for position." },
						{ part: "Avatar or icon", description: "An initials avatar per actor, or a status icon when events are typed." },
						{ part: "Day heading", description: "Optional Today/Yesterday groupings when groupByDay is set." },
					],
					dosDonts: {
						dos: [
							"Supply items newest first; the feed renders them in the order given.",
							"Keep the action text to a short phrase so articles stay scannable.",
							"Turn on groupByDay for feeds spanning several days.",
						],
						donts: [
							"Don't use it for machine logs; use LogViewer.",
							"Don't nest interactive controls inside events; the feed pattern expects focus on the articles themselves.",
						],
					},
					related: ["avatar", "notification-item", "comment-thread"],
					examples: [
						{
							title: "Flat feed",
							description:
								"Shows events newest-first with initials avatars and relative-looking timestamps.",
						},
						{
							title: "Grouped by day with icons",
							description:
								"Groups events under Today/Yesterday headings and swaps avatars for status icons per event type.",
						},
					],
				},
				{
					id: "bar-chart",
					name: "Bar Chart",
					apiNames: ["BarChart"],
					description:
						"Grouped SVG bar chart with vertical or horizontal bars, optional value labels, a legend, and a built-in accessible data table.",
					usage: `<BarChart
  label="Revenue and costs per quarter"
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    { name: 'Revenue', data: [42, 55, 48, 61] },
    { name: 'Costs', data: [30, 34, 32, 38] },
  ]}
  showValues
/>`,
					anatomy: [
						{ part: "Chart frame", description: "The shared container with the accessible summary and the hidden data table behind a toggle." },
						{ part: "Bar groups", description: "One group per category with side-by-side bars per series, starting from a zero baseline." },
						{ part: "Value labels", description: "Optional exact values above each bar, or at the end of the bar in horizontal mode." },
						{ part: "Legend", description: "Palette swatches naming each series below the chart." },
					],
					dosDonts: {
						dos: [
							"Switch to orientation=\"horizontal\" when category names are long.",
							"Turn on showValues when exact numbers matter more than the visual comparison.",
							"Keep the legend visible whenever there is more than one series.",
						],
						donts: [
							"Don't plot many ordered categories; a LineChart reads better as a trend.",
							"Don't rely on bar color alone to identify series; the legend and tooltips carry the names.",
						],
					},
					related: ["line-chart", "chart-container"],
					examples: [
						{
							title: "Grouped vertical bars",
							description:
								"Multiple series render side-by-side per category with palette colors, a legend, and optional value labels above each bar.",
						},
						{
							title: "Horizontal bars",
							description:
								"orientation=\"horizontal\" swaps the axes so long category names read comfortably and values label the end of each bar.",
						},
					],
				},
				{
					id: "calendar-heatmap",
					name: "Calendar Heatmap",
					apiNames: ["CalendarHeatmap"],
					description: "GitHub-style year calendar heatmap with weeks-by-weekday cells, a 0–4 level color scale, and month labels.",
					usage: `<CalendarHeatmap\n  aria-label="Commit activity in 2025"\n  year={2025}\n  data={[{ date: "2025-03-14", level: 3 }]}\n/>`,
					anatomy: [
						{ part: "Day cells", description: "One rect per day of the year, filled by a 0–4 level and carrying a title tooltip with the date and level." },
						{ part: "Week columns", description: "Days arranged as weeks-by-weekday in the GitHub style, growing left to right." },
						{ part: "Month labels", description: "Text labels above the columns where each new month starts." },
						{ part: "Accessible summary", description: "role=\"img\" with the aria-label, backed by a visually hidden active-day count." },
					],
					dosDonts: {
						dos: [
							"Pass ISO date strings; days without an entry fall back to level 0.",
							"Wrap the heatmap in a horizontally scrollable container on narrow screens.",
							"Use it for one year's daily activity such as commits, deploys, or streaks.",
						],
						donts: [
							"Don't use it for an arbitrary two-dimensional matrix; use Heatmap.",
							"Don't invent levels beyond 0–4; the color scale is fixed.",
						],
					},
					related: ["heatmap", "calendar", "sparkline"],
					examples: [
						{ title: "Year of activity", description: "A full year grid with deterministic activity levels and per-day tooltips." },
						{ title: "Leap year", description: "The same view for a leap year, showing the grid adapts to 366 days." },
					],
				},
				{
					id: "chart-container",
					name: "Chart Container",
					apiNames: ["ChartContainer", "ChartAxis", "ChartGrid", "ChartLegend"],
					description:
						"Accessible SVG frame for hand-rolled charts with an aria-label summary, a toggleable screen-reader data table, and reusable axis, grid, and legend primitives.",
					usage: `<ChartContainer
  label="Visits per weekday"
  columns={[
    { key: 'day', label: 'Day' },
    { key: 'visits', label: 'Visits' },
  ]}
  data={rows}
>
  <ChartGrid positions={[40, 90, 140]} start={44} end={404} />
  <ChartAxis orientation="x" offset={190} start={44} end={404} ticks={ticks} />
</ChartContainer>`,
					anatomy: [
						{ part: "Labelled SVG", description: "The role=\"img\" frame named by the label prop, scaling with its viewBox." },
						{ part: "Chart content", description: "Whatever SVG children you draw inside the frame." },
						{ part: "Axis, grid, and legend primitives", description: "ChartAxis, ChartGrid, and ChartLegend, all aria-hidden so only the summary and table carry information." },
						{ part: "Data table", description: "A visually hidden table built from columns and data, revealed by a toggle button exposing aria-expanded." },
					],
					dosDonts: {
						dos: [
							"Write the label as the chart's takeaway, not just its type.",
							"Always pass columns and data so screen-reader users get the exact values.",
							"Reuse ChartAxis, ChartGrid, and ChartLegend so bespoke charts match the built-in ones.",
						],
						donts: [
							"Don't hand-roll a chart type the library already ships; use LineChart, BarChart, or PieChart.",
							"Don't put unlabeled interactive elements inside the SVG.",
						],
					},
					related: ["line-chart", "bar-chart"],
					examples: [
						{
							title: "Custom chart content",
							description:
								"Any SVG markup can be drawn inside the frame; the container supplies the accessible summary and the hidden data table with its toggle.",
						},
						{
							title: "Axis, grid, and legend primitives",
							description:
								"ChartAxis, ChartGrid, and ChartLegend compose inside the container so bespoke charts share the same ticks, gridlines, and swatches as the built-in charts.",
						},
					],
				},
				{
					id: "comment-thread",
					name: "Comment Thread",
					apiNames: ["CommentThread"],
					description:
						"Nested comment list with author avatars, timestamps, caller-wired reply buttons, and collapsible reply threads.",
					usage: `<CommentThread\n  comments={[\n    {\n      id: "1",\n      author: "Ada Lovelace",\n      body: "Looks good overall.",\n      timestamp: new Date(),\n      replies: [{ id: "1a", author: "Alan Turing", body: "Needs tests." }],\n    },\n  ]}\n  onReply={(comment) => openComposer(comment.id)}\n/>`,
					anatomy: [
						{ part: "Comment", description: "Author avatar, name, timestamp, and body text laid out in a row." },
						{ part: "Reply action", description: "Caller-wired button rendered on every comment when onReply is provided." },
						{ part: "Collapse toggle", description: "Button that hides a comment's replies and reports the hidden reply count." },
						{ part: "Reply list", description: "Nested replies indented under their parent with a left border." },
					],
					dosDonts: {
						dos: [
							"Wire onReply to your own composer; the thread never owns editing UI.",
							"Pass timestamps and override formatTime to localize them for your audience.",
							"Keep nesting to two or three levels so indentation stays readable.",
						],
						donts: [
							"Don't use it for one-directional event history; use ActivityFeed instead.",
							"Don't truncate comment bodies; let them wrap inside the thread.",
							"Don't put interactive content inside comment bodies; the thread is read-only apart from reply and collapse.",
						],
					},
					related: ["activity-feed", "avatar", "markdown-view"],
					examples: [
						{
							title: "Nested thread",
							description:
								"Renders replies indented under their parent with a collapse toggle that shows the hidden reply count.",
						},
						{
							title: "With reply action",
							description:
								"Passes onReply so every comment gets a reply button wired to the host application's composer.",
						},
					],
				},
				{
					id: "diff-viewer",
					name: "Diff Viewer",
					apiNames: ["DiffViewer"],
					description:
						"Line-based diff view with added/removed/context coloring, a +/- gutter, and old/new line numbers.",
					usage: `<DiffViewer\n  label="config.js changes"\n  oldValue={before}\n  newValue={after}\n/>`,
					anatomy: [
						{ part: "Line number gutters", description: "Dual old/new columns; a number appears only on lines that exist in that version." },
						{ part: "Change marker", description: "+ / - / space sign column, tinted per line type and hidden from assistive tech." },
						{ part: "Line content", description: "Monospace code line with a row tint per type and a visually hidden Added/Removed/Unchanged prefix." },
					],
					dosDonts: {
						dos: [
							"Pass hunks when the diff already comes from git or a server instead of re-diffing strings.",
							"Give the label the file or change name, like 'config.js changes', so the group is usefully named.",
							"Leave lineNumbers on for anything longer than a handful of lines.",
						],
						donts: [
							"Don't use it as an editor; it is a read-only review surface.",
							"Don't drop all context lines; unchanged lines are what frame the change.",
							"Don't diff very large files inline; summarize and link out past a few hundred lines.",
						],
					},
					related: ["code-block", "json-viewer", "log-viewer"],
					examples: [
						{
							title: "From two strings",
							description:
								"Computes the line diff itself from oldValue and newValue, including dual line-number gutters.",
						},
						{
							title: "Pre-computed hunks",
							description:
								"Accepts explicit add/remove/context lines, useful when the diff comes from git or a server.",
						},
					],
				},
				{
					id: "funnel-chart",
					name: "Funnel Chart",
					apiNames: ["FunnelChart"],
					description: "SVG funnel of stages whose widths follow their values, with stage-to-stage conversion percentages.",
					usage: `<FunnelChart\n  aria-label="Signup conversion funnel"\n  stages={[\n    { name: "Visited", value: 10000 },\n    { name: "Signed up", value: 3200 },\n    { name: "Paid", value: 480 },\n  ]}\n/>`,
					anatomy: [
						{ part: "Stage band", description: "Trapezoid whose top width scales to the stage value, fading lighter down the funnel." },
						{ part: "Stage label", description: "Stage name and value centered inside each band." },
						{ part: "Conversion label", description: "Stage-to-stage percentage in the gap between bands; hide with showPercentages." },
					],
					dosDonts: {
						dos: [
							"Order stages from widest to narrowest; the metaphor assumes a shrinking pipeline.",
							"Write the aria-label as the takeaway, like 'Signup funnel converts 5% of visitors'.",
							"Keep it to three to six stages so the bands stay legible.",
						],
						donts: [
							"Don't plot unordered categories; use BarChart or Table instead.",
							"Don't use it for parts of a whole; use PieChart.",
							"Don't compare two funnels without aligning stage counts and scales.",
						],
					},
					related: ["bar-chart", "pie-chart", "chart-container"],
					examples: [
						{ title: "Conversion funnel", description: "Classic four-stage signup funnel with conversion labels between stages." },
						{ title: "Long pipeline", description: "A taller five-stage hiring pipeline showing the funnel scales to more stages." },
					],
				},
				{
					id: "gantt-chart",
					name: "Gantt Chart",
					apiNames: ["GanttChart"],
					description:
						"A read-only SVG Gantt chart that plots task bars on a day grid with a today marker.",
					usage: `<GanttChart
  label="Release plan"
  tasks={[
    { id: 'design', label: 'Design', start: '2025-03-03', end: '2025-03-07' },
    { id: 'build', label: 'Build', start: '2025-03-10', end: '2025-03-19' },
  ]}
/>`,
					anatomy: [
						{ part: "Date axis", description: "Day grid header with day numbers and month labels derived from the task range." },
						{ part: "Task label", description: "Fixed-width left column naming the task beside its row." },
						{ part: "Task bar", description: "Rounded bar spanning the task's start to end dates (inclusive) on the day grid." },
						{ part: "Today marker", description: "Error-colored vertical line drawn when today falls inside the axis." },
					],
					dosDonts: {
						dos: [
							"Pin startDate and endDate when several charts must share one scale.",
							"Keep task labels short; the label column is a fixed 160px.",
							"Pass today explicitly in tests and stories so the marker is deterministic.",
						],
						donts: [
							"Don't use it for editing or dragging tasks; the chart is read-only by design.",
							"Don't plot sub-day schedules; the grid resolution is one day.",
							"Don't render hundreds of tasks; the fixed row height makes long plans unwieldy, so filter first.",
						],
					},
					related: ["timeline", "calendar-heatmap", "kanban-board"],
					examples: [
						{
							title: "Release plan",
							description:
								"Task bars with an automatic date axis derived from the earliest start and latest end.",
						},
						{
							title: "Fixed axis",
							description:
								"Explicit startDate and endDate pin the axis so several charts can share the same scale.",
						},
					],
				},
				{
					id: "gauge-chart",
					name: "Gauge Chart",
					apiNames: ["GaugeChart"],
					description: "Semicircle SVG gauge with min/max scale, threshold zones, and a centered value label.",
					usage: `<GaugeChart\n  aria-label="Latency score"\n  value={64}\n  label="Latency score"\n  thresholds={[{ upTo: 50 }, { upTo: 80 }, { upTo: 100 }]}\n/>`,
					anatomy: [
						{ part: "Track", description: "Semicircular arc showing the full min–max scale, split into threshold zones when provided." },
						{ part: "Value arc", description: "Filled arc clamped to the scale and colored by the active threshold zone." },
						{ part: "Scale labels", description: "Min and max values printed at the arc ends." },
						{ part: "Value readout", description: "Raw value and optional caption centered beneath the arc." },
					],
					dosDonts: {
						dos: [
							"Label threshold zones so the accessible summary can name them.",
							"Keep the scale honest: min and max should bound the realistic values.",
							"Pair with a Stat when the exact number matters more than the zone.",
						],
						donts: [
							"Don't compare several KPIs with a row of gauges; use BarChart or a Stat list.",
							"Don't exceed three or four zones; more become indistinguishable along the arc.",
							"Don't rely on zone color alone for status; the caption should carry the meaning.",
						],
					},
					related: ["meter", "progress-circle", "stat"],
					examples: [
						{ title: "Threshold zones", description: "Value arc colored by the active zone, with the zones drawn along the track." },
						{ title: "Plain and custom scales", description: "A zoneless gauge plus a gauge with a custom min/max range." },
					],
				},
				{
					id: "heatmap",
					name: "Heatmap",
					apiNames: ["Heatmap"],
					description: "Matrix heatmap that maps values to a color scale with row/column labels and cell tooltips.",
					usage: `<Heatmap\n  aria-label="Tickets by day and hour"\n  rows={[{ label: "Mon", values: [12, 30, 44] }]}\n  columnLabels={["Morning", "Midday", "Evening"]}\n/>`,
					anatomy: [
						{ part: "Column labels", description: "Time buckets or categories rendered above the grid." },
						{ part: "Row label", description: "Left-hand label for each matrix row." },
						{ part: "Cell", description: "Rounded rect whose fill opacity scales between the data min and max, with a value tooltip." },
					],
					dosDonts: {
						dos: [
							"Keep rows and columns on ordered scales (days, hours) so intensity patterns read correctly.",
							"Wrap it in a horizontally scrollable container when columns overflow narrow viewports.",
							"Give the aria-label the matrix subject, like 'Tickets by weekday and hour'.",
						],
						donts: [
							"Don't use it for exact per-cell comparisons; use Table.",
							"Don't use it for a year of daily activity; CalendarHeatmap is purpose-built for that.",
							"Don't mix units across cells; the shared opacity scale assumes one unit.",
						],
					},
					related: ["calendar-heatmap", "chart-container", "table"],
					examples: [
						{ title: "Activity matrix", description: "Weekday-by-time-of-day grid showing intensity through fill opacity." },
						{ title: "Larger cells", description: "Quarterly comparison with an increased cellSize for a roomier readout." },
					],
				},
				{
					id: "json-viewer",
					name: "JSON Viewer",
					apiNames: ["JsonViewer"],
					description:
						"Collapsible JSON tree with type-colored values, key-count summaries, and optional hover copy-path buttons.",
					usage: `<JsonViewer\n  data={{ name: "teal", version: 5, tags: ["design", "system"] }}\n  copyable\n  defaultExpandedDepth={2}\n/>`,
					anatomy: [
						{ part: "Node toggle", description: "Chevron button that expands or collapses an object or array, with aria-expanded." },
						{ part: "Key and value", description: "Property name with a type-colored primitive: string, number, boolean, or null." },
						{ part: "Container summary", description: "Collapsed nodes show a key or item count, like '{3 keys}'." },
						{ part: "Copy path button", description: "Hover-revealed button that copies the node's JSON path to the clipboard." },
					],
					dosDonts: {
						dos: [
							"Set defaultExpandedDepth so large payloads stay scannable on first render.",
							"Enable copyable when users report paths back, such as debugging configurations.",
							"Name the payload in the label, like 'Webhook payload'.",
						],
						donts: [
							"Don't use it as an editor; it is read-only inspection.",
							"Don't render secrets you would not show as plain text; values display verbatim.",
							"Don't use it for streaming output; use LogViewer.",
						],
					},
					related: ["code-block", "diff-viewer", "tree-view"],
					examples: [
						{
							title: "Collapsible tree",
							description:
								"Renders the root expanded and nested objects collapsed with per-node toggles and type-colored values.",
						},
						{
							title: "Copyable paths",
							description:
								"Enables hover copy buttons that put the node's JSON path (like $.author.name) on the clipboard.",
						},
					],
				},
				{
					id: "kanban-board",
					name: "Kanban Board",
					apiNames: ["KanbanBoard"],
					description:
						"A column-based board where cards move between workflow stages with full keyboard support.",
					usage: `<KanbanBoard
  label="Sprint board"
  defaultColumns={[
    { id: 'todo', title: 'To do', cards: [{ id: 'a', title: 'Design tokens' }] },
    { id: 'done', title: 'Done', cards: [] },
  ]}
  onColumnsChange={(columns) => undefined}
/>`,
					anatomy: [
						{ part: "Column", description: "Fixed-width section named by its heading, with a live card count beside the title." },
						{ part: "Card", description: "Button with a title and optional description; a single tab stop roves across all cards." },
						{ part: "Grab state", description: "A grabbed card gets a primary border and shadow plus aria-pressed while it moves." },
					],
					dosDonts: {
						dos: [
							"Use onColumnsChange to persist moves; uncontrolled state resets on remount.",
							"Keep it to three to five columns; each column holds a fixed 16rem width.",
							"Announce the outcome of a move yourself (for example a toast) if it matters beyond the board.",
						],
						donts: [
							"Don't reach for it when rows need sorting or filtering; that is Table territory.",
							"Don't put interactive controls inside cards; the whole card is the grab button.",
							"Don't expect pointer drag-and-drop; movement is keyboard-first by design.",
						],
					},
					related: ["table", "card", "list"],
					examples: [
						{
							title: "Sprint board",
							description:
								"A three-stage uncontrolled board; Enter grabs a card and arrow keys move it between columns.",
						},
						{
							title: "Compact checklist",
							description:
								"Two columns with optional card descriptions, showing the board adapts to smaller workflows.",
						},
					],
				},
				{
					id: "line-chart",
					name: "Line Chart",
					apiNames: ["LineChart"],
					description:
						"Multi-series SVG line chart with axis ticks, focusable points, simple or custom tooltips, a legend, and a built-in accessible data table. type=\"area\" fills under each series, with adjustable fill opacity and a stacked mode for part-to-whole trends.",
					usage: `<LineChart
  label="Revenue and costs per month"
  labels={['Jan', 'Feb', 'Mar', 'Apr']}
  series={[
    { name: 'Revenue', data: [42, 55, 48, 61] },
    { name: 'Costs', data: [30, 34, 32, 38] },
  ]}
/>`,
					anatomy: [
						{ part: "Axes and grid", description: "Y ticks from a nice-number scale (baseline includes zero unless all values are negative); x ticks from the category labels." },
						{ part: "Series line", description: "One polyline per series in a palette or custom color." },
						{ part: "Point markers", description: "Focusable circles that enlarge on hover or focus and show a title or renderTooltip content." },
						{ part: "Legend and data table", description: "Color-keyed legend below the chart plus a toggleable, visually hidden data table." },
					],
					dosDonts: {
						dos: [
							"Keep it to about four series so lines stay distinguishable.",
							"Use renderTooltip when values need units or formatting beyond the default title.",
							"Write the label as the chart's takeaway; it is the SVG accessible name.",
						],
						donts: [
							"Don't use it for unordered category comparisons; use BarChart.",
							"Don't disable showPoints when keyboard users must read values; the points are the tab stops.",
							"Don't exceed a dozen x labels; they collide at small widths.",
						],
					},
					related: ["sparkline", "chart-container"],
					examples: [
						{
							title: "Multi-series with legend",
							description:
								"Each series gets a palette color, a legend entry, and focusable points with simple title tooltips; axes and grid lines come from shared primitives.",
						},
						{
							title: "Custom tooltip",
							description:
								"renderTooltip replaces the simple title with a floating tooltip fed the hovered or focused point, its series, and its coordinates.",
						},
						{
							title: "Single series area",
							description:
								"type=\"area\" adds a translucent fill under the line to emphasize volume over time; opacity controls how much of the grid shows through.",
						},
						{
							title: "Stacked area series",
							description:
								"stacked accumulates area series on top of each other so the top edge reads as the total; tooltips and the data table keep the raw per-series values.",
						},
					],
				},
				{
					id: "log-viewer",
					name: "Log Viewer",
					apiNames: ["LogViewer"],
					description:
						"Scrollable monospace log pane with severity coloring, a follow/auto-scroll toggle, and optional search highlighting.",
					usage: `<LogViewer\n  label="Deploy logs"\n  lines={[\n    { id: "1", level: "info", message: "build started", timestamp: "10:00:01" },\n    { id: "2", level: "error", message: "type check failed", timestamp: "10:00:33" },\n  ]}\n  search="failed"\n/>`,
					anatomy: [
						{ part: "Header", description: "Label with a live line count and the follow/pause toggle (aria-pressed)." },
						{ part: "Log pane", description: "role='log' scroll region with monospace lines; screen readers announce appended lines politely." },
						{ part: "Log line", description: "Optional timestamp, uppercase severity prefix, and message with search matches highlighted." },
					],
					dosDonts: {
						dos: [
							"Keep follow on for live streams and let users pause it to read history.",
							"Pass a search query to spotlight the current incident keyword.",
							"Give streamed lines a stable id so updates render cleanly.",
						],
						donts: [
							"Don't use it for human activity with actors and avatars; use ActivityFeed.",
							"Don't strip the severity prefix; it carries the meaning without color.",
							"Don't mount it with unbounded height for huge histories; window or virtualize the lines.",
						],
					},
					related: ["activity-feed", "code-block", "highlight-text"],
					examples: [
						{
							title: "Following log",
							description:
								"Auto-scrolls to the newest line while follow mode is on; the header toggle pauses it.",
						},
						{
							title: "Search highlight",
							description:
								"Highlights every case-insensitive match of the query inside log messages.",
						},
					],
				},
				{
					id: "markdown-view",
					name: "Markdown View",
					apiNames: ["MarkdownView"],
					description:
						"Renders a safe markdown subset — headings, emphasis, links, lists, code, and quotes — as teal-styled elements with no raw HTML.",
					usage: `<MarkdownView\n  content={"## Release notes\\n\\nShips the **parser rewrite**.\\n\\n- Faster tokens\\n- Inline \`diff\`"}\n/>`,
					anatomy: [
						{ part: "Headings", description: "Markdown levels 1-6 mapped onto the teal type scale." },
						{ part: "Inline formatting", description: "Bold, italic, inline code, and sanitized links inside paragraphs, quotes, and list items." },
						{ part: "Lists and quotes", description: "Disc and decimal lists plus a primary-bordered blockquote." },
						{ part: "Code blocks", description: "Fenced blocks rendered verbatim in a horizontally scrolling pre." },
					],
					dosDonts: {
						dos: [
							"Use it for trusted, simple CMS or user content like release notes and comments.",
							"Test the exact markdown authors write; the parser covers a deliberate subset.",
							"Prefer it over dangerouslySetInnerHTML; raw HTML never renders as markup.",
						],
						donts: [
							"Don't feed it full GFM (tables, footnotes, task lists); unsupported syntax shows as plain text.",
							"Don't rely on link schemes beyond http(s), mailto, root-relative, or hash; others render as text.",
							"Don't use it as an editor; pair a composer with this display-only renderer.",
						],
					},
					related: ["rich-text-editor", "code-block", "link"],
					examples: [
						{
							title: "Prose content",
							description:
								"Headings, bold and italic text, lists, a blockquote, and a safe link rendered with teal typography.",
						},
						{
							title: "Code and sanitizing",
							description:
								"Fenced code blocks render verbatim, and raw HTML in the source shows up as literal text rather than markup.",
						},
					],
				},
				{
					id: "org-chart",
					name: "Org Chart",
					apiNames: ["OrgChart"],
					description:
						"A hierarchy of person nodes rendered as connected boxes, with collapsible subtrees.",
					usage: `<OrgChart
  root={{
    id: 'ceo',
    name: 'Ada',
    title: 'CEO',
    children: [{ id: 'cto', name: 'Ben', title: 'CTO' }],
  }}
/>`,
					anatomy: [
						{ part: "Node card", description: "Bordered box with the person's name and an optional role or team line." },
						{ part: "Subtree toggle", description: "Round chevron button that collapses or expands the node's reports." },
						{ part: "Connectors", description: "aria-hidden stubs and horizontal bars linking parents to their children." },
					],
					dosDonts: {
						dos: [
							"Collapse dense branches with defaultCollapsedIds so first render stays scannable.",
							"Keep node titles to one short line, like a role or team.",
							"Control collapsedIds when the view must sync with filters elsewhere in the app.",
						],
						donts: [
							"Don't use it as a navigation outline; TreeView is the interactive choice.",
							"Don't show per-person data columns; use TreeGrid for tabular hierarchy.",
							"Don't render hundreds of nodes expanded; the horizontal layout grows quickly.",
						],
					},
					related: ["tree-view", "tree-grid", "avatar"],
					examples: [
						{
							title: "Leadership tree",
							description:
								"A fully expanded three-level hierarchy with name and role lines on every node.",
						},
						{
							title: "Partially collapsed",
							description:
								"defaultCollapsedIds hides a subtree on first render; the toggle button reveals it.",
						},
					],
				},
				{
					id: "pie-chart",
					name: "Pie Chart",
					apiNames: ["PieChart"],
					description:
						"SVG pie and donut chart with keyboard-focusable segments, percentage labels, a legend, and a built-in accessible data table.",
					usage: `<PieChart
  label="Budget share per department"
  data={[
    { name: 'Engineering', value: 45 },
    { name: 'Design', value: 20 },
    { name: 'Marketing', value: 25 },
  ]}
  innerRadius={0.6}
/>`,
					anatomy: [
						{ part: "Segment", description: "Focusable path per positive value, sweeping clockwise from the top." },
						{ part: "Percentage label", description: "Text drawn on segments of five percent or larger, hidden from assistive tech." },
						{ part: "Donut hole", description: "innerRadius carves the center out as a fraction of the outer radius." },
						{ part: "Legend and data table", description: "Color-keyed legend plus a toggleable, visually hidden table of values and shares." },
					],
					dosDonts: {
						dos: [
							"Limit it to about five segments; merge the tail into 'Other'.",
							"Order segments meaningfully, largest first, since the sweep starts at the top.",
							"Keep the legend or labels visible so every segment is named.",
						],
						donts: [
							"Don't compare similar-sized values; angles deceive, so use BarChart.",
							"Don't pass zero or negative values expecting a slice; they are skipped.",
							"Don't stack multiple pies for comparison; use a stacked BarChart or Table.",
						],
					},
					related: ["bar-chart", "chart-container", "gauge-chart"],
					examples: [
						{
							title: "Pie with labels and legend",
							description:
								"Segments are drawn clockwise from the top with percentage labels on any slice large enough to fit them, plus a color-keyed legend.",
						},
						{
							title: "Donut",
							description:
								"innerRadius sets the hole as a fraction of the outer radius, turning the pie into a donut while keeping the same labels and keyboard support.",
						},
					],
				},
				{
					id: "qr-code",
					name: "QR Code",
					apiNames: ["QrCode"],
					description:
						"Dependency-free SVG QR code renderer with a hand-rolled byte-mode encoder (error-correction level L).",
					usage: `<QrCode\n  value="https://example.com/app/invite"\n  label="QR code for the invite link"\n  size={160}\n/>`,
					anatomy: [
						{ part: "Finder patterns", description: "The three corner squares scanners use to locate and orient the code." },
						{ part: "Data modules", description: "The encoded payload grid with error-correction level L and the best-fit mask." },
						{ part: "Quiet zone", description: "Empty margin in modules (default 4) that keeps the code scannable; tune with margin." },
					],
					dosDonts: {
						dos: [
							"Always pass a label that says where the code leads, like 'QR code for the invite link'.",
							"Keep the quiet zone at four modules unless space is truly constrained.",
							"Place the encoded URL as a text link nearby for people without a camera.",
						],
						donts: [
							"Don't encode payloads over ~340 UTF-8 bytes; the encoder throws past 343 bytes.",
							"Don't overlay logos or recolor modules; level L tolerates little damage.",
							"Don't render it tiny in print contexts; keep roughly 120px or larger for reliable scans.",
						],
					},
					related: ["link", "copy-button", "share-button"],
					examples: [
						{
							title: "Basic code",
							description:
								"Renders a scannable SVG for a URL with the default 160px size and 4-module quiet zone.",
						},
						{
							title: "Sizes and quiet zone",
							description:
								"Scales via the size prop and trades quiet-zone width for density with the margin prop.",
						},
					],
				},
				{
					id: "radar-chart",
					name: "Radar Chart",
					apiNames: ["RadarChart"],
					description: "SVG radar (spider) chart that overlays multi-series polygons across a shared set of axes.",
					usage: `<RadarChart\n  aria-label="Skill profiles"\n  axes={["Frontend", "Backend", "Testing", "DevOps"]}\n  series={[{ name: "Ada", values: [5, 3, 4, 2] }]}\n/>`,
					anatomy: [
						{ part: "Axes", description: "Spokes from the center, one per dimension, starting at the top and going clockwise." },
						{ part: "Grid rings", description: "Concentric polygons marking scale steps up to the shared max." },
						{ part: "Series polygon", description: "Translucent filled outline per series with a native title tooltip of its values." },
						{ part: "Axis labels", description: "Dimension names placed just outside each spoke." },
					],
					dosDonts: {
						dos: [
							"Keep axes commensurable (same units or normalized scores) and pass max explicitly.",
							"Stay at three to eight axes; labels collide beyond that.",
							"Limit it to two or three series; overlapping fills get muddy fast.",
						],
						donts: [
							"Don't use it for precise value reading; use Table.",
							"Don't mix unnormalized units like revenue with percentages on one chart.",
							"Don't use it for time series; use LineChart.",
						],
					},
					related: ["bar-chart", "line-chart", "table"],
					examples: [
						{ title: "Multi-series comparison", description: "Two overlapping polygons make relative strengths across axes easy to compare." },
						{ title: "Single profile with fixed scale", description: "One series against an explicit max with a ring per scale step." },
					],
				},
				{
					id: "scatter-chart",
					name: "Scatter Chart",
					apiNames: ["ScatterChart"],
					description: "Hand-rolled SVG scatter plot with x/y axes, multi-series dots, and optional size encoding.",
					usage: `<ScatterChart\n  aria-label="Latency by payload size"\n  series={[{ name: "Baseline", data: [{ x: 12, y: 40 }, { x: 24, y: 55 }] }]}\n  xAxisLabel="Payload (KB)"\n  yAxisLabel="Latency (ms)"\n/>`,
					anatomy: [
						{ part: "Axes", description: "X and Y lines with min/max tick labels and optional axis captions." },
						{ part: "Point", description: "Palette-colored dot per data point with a tooltip of its x, y or a custom label." },
						{ part: "Size encoding", description: "Optional mapping of a third value to dot radius via sizeEncoding." },
					],
					dosDonts: {
						dos: [
							"Add xAxisLabel and yAxisLabel with units; bare min/max ticks lack context.",
							"Provide point labels when individual points represent named entities.",
							"Keep it to two or three series so the color groups stay readable.",
						],
						donts: [
							"Don't use it for ordered time trends; LineChart connects the dots better.",
							"Don't enable sizeEncoding without explaining nearby what the radius means.",
							"Don't plot thousands of points; it is one SVG node per dot.",
						],
					},
					related: ["line-chart", "chart-container", "heatmap"],
					examples: [
						{ title: "Multi-series comparison", description: "Two series plotted against shared axes with palette-colored dots and per-point tooltips." },
						{ title: "Size-encoded bubbles", description: "A third numeric dimension mapped to dot radius via the sizeEncoding prop." },
					],
				},
				{
					id: "tree-grid",
					name: "Tree Grid",
					apiNames: ["TreeGrid"],
					description:
						"A data table whose rows form an expandable tree, following the WAI-ARIA treegrid pattern.",
					usage: `<TreeGrid
  aria-label="Project files"
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size' },
  ]}
  rows={[
    { id: 'src', name: 'src', size: '—', children: [{ id: 'app', name: 'app.ts', size: '2 KB' }] },
  ]}
/>`,
					anatomy: [
						{ part: "Header row", description: "columnheader cells; the first column owns the tree affordances." },
						{ part: "Tree cell", description: "First column with depth indentation, a chevron toggle on parent rows, and the row label." },
						{ part: "Data cells", description: "Remaining gridcell columns read from the row object by key." },
					],
					dosDonts: {
						dos: [
							"Put the most identifying column first; it carries the indentation and expand toggle.",
							"Use defaultExpandedIds to spotlight one or two branches on first render.",
							"Keep cell content as simple text; interaction belongs on the row.",
						],
						donts: [
							"Don't use it for flat tables; Table adds sorting and selection.",
							"Don't nest deeper than four or five levels; indentation eats the first column.",
							"Don't put focusable controls inside cells; the keyboard model is row-level.",
						],
					},
					related: ["table", "tree-view", "tree-select"],
					examples: [
						{
							title: "File tree",
							description:
								"A collapsed-by-default file listing; Arrow Right expands a folder row to reveal its children.",
						},
						{
							title: "Pre-expanded budget",
							description:
								"defaultExpandedIds opens chosen branches on first render, useful for spotlight rows.",
						},
					],
				},
		],
	},
	{
		name: "Layout",
		modules: [
			{
				id: "stack",
				name: "Stack",
				apiNames: ["Stack"],
				imports: ["Stack", "Badge"],
				description:
					"A flex primitive that stacks children along one axis with consistent spacing and alignment.",
				usage: `<Stack direction="row" gap={4} align="center">
  <Badge variant="success">Ready</Badge>
  <Badge>Paused</Badge>
</Stack>`,
				anatomy: [
					{ part: "Container", description: "A flex root that lays children out along one axis; direction defaults to column." },
					{ part: "Gap", description: "Even spacing between children; numbers follow the spacing scale (n × 0.25rem), strings pass through as CSS lengths." },
					{ part: "Alignment", description: "align and justify map to cross-axis and main-axis flexbox values." },
					{ part: "Wrap", description: "An optional flag that lets a row flow onto multiple lines." },
				],
				dosDonts: {
					dos: [
						"Use numeric gaps from the spacing scale so the rhythm stays consistent with the rest of the UI.",
						"Combine wrap with direction=\"row\" for toolbars and tag rows that must survive narrow widths.",
						"Nest Stacks to compose simple two-axis layouts before reaching for Grid.",
					],
					donts: [
						"Don't use Stack for two-dimensional track layouts; use Grid or Columns.",
						"Don't space children with margin utilities; set gap on the Stack so spacing stays uniform.",
						"Don't expect equal-width cells; Stack children size to their content.",
					],
				},
				related: ["flex", "grid", "box"],
				examples: [
					{
						title: "Axis and spacing",
						description:
							"Numeric gaps follow the spacing scale; direction, align, justify, and wrap map to flexbox.",
					},
					{
						title: "Vertical rhythm",
						description:
							"The default column direction stacks header, content, and footer blocks with even spacing.",
					},
				],
			},
			{
				id: "grid",
				name: "Grid",
				apiNames: ["Grid"],
				imports: ["Grid", "Card"],
				description:
					"A grid primitive with fixed columns or responsive auto-fit tracks.",
				usage: `<Grid minChildWidth="14rem" gap={4}>
  <Card>...</Card>
  <Card>...</Card>
</Grid>`,
				anatomy: [
					{ part: "Track container", description: "A CSS grid root; children stretch to fill their cells by default." },
					{ part: "Fixed columns", description: "columns pins an exact track count regardless of width." },
					{ part: "Auto-fit tracks", description: "minChildWidth lets the browser add or drop tracks as the container changes size." },
					{ part: "Gap", description: "Row and column spacing; numbers follow the spacing scale (n × 0.25rem), strings pass through as CSS lengths." },
				],
				dosDonts: {
					dos: [
						"Use minChildWidth for card collections that should reflow without any breakpoint code.",
						"Use columns when the design requires an exact track count, such as a strict three-up marketing row.",
						"Let children stretch so cards in a row share the same height.",
					],
					donts: [
						"Don't combine columns and minChildWidth; pick one track strategy per grid.",
						"Don't use Grid for tightly packed unequal-height items; use Masonry.",
						"Don't nest a second Grid when a Stack would express the inner layout more simply.",
					],
				},
				related: ["stack", "columns", "masonry"],
				examples: [
					{
						title: "Responsive tracks",
						description:
							"minChildWidth collapses columns automatically as the container narrows.",
					},
					{
						title: "Fixed column count",
						description:
							"columns pins an exact track count for layouts that must hold their shape.",
					},
				],
			},
			{
				id: "resizable",
				name: "Resizable",
				apiNames: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
				imports: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
				description:
					"Pointer- and keyboard-resizable panes with percentage sizing and double-click reset.",
				usage: `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>`,
				anatomy: [
					{ part: "Panel group", description: "Owns the direction and distributes percentage sizes across its panels." },
					{ part: "Panel", description: "A sized region with defaultSize plus minSize and maxSize clamps in percent." },
					{ part: "Handle", description: "The separator between two panels; drags with the pointer, steps with arrow keys, and resets on double-click." },
				],
				dosDonts: {
					dos: [
						"Set minSize on every panel so a pane can never crush its content.",
						"Keep panel content scrollable so small sizes stay usable.",
						"Use direction=\"vertical\" for stacked summary-and-detail splits.",
					],
					donts: [
						"Don't make a layout resizable without a real user need; fixed layouts are simpler and have fewer focus stops.",
						"Don't pack many panels into one group; nest groups for complex shells instead.",
						"Don't remove the handle from the tab order; it is the keyboard user's only way to resize.",
					],
				},
				related: ["app-shell", "scroll-area"],
				examples: [
					{
						title: "Split panes",
						description:
							"The handle exposes separator semantics with arrow-key steps and aria-valuenow.",
					},
					{
						title: "Vertical split",
						description:
							"direction=\"vertical\" stacks panes top to bottom with the same drag and keyboard behavior.",
					},
				],
			},
			{
				id: "aspect-ratio",
				name: "Aspect Ratio",
				apiNames: ["AspectRatio"],
				description:
					"Keeps media or content at a consistent width-to-height ratio.",
				usage: `<AspectRatio ratio={16 / 9}>
  <img src="/charts/usage.png" alt="Weekly usage chart" />
</AspectRatio>`,
				anatomy: [
					{ part: "Ratio box", description: "Reserves the width-to-height ratio before content loads, preventing layout shift." },
					{ part: "Content", description: "The media or element that fills the box and is clipped with rounded corners." },
				],
				dosDonts: {
					dos: [
						"Pick the ratio from the media itself: 16/9 for video, 1/1 for avatars and map tiles, 4/3 for photos.",
						"Reserve space for media that has not loaded yet so the page does not jump.",
						"Give images real alt text; the ratio wrapper is purely presentational.",
					],
					donts: [
						"Don't force a ratio on text or mixed content that should size naturally.",
						"Don't set fixed heights inside; the ratio owns the height and the content gets clipped.",
						"Don't crop dashboards or charts without checking how the ratio cuts them at narrow widths.",
					],
				},
				related: ["lazy-image", "card", "grid"],
				examples: [
					{
						title: "Consistent media",
						description:
							"The box holds its ratio while content stays clipped with rounded corners.",
					},
					{
						title: "Square media",
						description:
							"ratio={1} holds square thumbnails such as avatar crops and map tiles.",
					},
				],
			},
				{
					id: "app-shell",
					name: "AppShell",
					apiNames: ["AppShell", "AppShellHeader", "AppShellSidebar", "AppShellMain", "AppShellFooter"],
					description:
						"An application frame that places header, sidebar, main and footer regions into named grid areas.",
					usage: `<AppShell>\n  <AppShellHeader>…</AppShellHeader>\n  <AppShellSidebar>…</AppShellSidebar>\n  <AppShellMain>…</AppShellMain>\n  <AppShellFooter>…</AppShellFooter>\n</AppShell>`,
					anatomy: [
						{ part: "Header", description: "The banner landmark spanning the top of the frame; holds global actions and identity." },
						{ part: "Sidebar", description: "The complementary navigation region beside main; optional." },
						{ part: "Main", description: "The primary content landmark; keep exactly one per page." },
						{ part: "Footer", description: "The contentinfo landmark at the bottom of the frame; optional." },
					],
					dosDonts: {
						dos: [
							"Keep exactly one AppShellMain and put the primary content inside it.",
							"Hide or restyle the sidebar at small breakpoints with responsive classes such as hidden md:block.",
							"Put global navigation in the sidebar and page-level actions in the header.",
						],
						donts: [
							"Don't use AppShell for marketing or content pages; compose Container and Section instead.",
							"Don't nest a second AppShell inside the main region.",
							"Don't let scrollable page content live outside the main area.",
						],
					},
					related: ["sidebar", "sticky-header", "container"],
					examples: [
						{
							title: "Full application frame",
							description:
								"All four regions compose into a full-height console layout with hairline separators.",
						},
						{
							title: "Header and main only",
							description:
								"Regions are optional; without a sidebar the main area spans the full width.",
						},
					],
				},
				{
					id: "box",
					name: "Box",
					apiNames: ["Box"],
					description:
						"The lowest-level layout primitive: a polymorphic box with spacing props, leaving surfaces and colors to className.",
					usage: `<Box\n  p={4}\n  className="teal-u-rounded-xl teal-u-bg-surface-container"\n>\n  Content\n</Box>`,
					anatomy: [
						{ part: "Element", description: "The rendered tag; div by default, swapped through the as prop." },
						{ part: "Spacing props", description: "Padding and margin shorthands that follow the spacing scale; axis values override the all-sides value." },
						{ part: "Surface", description: "Colors, radius and shadows arrive through className tokens, not Box props." },
					],
					dosDonts: {
						dos: [
							"Use the as prop to give the wrapper a meaningful landmark or grouping element.",
							"Reach for Box for one-off spacing wrappers instead of writing a bespoke utility class.",
							"Apply surface and color tokens through className utilities.",
						],
						donts: [
							"Don't arrange multiple children with Box; Flex or Stack expresses that intent.",
							"Don't combine Box margins with a parent's gap; the spacing doubles up.",
							"Don't use Box where a named component like Card or Section already exists.",
						],
					},
					related: ["flex", "stack", "container"],
					examples: [
						{
							title: "Spacing and surface",
							description:
								"Numeric padding follows the spacing scale while surface tokens arrive through className.",
						},
						{
							title: "Semantic element",
							description:
								"The as prop swaps the rendered tag, here a centered section with per-axis spacing.",
						},
					],
				},
				{
					id: "center",
					name: "Center",
					apiNames: ["Center"],
					description:
						"Centers children horizontally and vertically inside their box, with an inline option for flow content.",
					usage: `<Center\n  className="h-40"\n>\n  <Spinner />\n</Center>`,
					anatomy: [
						{ part: "Center box", description: "A flex container with both axes centered; its size comes from the caller's className." },
						{ part: "Inline option", description: "Switches to inline-flex so the box shrinks to its content inside running text." },
						{ part: "Child", description: "The single element or cluster being centered, such as a spinner or empty-state graphic." },
					],
					dosDonts: {
						dos: [
							"Use it for empty states and loading spinners inside bounded areas.",
							"Give the area a height through className so the centering is visible.",
							"Use the inline option to center badges or icons within a line of text.",
						],
						donts: [
							"Don't use Center to arrange several children with spacing; use Flex or Stack.",
							"Don't center long-form content; keep body text left-aligned for readability.",
							"Don't add alignment utilities on the child that fight the centering.",
						],
					},
					related: ["empty-state", "box", "flex"],
					examples: [
						{
							title: "Block centering",
							description:
								"A fixed-height area centers a single child on both axes, the classic empty or loading state box.",
						},
						{
							title: "Inline centering",
							description:
								"The inline option shrinks the box to its content so badges center inside running text.",
						},
					],
				},
				{
					id: "columns",
					name: "Columns",
					apiNames: ["Columns"],
					description:
						"An equal-width grid column layout that keeps row alignment and collapses to fewer columns on narrow screens.",
					usage: `<Columns\n  columns={3}\n  gap={3}\n>\n  {features.map((f) => <FeatureCard key={f.id} {...f} />)}\n</Columns>`,
					anatomy: [
						{ part: "Track grid", description: "Equal-width cells that keep rows aligned; DOM order matches visual order." },
						{ part: "Column count", description: "The columns prop sets the wide-screen count and collapses through fewer columns at smaller breakpoints." },
						{ part: "Gap", description: "Row and column spacing from the spacing scale." },
					],
					dosDonts: {
						dos: [
							"Use it for feature grids and stat groups that need tidy, aligned rows.",
							"Let the built-in collapse (for example 3 to 2 to 1) handle narrow screens.",
							"Keep cell content roughly equal in height for the cleanest rows.",
						],
						donts: [
							"Don't use Columns when heights vary wildly and tight packing matters; use Masonry.",
							"Don't fight the equal widths with per-child width utilities.",
							"Don't use it for one-axis lists; Stack is simpler.",
						],
					},
					related: ["grid", "masonry", "card"],
					examples: [
						{
							title: "Three-up feature grid",
							description:
								"Equal cells keep row alignment at three columns on wide screens, collapsing through two to one.",
						},
						{
							title: "Two-column detail",
							description:
								"A wider gap and two columns suit richer cards that need more horizontal room.",
						},
					],
				},
				{
					id: "container",
					name: "Container",
					apiNames: ["Container"],
					description:
						"Centers content in a max-width column with responsive horizontal padding and fixed size steps.",
					usage: `<Container\n  size="lg"\n>\n  <p>Centered page content.</p>\n</Container>`,
					anatomy: [
						{ part: "Centered column", description: "A max-width wrapper that keeps content readable on wide screens." },
						{ part: "Side padding", description: "Horizontal padding that steps up across the sm and lg breakpoints." },
						{ part: "Size step", description: "sm, md and lg cap the column at different widths; fluid removes the cap." },
					],
					dosDonts: {
						dos: [
							"Wrap page content so line lengths stay readable on wide screens.",
							"Use size=\"fluid\" for full-bleed bands, then nest a capped Container inside for the content.",
							"Pass as=\"main\" when the Container wraps the primary page content.",
						],
						donts: [
							"Don't nest capped Containers; the inner cap fights the outer one.",
							"Don't add Container inside already-narrow panels or sidebars.",
							"Don't hand-roll your own max-width wrappers alongside it; pick one convention.",
						],
					},
					related: ["section", "app-shell", "box"],
					examples: [
						{
							title: "Default page column",
							description:
								"Content centers at max-w-6xl with side padding that widens on larger breakpoints.",
						},
						{
							title: "Size variants",
							description:
								"sm, md and lg cap the column at different widths; fluid removes the cap for full-bleed regions.",
						},
					],
				},
				{
					id: "flex",
					name: "Flex",
					apiNames: ["Flex"],
					description:
						"A flex container primitive with direction, gap, alignment and distribution props; defaults to a horizontal row.",
					usage: `<Flex\n  gap={3}\n  align="center"\n  justify="between"\n>\n  <span>Label</span>\n  <Button>Action</Button>\n</Flex>`,
					anatomy: [
						{ part: "Flex container", description: "A display-flex root; direction defaults to row." },
						{ part: "Direction", description: "row, row-reverse, column or column-reverse along the main axis." },
						{ part: "Alignment and distribution", description: "align and justify map to align-items and justify-content." },
						{ part: "Wrap", description: "Lets rows flow onto multiple lines when space runs out." },
					],
					dosDonts: {
						dos: [
							"Use justify=\"between\" for label-plus-action toolbar rows.",
							"Enable wrap for tag rows and button groups that must survive narrow widths.",
							"Use the as prop when the grouping has semantics, such as nav or a list.",
						],
						donts: [
							"Don't use Flex for a plain evenly spaced stack; Stack is the more specific choice.",
							"Don't reverse the direction when that would make visual order contradict the DOM reading order.",
							"Don't duplicate the gap with margins on children.",
						],
					},
					related: ["stack", "grid", "box"],
					examples: [
						{
							title: "Row with distribution",
							description:
								"Children spread across the row with wrapping enabled, the common toolbar and tag-row shape.",
						},
						{
							title: "Column direction",
							description:
								"The same container stacks children vertically with consistent gaps and start alignment.",
						},
					],
				},
				{
					id: "masonry",
					name: "Masonry",
					apiNames: ["Masonry"],
					description:
						"A CSS-columns masonry layout where unequal-height items pack tightly down each column without row gaps.",
					usage: `<Masonry\n  columns={3}\n  gap={3}\n>\n  {notes.map((note) => <NoteCard key={note.id} {...note} />)}\n</Masonry>`,
					anatomy: [
						{ part: "Column tracks", description: "CSS multi-column tracks; items fill the first column before spilling into the next." },
						{ part: "Item wrapper", description: "Each child is wrapped with break-inside: avoid so cards never split across columns." },
						{ part: "Gap", description: "Column and row spacing from the spacing scale." },
					],
					dosDonts: {
						dos: [
							"Use it for note walls and photo grids where item heights are unpredictable.",
							"Set minColumnWidth when the column count should adapt to the container width.",
							"Keep DOM order meaningful; screen readers read down each column in source order.",
						],
						donts: [
							"Don't use Masonry when left-to-right row reading order matters; use Columns or Grid.",
							"Don't put row-aligned comparisons, such as pricing tiers, into masonry.",
							"Don't expect equal column heights; the final column may run short.",
						],
					},
					related: ["columns", "grid", "card"],
					examples: [
						{
							title: "Fixed column count",
							description:
								"Cards of different heights flow down three columns; each card is wrapped to avoid column breaks.",
						},
						{
							title: "Minimum column width",
							description:
								"A minColumnWidth lets the browser add or drop columns as the container changes size.",
						},
					],
				},
				{
					id: "scroll-shadow",
					name: "ScrollShadow",
					apiNames: ["ScrollShadow"],
					description:
						"A scroll container that fades the top and bottom edges to signal that more content exists in that direction.",
					usage: `<ScrollShadow\n  className="max-h-64"\n>\n  <MessageList />\n</ScrollShadow>`,
					anatomy: [
						{ part: "Scroll container", description: "The overflowing region; the caller bounds its height through className." },
						{ part: "Top fade", description: "Appears once the reader has scrolled away from the start." },
						{ part: "Bottom fade", description: "Visible until the reader reaches the end, signaling more content below." },
						{ part: "Scroll state", description: "A ResizeObserver and scroll listener keep the fades correct as content changes." },
					],
					dosDonts: {
						dos: [
							"Use it on chat panels, log viewers and long dropdown lists that overflow often.",
							"Bound the height through className so the fades have overflow to signal.",
							"Increase shadowSize on tall panels where a subtle fade gets lost.",
						],
						donts: [
							"Don't add fades when a persistent scrollbar already communicates overflow.",
							"Don't rely on the fade alone; keyboard users must still reach every focusable item inside.",
							"Don't stack ScrollShadow with ScrollArea cues on the same region; pick one signal.",
						],
					},
					related: ["scroll-area", "infinite-scroll", "list"],
					examples: [
						{
							title: "Overflowing list",
							description:
								"A bounded list shows a bottom fade until the reader scrolls, then fades both edges mid-scroll.",
						},
						{
							title: "Larger shadows",
							description:
								"shadowSize deepens the fade for taller panels where a subtle cue gets lost.",
						},
					],
				},
				{
					id: "section",
					name: "Section",
					apiNames: ["Section"],
					description:
						"A semantic page section with vertical rhythm spacing and an optional centered container wrap.",
					usage: `<Section\n  container\n  spacing="md"\n>\n  <h2>Release notes</h2>\n</Section>`,
					anatomy: [
						{ part: "Section element", description: "A semantic section landmark wrapping one topical block of the page." },
						{ part: "Rhythm spacing", description: "Vertical padding in sm, md or lg steps; none removes it for flush stacking." },
						{ part: "Container wrap", description: "An optional centered Container around the children, enabled with the container prop." },
					],
					dosDonts: {
						dos: [
							"Give each Section a heading, and name it with aria-labelledby when the page has several.",
							"Use the container prop on content pages so sections align to the same centered column.",
							"Use spacing=\"none\" for flush-stacked bands such as heroes and full-bleed media.",
						],
						donts: [
							"Don't use Section for tiny groupings inside a component; it is a page-level landmark.",
							"Don't nest a Container inside a contained Section; the width cap doubles up.",
							"Don't render sections without headings; unnamed landmarks are noise for screen-reader navigation.",
						],
					},
					related: ["container", "page-header", "stack"],
					examples: [
						{
							title: "Contained section",
							description:
								"Children are wrapped in a centered Container while the section supplies medium vertical rhythm.",
						},
						{
							title: "Rhythm variants",
							description:
								"sm and lg spacing tighten or loosen the vertical beat; none removes it for flush stacking.",
						},
					],
				},
				{
					id: "sticky-header",
					name: "StickyHeader",
					apiNames: ["StickyHeader"],
					description:
						"A header that sticks to the top of its scrolling container and gains a shadow once it is stuck.",
					usage: `<StickyHeader\n  offset={0}\n>\n  <h2>Recent activity</h2>\n</StickyHeader>`,
					anatomy: [
						{ part: "Sticky header", description: "A position: sticky bar that parks at the top of its scrolling container." },
						{ part: "Sentinel", description: "A zero-height element observed by IntersectionObserver to detect the stuck state." },
						{ part: "Stuck shadow", description: "A shadow toggled through data-stuck once content scrolls under the header." },
					],
					dosDonts: {
						dos: [
							"Use it inside bounded scroll panels for table toolbars and long list headings.",
							"Set offset to clear any fixed bar above, such as the application top bar.",
							"Keep the header compact so it does not eat the visible scroll area.",
						],
						donts: [
							"Don't use it for the application-level header; AppShellHeader owns that role.",
							"Don't bury it inside nested wrappers; it must be a direct child of the scrolling element.",
							"Don't make several headers sticky in the same scroller; they stack unpredictably.",
						],
					},
					related: ["scroll-shadow", "app-shell", "scroll-area"],
					examples: [
						{
							title: "Sticky list header",
							description:
								"Inside a bounded scroll area the header stays visible and lifts with a shadow as content scrolls under it.",
						},
						{
							title: "Custom stick offset",
							description:
								"An offset parks the header below another fixed element such as a top bar.",
						},
					],
				},
		],
	},
	{
		name: "Utilities",
		modules: [
			{
				id: "visually-hidden",
				name: "Visually Hidden",
				apiNames: ["VisuallyHidden"],
				imports: ["VisuallyHidden"],
				description:
					"Hides content visually while keeping it available to assistive technology.",
				usage: `<button type="button">
  <Trash aria-hidden="true" />
  <VisuallyHidden>Delete report</VisuallyHidden>
</button>`,
				anatomy: [
					{ part: "Clipped wrapper", description: "The span that applies the 1px clip styles, removing content from view without display: none." },
					{ part: "Hidden content", description: "The text or nodes that stay in the accessibility tree and are announced by screen readers." },
				],
				dosDonts: {
					dos: [
						"Label icon-only buttons with VisuallyHidden text instead of relying on title attributes.",
						"Add context such as \"(opens in a new tab)\" to links whose behavior is not obvious from the text.",
						"Keep the hidden text short and equivalent to what a sighted user infers visually.",
					],
					donts: [
						"Don't place focusable elements inside; a focus target nobody can see strands sighted keyboard users.",
						"Don't use it to hide content that should appear at larger screens; use responsive utilities instead.",
						"Don't duplicate text already announced through an aria-label on the same element.",
					],
				},
				related: ["announcer", "button", "tooltip"],
				examples: [
					{
						title: "Screen-reader text",
						description:
							"Use for extra context that would clutter the visual design.",
					},
					{
						title: "New-tab context",
						description:
							"Appends \"(opens in a new tab)\" to a link so the behavior is announced without cluttering the visible link text.",
					},
				],
			},
			{
				id: "copy-button",
				name: "Copy Button",
				apiNames: ["CopyButton"],
				description:
					"A button that copies a value to the clipboard and confirms with an icon swap and live feedback.",
				usage: `<CopyButton value="npm install @kryv/teal" />`,
				anatomy: [
					{ part: "Trigger button", description: "The native button that performs the clipboard write; renders as a full button or icon-only." },
					{ part: "State icon", description: "The copy icon that briefly swaps to a check after a successful copy." },
					{ part: "Label", description: "The visible text (accessible name in iconOnly mode) that switches to copiedLabel on success." },
					{ part: "Live region", description: "A visually hidden role=\"status\" region that announces the copy result." },
				],
				dosDonts: {
					dos: [
						"Use iconOnly next to code snippets and identifiers in dense rows.",
						"Set label and copiedLabel to name the specific value, like \"Copy API key\".",
						"Trim whitespace from the value before passing it so pastes are exact.",
					],
					donts: [
						"Don't use it for editable text; use an Input with a copy action instead.",
						"Don't label it generically \"Copy\" when several copy buttons share a row.",
						"Don't copy secrets silently; make clear in the label what lands on the clipboard.",
					],
				},
				related: ["code-block", "input", "button"],
				examples: [
					{
						title: "Copy feedback",
						description:
							"The label swaps to the copied text briefly and announces through a hidden live region.",
					},
					{
						title: "Icon-only copy",
						description:
							"iconOnly fits next to inline code; the label prop becomes the accessible name.",
					},
				],
			},
			{
				id: "theme-toggle",
				name: "Theme Toggle",
				apiNames: ["ThemeToggle"],
				description:
					"An icon button that toggles the dark class on the document root and reports its state.",
				usage: `<ThemeToggle onChange={(theme) => persistTheme(theme)} />`,
				anatomy: [
					{ part: "Toggle button", description: "The icon button exposing aria-pressed for the current theme." },
					{ part: "Theme icon", description: "The sun/moon icon that swaps with the active theme; decorative, not the state carrier." },
				],
				dosDonts: {
					dos: [
						"Persist the reported theme through onChange so the choice survives reloads.",
						"Initialize from the system preference when no choice is stored.",
						"Keep one toggle in a consistent location, typically the top bar.",
					],
					donts: [
						"Don't render several toggles that can disagree about the document state.",
						"Don't toggle theme without updating the dark class contract your styles rely on.",
						"Don't bury the toggle in a menu where theme switching is frequent.",
					],
				},
				related: ["top-bar", "switch", "button"],
				examples: [
					{
						title: "Light and dark",
						description:
							"aria-pressed reflects the current theme; persisting the choice stays with the app.",
					},
					{
						title: "Persisted preference",
						description:
							"onChange reports the new theme so the app shell can store it.",
					},
				],
			},
			{
				id: "carousel",
				name: "Carousel",
				apiNames: ["Carousel", "CarouselSlide"],
				description:
					"A scroll-snap carousel with previous and next controls, dot indicators, and arrow-key support.",
				usage: `<Carousel label="Featured reports">
  <ReportCard title="Q1 security" />
  <ReportCard title="Q2 reliability" />
</Carousel>`,
				anatomy: [
					{ part: "Track", description: "The scroll-snap container that pages one slide at a time." },
					{ part: "Slide", description: "Each child laid out as a full-width snap stop, labelled with its position in the set." },
					{ part: "Previous and next buttons", description: "The paging controls; disabled at the ends unless loop is set." },
					{ part: "Dot indicators", description: "Compact page buttons with 24px touch targets that jump straight to a slide." },
				],
				dosDonts: {
					dos: [
						"Name the collection with the label prop so the region is announced properly.",
						"Use loop for short sets that should cycle endlessly.",
						"Keep slide content simple; each slide is a full snap stop.",
					],
					donts: [
						"Don't hide critical unique content on the last slide only.",
						"Don't auto-advance slides; readers control the pacing.",
						"Don't nest the carousel inside another scroll-snap container.",
					],
				},
				related: ["image-viewer", "scroll-area", "pagination"],
				examples: [
					{
						title: "Paged content",
						description:
							"Slides announce their position; loop wraps around at the ends.",
					},
					{
						title: "Looping set",
						description:
							"loop keeps previous and next enabled by wrapping around at the ends.",
					},
				],
			},
				{
					id: "collapse",
					name: "Collapse",
					apiNames: ["Collapse"],
					description:
						"Animates a region's height to show or hide content, marking it hidden and inert while closed.",
					usage: `<Collapse open={showDetails}>\n  <p>Extra details revealed on demand.</p>\n</Collapse>`,
					anatomy: [
						{ part: "Animated region", description: "The wrapper whose grid rows animate from 0fr to 1fr to reveal or hide content." },
						{ part: "Inner content", description: "The children shown or hidden; aria-hidden and inert while the region is closed." },
					],
					dosDonts: {
						dos: [
							"Drive it from a trigger button wired with aria-expanded and aria-controls.",
							"Use it for custom disclosures where Accordion's built-in chrome does not fit.",
							"Let reduced-motion users get an instant toggle; the component skips the animation.",
						],
						donts: [
							"Don't put content users always need behind a Collapse.",
							"Don't treat closed content as live state; the region is inert and out of the tab order.",
							"Don't wrap entire pages; keep collapsed regions small and focused.",
						],
					},
					related: ["accordion", "presence", "expandable-card"],
					examples: [
						{
							title: "Toggleable details",
							description:
								"A button drives the open prop; the region smoothly expands and collapses its content.",
						},
						{
							title: "Initially open",
							description:
								"Start expanded to show secondary content such as release notes that readers can fold away.",
						},
					],
				},
				{
					id: "countdown-timer",
					name: "Countdown Timer",
					apiNames: ["CountdownTimer"],
					description:
						"Counts down to a target date with a default HH:MM:SS display or a custom render prop, firing onComplete at zero.",
					usage: `<CountdownTimer\n  targetDate={launchDate}\n  onComplete={openLaunch}\n  completionMessage="The launch window has opened."\n/>`,
					anatomy: [
						{ part: "Time readout", description: "The default inline HH:MM:SS display rendered with tabular numerals." },
						{ part: "Render-prop tiles", description: "The custom layout receiving days, hours, minutes, and seconds when the render prop is used." },
						{ part: "Completion announcement", description: "A visually hidden role=\"status\" message spoken once when the count reaches zero." },
					],
					dosDonts: {
						dos: [
							"Pass completionMessage so reaching zero is announced, not just shown.",
							"Use the render prop for styled tiles on launch or maintenance pages.",
							"Re-arm by passing a new targetDate; the timer restarts when the target moves to the future.",
						],
						donts: [
							"Don't use it for elapsed time; use TimeAgo.",
							"Don't show seconds precision for targets days away; drop units with the render prop.",
							"Don't treat it as an authoritative deadline source; it is a display aid, not a scheduler.",
						],
					},
					related: ["time-ago", "number-ticker", "stat"],
					examples: [
						{
							title: "Inline countdown",
							description:
								"The default format renders a compact tabular HH:MM:SS readout that drops straight into a sentence.",
						},
						{
							title: "Render-prop tiles",
							description:
								"The render prop receives days, hours, minutes, and seconds so you can lay out styled countdown tiles.",
						},
					],
				},
				{
					id: "focus-trap",
					name: "Focus Trap",
					apiNames: ["FocusTrap"],
					description:
						"Keeps Tab and Shift+Tab focus cycling within a container and restores focus when deactivated.",
					usage: `<FocusTrap active={isEditing}>\n  <Input aria-label="Project name" />\n  <Button>Save</Button>\n</FocusTrap>`,
					anatomy: [
						{ part: "Trap container", description: "The div that listens for Tab and queries its own focusable descendants." },
						{ part: "Trapped content", description: "The focusable children cycled by Tab and Shift+Tab while the trap is active." },
					],
					dosDonts: {
						dos: [
							"Activate the trap only while the modal region is open.",
							"Keep the default focus restoration so focus returns to the trigger on release.",
							"Guarantee at least one focusable element inside the trap.",
						],
						donts: [
							"Don't trap focus in normal page flow; keyboard users get stranded.",
							"Don't run two active traps at once; coordinate which region owns focus.",
							"Don't use it as a substitute for Dialog's full modal semantics.",
						],
					},
					related: ["dialog", "portal"],
					examples: [
						{
							title: "Toggleable trap",
							description:
								"Activate the trap around a panel; Tab cycles through its controls and focus returns to the toggle when released.",
						},
						{
							title: "Always-on trap",
							description:
								"A permanently trapped region such as an embedded modal pane or a guided form.",
						},
					],
				},
				{
					id: "highlight-text",
					name: "Highlight Text",
					apiNames: ["HighlightText"],
					description:
						"Wraps every case-insensitive match of a query in a styled mark element.",
					usage: `<HighlightText\n  text="Audit report for Q3"\n  query="report"\n/>`,
					anatomy: [
						{ part: "Base text", description: "The original string, split around each match with casing preserved." },
						{ part: "Match marks", description: "Each case-insensitive match wrapped in a styled mark element." },
					],
					dosDonts: {
						dos: [
							"Pass the raw user query; regex characters are treated as literal text.",
							"Highlight the same query across every result row so matches scan consistently.",
							"Keep the mark styling prominent enough to notice in dense lists.",
						],
						donts: [
							"Don't use it for rich or nested markup; it operates on plain strings.",
							"Don't render it when the query is empty; nothing gets marked anyway.",
							"Don't reimplement per-field split logic; reuse the component wherever matches are shown.",
						],
					},
					related: ["search-input", "combobox", "truncated-text"],
					examples: [
						{
							title: "Inline highlight",
							description:
								"Highlights a term inside a sentence, preserving the original casing of each match.",
						},
						{
							title: "Search results",
							description:
								"Applies the highlight across a list of result titles so the typed query stands out in every row.",
						},
					],
				},
				{
					id: "infinite-scroll",
					name: "Infinite Scroll",
					apiNames: ["InfiniteScroll"],
					description:
						"Loads the next batch of content automatically when a sentinel scrolls into view via IntersectionObserver.",
					usage: `<InfiniteScroll\n  hasMore={hasMore}\n  loading={loading}\n  onLoadMore={loadNextPage}\n  endMessage="All caught up"\n>\n  <ReportRows rows={rows} />\n</InfiniteScroll>`,
					anatomy: [
						{ part: "Content block", description: "The accumulated children rendered as a plain block." },
						{ part: "Sentinel", description: "The aria-hidden marker whose intersection with the viewport triggers onLoadMore." },
						{ part: "Loader and end message", description: "A role=\"status\" spinner while loading, replaced by the end message when hasMore is false." },
					],
					dosDonts: {
						dos: [
							"Set an endMessage so the end of the feed is explicit.",
							"Gate requests with hasMore and loading to prevent duplicate fetches.",
							"Offer another route to footer content, since infinite lists push it away.",
						],
						donts: [
							"Don't use it when users need to reach a specific record; use Pagination.",
							"Don't auto-load task lists the user must finish; continuous loading hides the finish line.",
							"Don't rely on the sentinel without a fallback; unsupported environments show a Load more button.",
						],
					},
					related: ["pagination", "virtual-list", "loading"],
					examples: [
						{
							title: "Sentinel loading",
							description:
								"Scrolling the list to the bottom triggers onLoadMore and appends the next batch, with a spinner while it loads.",
						},
						{
							title: "End of feed",
							description:
								"With hasMore={false} the sentinel disappears and an end message tells the reader there is nothing left.",
						},
					],
				},
				{
					id: "lazy-image",
					name: "Lazy Image",
					apiNames: ["LazyImage"],
					description:
						"Defers an image request until it nears the viewport, showing a placeholder and fading the image in on load.",
					usage: `<LazyImage\n  src="/charts/signups.png"\n  alt="Bar chart of quarterly signups"\n  width={640}\n  height={360}\n/>`,
					anatomy: [
						{ part: "Wrapper", description: "The sized box observed against the rootMargin threshold." },
						{ part: "Placeholder", description: "A pulsing surface, or any custom node, holding layout until the image loads." },
						{ part: "Image", description: "The img whose src is requested only near the viewport, fading in via data-state." },
					],
					dosDonts: {
						dos: [
							"Pass width and height so the layout is reserved and the page does not shift.",
							"Write meaningful alt text; it applies as soon as the img mounts.",
							"Use a custom placeholder that hints at the incoming content.",
						],
						donts: [
							"Don't lazy-load hero or above-the-fold images; they should render immediately.",
							"Don't set rootMargin so large that every image loads up front.",
							"Don't use it for icons and decorative graphics; a plain img is simpler.",
						],
					},
					related: ["image-viewer", "aspect-ratio", "loading"],
					examples: [
						{
							title: "Default placeholder",
							description:
								"A pulsing surface holds the layout until the image scrolls near the viewport and finishes loading.",
						},
						{
							title: "Custom placeholder",
							description:
								"Any React node can stand in for the image, such as a branded blur-up or an explanatory caption.",
						},
					],
				},
				{
					id: "marquee",
					name: "Marquee",
					apiNames: ["Marquee"],
					description:
						"Scrolls content horizontally in a seamless CSS-animation loop with pause-on-hover and reduced-motion support.",
					usage: `<Marquee duration={16} pauseOnHover>\n  <StatusChip label="All systems operational" />\n  <StatusChip label="Deploy complete" />\n</Marquee>`,
					anatomy: [
						{ part: "Viewport", description: "The overflow-hidden wrapper that clips the scrolling track." },
						{ part: "Track", description: "The CSS-animated row translating continuously for a seamless loop." },
						{ part: "Duplicated copy", description: "An aria-hidden repeat of the children that closes the wrap gap." },
					],
					dosDonts: {
						dos: [
							"Limit it to ambient, glanceable content such as status chips or logos.",
							"Keep pauseOnHover enabled so pointer users can read the content.",
							"Label the region when the looped content carries meaning.",
						],
						donts: [
							"Don't put critical or actionable messages in a Marquee; use Alert.",
							"Don't expect users to read long text; it is off-screen part of the time.",
							"Don't stack multiple fast marquees; the compounded motion overwhelms.",
						],
					},
					related: ["alert", "status-dot", "badge"],
					examples: [
						{
							title: "Status ticker",
							description:
								"A row of live status chips loops continuously across the banner, pausing when the reader hovers it.",
						},
						{
							title: "Reverse direction",
							description:
								"direction=\"right\" runs the loop the other way, useful for stacking two counter-scrolling rows.",
						},
					],
				},
				{
					id: "number-ticker",
					name: "Number Ticker",
					apiNames: ["NumberTicker"],
					description:
						"Animates a number toward its target with a requestAnimationFrame count-up and a pluggable formatter.",
					usage: `<NumberTicker\n  value={revenue}\n  duration={1200}\n  formatter={(v) => currency.format(v)}\n/>`,
					anatomy: [
						{ part: "Value readout", description: "The inline span with tabular numerals rendering each animation frame." },
						{ part: "Formatted output", description: "The formatter prop shapes every frame, such as whole-dollar currency." },
					],
					dosDonts: {
						dos: [
							"Format every frame with the formatter prop, for example as currency.",
							"Keep the count-up near a second so it reads as a flourish, not a wait.",
							"Pair the number with a static label so the value has meaning.",
						],
						donts: [
							"Don't animate values that update many times per second.",
							"Don't use it in dense tables; render the formatted value directly.",
							"Don't rely on the animation for comprehension; reduced-motion users see the final value instantly.",
						],
					},
					related: ["stat", "countdown-timer", "meter"],
					examples: [
						{
							title: "Live counter",
							description:
								"A stat eases up from zero on mount and counts smoothly to each new value as data arrives.",
						},
						{
							title: "Formatted currency",
							description:
								"The formatter prop shapes every intermediate frame, here as whole-dollar US currency.",
						},
					],
				},
				{
					id: "portal",
					name: "Portal",
					apiNames: ["Portal"],
					description:
						"Renders children into a different DOM container, escaping overflow and stacking-context traps.",
					usage: `<Portal>\n  <div className="fixed bottom-4 right-4">Floating notice</div>\n</Portal>`,
					anatomy: [
						{ part: "Host container", description: "The target element, document.body by default, that receives the children." },
						{ part: "Portalled content", description: "The children mounted after the first client render and removed on unmount." },
					],
					dosDonts: {
						dos: [
							"Use it for overlays that must escape an overflow-hidden or transformed ancestor.",
							"Prefer higher-level components like Dialog or Tooltip that portal for you when they fit.",
							"Choose the container deliberately when coordinating stacking contexts.",
						],
						donts: [
							"Don't portal interactive content without managing focus; DOM order diverges from visual order.",
							"Don't portal content that belongs to the normal layout flow.",
							"Don't expect server-rendered output; nothing renders until the client mounts.",
						],
					},
					related: ["dialog", "focus-trap", "popover"],
					examples: [
						{
							title: "Portal to document.body",
							description:
								"A fixed-position notice rendered outside its parent tree so clipping and z-index of ancestors do not apply.",
						},
						{
							title: "Portal into a custom container",
							description:
								"Pass a container element to render into a specific region instead of the document body.",
						},
					],
				},
				{
					id: "presence",
					name: "Presence",
					apiNames: ["Presence"],
					description:
						"Keeps children mounted through their exit transition before unmounting them.",
					usage: `<Presence present={showCard}>\n  <Card>Sync complete</Card>\n</Presence>`,
					anatomy: [
						{ part: "Wrapper", description: "The div that keeps children mounted while their exit transition runs." },
						{ part: "Exiting content", description: "Children flagged data-state=\"closed\" until transitionend, then unmounted." },
					],
					dosDonts: {
						dos: [
							"Move focus out of exiting content before setting present to false.",
							"Drive the enter and exit CSS from the data-state hooks.",
							"Keep exit transitions short so content does not linger after dismissal.",
						],
						donts: [
							"Don't use it without an exit animation; plain conditional rendering is simpler.",
							"Don't wrap large, frequently updating subtrees; each exit defers unmount.",
							"Don't depend on transitions deep in the subtree; style the direct child.",
						],
					},
					related: ["collapse", "reveal", "dialog"],
					examples: [
						{
							title: "Fading card",
							description:
								"A card that fades out: it stays mounted with data-state=\"closed\" until the opacity transition ends.",
						},
						{
							title: "Removable filter chip",
							description:
								"A filter indicator that animates away instead of disappearing instantly.",
						},
					],
				},
				{
					id: "reveal",
					name: "Reveal",
					apiNames: ["Reveal"],
					description:
						"Fades and slides children in when they scroll into the viewport via IntersectionObserver.",
					usage: `<Reveal>\n  <Card title="Reliability" />\n</Reveal>`,
					anatomy: [
						{ part: "Observed wrapper", description: "The element watched by IntersectionObserver against the threshold." },
						{ part: "Revealed content", description: "Children transitioning opacity and translate from data-state=\"hidden\" to \"visible\"." },
					],
					dosDonts: {
						dos: [
							"Use it for below-the-fold sections on long pages.",
							"Keep once enabled so content does not re-animate on every pass.",
							"Test with reduced motion; the transition is skipped automatically.",
						],
						donts: [
							"Don't wrap above-the-fold or critical content; entrance motion just delays reading.",
							"Don't stagger so many elements that the page feels slow to assemble.",
							"Don't animate layout properties; Reveal applies only opacity and transform.",
						],
					},
					related: ["presence", "lazy-image", "collapse"],
					examples: [
						{
							title: "Reveal once",
							description:
								"Cards animate in the first time they enter the viewport and stay visible afterwards.",
						},
						{
							title: "Reveal every time",
							description:
								"With once={false} the animation replays whenever the element leaves and re-enters the viewport.",
						},
					],
				},
				{
					id: "time-ago",
					name: "Time Ago",
					apiNames: ["TimeAgo"],
					description:
						"Renders a self-updating relative timestamp like \"5 minutes ago\" with the absolute time on hover.",
					usage: `<TimeAgo\n  date={event.createdAt}\n  updateInterval={30000}\n/>`,
					anatomy: [
						{ part: "Time element", description: "The semantic time tag with a machine-readable dateTime attribute." },
						{ part: "Relative label", description: "The self-updating text, like \"5 minutes ago\", recomputed every updateInterval." },
						{ part: "Absolute tooltip", description: "The locale-formatted exact time exposed through the title attribute." },
					],
					dosDonts: {
						dos: [
							"Keep updateInterval modest, around 30 seconds, for feeds and logs.",
							"Rely on the built-in title for the exact timestamp instead of duplicating it.",
							"Use it for future dates too; scheduled jobs read naturally with the in-prefix.",
						],
						donts: [
							"Don't use it for legal, billing, or scheduling contexts that need unambiguous absolute times.",
							"Don't set one-second intervals that churn the DOM constantly.",
							"Don't restyle the label into ambiguity; recency must stay readable.",
						],
					},
					related: ["countdown-timer", "timeline", "activity-feed"],
					examples: [
						{
							title: "Event feed",
							description:
								"Past events read as relative times that refresh on an interval, with the exact timestamp in the title.",
						},
						{
							title: "Future time",
							description:
								"Future dates render with an in-prefix, handy for scheduled jobs and upcoming syncs.",
						},
					],
				},
				{
					id: "truncated-text",
					name: "Truncated Text",
					apiNames: ["TruncatedText"],
					description:
						"Clamps text to one or more lines with a show more/less toggle and a tooltip for the full text.",
					usage: `<TruncatedText\n  text="The full audit summary that may not fit..."\n  lines={3}\n/>`,
					anatomy: [
						{ part: "Clamped text", description: "The content ellipsized to one line or clamped to the configured number of lines." },
						{ part: "Toggle button", description: "The Show more/Show less control with aria-expanded, rendered only when text overflows." },
						{ part: "Full-text tooltip", description: "The native title carrying the complete text while clamped." },
					],
					dosDonts: {
						dos: [
							"Set lines to match the height budget of the card or row.",
							"Let the built-in measurement decide; the toggle appears only when text actually truncates.",
							"Keep the full text reachable in place rather than linking away.",
						],
						donts: [
							"Don't truncate code; use CodeBlock with scrolling instead.",
							"Don't hide critical errors or actions behind truncation.",
							"Don't add your own tooltip on top; the title already exposes the full text.",
						],
					},
					related: ["tooltip", "code-block", "highlight-text"],
					examples: [
						{
							title: "Single line",
							description:
								"Ellipsizes text that overflows a narrow container and offers a Show more toggle plus a native title tooltip.",
						},
						{
							title: "Multi-line clamp",
							description:
								"Clamps a paragraph to three lines using the lines prop before offering expansion.",
						},
					],
				},
				{
					id: "virtual-list",
					name: "Virtual List",
					apiNames: ["VirtualList"],
					description:
						"Renders only the visible slice of a large fixed-height list, keeping thousands of rows scrolling smoothly.",
					usage: `<VirtualList\n  items={people}\n  itemHeight={36}\n  height={320}\n  label="Teammates"\n  renderItem={(person) => <Row>{person.name}</Row>}\n/>`,
					anatomy: [
						{ part: "Viewport", description: "The fixed-height scroll container that also serves as a keyboard tab stop." },
						{ part: "Spacer", description: "The full-height sizer that keeps the scrollbar honest for the entire item count." },
						{ part: "Rendered window", description: "The visible rows plus overscan, each reporting aria-posinset and aria-setsize." },
					],
					dosDonts: {
						dos: [
							"Give the list a label and an explicit pixel height.",
							"Keep row heights fixed; itemHeight is a guarantee, not a hint.",
							"Use the index from renderItem for stable keys.",
						],
						donts: [
							"Don't virtualize short lists; below a few dozen rows plain rendering is cheaper.",
							"Don't expect find-in-page or skip links to reach unmounted rows.",
							"Don't put expanding or variable-height rows inside.",
						],
					},
					related: ["infinite-scroll", "table", "scroll-area"],
					examples: [
						{
							title: "Compact roster",
							description:
								"Five hundred rows scroll instantly because only the viewport window plus overscan is mounted in the DOM.",
						},
						{
							title: "Rich rows",
							description:
								"renderItem receives the item and index, so rows can mix metadata, avatars, and actions freely.",
						},
					],
				},
		],
	},
];

export const modules = moduleGroups.flatMap((group) => group.modules);

/** @type {Record<string, Array<{ title: string, description: string, demo?: string }>>} */
const additionalExamples = {
	button: [
		{
			title: "Disabled actions",
			description:
				"Use disabled state when the action cannot be completed yet, and explain why nearby.",
		},
	],
	field: [
		{
			title: "Account profile",
			description:
				"Pair a required profile value with a clear validation message.",
		},
	],
	input: [
		{
			title: "Search and inline validation",
			description:
				"Use a compact search control alongside an input that reports its invalid state.",
		},
	],
	select: [
		{
			title: "Role assignment",
			description: "Use a labeled picker when a person must choose one role.",
		},
		{
			title: "Keyboard selection",
			description:
				"Typeahead and arrow-key navigation keep long option lists efficient.",
		},
	],
	checkbox: [
		{
			title: "Bulk selection",
			description:
				"Use indeterminate state when a table selection contains both checked and unchecked rows.",
			demo: "checkbox-bulk",
		},
		{
			title: "Permission groups",
			description:
				"Group independent permissions under one clear label and description.",
		},
	],
	switch: [
		{
			title: "Application settings",
			description:
				"Use switches in a settings list for changes that apply immediately.",
		},
		{
			title: "Compact settings",
			description:
				"The small size keeps dense preference lists scannable without losing the accessible label.",
		},
	],
	card: [
		{
			title: "Report summary",
			description:
				"Use a card to group a short summary and one related action.",
		},
	],
	badge: [
		{
			title: "Table statuses",
			description:
				"Keep status text explicit when badges appear in dense data rows.",
		},
	],
	accordion: [
		{
			title: "Multi-open and disabled",
			description:
				"multiple allows any number of open items; disabled items cannot be toggled.",
		},
	],
	dialog: [
		{
			title: "Destructive confirmation",
			description:
				"Use a danger action only when the consequence is clear and reversible where possible.",
		},
		{
			title: "Long-form task",
			description:
				"For focused tasks, keep the title visible and let the dialog body own its scroll.",
		},
		{
			title: "Fullscreen task",
			description:
				"placement=\"fullscreen\" fills the viewport with a sticky header, scrollable body, and footer actions.",
		},
		{
			title: "Drawer panel",
			description:
				"placement=\"right\" (or \"left\") slides a panel in from the edge; width sets its size.",
		},
		{
			title: "Bottom sheet",
			description:
				"placement=\"bottom\" rises from the thumb zone; snap=\"half\" keeps page context visible.",
		},
		{
			title: "Full-height sheet",
			description:
				"snap=\"full\" gives long content like pickers the full viewport height.",
		},
	],
	tooltip: [
		{
			title: "Pure hover and focus hint",
			description:
				"Use Tooltip for short, non-interactive context around an unfamiliar icon.",
			demo: "tooltip-pure",
		},
		{
			title: "Action context",
			description:
				"Keep the hint short when it sits beside an unfamiliar product action.",
			demo: "tooltip-actions",
		},
	],
	menu: [
		{
			title: "Separated destructive action",
			description:
				"Keep destructive actions at the end of the menu behind a separator.",
		},
		{
			title: "Keyboard action menu",
			description: "Menus preserve arrow-key navigation and Escape dismissal.",
		},
		{
			title: "Right-click context menu",
			description:
				'mode="context" attaches the menu to any element and opens it on right-click.',
		},
	],
	popover: [
		{
			title: "Inline filters",
			description:
				"Keep a small set of filters anchored to the toolbar that owns them.",
		},
		{
			title: "Supplemental controls",
			description:
				"Use a popover for controls that do not deserve a full route or dialog.",
		},
	],
	toast: [
		{
			title: "Failure feedback",
			description:
				"Use a danger variant for a failed action and keep the recovery path in context.",
		},
		{
			title: "Undo feedback",
			description:
				"Offer a short action when users may want to reverse a completed operation.",
		},
	],
	"empty-state": [
		{
			title: "Filtered empty result",
			description:
				"Explain that filters produced no results and offer a way to adjust them.",
		},
		{
			title: "Status outcomes",
			description:
				"Pass status to show a standard icon and tint for success, error, warning, info, or HTTP outcomes like 404.",
		},
	],
	loading: [
		{
			title: "Skeleton region",
			description:
				"Reserve the eventual layout with Skeleton when content shape is known.",
		},
	],
	alert: [
		{
			title: "Dismissible",
			description:
				"Pass onDismiss to render a close button for feedback the user can clear.",
		},
		{
			title: "Banner appearance",
			description:
				"appearance=\"banner\" renders a full-width page-level strip with an optional trailing action.",
		},
		{
			title: "Callout appearance",
			description:
				"appearance=\"callout\" stays in the reading flow with a left accent bar; pass accent={false} to hide it.",
		},
	],
	tabs: [
		{
			title: "Profile sections",
			description: "Use tabs for peer views that share the same route context.",
		},
		{
			title: "Responsive tab list",
			description:
				"Long tab labels remain reachable through horizontal scrolling.",
			demo: "tabs-responsive",
		},
	],
	pagination: [
		{
			title: "Boundary pages",
			description:
				"Disable previous and next controls at the collection boundaries.",
		},
	],
	"page-header": [
		{
			title: "Responsive actions",
			description: "Let actions wrap beneath the title on narrow screens.",
		},
	],
	"nav-rail": [
		{
			title: "Badge dots",
			description:
				"Pass badge to flag a destination that needs attention without carrying a count.",
		},
	],
	"top-bar": [
		{
			title: "Application shell header",
			description:
				"Combine brand, global search, and account actions in one persistent header.",
		},
		{
			title: "Compact shell",
			description:
				"Use the same slots for a focused route header with fewer global actions.",
			demo: "top-bar-shell",
		},
	],
	breadcrumb: [
		{
			title: "Collapsed middle items",
			description:
				"Trails longer than collapseAfter move middle items into a labeled menu.",
		},
	],
	separator: [
		{
			title: "Vertical grouping",
			description:
				"Use a vertical separator only when adjacent controls form one horizontal group.",
		},
	],
	"button-group": [
		{
			title: "Vertical cluster",
			description:
				"Use vertical orientation when the actions stack in a narrow panel.",
		},
	],
	link: [
		{
			title: "Standalone navigation",
			description:
				"Use the standalone variant outside prose, where underline-on-hover signals the affordance.",
		},
	],
	slider: [
		{
			title: "Bounded ranges",
			description:
				"Set min, max, and step when the meaningful range is narrower than 0–100.",
		},
	],
	"search-input": [
		{
			title: "Loading results",
			description:
				"The loading state replaces the clear action while results refresh.",
		},
	],
	chip: [
		{
			title: "Locked filters",
			description: "Disabled chips communicate filters managed elsewhere.",
		},
	],
	kbd: [
		{
			title: "Combinations",
			description:
				"Join keys with plain-text separators for multi-key shortcuts.",
		},
	],
	"scroll-area": [
		{
			title: "Panel lists",
			description:
				"Pair with a fixed maxHeight so the page itself keeps its own scroll.",
		},
	],
	"hover-card": [
		{
			title: "Identity preview",
			description: "Show a person or project summary without leaving the list.",
		},
	],
	steps: [
		{
			title: "Clickable completed steps",
			description: "Allow returning to completed steps with onStepClick.",
		},
	],
	toggle: [
		{
			title: "Filter rows",
			description:
				"Use toggles in a toolbar for independent on/off preferences.",
		},
	],
	toolbar: [
		{
			title: "Formatting groups",
			description: "Group related controls and separate them with hairlines.",
		},
	],
	"split-button": [
		{
			title: "Secondary and danger variants",
			description: "The menu can carry a danger item behind the separator.",
		},
	],
	"avatar-group": [
		{
			title: "Compact stacks",
			description: "Use the small size and a lower max inside table rows.",
		},
	],
	"tree-view": [
		{
			title: "Default expansion",
			description: "Open key branches on first render with defaultExpandedIds.",
		},
	],
	command: [
		{
			title: "Keyboard first",
			description:
				"Bind a global shortcut to open the palette; keep item hints scannable.",
		},
	],
	"progress-circle": [
		{
			title: "Indeterminate work",
			description: "Omit value while progress cannot be measured.",
		},
	],
	timeline: [
		{
			title: "Event tones",
			description: "Use success and warning tones to mark outcomes in a feed.",
		},
	],
	"code-block": [
		{
			title: "Line numbers",
			description:
				"Enable line numbers for walkthroughs that reference specific lines.",
		},
	],
	meter: [
		{
			title: "Custom formatting",
			description:
				"formatValue renders units such as GB in the readout and the accessible value text.",
		},
	],
	rating: [
		{
			title: "Read-only display",
			description:
				"readOnly renders static stars with an img role for review summaries.",
		},
	],
	announcer: [
		{
			title: "Assertive updates",
			description:
				'Use politeness="assertive" only for urgent changes that should interrupt.',
		},
	],
	"color-picker": [
		{
			title: "Controlled color",
			description: "Pair value with onChange when the color drives other UI.",
		},
	],
	"alert-dialog": [
		{
			title: "Custom actions",
			description:
				"Pass actions to replace the default cancel and confirm buttons entirely.",
		},
	],
	tour: [
		{
			title: "Placement",
			description:
				'Use placement="top" when the step target sits near the bottom of the viewport.',
		},
	],
	menubar: [
		{
			title: "Menu items",
			description:
				"Items share the Menu contract, including icons, disabled states, and danger.",
		},
	],
	"navigation-menu": [
		{
			title: "Panel content",
			description:
				"Panel items accept arbitrary content such as feature grids or promoted links.",
		},
	],
	"back-top": [
		{
			title: "Custom threshold",
			description:
				"Lower the threshold on short pages so the control still appears.",
		},
	],
	list: [
		{
			title: "Dense lists",
			description:
				"Use dense inside popovers and panels where vertical space is tight.",
		},
	],
	stack: [
		{
			title: "Wrapping rows",
			description:
				"wrap lets a row flow onto multiple lines on narrow screens.",
		},
	],
	resizable: [
		{
			title: "Vertical stacks",
			description:
				'direction="vertical" splits panes top to bottom with the same handle behavior.',
		},
	],
	"aspect-ratio": [
		{
			title: "Media placeholders",
			description:
				"Reserve space for media that has not loaded to avoid layout shift.",
		},
	],
	"visually-hidden": [
		{
			title: "Extra context",
			description:
				"Add location or status context to links whose visible text stays short.",
		},
	],
	"copy-button": [
		{
			title: "Icon-only copy",
			description:
				"iconOnly fits copy actions inside table rows and code headers.",
		},
	],
	"theme-toggle": [
		{
			title: "Persisting choice",
			description: "Store the theme in onChange and reapply the class on load.",
		},
	],
};

for (const module of modules) {
	module.examples = [
		...module.examples,
		...(additionalExamples[module.id] ?? []),
	];
}

/** Editorial guidance is kept beside the canonical module registry. */
/** @type {Record<string, { useWhen: string, avoidWhen: string, behavior: string, responsive: string }>} */
const guidanceById = {
	"app-switcher": {
		useWhen: "People move between entitled ecosystem applications.",
		avoidWhen:
			"The navigation is inside one application; use a sidebar or tabs instead.",
		behavior:
			"The caller filters applications by entitlement first; the switcher always includes the explicit Home destination.",
		responsive:
			"The dropdown collision-handles to stay on screen; keep labels short on narrow layouts.",
	},
	"ecosystem-rail": {
		useWhen:
			"A product needs persistent navigation across the whole ecosystem, not just its own sections.",
		avoidWhen:
			"The navigation is inside one application; use Sidebar. For a temporary switcher menu, use App Switcher.",
		behavior:
			"Home always renders first, the caller filters destinations by entitlement, health status appears only when supplied, and onNavigate fires before ordinary anchor navigation.",
		responsive:
			"Rail mode collapses to icons until hover or focus; fold the rail into a drawer on narrow screens.",
	},
	"account-menu": {
		useWhen:
			"A signed-in household identity needs session and account actions.",
		avoidWhen: "The surface has no identity concept or is public.",
		behavior:
			"App-session and SSO sign-out stay distinct actions with product-supplied labels.",
		responsive:
			"The trigger stays a compact avatar so it fits top bars at any width.",
	},
	"launcher-card": {
		useWhen:
			"An application destination needs a prominent, scannable entry point.",
		avoidWhen:
			"The destination is a minor link inside prose; use a plain link instead.",
		behavior:
			"Disabled cards leave the focus order and block navigation instead of hiding.",
		responsive:
			"Cards stack single-column on mobile and grid at larger widths under the caller’s layout.",
	},
	"permission-matrix": {
		useWhen: "Owners review who can reach which application or capability.",
		avoidWhen:
			"The data is a flat list rather than a people-by-applications grid; use Table instead.",
		behavior:
			"Cells are caller-rendered; missing entries show an explicit em dash rather than a blank.",
		responsive:
			"The table region scrolls horizontally on narrow screens and becomes focusable only when it overflows.",
	},
	"notification-item": {
		useWhen: "An inbox lists sanitized pointers to application events.",
		avoidWhen:
			"The feedback is local to the current task; use Alert or Toast instead.",
		behavior:
			"Mute and archive touch delivery state only; the deep link never mutates the source.",
		responsive: "Text wraps and controls stay reachable at mobile widths.",
	},
	"health-indicator": {
		useWhen: "A surface reports one application or ecosystem health status.",
		avoidWhen: "The status is decorative; omit it instead of implying health.",
		behavior:
			"Unknown, stale, and checking are explicit states; health is never inferred from missing evidence.",
		responsive: "The badge and label wrap naturally in compact headers.",
	},
	"step-up-notice": {
		useWhen: "A sensitive action requires fresh strong authentication first.",
		avoidWhen: "A plain warning suffices; use Alert instead.",
		behavior:
			"The verification action is caller-supplied; the notice never starts or auto-submits verification.",
		responsive: "The action wraps beneath the explanation on narrow screens.",
	},
	button: {
		useWhen: "A user needs to take an explicit action.",
		avoidWhen: "The control is only communicating status or navigation.",
		behavior: "Loading disables the native button until the action completes.",
		responsive:
			"Let actions wrap in narrow toolbars instead of shrinking their labels.",
	},
	field: {
		useWhen:
			"A control needs a visible label, help text, or validation message.",
		avoidWhen: "The control already owns an equivalent form-label composition.",
		behavior:
			"Field provides the id and ARIA relationships consumed by its child control.",
		responsive: "Keep labels readable and let long error messages wrap.",
	},
	input: {
		useWhen: "Users enter or search for short text.",
		avoidWhen: "A constrained set of choices or a long-form editor is clearer.",
		behavior:
			"Native input behavior is preserved, including browser validation and refs.",
		responsive:
			"Use full width on small screens and constrain width at larger sizes.",
	},
	select: {
		useWhen: "Users choose one value from a known list.",
		avoidWhen:
			"There are only two choices or users need to compare all options at once.",
		behavior:
			"Radix manages keyboard navigation, typeahead, focus, and collision handling.",
		responsive:
			"The trigger fills its parent width and the menu follows its measured width.",
	},
	checkbox: {
		useWhen: "Users can select independent items or a tri-state group.",
		avoidWhen:
			"Changing the value should take effect immediately as a setting.",
		behavior:
			"Checked, unchecked, and indeterminate states remain native and form-friendly.",
		responsive: "Allow supporting text to wrap beside the control.",
	},
	switch: {
		useWhen: "A boolean setting takes effect immediately.",
		avoidWhen: "The user must submit several values together as a form.",
		behavior:
			"The label and description remain associated with the switch control.",
		responsive:
			"Keep the control at a fixed size while the setting copy takes available width.",
	},
	card: {
		useWhen: "Related content needs a structural surface.",
		avoidWhen:
			"A card is being used only to decorate every section or hide a primary action.",
		behavior:
			"Card is non-interactive by default and accepts an explicit polymorphic element.",
		responsive: "Use compact padding and let card content define its width.",
	},
	badge: {
		useWhen: "A short status or category needs quick visual scanning.",
		avoidWhen: "The content needs an action or a sentence of explanation.",
		behavior: "Variant changes meaning without changing the content semantics.",
		responsive: "Keep labels short so badges do not dominate dense rows.",
	},
	accordion: {
		useWhen: "Sections of related content should be progressively disclosed.",
		avoidWhen:
			"All content must be visible at once or sections are compared side by side.",
		behavior:
			"Single mode keeps at most one item open and is collapsible; multiple mode opens any number.",
		responsive: "Keep titles short so triggers stay on one line.",
	},
	dialog: {
		useWhen: "A decision or focused task must temporarily block the page.",
		avoidWhen: "The content can be inline or handled by a popover.",
		behavior:
			"Focus is trapped, Escape dismisses, and focus returns to the trigger, for every placement.",
		responsive:
			"placement=\"bottom\" snaps to half or full viewport height; the left and right placements size with the width prop, and placement=\"fullscreen\" always fills the viewport.",
	},
	tooltip: {
		useWhen: "An unfamiliar icon or abbreviated label needs a brief hint.",
		avoidWhen: "The user must read or interact with the content.",
		behavior: "Hover and focus reveal a short non-interactive description.",
		responsive:
			"Never rely on hover alone; provide a visible label on touch layouts.",
	},
	menu: {
		useWhen: "Several related actions belong behind one trigger.",
		avoidWhen: "The actions should remain visible for frequent workflows.",
		behavior: "Keyboard navigation and dismissal are managed by Radix.",
		responsive:
			"Keep destructive actions separated and easy to reach on touch.",
	},
	popover: {
		useWhen: "Supplemental controls should stay anchored to a trigger.",
		avoidWhen: "The content is a blocking task or a simple one-line hint.",
		behavior: "Focus returns to the trigger after dismissal.",
		responsive: "Keep panels within the viewport and avoid overly wide forms.",
	},
	toast: {
		useWhen: "A completed or failed action needs brief asynchronous feedback.",
		avoidWhen:
			"The message is required to continue or must be read in context.",
		behavior:
			"Toaster announces messages and supports timed or manual dismissal.",
		responsive:
			"Position toasts away from mobile browser controls and safe areas.",
	},
	"empty-state": {
		useWhen: "A product surface has no results or has not been configured.",
		avoidWhen: "Content is merely loading or filtered temporarily.",
		behavior:
			"Explain what happened and give one clear next action when useful.",
		responsive: "Keep the message readable and center the action beneath it.",
	},
	loading: {
		useWhen: "Users need feedback while content or work is in progress.",
		avoidWhen: "The operation is instant or no meaningful progress exists.",
		behavior:
			"Use Spinner for local work, Skeleton for layout, and Progress for measurable work.",
		responsive:
			"Prefer local indicators so small screens retain useful content.",
	},
	alert: {
		useWhen:
			"Feedback must stay visible in context until it is read or dismissed.",
		avoidWhen:
			"A brief confirmation is enough; use a toast for transient feedback.",
		behavior:
			'Danger renders role="alert" for immediate announcement; other variants render role="status". appearance="callout" renders no live region and stays in the reading flow.',
		responsive: "Let the body text wrap and keep the title to a short phrase.",
	},
	tabs: {
		useWhen: "Related views share a context and users switch between them.",
		avoidWhen: "Views need independent URLs or a long sequence of steps.",
		behavior: "Arrow keys move between tabs and the active panel is announced.",
		responsive:
			"Allow tab labels to scroll rather than wrap into ambiguous rows.",
	},
	pagination: {
		useWhen: "A large collection is split into stable pages.",
		avoidWhen: "Users need continuous search, sorting, or infinite history.",
		behavior:
			"The page is controlled by the consumer and unavailable directions are disabled.",
		responsive:
			"Keep controls large enough for touch and preserve the current page label.",
	},
	"page-header": {
		useWhen: "A route needs a consistent title, context, and primary actions.",
		avoidWhen:
			"The content is a small inline section without route-level actions.",
		behavior:
			"Actions remain aligned with the title and wrap below it when needed.",
		responsive:
			"Let actions wrap naturally below the heading at narrow widths.",
	},
	"nav-rail": {
		useWhen:
			"A dense product needs a compact, always-visible strip of top-level destinations.",
		avoidWhen:
			"Destinations need visible labels or grouped sections; use Sidebar.",
		behavior:
			"The active item sets aria-current and every icon is named through aria-label and a tooltip.",
		responsive:
			"Keep the rail floating on desktop and fold destinations into a drawer on narrow screens.",
	},
	"top-bar": {
		useWhen:
			"An application needs a consistent global header and action slots.",
		avoidWhen: "A page has only local controls that belong in its header.",
		behavior:
			"Sticky mode keeps the bar visible while its slots remain composable.",
		responsive:
			"Collapse secondary actions and move search to a dedicated mobile trigger.",
	},
	breadcrumb: {
		useWhen: "Users need to see and move within a deep page hierarchy.",
		avoidWhen:
			"The structure is flat or the trail would duplicate primary navigation.",
		behavior:
			"The last item is the current page; middle items collapse into a menu past collapseAfter.",
		responsive: "Let items wrap and prefer collapsing over shrinking labels.",
	},
	"button-group": {
		useWhen: "Two to four tightly related actions belong to one decision.",
		avoidWhen:
			"The actions are unrelated or need distinct visual priority; space them normally.",
		behavior:
			"Seams collapse to hairlines and only the outer corners keep their radius.",
		responsive:
			"Let the cluster wrap or switch to vertical orientation on narrow screens.",
	},
	link: {
		useWhen:
			"Navigation happens inline in prose or as a lightweight standalone action.",
		avoidWhen: "The affordance performs an action; use Button instead.",
		behavior:
			'External links open a new tab with rel="noreferrer" and an indicator icon.',
		responsive: "Let inline links wrap naturally with their surrounding text.",
	},
	"radio-group": {
		useWhen: "Users pick exactly one option from a small visible set.",
		avoidWhen: "The list is long or needs filtering; use Select or Combobox.",
		behavior:
			"Arrow keys move and select within the group; the label is wired through aria-labelledby.",
		responsive:
			"Switch to horizontal orientation only when labels stay on one line.",
	},
	slider: {
		useWhen:
			"A value inside a known range is more natural to scrub than to type.",
		avoidWhen:
			"Precision matters more than speed; pair with or use Input instead.",
		behavior:
			"Pointer and keyboard adjust the value and showValue mirrors it live.",
		responsive:
			"The track fills its container width, so constrain it in the layout.",
	},
	"search-input": {
		useWhen: "A field exists specifically to query a collection.",
		avoidWhen: "The input is general-purpose text entry; use Input.",
		behavior:
			"The clear action appears only with a value, and loading swaps it for a spinner.",
		responsive: "Icons stay pinned inside the field at any width.",
	},
	combobox: {
		useWhen:
			"Users choose one value from a list long enough to need filtering.",
		avoidWhen:
			"The list is short; use Select, or the value is free text; use Input.",
		behavior:
			"Typing filters, arrows highlight, Enter selects, Escape preserves the current value.",
		responsive:
			"The suggestion list matches the field width and collision-handles vertically.",
	},
	chip: {
		useWhen: "Active filters or selections need compact, removable tokens.",
		avoidWhen: "The status is informational only; use Badge.",
		behavior:
			"The remove action is labeled from the chip text for screen readers.",
		responsive: "Chips wrap in rows; keep labels to one or two words.",
	},
	kbd: {
		useWhen: "A keyboard shortcut is referenced in help or onboarding copy.",
		avoidWhen: "The key is part of a form value; use plain text.",
		behavior: "Sizing is em-based so the keycap scales with its context.",
		responsive:
			"Keep combinations short; wrap groups of keys with separators as text.",
	},
	"scroll-area": {
		useWhen: "A panel needs a bounded height with theme-consistent scrollbars.",
		avoidWhen:
			"The page itself should scroll; do not nest page-level scrolling.",
		behavior:
			"The custom thumb appears over a transparent track only where scrolling is possible; the viewport is keyboard focusable.",
		responsive:
			"Set maxHeight in relative units so the region adapts to viewport height.",
	},
	"hover-card": {
		useWhen: "Rich preview context helps before committing to navigation.",
		avoidWhen:
			"The content is a short hint; use Tooltip, or must be interacted with on touch; use Popover.",
		behavior: "Hover and keyboard focus open the card after a tunable delay.",
		responsive:
			"Provide the same content through another path on touch layouts.",
	},
	steps: {
		useWhen:
			"A flow has a clear sequence and the user benefits from seeing progress.",
		avoidWhen: "Steps are independent views; use Tabs or navigation.",
		behavior:
			"The current step sets aria-current and completed steps can be made clickable.",
		responsive:
			"Steps wrap with their labels on narrow screens; keep labels short.",
	},
	"description-list": {
		useWhen: "A detail view lists labeled values for one entity.",
		avoidWhen: "Records need column comparison; use Table.",
		behavior: "Real dl/dt/dd markup keeps the relationship semantic.",
		responsive:
			"Stacked layout is default; grid splits to two columns on wider screens.",
	},
	toggle: {
		useWhen:
			"A preference flips between two states inside a toolbar or filter row.",
		avoidWhen:
			"The choice needs a label with explanation; use Switch or Checkbox.",
		behavior: "aria-pressed reflects the value and the pressed tint follows.",
		responsive: "Keep toggle content icon-sized so rows stay compact.",
	},
	toolbar: {
		useWhen: "Several small controls act on one editor or view.",
		avoidWhen:
			"The actions are unrelated page actions; use a header action area.",
		behavior:
			'role="toolbar" groups controls; separators are decorative hairlines.',
		responsive: "Let groups wrap or scroll horizontally on narrow screens.",
	},
	"split-button": {
		useWhen: "One default action has a few close alternatives.",
		avoidWhen:
			"The actions are unrelated; use separate buttons or a plain Menu.",
		behavior: "The main button fires the default; the chevron owns the menu.",
		responsive: "Keep the label short so the joined control stays one line.",
	},
	"multi-select": {
		useWhen: "Users pick several values from a filterable list.",
		avoidWhen: "Only one value is allowed; use Select or Combobox.",
		behavior:
			"Options toggle without closing and pills remove through compact 24px touch targets.",
		responsive: "Pills wrap inside the control as values accumulate.",
	},
	"date-picker": {
		useWhen:
			"Users pick a calendar date, month, year, timestamp, or date range.",
		avoidWhen: "The value is free-form text; use Input.",
		behavior:
			"mode switches the popover between day, month, year, and datetime panels; selection=\"range\" turns two clicks into {from, to} with presets and a connected band.",
		responsive:
			"The popover collision-handles; the field keeps its layout width.",
	},
	"number-input": {
		useWhen: "A numeric value benefits from quick stepping.",
		avoidWhen: "The value is an identifier, not a quantity; use Input.",
		behavior:
			"Steppers use 24px touch targets and blur clamps to min/max; empty means undefined.",
		responsive:
			"The field fills its container; constrain it in the form layout.",
	},
	"password-input": {
		useWhen: "The user enters a secret they may want to verify visually.",
		avoidWhen: "The content is not sensitive; use Input or SearchInput.",
		behavior: "The visibility toggle reports state through aria-pressed.",
		responsive: "The toggle stays pinned inside the field at any width.",
	},
	"file-upload": {
		useWhen: "Users attach files to a form.",
		avoidWhen: "A single URL or text reference suffices; use Input.",
		behavior:
			"Drag-over highlights the zone; the list mirrors the caller-owned value.",
		responsive: "The zone fills its container and the file list wraps below.",
	},
	"avatar-group": {
		useWhen: "Several identities belong to one row or card.",
		avoidWhen: "One identity needs emphasis; use Avatar.",
		behavior:
			"Overflow collapses into a +N bubble; the group label names everyone.",
		responsive: "Lower max in dense contexts like tables.",
	},
	table: {
		useWhen: "Records need readable rows and columns, optionally with caller-owned sorting and selection.",
		avoidWhen:
			"The data is hierarchical; TreeView or TreeGrid fits better.",
		behavior:
			"Columns declare a header and a cell renderer; sortable headers report the next sort state through onSortChange, and selectable adds a header checkbox with indeterminate bulk state plus per-row checkboxes reported through onSelectionChange. Loading swaps in skeleton rows and marks the region busy; an empty rows array shows the empty content.",
		responsive:
			"The region scrolls horizontally when columns overflow and takes keyboard focus only then.",
	},
	separator: {
		useWhen:
			"Adjacent sections need a subtle visual break, such as between groups in a settings page.",
		avoidWhen:
			"Spacing alone would do, or the boundary deserves a heading instead.",
		behavior:
			"Decorative by default; pass decorative={false} for a semantic rule and orientation=\"vertical\" for inline groups.",
		responsive:
			"Horizontal rules stretch to their container; vertical ones need a parent with a defined height.",
	},
	avatar: {
		useWhen:
			"A person or entity needs a compact visual identity in lists, comments, or headers.",
		avoidWhen:
			"The image is content rather than identity; use a plain img or LazyImage.",
		behavior:
			"Falls back from image to two-letter initials to a generic user icon; a failed image load swaps to initials, and alt defaults to the name.",
		responsive:
			"Fixed sm, md, and lg sizes; use sm in dense rows and lg in profile headers.",
	},
	stat: {
		useWhen: "A dashboard surfaces one key metric with its trend at a glance.",
		avoidWhen:
			"The data needs comparison across many categories; use a chart or Table.",
		behavior:
			"The delta direction picks the icon and default tone — up is success, down is danger, flat is neutral — and tone overrides it when the semantics differ.",
		responsive:
			"Value and delta wrap at the baseline on narrow widths; supporting content stacks below.",
	},
	list: {
		useWhen:
			"A vertical set of items carries icons, secondary text, or trailing metadata, like files or settings entries.",
		avoidWhen:
			"The items are navigation; use a navigation component. Records needing columns fit Table better.",
		behavior:
			"onClick turns the whole row into a button; dense reduces the vertical padding of every item.",
		responsive:
			"Titles and secondary text truncate while leading and trailing slots stay pinned.",
	},
	sparkline: {
		useWhen:
			"A compact trend belongs inline next to a metric, in a table cell, or inside a Stat.",
		avoidWhen:
			"Users need exact values, axes, or several series; use LineChart or BarChart.",
		behavior:
			"Values scale to the data's min/max range; a flat series centers the line and a single value renders a dot.",
		responsive:
			"Fixed pixel width and height by design; size it to the slot it accompanies.",
	},
	calendar: {
		useWhen:
			"Users pick a single date from a month grid, optionally bounded by min, max, or a disabledDates predicate.",
		avoidWhen:
			"The user needs a range or a field with a popover; use DatePicker.",
		behavior:
			"Days are buttons with aria-pressed for the selection and aria-current=\"date\" for today; the aria-live month label announces navigation, and the visible month can be controlled.",
		responsive:
			"The grid keeps a fixed seven-column width; place it in a popover or panel on small screens.",
	},
	"tree-view": {
		useWhen:
			"Content is genuinely hierarchical, like files or nested categories.",
		avoidWhen: "The list is flat; use a plain list or Tabs.",
		behavior: "Arrow keys expand, collapse, and move; Enter selects.",
		responsive:
			"Indent scales with depth; keep labels truncating, not wrapping.",
	},
	command: {
		useWhen: "Power users need fast keyboard access to many actions.",
		avoidWhen: "There are few actions; use visible buttons or a Menu.",
		behavior: "Filtering, highlight, and selection reset on every open.",
		responsive:
			"The panel caps at viewport width with its own internal scroll.",
	},
	"progress-circle": {
		useWhen: "Progress needs a compact radial treatment.",
		avoidWhen: "A precise value matters in a table; use Progress.",
		behavior:
			"Determinate mode exposes aria-valuenow; omit value for indeterminate.",
		responsive: "Set an explicit size per context instead of scaling.",
	},
	timeline: {
		useWhen: "Events form a chronological feed.",
		avoidWhen: "Items are peers without time order; use a plain list.",
		behavior: "Tone dots carry semantics; connectors skip the last item.",
		responsive: "Content wraps while the rail stays fixed width.",
	},
	"code-block": {
		useWhen: "Code or commands should be readable and copyable.",
		avoidWhen: "A single identifier in prose; use inline code styling.",
		behavior:
			"The copy action confirms with an icon swap and announces via its label; long code regions are keyboard focusable.",
		responsive: "Long lines scroll horizontally instead of wrapping.",
	},
	meter: {
		useWhen: "A quantity within a known range needs a glanceable gauge.",
		avoidWhen: "Progress toward completing a task is shown; use Progress.",
		behavior:
			'role="meter" carries min, max, and now; zones color the fill from low, high, and optimum.',
		responsive:
			"The track fills its container, so constrain width in the layout.",
	},
	rating: {
		useWhen: "Users score something on a small fixed scale.",
		avoidWhen:
			"The input is numeric but not a rating; use Slider or NumberInput.",
		behavior:
			"Stars form a radiogroup with roving tab index and arrow-key selection.",
		responsive: "Pick a size per context; the inline group never wraps.",
	},
	announcer: {
		useWhen: "State changes off-screen must reach screen-reader users.",
		avoidWhen:
			"The change is already visible and focused; announcement would duplicate it.",
		behavior:
			"The region clears and rewrites so identical messages re-announce.",
		responsive: "The region is visually hidden and has no layout impact.",
	},
	"pin-input": {
		useWhen: "The user enters a fixed-length numeric code.",
		avoidWhen: "The value is free-form text; use Input.",
		behavior:
			"Typing, Backspace, arrows, and paste move between cells; onComplete fires when full.",
		responsive: "Cells keep a fixed tap size; reduce length on narrow screens.",
	},
	"tags-input": {
		useWhen: "A field collects an open-ended list of short tokens.",
		avoidWhen: "Values come from a fixed set; use MultiSelect.",
		behavior:
			"Enter or comma commits; duplicates are ignored and chips remove individually.",
		responsive: "Chips wrap inside the field as the list grows.",
	},
	"input-group": {
		useWhen:
			"An input needs a fixed prefix or suffix such as a protocol or unit.",
		avoidWhen: "The accessory is interactive; use separate controls instead.",
		behavior:
			"The group owns the border and focus ring, so the whole box highlights as one control.",
		responsive: "Addons stay fixed width while the input flexes.",
	},
	editable: {
		useWhen: "A displayed value is renamed or corrected in place.",
		avoidWhen:
			"The value is edited alongside others in a form; use Field and Input.",
		behavior:
			"Enter and blur commit, Escape cancels, and the draft is preselected.",
		responsive: "The preview truncates within its container width.",
	},
	"time-picker": {
		useWhen: "The user enters a time of day.",
		avoidWhen:
			"A date or a date range is needed; use DatePicker.",
		behavior:
			"Hour and minute fields clamp while typing; the 12-hour cycle adds a period toggle.",
		responsive: "The segmented group stays inline and fits compact forms.",
	},
	"color-picker": {
		useWhen: "The user picks a color from presets or a hex value.",
		avoidWhen: "A full design-token editor is required.",
		behavior:
			"Presets commit immediately; hex input validates and normalizes on Enter or blur.",
		responsive:
			"The trigger fits toolbars; the panel caps at the preset grid width.",
	},
	"alert-dialog": {
		useWhen: "An action needs an explicit, blocking confirmation.",
		avoidWhen: "The consequence is minor; use Popconfirm or inline feedback.",
		behavior:
			"Focus stays trapped until cancel or confirm; tone styles the confirm action.",
		responsive: "The panel caps at the viewport with its own scroll.",
	},
	popconfirm: {
		useWhen: "A small action benefits from confirmation without a modal.",
		avoidWhen: "The consequence is severe; use AlertDialog.",
		behavior:
			"Anchored to its trigger and dismisses on confirm, cancel, or Escape.",
		responsive: "The panel stays within the viewport near the trigger.",
	},
	tour: {
		useWhen: "New users need a guided introduction to key areas.",
		avoidWhen: "The hint is local to one control; use Tooltip.",
		behavior:
			"Steps anchor to selectors, Escape or Skip closes, and missing targets center the dialog.",
		responsive: "Steps scroll targets into view; keep step content short.",
	},
	menubar: {
		useWhen:
			"A desktop-style application exposes many commands in labeled menus.",
		avoidWhen: "There are few actions; use a Toolbar or Menu.",
		behavior:
			"Arrows traverse triggers and items following the menubar pattern.",
		responsive: "Collapse into a single menu on narrow screens.",
	},
	"navigation-menu": {
		useWhen: "Top-level destinations mix links with rich preview panels.",
		avoidWhen: "The navigation is flat links only; use simpler link styling.",
		behavior:
			"Panels open in a shared viewport; the active link sets aria-current.",
		responsive: "Fall back to a vertical nav or drawer on narrow screens.",
	},
	"back-top": {
		useWhen: "Pages grow long enough that returning to the top is tedious.",
		avoidWhen: "The page is short or has its own scroll container.",
		behavior:
			"Appears past the threshold and scrolls smoothly unless reduced motion is preferred.",
		responsive: "The floating position clears content on all viewport sizes.",
	},
	stack: {
		useWhen:
			"Children flow along one axis with even spacing, from toolbar rows to page-level vertical rhythm.",
		avoidWhen:
			"The layout needs two-dimensional tracks or equal-width cells; use Grid or Columns.",
		behavior:
			"Numeric gaps follow the spacing scale (n × 0.25rem); direction, align, justify and wrap map straight to flexbox, and the as prop can swap the rendered element.",
		responsive:
			"Combine wrap with row direction so toolbars reflow onto multiple lines; switch direction per breakpoint through responsive classes.",
	},
	grid: {
		useWhen:
			"Children distribute across columns, either a fixed track count or responsive auto-fit cards.",
		avoidWhen:
			"Items flow in one line — use Stack; for tightly packed unequal heights, use Masonry.",
		behavior:
			"columns pins an exact track count; minChildWidth switches to auto-fit tracks, and children stretch to fill their cells.",
		responsive:
			"Auto-fit tracks collapse one by one as the container narrows, with no breakpoint code.",
	},
	resizable: {
		useWhen:
			"Users genuinely benefit from adjusting the split between panes, such as sidebar-and-content consoles.",
		avoidWhen:
			"The layout is fixed or the split is decorative; unneeded interaction adds focus stops and complexity.",
		behavior:
			"Handles drag with the pointer, step by a percentage with arrow keys, and reset on double-click; sizes are percentages clamped by minSize and maxSize.",
		responsive:
			"Set minSize so panes stay usable on narrow screens, and consider locking the split below a breakpoint.",
	},
	"aspect-ratio": {
		useWhen:
			"Media or embeds must hold a consistent shape across widths, like 16/9 video or square thumbnails.",
		avoidWhen:
			"Text or mixed content should size naturally; forcing a ratio clips or starves it.",
		behavior:
			"The wrapper reserves the ratio before content loads, preventing layout shift, and clips overflow with rounded corners.",
		responsive:
			"The box scales with its container while holding the ratio, so no per-breakpoint sizing is needed.",
	},
	"visually-hidden": {
		useWhen: "Assistive technology needs context the visual design omits.",
		avoidWhen: "The text should be visible; show it instead.",
		behavior: "Content stays in the accessibility tree without layout impact.",
		responsive: "No visual footprint at any viewport.",
	},
	"copy-button": {
		useWhen: "A value such as a command or id is copied often.",
		avoidWhen: "The value is editable; use an Input with a copy recipe.",
		behavior:
			"Clipboard failures still give feedback; a hidden live region announces the copy.",
		responsive: "iconOnly mode fits dense rows and headers.",
	},
	"theme-toggle": {
		useWhen: "The app offers a light and dark theme switch.",
		avoidWhen: "Theme follows the system only.",
		behavior:
			"Toggles the dark class on the document root and reports state through aria-pressed.",
		responsive: "Icon-sized control fits any header.",
	},
	carousel: {
		useWhen: "Peer items page through a bounded region.",
		avoidWhen: "All content should be visible at once; use Grid.",
		behavior:
			"Scroll-snap track with buttons, compact dots with 24px touch targets, and arrow keys; slides announce their position.",
		responsive:
			"Slides take full track width; keep content readable at mobile widths.",
	},
	"action-bar": {
		useWhen:
			"A page or panel has primary and secondary actions that apply to the whole content, like saving an edited record.",
		avoidWhen:
			"Actions belong to a single field or card; place buttons inline or use a ButtonGroup instead.",
		behavior:
			"Renders a labelled region with actions aligned to the end; sticky pins it to the configured edge of the scrolling container.",
		responsive:
			"The bar stretches full width and lets its actions wrap or shrink; keep the action set small on narrow screens.",
	},
	"bulk-action-bar": {
		useWhen:
			"A list or table supports multi-select and the same action must apply to every selected row at once.",
		avoidWhen:
			"Only one row is ever acted on; use row-level buttons or a Menu in context mode instead.",
		behavior:
			"Renders nothing while count is 0; the count is announced politely as it changes, and onClear resets the selection.",
		responsive:
			"Actions flex to fill the bar; on narrow widths keep bulk actions to two or three short labels.",
	},
	"floating-action-button": {
		useWhen:
			"One creation action dominates the screen, such as composing a message or adding a record to a long list.",
		avoidWhen:
			"Several actions compete or the action is destructive; use an ActionBar or regular Button instead.",
		behavior:
			"Stays fixed to the chosen viewport corner while content scrolls; label always names the button for assistive tech.",
		responsive:
			"Keeps a constant offset from the viewport edges at all widths; prefer the extended pill only when space allows.",
	},
	"share-button": {
		useWhen:
			"Users need to pass a deep link to a record, report, or page to someone else.",
		avoidWhen:
			"The goal is duplicating content inside the app; use a dedicated duplicate action instead.",
		behavior:
			"Copies the given URL (or the current page URL) with visible and announced feedback, and degrades gracefully when clipboard or share APIs are missing.",
		responsive:
			"The trigger is a standard button and the popover clamps to the viewport width, so it works at any size.",
	},
	"speed-dial": {
		useWhen:
			"A screen offers three to six related creation actions that deserve one persistent entry point.",
		avoidWhen:
			"There is a single primary action; a plain FloatingActionButton is simpler and faster to use.",
		behavior:
			"Opens on click or keyboard, focuses the first action, closes on Escape or after an action runs, and returns focus to the trigger.",
		responsive:
			"The fixed corner and fan direction keep actions on-screen at any width; choose the direction that points into the page.",
	},
	"autosize-textarea": {
		useWhen:
			"Entries vary widely in length and seeing the whole text matters, such as comments, bios, or feedback boxes.",
		avoidWhen:
			"The layout needs a stable, resizable field; use TextArea, which keeps a fixed minimum height and a resize handle.",
		behavior:
			"Height follows the content between minRows and maxRows; beyond maxRows the field scrolls instead of growing.",
		responsive:
			"The field stretches to fill its container and re-measures on every change, so wrapping text still fits.",
	},
	"checkbox-card": {
		useWhen:
			"An on/off choice needs a description or icon to be understood, such as notification channels or feature opt-ins.",
		avoidWhen:
			"The choice needs no explanation; a plain Checkbox is more compact. Mutually exclusive options call for RadioCard.",
		behavior:
			"Clicking or pressing Space toggles the card and reports the new checked state; each card in a group tracks its own state. Supports controlled and uncontrolled checked.",
		responsive:
			"Cards fill their container width; stack them single-column on narrow screens.",
	},
	"currency-input": {
		useWhen:
			"The user enters a monetary amount in a known currency, such as prices, budgets, or invoice totals.",
		avoidWhen:
			"The value is a plain number without a currency; use NumberInput instead. For multi-currency entry, pair a Select with NumberInput.",
		behavior:
			"Emits the parsed number on every edit (undefined when emptied) and formats the display with Intl.NumberFormat on blur, clamping to min/max.",
		responsive:
			"The field stretches to fill its container; the leading symbol addon stays a fixed width.",
	},
	fieldset: {
		useWhen:
			"Several controls together answer one question, such as an address block or a set of related checkboxes.",
		avoidWhen:
			"A single labeled control is enough; use Field on its own instead.",
		behavior:
			"The legend names the group for assistive technology; the disabled attribute disables every control inside, as native fieldsets do.",
		responsive:
			"Children lay out in a single-column grid; add your own grid classes inside for multi-column rows.",
	},
	form: {
		useWhen:
			"A plain HTML form needs value collection and a shared validation error map without adopting a form library.",
		avoidWhen:
			"Complex per-field state, async validation, or dependent fields are required; a dedicated form library fits better.",
		behavior:
			"Submitting collects values with FormData (repeated names become arrays) and calls onSubmit after preventing navigation; the errors map is read through useFormFieldError.",
		responsive:
			"Layout is fully caller-controlled; stack fields single-column on narrow screens.",
	},
	"form-error-summary": {
		useWhen: "Long or complex forms submit server- or client-side validation failures that users must locate quickly.",
		avoidWhen: "A single visible field fails inline; the Field error message alone is enough and a summary would repeat it.",
		behavior:
			"Activating an error link prevents navigation and focuses the element with the matching id, adding tabindex=-1 first when it is not naturally focusable. Renders nothing when the errors list is empty.",
		responsive: "The summary stacks its icon, heading, and link list at any width within the form container.",
	},
	"masked-input": {
		useWhen:
			"The value has a fixed digit count with familiar separators, such as dates, card expiries, or US phone numbers.",
		avoidWhen:
			"The format varies by region or allows letters; use a plain Input with a description, or PhoneInput for international numbers.",
		behavior:
			"Only digits are accepted, literals are inserted automatically, the caret stays after the last filled slot, and onChange receives the masked string.",
		responsive:
			"The field stretches to fill its container; fixed-width masks pair well with tabular numerals.",
	},
	"mention-input": {
		useWhen:
			"Free-form text needs lightweight references to people or records, such as comments, handoff notes, or review feedback.",
		avoidWhen:
			"Mentions must stay structured or deletable as chips — that needs a tokenized editor; for plain multi-line text without mentions use TextArea.",
		behavior:
			"Choosing an option inserts `@Label ` at the caret as plain text; the popup only opens for an @ that starts a new token and closes after insertion.",
		responsive:
			"The textarea fills its container and the popup anchors below it with a fixed, scrollable width.",
	},
	"password-strength-meter": {
		useWhen:
			"A sign-up or password-change flow should give live feedback on password quality next to a PasswordInput.",
		avoidWhen:
			"You only need to state requirements; a description list under PasswordInput is simpler and less noisy.",
		behavior:
			"Scores are clamped to 0–4 and mapped to Very weak through Very strong; the score prop replaces the default heuristic entirely.",
		responsive:
			"The meter stretches to fill its container; the label and strength text stay on one row with space between.",
	},
	"phone-input": {
		useWhen:
			"You collect phone numbers that must be stored in a normalized international form, such as contact or billing profiles.",
		avoidWhen:
			"The number is always domestic; a MaskedInput with a national format is less UI. For free-form contact info use a plain Input.",
		behavior:
			"Emits +<dial><digits> on every edit and undefined when the number is emptied; non-digit characters are stripped from the national number.",
		responsive:
			"The country dropdown keeps its natural width while the number field flexes to fill the remaining space.",
	},
	"radio-card": {
		useWhen:
			"A single choice between a few options benefits from a description or icon, such as plans, billing periods, or delivery speeds.",
		avoidWhen:
			"Options are short labels with no supporting text; RadioGroup or ToggleGroup is lighter. Several selections call for CheckboxCard.",
		behavior:
			"Selecting a card checks it and moves focus like a native radio group; the checked card holds the group's only tab stop and arrows wrap around, skipping disabled cards. Supports controlled and uncontrolled value.",
		responsive:
			"Vertical stacks fill their container; horizontal groups wrap cards onto multiple rows on narrow screens.",
	},
	"rich-text-editor": {
		useWhen:
			"Users write formatted long-form text that should stay portable markdown, such as release notes, docs, or issue descriptions.",
		avoidWhen:
			"Users expect WYSIWYG editing of rich content — that requires a contentEditable framework; for short plain answers use TextArea.",
		behavior:
			"Editing stays in a plain textarea; toolbar actions toggle markdown markers around the selection or at the start of the selected lines and keep the selection usable afterwards.",
		responsive:
			"The toolbar wraps within the editor width; the preview pane stacks below the textarea on narrow screens and sits beside it from md up.",
	},
	"timezone-select": {
		useWhen: "People schedule or display times across regions and need a recognizable zone with its offset visible.",
		avoidWhen: "The full IANA database is required; this curated list covers common zones, so build on Combobox with custom options instead.",
		behavior:
			"Filtering matches the city label, selection reports the IANA zone id, and the input shows the city with its UTC offset.",
		responsive: "The input fills its container and the option list overlays below it at the same width.",
	},
	"toggle-group": {
		useWhen:
			"Two to five related options need quick on/off switching, such as alignment or formatting controls.",
		avoidWhen:
			"Options need explanatory text or there are many of them; use RadioCard, CheckboxCard, or Select instead.",
		behavior:
			"Single mode keeps exactly one item checked and reports the new value; multiple mode reports the full array of pressed values. Disabled items leave the focus order and cannot be toggled.",
		responsive:
			"Items wrap to the next line when the group outgrows its container.",
	},
	"transfer-list": {
		useWhen:
			"The user builds a set from a larger pool and benefits from seeing both states side by side, such as permissions or team skills.",
		avoidWhen:
			"Only a handful of options exist — checkboxes or a MultiSelect are lighter; ordering within the chosen set is not supported.",
		behavior:
			"value always reflects the target list; moves preserve the original option order, and moved items stay selected so they can be sent back immediately.",
		responsive:
			"Both lists flex to share the available width; on narrow screens give the group a min width or stack it in a scrollable container.",
	},
	"tree-select": {
		useWhen:
			"Users pick one value from a hierarchy where intermediate grouping helps orientation, such as regions, folders, or org units.",
		avoidWhen:
			"The option set is flat or small — use Select; if the user needs to drill through many levels, display=\"columns\" scans faster.",
		behavior:
			"Branch nodes only expand or collapse; leaf nodes commit a single value, close the popover, and render their label in the trigger.",
		responsive:
			"The popover matches the trigger width and the tree scrolls vertically; deep levels indent rather than widen the control.",
	},
	"expandable-card": {
		useWhen:
			"A card carries secondary detail that most readers skip, for example changelogs, advanced settings, or long descriptions under a summary.",
		avoidWhen:
			"Several stacked disclosures belong together; use Accordion instead so only one section expands at a time and headings are grouped.",
		behavior:
			"The trigger button sets aria-expanded and points at the content region; while collapsed the region is aria-hidden and inert, and the chevron rotates as the height animates. Supports controlled (expanded) and uncontrolled (defaultExpanded) usage.",
		responsive:
			"The height animation uses the grid-rows technique, so any content height animates smoothly at any width without JavaScript measurement.",
	},
	"glass-panel": {
		useWhen:
			"Content floats over imagery, gradients, or video, for example hero overlays, map chrome, or media captions.",
		avoidWhen:
			"The surface sits on a plain app background; use Panel or Card instead, since backdrop blur adds rendering cost and buys nothing on solid color.",
		behavior:
			"GlassPanel is a static container: it applies the glass treatment (translucent background, backdrop blur, border highlight, overlay shadow) and no interaction of its own.",
		responsive:
			"The panel is width-agnostic; constrain it with a wrapper or className and the blur treatment adapts to whatever shows through.",
	},
	panel: {
		useWhen:
			"You need to group related content on the page with a light boundary, for example settings blocks, summaries, or sidebar sections.",
		avoidWhen:
			"The surface is a primary, clickable, or elevated content unit; use Card instead, which carries stronger elevation and an interactive variant.",
		behavior:
			"Panel is a static container: it renders a header row only when a title or actions are provided and adds no interaction of its own.",
		responsive:
			"The header row keeps its items on one line with a gap and relies on the flexible width of the panel, so it fills narrow columns without extra work.",
	},
	"action-sheet": {
		useWhen:
			"A small set of page-level actions on touch layouts, especially when one of them is destructive.",
		avoidWhen:
			"Rich forms or navigation menus; use Dialog with placement=\"bottom\" and custom content or Menu instead.",
		behavior:
			"Choosing an action fires its onSelect and closes the sheet; cancel closes without selecting anything.",
		responsive:
			"Stays full width with comfortable touch targets, capped and centered on wide screens.",
	},
	"cookie-consent": {
		useWhen: "You must collect consent without interrupting the task at hand, as required for cookie and tracking disclosures.",
		avoidWhen: "The decision blocks use of the product; use AlertDialog for a mandatory acknowledgement.",
		behavior: "Accept and decline both report the choice and dismiss the banner; visibility is controllable so consent can be re-opened later.",
		responsive: "Actions stack above the message on narrow screens and sit inline from the sm breakpoint up.",
	},
	"floating-panel": {
		useWhen:
			"Companion tooling (history, shortcuts, inspectors) the user keeps open while working in the page.",
		avoidWhen:
			"Tasks that demand full attention or decisions; use Dialog instead.",
		behavior:
			"Non-modal: the page stays interactive, focus is not trapped, and the panel closes via its close button or Escape.",
		responsive:
			"Fixed width capped to the viewport with margins on every side, so it never covers edge-to-edge on phones.",
	},
	"image-viewer": {
		useWhen: "A single diagram, map, or photo needs in-place inspection with zoom and pan, such as a blueprint or chart export.",
		avoidWhen: "Browsing a set of images; use Lightbox for galleries, or a plain img when no inspection is needed.",
		behavior: "Zoom is clamped between minZoom and maxZoom; panning only engages above minZoom and the offset resets when zoom returns to the minimum.",
		responsive: "The viewer fills its container and the image scales within it; sizing is controlled by the caller's layout.",
	},
	lightbox: {
		useWhen: "Users need to inspect a set of images one at a time without leaving the page, such as photo galleries or screenshot collections.",
		avoidWhen: "A single inline image with zoom controls is enough; use ImageViewer instead.",
		behavior: "Wraps from the last image to the first (and back) with both keys and buttons; Escape and backdrop clicks close the overlay.",
		responsive: "The image scales to fit the viewport while controls stay anchored to the edges on any width.",
	},
	"notification-center": {
		useWhen: "A product aggregates events from several sources behind a single bell-style entry point, such as deploys, comments, and billing alerts.",
		avoidWhen: "A single transient update; use Toast or Alert instead of an inbox.",
		behavior: "Rows reuse NotificationItem; the panel never mutates the items — read state changes are reported through onMarkAllRead for the caller to apply.",
		responsive: "The panel caps at 24rem and narrows to the viewport on small screens, with the list scrolling internally.",
	},
	"prompt-dialog": {
		useWhen:
			"Quick single-value captures like renaming, creating folders, or tagging, where a full form would be overkill.",
		avoidWhen:
			"Multiple fields or validation-heavy input; compose a Dialog with Field components instead.",
		behavior:
			"Confirm (or Enter) calls onSubmit with the entered value and closes; cancel and Escape close without submitting.",
		responsive:
			"A compact centered dialog capped to the viewport width with comfortable margins on small screens.",
	},
	"search-overlay": {
		useWhen: "Search is the primary task and deserves the whole screen, such as documentation or knowledge-base search triggered from a shortcut.",
		avoidWhen: "Choosing from a fixed set of commands; use Command, or Combobox for inline autocomplete inside a form.",
		behavior: "Arrow keys cycle the highlight through resultCount results and Enter reports the highlighted index via onSelect; query and highlight reset on every open.",
		responsive: "The input and results column cap at a readable width and the results area scrolls on short viewports.",
	},
	"blocking-overlay": {
		useWhen: "An in-flight operation must not be interrupted by further edits, such as a form save or a bulk action.",
		avoidWhen: "The content can remain interactive or a small inline spinner is enough; use Spinner or LoadingState instead.",
		behavior: "While visible it covers the wrapped content, sets aria-busy, moves focus into the overlay, and traps Tab until hidden.",
		responsive: "Fills its positioned container at any size; keep the container relative and full-width on small screens.",
	},
	"error-boundary": {
		useWhen: "A subtree can fail independently — dashboards, widgets, or third-party embeds — and the rest of the page must survive.",
		avoidWhen: "Handling expected async errors; catch those in data-loading code and show EmptyState or Alert instead.",
		behavior: "Catches render errors below it, calls onError, swaps in the fallback, and re-renders children on reset() or when any resetKey changes.",
		responsive: "Layout-agnostic; the fallback owns its own sizing.",
	},
	"loading-bar": {
		useWhen: "Navigations or page-level loads need ambient progress feedback without replacing the page content.",
		avoidWhen: "The wait is tied to one region or component; use LoadingState or Spinner there instead.",
		behavior: "Omits aria-valuenow in indeterminate mode; clamps determinate values to 0–max and animates width changes.",
		responsive: "Spans the full viewport width at any size; height stays a thin 2px strip.",
	},
	"network-status": {
		useWhen: "The UI depends on connectivity and users benefit from a persistent inline indicator, for example next to sync controls.",
		avoidWhen: "You only need to interrupt the user when connectivity drops; use OfflineBanner instead.",
		behavior: "Initializes from navigator.onLine and updates live on the window online/offline events.",
		responsive: "Compact inline element; the render prop allows any responsive treatment.",
	},
	"offline-banner": {
		useWhen: "Losing connectivity has real consequences — unsaved edits, stalled sync — and the user must be told immediately.",
		avoidWhen: "A subtle always-on indicator is enough; use NetworkStatus instead.",
		behavior: "Shows on the offline event, hides on the online event, stays hidden once dismissed until the next offline transition.",
		responsive: "Spans the full viewport width and wraps its message at narrow widths.",
	},
	"save-status": {
		useWhen: "A document or form autosaves and the user needs quiet, continuous confidence about persistence.",
		avoidWhen: "A save is an explicit user action with a clear result; use a Toast or inline Button feedback instead.",
		behavior: "Reflects the status prop: saved shows a check with an optional relative timestamp, saving shows a spinner, error shows a failure message.",
		responsive: "Stays inline and compact; pair it with a toolbar or header where space is tight.",
	},
	"status-dot": {
		useWhen: "You need a compact, glanceable status marker next to an entity name, for example in tables or list rows.",
		avoidWhen: "The status needs more explanation or an action; use Alert instead.",
		behavior: "Purely presentational: the dot is hidden from assistive technology and the visible label carries the meaning. With pulse it renders role=\"status\" with the label as aria-label and animates a ping ring, disabled under prefers-reduced-motion.",
		responsive: "Stays inline and shrinks to content; the label truncates with the surrounding layout.",
	},
	"upload-progress": {
		useWhen: "Uploads run in the background and users need per-file progress plus the ability to cancel.",
		avoidWhen: "You only need a single overall progress figure; use Progress or LoadingBar instead.",
		behavior: "Clamps progress to 0–100, formats the byte size, and calls onCancel from the trailing button without managing the upload itself.",
		responsive: "The file name truncates with ellipsis so the bar and cancel button keep their space at narrow widths.",
	},
	"anchor-nav": {
		useWhen:
			"A long page is split into id-addressable sections and readers need a persistent way to jump between them, such as docs or marketing pages.",
		avoidWhen:
			"The outline runs deeper than two levels or the links switch routes instead of scrolling within the page; use a Sidebar or SubNav instead.",
		behavior:
			"Clicking an item activates it and smooth-scrolls its section into view; scrolling updates the active item through IntersectionObserver, items can nest via children, and activeId can be controlled.",
		responsive:
			"The vertical layout suits side rails on wide screens; on narrow screens hide it or move it above the content.",
	},
	"bottom-nav": {
		useWhen:
			"A mobile app has three to five top-level destinations the user switches between constantly.",
		avoidWhen:
			"Destinations are numerous or hierarchical; use a Sidebar or an off-canvas Dialog instead, and hide BottomNav on desktop widths.",
		behavior:
			"Items are links with equal flex width; the active item exposes aria-current=\"page\", and the bar pads for the device safe area with env(safe-area-inset-bottom).",
		responsive:
			"Fixed to the bottom edge and full width; at desktop widths replace it with a Sidebar or TopBar navigation.",
	},
	dock: {
		useWhen:
			"A small set of apps or tools should be launchable from a playful, icon-only bar, such as in a desktop-like workspace.",
		avoidWhen:
			"Items need visible text labels or there are more than a handful of destinations; use BottomNav or Sidebar instead.",
		behavior:
			"Every item is a real button whose label prop is both the accessible name and the tooltip text; active adds a non-interactive indicator dot.",
		responsive:
			"The dock sizes to its icons and centers in available space; on narrow screens keep the item count low or allow horizontal scrolling in a wrapper.",
	},
	"floating-toolbar": {
		useWhen:
			"Actions apply to a transient context such as a text selection or a hovered row and should appear right next to it.",
		avoidWhen:
			"The controls are always visible in a fixed region of the screen; use Toolbar instead and skip the positioning.",
		behavior:
			"Renders nothing while open is false; when shown it is a single tab stop whose controls are reached with arrow keys, Home, and End, skipping disabled controls.",
		responsive:
			"Positioning comes from className or style, so the anchor logic decides placement; keep it inside the viewport near the selection.",
	},
	"mega-menu": {
		useWhen:
			"A marketing or docs site has a handful of top-level sections that each fan out into many categorized links.",
		avoidWhen:
			"The panel would hold actions rather than links, or the structure is a single short list; use Menu or NavigationMenu instead.",
		behavior:
			"Only one panel is open at a time; arrow keys move between triggers and across column boundaries, and Escape closes the panel and refocuses its trigger.",
		responsive:
			"Panels open below their trigger and grow with the column count; on narrow screens switch to an off-canvas Dialog or Accordion of the same links.",
	},
	sidebar: {
		useWhen:
			"The app has a persistent primary navigation that benefits from header and footer slots, such as a dashboard or admin console.",
		avoidWhen:
			"The nav is a dense icon-only strip with tooltips; use Nav Rail instead.",
		behavior:
			"Collapsed state is controlled or uncontrolled via collapsed/defaultCollapsed/onCollapsedChange; mode=\"rail\" collapses labels until hover or focus instead, floating renders a translucent glass pill, and the active item always exposes aria-current=\"page\".",
		responsive:
			"Collapsing frees horizontal space on narrow screens; pair with Dialog placement=\"left\" for an off-canvas pattern on phones.",
	},
	"skip-link": {
		useWhen:
			"Every page with repeated navigation should offer keyboard users a way to jump straight to the main content.",
		avoidWhen:
			"The page has no repeated blocks before the main content; a skip link adds a tab stop without saving any.",
		behavior:
			"An ordinary anchor to the target id; it stays focusable while visually hidden and slides into view on focus, so it works as the first tab stop.",
		responsive:
			"Position is absolute near the top corner and does not depend on viewport width.",
	},
	"sub-nav": {
		useWhen:
			"A section of the app needs its own second level of navigation below the primary nav, such as settings or project pages.",
		avoidWhen:
			"Items switch panels of content rather than navigate; use Tabs instead so keyboard and aria semantics match.",
		behavior:
			"Items are real links; the active item exposes aria-current=\"page\" and a persistent underline that aligns with the row's bottom border.",
		responsive:
			"The row scrolls horizontally when items exceed the available width; labels never wrap.",
	},
	"activity-feed": {
		useWhen:
			"A project, document, or account page needs a readable history of who did what and when.",
		avoidWhen:
			"Events are machine logs rather than human activity; use LogViewer instead.",
		behavior:
			"Renders items in the order given (supply newest first), formats timestamps via formatTime, and groups by calendar day when groupByDay is set.",
		responsive:
			"Stacks avatar, text, and timestamp vertically in a single column that wraps at narrow widths.",
	},
	"bar-chart": {
		useWhen:
			"Comparing discrete categories against each other, especially with a few series per category or when exact values deserve labels.",
		avoidWhen:
			"Showing a continuous trend over many ordered points; a LineChart reads better as categories multiply.",
		behavior:
			"Bars start from a zero baseline, carry a simple title tooltip with series, category, and value, and group evenly within each category band; horizontal mode mirrors the same data.",
		responsive:
			"The SVG scales down proportionally; horizontal orientation is the better fit when category labels are long or screens are narrow.",
	},
	"calendar-heatmap": {
		useWhen: "You need a daily activity overview for a whole year, such as commits, deploys, or streaks.",
		avoidWhen: "You need a two-dimensional matrix with custom row labels; use Heatmap instead.",
		behavior: "Purely presentational: missing dates render as level 0, levels clamp to 0–4, and every day cell carries a native title tooltip.",
		responsive: "The year grid is intrinsically wide; wrap it in a horizontally scrollable container at narrow widths.",
	},
	"chart-container": {
		useWhen:
			"You are building a chart type the library does not ship, or you want full control over the SVG while keeping an accessible summary and data table.",
		avoidWhen:
			"A standard line, area, bar, or pie chart fits the data; use LineChart, BarChart, or PieChart, which wrap this container already.",
		behavior:
			"Renders the SVG with role=\"img\" and the label as its accessible name; the data table stays visually hidden for screen readers until the toggle reveals it, and its visibility can be controlled.",
		responsive:
			"The SVG scales down with max-width while keeping its viewBox proportions; the data table and legend wrap below the chart on narrow screens.",
	},
	"comment-thread": {
		useWhen:
			"Discussions on documents, pull requests, or tickets need nested replies the user can collapse to scan the top level.",
		avoidWhen:
			"Events are one-directional history without conversation structure; use ActivityFeed instead.",
		behavior:
			"Threads start expanded; the collapse toggle hides a comment's replies and reports the hidden count. Reply actions are fully caller-wired via onReply.",
		responsive:
			"Nested replies indent with a left border and keep a single-column layout that wraps at narrow widths.",
	},
	"diff-viewer": {
		useWhen:
			"A config change, file edit, or generated output needs a compact before/after review inline in the page.",
		avoidWhen:
			"Users must edit or comment on individual lines; use a full code review surface instead.",
		behavior:
			"Given oldValue/newValue it computes a line-level LCS diff; given hunks it renders them verbatim. Added lines are tinted primary, removed lines error, and screen readers hear an Added/Removed/Unchanged prefix per line.",
		responsive:
			"Scrolls horizontally within its bordered pane so long lines never break the layout.",
	},
	"funnel-chart": {
		useWhen: "You need to show drop-off across an ordered pipeline, such as signups, checkouts, or hiring stages.",
		avoidWhen: "Values are not strictly sequential stages; use a Meter, Stat, or Table instead.",
		behavior: "Purely presentational: band widths scale to each stage value, each band carries a native title tooltip, and conversion percentages can be hidden with showPercentages.",
		responsive: "Renders at the given width and height; reduce width at narrow viewports or wrap it in a scrollable container.",
	},
	"gantt-chart": {
		useWhen:
			"A schedule or timeline needs a compact visual summary, such as release plans, availability, or project phases.",
		avoidWhen:
			"Users must edit tasks or drag bars — the chart is read-only by design; for a single trend line, Sparkline is lighter.",
		behavior:
			"Each task renders one bar whose position and length map to its start and end dates (inclusive). A today marker line appears when today falls inside the axis.",
		responsive:
			"The chart keeps its day scale and scrolls horizontally inside its container on narrow screens.",
	},
	"gauge-chart": {
		useWhen: "You need a single KPI against a known scale with qualitative zones, such as latency scores or capacity.",
		avoidWhen: "You compare several values or trends; use Stat, Meter, or Sparkline instead.",
		behavior: "Purely presentational: the value arc clamps to the min–max range while the center text always shows the raw value.",
		responsive: "Renders at the given width and height; shrink width at narrow viewports since the radius derives from it.",
	},
	heatmap: {
		useWhen: "You need a compact density view of a two-dimensional matrix, such as activity by weekday and hour.",
		avoidWhen: "You need exact per-cell comparisons or sorting; use Table instead. For a year of daily activity use CalendarHeatmap.",
		behavior: "Purely presentational: values scale to cell opacity between the data min and max, and every cell carries a native title tooltip with its row, column, and value.",
		responsive: "Sized from cellSize and the number of rows and columns; wrap it in a horizontally scrollable container at narrow widths.",
	},
	"json-viewer": {
		useWhen:
			"API responses, configuration objects, or webhook payloads need to be inspectable without leaving the page.",
		avoidWhen:
			"The user must edit the JSON rather than read it; use a code editor or form instead.",
		behavior:
			"Nodes start expanded down to defaultExpandedDepth; toggling a container shows a summary of its key or item count while collapsed, and copyable adds a path-copy button to every row.",
		responsive:
			"Scrolls horizontally inside its bordered pane when deeply nested lines exceed the available width.",
	},
	"kanban-board": {
		useWhen:
			"Users track work items across a small set of named stages, such as a sprint board or a review pipeline.",
		avoidWhen:
			"Rows need sorting, filtering, or many columns — use Table; for pure drag-and-drop file or list ordering, a dedicated sortable list fits better.",
		behavior:
			"Cards move one step per arrow key press. Enter or Space grabs the focused card, arrows move it, Enter or Space drops it, and Escape cancels the grab. Focus always follows the grabbed card.",
		responsive:
			"Columns keep a fixed width and the board scrolls horizontally when they overflow the viewport.",
	},
	"line-chart": {
		useWhen:
			"Showing trends over ordered categories or time for one or more series, where the shape of change matters more than individual values. Use type=\"area\" when magnitude or cumulative volume should be emphasized, with stacked for parts of a changing total.",
		avoidWhen:
			"Comparing discrete categories where lengths read better than slopes; use a BarChart, or a Sparkline for an inline glanceable trend.",
		behavior:
			"Points are hoverable and keyboard-focusable; hovering or focusing a point enlarges it and shows either a simple SVG title or the renderTooltip content. The y axis always includes zero unless every value is negative. When type=\"area\" is stacked, points sit at their cumulative position while tooltips and the data table report raw values.",
		responsive:
			"The SVG scales down proportionally with its container while the legend and data table wrap below; keep label counts small on narrow screens.",
	},
	"log-viewer": {
		useWhen:
			"Build, deploy, or runtime output streams need live, glanceable monitoring with severity at a glance.",
		avoidWhen:
			"Entries are human activity with actors and avatars; use ActivityFeed instead.",
		behavior:
			"While follow is on the pane scrolls to the newest line whenever lines change; toggling pauses auto-scroll so the user can read history. Follow can be controlled via follow/onFollowChange or uncontrolled via defaultFollow.",
		responsive:
			"Fixed-height pane (max-h-64 by default, overridable via className) with internal vertical scroll and wrapped long lines.",
	},
	"markdown-view": {
		useWhen:
			"User- or CMS-authored markdown (release notes, comments, doc snippets) needs lightweight rendering without a dependency.",
		avoidWhen:
			"Full CommonMark/GFM fidelity (tables, footnotes, nested emphasis) is required; use a dedicated markdown pipeline instead.",
		behavior:
			"Parses a hand-rolled subset — headings, bold, italic, links, lists, inline code, fenced code blocks, blockquotes, and rules — and never renders raw HTML; links only get an href for http(s), mailto, root-relative, or hash targets.",
		responsive:
			"Flows as a single column of block elements; long code blocks scroll horizontally inside their container.",
	},
	"org-chart": {
		useWhen:
			"Showing reporting lines or team structures where collapsing whole branches keeps large trees scannable.",
		avoidWhen:
			"The hierarchy is navigational rather than informational — use TreeView; for tabular hierarchy with per-row data columns, use TreeGrid.",
		behavior:
			"Every node with reports shows a toggle button that collapses or expands its whole subtree; collapse state is controlled or uncontrolled via collapsedIds.",
		responsive:
			"The chart keeps its node sizes and scrolls horizontally when the tree is wider than the viewport.",
	},
	"pie-chart": {
		useWhen:
			"Showing a small set of parts that make up a whole, where rough proportions matter more than exact comparison.",
		avoidWhen:
			"Comparing more than about five segments or values of similar size; angles are hard to judge, so use a BarChart instead.",
		behavior:
			"Segments are tab stops and arrow keys cycle focus between them with Home and End jumping to the first and last; each segment announces its name, value, and percentage. Non-positive values are skipped.",
		responsive:
			"The square SVG scales down proportionally with its container while the legend wraps below; percentage labels drop off segments under five percent.",
	},
	"qr-code": {
		useWhen:
			"A link, invite, or pairing payload needs to be scannable by a phone camera without adding a QR dependency.",
		avoidWhen:
			"Payloads exceed ~340 UTF-8 bytes or need higher error correction (logo overlays, dense print); use a dedicated QR library instead.",
		behavior:
			"Encodes the value as UTF-8 byte mode at error-correction level L, picks the smallest fitting version (1-10) and best mask, and renders crisp SVG modules at any size. Throws for values over 343 bytes.",
		responsive:
			"SVG scales losslessly; size is fixed in pixels via the size prop and can be driven by container queries or breakpoints from the parent.",
	},
	"radar-chart": {
		useWhen: "You compare multivariate profiles, such as skill matrices or product trade-offs, on a shared scale.",
		avoidWhen: "Axes are not commensurable or you need precise value reading; use a Table or Stat list instead.",
		behavior: "Purely presentational: values scale to the shared max (or the data max), each series polygon carries a native title tooltip, and an sr-only summary lists every value.",
		responsive: "Renders as a fixed-size square; shrink the size prop at narrow viewports.",
	},
	"scatter-chart": {
		useWhen: "You need to show correlation or distribution between two numeric variables, optionally weighted by a third.",
		avoidWhen: "Values are categorical or time-ordered trends; use Sparkline or Table instead.",
		behavior: "Purely presentational: axes scale to the data domain, each dot carries a native title tooltip, and an sr-only summary lists the series.",
		responsive: "Renders at the given width and height; wrap it in a horizontally scrollable container at narrow widths.",
	},
	"tree-grid": {
		useWhen:
			"Tabular data has a parent-child structure, such as file trees, budget rollups, or nested categories with shared columns.",
		avoidWhen:
			"Rows are flat — use Table, which supports sorting and selection; if there is no per-row data beyond a label, TreeView is simpler.",
		behavior:
			"Collapsed rows hide their whole subtree. Arrow Right expands a collapsed parent, Arrow Left collapses it or moves focus to its parent, and expansion state is controlled or uncontrolled.",
		responsive:
			"Columns keep their content width and the grid scrolls horizontally on narrow screens; indentation grows with depth instead of widening columns.",
	},
	"app-shell": {
		useWhen:
			"An app or admin console needs a persistent frame with landmark regions that stay consistent across views.",
		avoidWhen:
			"You are building a marketing or content page; Container and Section express that structure more directly.",
		behavior:
			"AppShell is a plain grid with named areas; regions are independent slots, so any subset renders correctly and each region fills its area.",
		responsive:
			"The shell itself does not collapse; hide or restyle the sidebar at small breakpoints through className (for example hidden md:block).",
	},
	box: {
		useWhen:
			"You need a one-off wrapper with spacing and surface styling and want to avoid writing a bespoke class.",
		avoidWhen:
			"You are arranging multiple children along an axis; Flex or Stack expresses that intent better.",
		behavior:
			"Box renders no styling of its own beyond the spacing props; axis values (px, py, mx, my) override the all-sides value.",
		responsive:
			"Spacing props are static; combine Box with responsive Tailwind classes for breakpoint-dependent layouts.",
	},
	center: {
		useWhen:
			"A single child or cluster must sit exactly in the middle of a bounded area, such as an empty-state panel.",
		avoidWhen:
			"You are arranging several children with spacing or distribution; Flex covers that without manual classes.",
		behavior:
			"Center only applies display flex with both alignments; sizing comes from the caller's className.",
		responsive:
			"Centering is intrinsic and adapts to whatever size the parent gives the box at each breakpoint.",
	},
	columns: {
		useWhen:
			"Items should form tidy rows of equal-width cells that step down responsively, like feature grids or stat groups.",
		avoidWhen:
			"Items have wildly different heights and tight packing matters more than row alignment; use Masonry instead.",
		behavior:
			"Columns guarantees every cell in a row shares the same width and the row order matches the DOM order.",
		responsive:
			"The count collapses automatically (for example 3 -> 2 -> 1) at the sm and lg breakpoints; nothing is measured in JavaScript.",
	},
	container: {
		useWhen:
			"Page or section content should stay readable on wide screens with a consistent centered column.",
		avoidWhen:
			"The content should fill the available width edge to edge; skip the wrapper or use size=\"fluid\".",
		behavior:
			"Container always spans the full available width up to its size cap and keeps a minimum padding on small screens.",
		responsive:
			"Horizontal padding steps up from px-4 to px-8 across the sm and lg breakpoints while the column stays centered.",
	},
	flex: {
		useWhen:
			"Children need one-dimensional arrangement with control over direction, wrapping, alignment and distribution.",
		avoidWhen:
			"You only need an evenly spaced vertical or horizontal stack; Stack is the simpler, more specific choice.",
		behavior:
			"Flex maps props to flexbox values and merges any caller className and style, so one-off overrides stay possible.",
		responsive:
			"Wrap lets rows collapse onto multiple lines; pair with responsive classes when direction itself must change per breakpoint.",
	},
	masonry: {
		useWhen:
			"Items have unpredictable heights and packing them tightly matters more than keeping rows aligned, like note or photo walls.",
		avoidWhen:
			"Reading order must run left to right across rows, or rows must align; use Columns or Grid instead.",
		behavior:
			"Items fill the first column before spilling into the next, so DOM order reads top-to-bottom per column; every child is wrapped with break-inside: avoid.",
		responsive:
			"With minColumnWidth the column count derives from the available width and collapses naturally on narrow screens.",
	},
	"scroll-shadow": {
		useWhen:
			"A bounded scrolling region should advertise that it continues, such as chat panels, dropdown lists or log viewers.",
		avoidWhen:
			"The content rarely overflows or a scrollbar is always visible and sufficient; the shadows would be noise.",
		behavior:
			"Shadows appear only when scrolling is possible in that direction: bottom until scrolled, top once scrolled, none at the end; a ResizeObserver keeps the state correct as content changes.",
		responsive:
			"The shadows stretch to the container's width automatically; the container itself sizes via the caller's className.",
	},
	section: {
		useWhen:
			"A page is composed of stacked topical blocks that need consistent vertical spacing and optional centering.",
		avoidWhen:
			"The block already sits inside a Container or needs custom padding; compose Container directly instead.",
		behavior:
			"Section always renders a section element and only wraps children in a Container when the container prop is set.",
		responsive:
			"The inner Container keeps its responsive side padding, so contained sections stay readable at any width.",
	},
	"sticky-header": {
		useWhen:
			"A long scrolling list or panel needs its heading or toolbar to remain visible, for example table toolbars and activity feeds.",
		avoidWhen:
			"The whole app header should stick; TopBar already handles the application-level sticky bar.",
		behavior:
			"An IntersectionObserver sentinel toggles a stuck state (exposed as data-stuck) that adds the shadow; without an observer the header still sticks but never shows the shadow.",
		responsive:
			"The header spans the width of its scrolling container and the offset is fixed in pixels, so pick it relative to the bars above it.",
	},
	collapse: {
		useWhen:
			"A self-built disclosure needs a smooth height animation, for example detail sections under a custom row or card.",
		avoidWhen:
			"You need a complete disclosure widget with a built-in trigger and heading semantics; use Accordion instead.",
		behavior:
			"While closed the region is aria-hidden and inert, so its content is removed from the tab order and the accessibility tree; the height animation is skipped under reduced motion.",
		responsive:
			"Animates grid-template-rows between 0fr and 1fr, so it adapts to any content height at any width without measuring JavaScript.",
	},
	"countdown-timer": {
		useWhen:
			"Deadlines, launches, and maintenance windows where the remaining time must stay visibly accurate.",
		avoidWhen:
			"Elapsed-time displays or wall-clock times; use TimeAgo for relative times and a formatted Date for absolute ones.",
		behavior:
			"Clamps at zero, calls onComplete exactly once per target, re-arms when the target moves to the future, and announces completion politely.",
		responsive:
			"Renders inline by default; the render prop lets you restack the tiles at narrow widths.",
	},
	"focus-trap": {
		useWhen:
			"A transient modal region — a dialog, drawer, or edit mode — must keep keyboard focus inside until it is dismissed.",
		avoidWhen:
			"The content is part of the normal page flow; trapping focus there would strand keyboard users. Use a plain container instead.",
		behavior:
			"While active, Tab on the last focusable element wraps to the first and Shift+Tab wraps the other way; with no focusable children Tab is suppressed entirely.",
		responsive:
			"Renders a plain div with no intrinsic layout, so the trapped region adapts to whatever container styles you apply.",
	},
	"highlight-text": {
		useWhen:
			"Search, filter, or find-in-page UIs need to show why a result matched by highlighting the query inside the text.",
		avoidWhen:
			"There is no query to emphasize, or the text is rich content; use plain text or a typography component instead.",
		behavior:
			"Matches case-insensitively, treats regex characters in the query as literal text, preserves the full original string, and renders nothing marked when the query is empty.",
		responsive:
			"Renders an inline span that flows with surrounding text at any width.",
	},
	"infinite-scroll": {
		useWhen:
			"Feeds and long result lists where readers browse continuously, such as activity streams or search results.",
		avoidWhen:
			"Data where users need to reach a specific record or the footer; use Pagination or a VirtualList instead.",
		behavior:
			"Calls onLoadMore only while hasMore is true and loading is false; without IntersectionObserver it falls back to a manual Load more button.",
		responsive:
			"Renders as a plain block around its children, so the content's own responsive layout is untouched.",
	},
	"lazy-image": {
		useWhen:
			"Image-heavy pages where most media sits below the fold, such as galleries, dashboards, or documentation.",
		avoidWhen:
			"Hero or above-the-fold images that should render immediately; a plain img with fetchpriority is a better fit.",
		behavior:
			"Requests src only when the wrapper crosses the rootMargin threshold, keeps data-state from idle through loading to loaded, and loads immediately without IntersectionObserver.",
		responsive:
			"Accepts explicit width and height; pass percentages through style and the image fills the wrapper with object-fit cover.",
	},
	marquee: {
		useWhen:
			"Ambient, glanceable content like logo strips, status tickers, or announcement loops that users can ignore safely.",
		avoidWhen:
			"Critical messages users must read or act on; motion hides content part of the time, so use an Alert instead.",
		behavior:
			"Duplicates the children for a gapless wrap, pauses on hover when pauseOnHover is set, and renders statically under prefers-reduced-motion.",
		responsive:
			"Overflows are clipped by the wrapper; give it a width and the track loops regardless of content size.",
	},
	"number-ticker": {
		useWhen:
			"Dashboard stats and KPIs where a short count-up draws attention to a fresh value.",
		avoidWhen:
			"Values that change many times per second or dense tables of numbers; render the formatted value directly to avoid motion noise.",
		behavior:
			"Eases from the current displayed value to the new target over duration, calls onComplete at the end, and jumps instantly under prefers-reduced-motion.",
		responsive:
			"An inline span with tabular numerals; sizing and layout come entirely from the parent.",
	},
	portal: {
		useWhen:
			"Overlay content such as notifications, menus, or modals must visually escape an ancestor with overflow hidden or its own stacking context.",
		avoidWhen:
			"The content belongs to the normal layout flow; rendering inline keeps semantics and focus order simpler.",
		behavior:
			"Renders nothing on the server, then mounts children into the container after the first client render and removes them on unmount.",
		responsive:
			"Has no layout of its own; position and sizing are fully controlled by the portalled content.",
	},
	presence: {
		useWhen:
			"Content needs an exit animation — a fade, slide, or scale — before it leaves the DOM.",
		avoidWhen:
			"Simple conditional rendering with no exit animation; plain {show && <Content />} is enough.",
		behavior:
			"Exposes data-state=\"open\" while present and data-state=\"closed\" during the exit, then unmounts on transitionend (or immediately when there is no transition) and calls onExitComplete.",
		responsive:
			"Renders a plain div wrapper; layout responsibility stays with the children.",
	},
	reveal: {
		useWhen:
			"Long pages benefit from progressive entrance motion as sections scroll into view, such as marketing or dashboard summaries.",
		avoidWhen:
			"Content above the fold or critical information that must render instantly; entrance motion there just delays reading.",
		behavior:
			"Exposes data-state=\"hidden\" until the observed element crosses the threshold, then data-state=\"visible\"; without IntersectionObserver support it shows content immediately, and reduced motion skips the transition.",
		responsive:
			"Applies only opacity and translate transforms, so the child's own responsive layout is untouched.",
	},
	"time-ago": {
		useWhen:
			"Feeds, logs, and activity lists where recency matters more than the exact clock time.",
		avoidWhen:
			"Legal, billing, or scheduling contexts that demand an unambiguous absolute timestamp; format the Date directly instead.",
		behavior:
			"Recomputes the label every updateInterval, scales from seconds to years via Intl.RelativeTimeFormat, and always exposes the absolute time in the title and dateTime attributes.",
		responsive:
			"An inline time element that wraps with its surrounding text; no layout constraints of its own.",
	},
	"truncated-text": {
		useWhen:
			"Long user-generated text must fit a fixed-height region such as a card, table cell, or feed item, with an in-place way to read the rest.",
		avoidWhen:
			"The full text is short or always visible; a plain element avoids the measurement overhead. For code, use CodeBlock with scrolling instead.",
		behavior:
			"Measures overflow with scrollWidth/scrollHeight and only renders the toggle when the text actually truncates; while collapsed the full text is available as a title tooltip, and the toggle button reflects its state with aria-expanded.",
		responsive:
			"Re-measures through ResizeObserver, so resizing the container re-evaluates whether truncation and the toggle are needed.",
	},
	"virtual-list": {
		useWhen:
			"Lists of hundreds or thousands of equally-sized rows where mounting every row would slow the page down.",
		avoidWhen:
			"Short lists, rows of varying height, or content that must be findable with browser find-in-page; use a plain List instead.",
		behavior:
			"Guarantees a fixed itemHeight per row, renders overscan rows around the viewport, and reports aria-setsize and aria-posinset for the virtual window.",
		responsive:
			"Takes an explicit pixel height; wrap it in a flexible container and compute the height if it must track the viewport.",
	},
};

export const moduleGuidance = Object.fromEntries(
	modules.map((module) => {
		const guidance = guidanceById[module.id];
		if (!guidance)
			throw new Error(`Missing guidance entry for module "${module.id}"`);
		return [module.id, guidance];
	}),
);

for (const module of modules) module.guidance = moduleGuidance[module.id];
