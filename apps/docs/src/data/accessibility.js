/**
 * Accessibility reference per module: keyboard interactions and semantic
 * notes. Rendered by ModulePage in the Accessibility section.
 *
 * @type {Record<string, { keyboard?: Array<{ keys: string[], action: string }>, notes?: string[] }>}
 */
export const accessibility = {
  button: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the button.' },
      { keys: ['Enter', 'Space'], action: 'Activates the button.' },
    ],
    notes: [
      'Icon-only actions use IconButton, which requires a label applied as aria-label and mirrored in the title tooltip.',
      'Loading buttons set aria-busy and are disabled so they cannot be activated twice.',
      'A loading IconButton replaces its icon with a spinner while keeping the accessible label.',
      'The danger variant carries meaning through its label as well as its color.',
    ],
  },
  field: {
    notes: [
      'The label is wired to the control with htmlFor, so clicking the label focuses the control.',
      'Description and error text are linked to Input and TextArea children through aria-describedby automatically.',
      'Setting error marks the control aria-invalid and renders the message in error color.',
      'The required indicator is decorative; the underlying control keeps the native required attribute.',
      'Custom controls can join the same wiring through the exported useFieldControl hook and mergeDescriptionIds helper.',
    ],
  },
  input: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the control.' },
      { keys: ['Typing'], action: 'Edits the value using native text editing keys.' },
    ],
    notes: [
      'Inputs are native elements, so autofill, spellcheck, and input modes work without configuration.',
      'Inside a Field, aria-invalid and aria-describedby are applied automatically when the field has an error or description.',
    ],
  },
  select: {
    keyboard: [
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'Opens the listbox and highlights the selected option.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight between options.' },
      { keys: ['Home', 'End'], action: 'Highlights the first or last option.' },
      { keys: ['Typing'], action: 'Typeahead jumps to the first matching option.' },
      { keys: ['Enter', 'Tab'], action: 'Commits the highlighted option and closes the listbox.' },
      { keys: ['Escape'], action: 'Closes the listbox without changing the value.' },
    ],
    notes: [
      'Provide aria-label when the select has no visible label; the demo options render visible text either way.',
      'Disabled options are skipped during keyboard navigation and typeahead.',
    ],
  },
  checkbox: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the checkbox.' },
      { keys: ['Space'], action: 'Toggles the checkbox; indeterminate moves to checked.' },
    ],
    notes: [
      'Supports a tri-state checked value for select-all patterns, announced as "mixed" by screen readers.',
      'The label is clickable and the description is linked through aria-describedby.',
      'Inside a Field, the Field label is the only rendered label; pass label only for standalone use.',
    ],
  },
  switch: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the switch.' },
      { keys: ['Space', 'Enter'], action: 'Toggles the setting.' },
    ],
    notes: [
      'Renders role="switch" with aria-checked, so assistive technology announces it as an on/off setting.',
      'The label and description are wired to the control automatically.',
      'Inside a Field, the Field label is the only rendered label; pass label only for standalone use.',
    ],
  },
  card: {
    notes: [
      'Cards are passive surfaces with no keyboard behavior of their own.',
      'Render real links and buttons inside a card rather than making the card itself clickable.',
      'The as prop lets you render the card as a section, article, or list item to fit the page outline.',
      'Disabled cards are dimmed, skip pointer events, and set aria-disabled.',
      'CardTitle renders an h2 by default; set titleAs so card headings fit the surrounding page outline.',
    ],
  },
  badge: {
    notes: [
      'Badges are plain text, so their status is announced verbatim by screen readers.',
      'Always pair a variant with meaningful text; never rely on color alone to carry the status.',
    ],
  },
  accordion: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggles the focused item.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves focus between item triggers.' },
      { keys: ['Home', 'End'], action: 'Focuses the first or last trigger.' },
    ],
    notes: [
      'Implements the ARIA accordion pattern through the Radix primitive, with state exposed as aria-expanded on each trigger.',
      'Disabled items are skipped and cannot be toggled.',
      'The chevron is decorative and hidden from assistive technology.',
    ],
  },
  dialog: {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the dialog and returns focus to the trigger.' },
      { keys: ['Tab', 'Shift+Tab'], action: 'Cycles focus through the focusable elements inside the dialog.' },
    ],
    notes: [
      'Renders role="dialog" with aria-modal, labelled by the title and described by the description.',
      'Focus moves into the dialog on open and is restored to the trigger on close.',
      'Background content is scroll-locked while the dialog is open.',
    ],
  },
  tooltip: {
    keyboard: [
      { keys: ['Focus'], action: 'Shows the tooltip when its trigger receives keyboard focus.' },
      { keys: ['Escape'], action: 'Dismisses the tooltip.' },
    ],
    notes: [
      'The trigger is described by the tooltip through aria-describedby.',
      'Tooltips are for short hints only; never place interactive content inside them.',
      'Wrap the app in TooltipProvider once so tooltips share open-delay grouping; moving between triggers then skips the delay.',
    ],
  },
  menu: {
    keyboard: [
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'Opens the menu and highlights the first item.' },
      { keys: ['Arrow Up'], action: 'Opens the menu and highlights the last item.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight between items, skipping disabled ones.' },
      { keys: ['Home', 'End'], action: 'Highlights the first or last item.' },
      { keys: ['Typing'], action: 'Typeahead jumps to the first matching item.' },
      { keys: ['Enter', 'Space'], action: 'Activates the highlighted item and closes the menu.' },
      { keys: ['Escape', 'Tab'], action: 'Closes the menu and returns focus to the trigger.' },
    ],
    notes: [
      'Renders the ARIA menu pattern with menuitem roles and roving highlight.',
      'Icons are decorative; every item keeps a text label.',
      'Set modal to trap focus and block outside interaction while the menu is open.',
    ],
  },
  popover: {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the popover and returns focus to the trigger.' },
      { keys: ['Tab'], action: 'Moves focus into the popover content, then back into the page flow.' },
    ],
    notes: [
      'The trigger exposes aria-expanded and aria-controls for the popover content.',
      'Focus is not trapped; popovers suit small control panels, not multi-step flows.',
      'Placement flips automatically to stay inside the viewport.',
    ],
  },
  toast: {
    keyboard: [
      { keys: ['F8'], action: 'Moves focus to the toast viewport so toasts can be reviewed and dismissed.' },
      { keys: ['Escape'], action: 'Dismisses the focused toast.' },
      { keys: ['Swipe right'], action: 'Dismisses a toast on touch devices.' },
    ],
    notes: [
      'Toasts are announced through a live region as they appear.',
      'Actions render as real buttons with accessible labels.',
      'Pass duration: Infinity for critical messages that must be dismissed manually.',
    ],
  },
  'empty-state': {
    notes: [
      'The title renders as an h3 by default; adjust titleAs so the empty state fits the page outline.',
      'The action is a real button or link; keep to a single primary action.',
    ],
  },
  loading: {
    notes: [
      'Spinner and LoadingState render role="status" with an accessible label, announced once to screen readers.',
      'Progress exposes aria-valuenow, aria-valuemin, and aria-valuemax through the Radix progress primitive.',
      'Skeleton is aria-hidden because it duplicates content that is about to load.',
      'All motion respects prefers-reduced-motion.',
    ],
  },
  alert: {
    notes: [
      'Danger renders role="alert" so the message is announced immediately; other variants render role="status".',
      'The variant icon is decorative and hidden from assistive technology; meaning is carried by the text.',
      'The dismiss control is a labeled button in the normal tab order.',
    ],
  },
  tabs: {
    keyboard: [
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves between tabs and activates them.' },
      { keys: ['Home', 'End'], action: 'Activates the first or last tab.' },
      { keys: ['Tab'], action: 'Moves focus from the active tab into its panel.' },
    ],
    notes: [
      'Implements the ARIA tabs pattern with tablist, tab, and tabpanel roles.',
      'aria-label on the tab list describes what the tabs switch between.',
      'Disabled tabs are skipped during arrow-key navigation.',
    ],
  },
  pagination: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the page controls.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused page control.' },
    ],
    notes: [
      'Renders a nav element with an accessible label.',
      'The current page is marked with aria-current="page".',
      'Unavailable directions render as disabled buttons rather than being hidden.',
    ],
  },
  'page-header': {
    notes: [
      'The title renders as an h1 by default; set titleAs to fit the page outline and keep one h1 per page.',
      'Actions are regular buttons and links with standard focus order.',
    ],
  },
  table: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the scroll region when the table overflows horizontally.' },
      { keys: ['Arrow keys'], action: 'Scrolls the region horizontally when the table overflows.' },
    ],
    notes: [
      'The caption is announced to screen readers and kept visually hidden.',
      'Header cells use scope="col", and the table keeps real table semantics for screen reader navigation.',
      'Skeleton rows are announced through loadingLabel while data loads.',
      'The scroll region is a tab stop only while the table overflows; tables that fit their container are skipped.',
    ],
  },
  separator: {
    notes: [
      'Renders role="separator" with an orientation unless marked decorative.',
      'Use decorative separators between visually obvious groups; keep semantic ones where the structure matters.',
    ],
  },
  avatar: {
    notes: [
      'Image alt text defaults to the name; pass an empty alt for decorative avatars.',
      'Initials and icon fallbacks render role="img" with the name as the accessible label.',
    ],
  },
  'vertical-nav': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between nav items. In rail mode, focusing an item expands the nav.' },
      { keys: ['Enter'], action: 'Activates the focused item link.' },
    ],
    notes: [
      'Rail mode expands on hover and on focus-within, so keyboard users can read labels that are hidden from mouse users until hover.',
      'The active item sets aria-current="page" to mark the current location for screen readers.',
      'Use the icon prop for the leading icon so it stays visible in rail mode; only the label fades.',
    ],
  },
  'top-bar': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the brand, search trigger, and action buttons in order.' },
    ],
    notes: [
      'Renders a <header> element by default; use the as prop to change the element if needed.',
      'Keep action buttons labeled with aria-label when they contain only icons.',
      'Sticky keeps the bar in view during scrolling; use sticky={false} for an inline bar.',
    ],
  },
  breadcrumb: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the trail links and the collapsed-items menu trigger.' },
    ],
    notes: [
      'Renders a nav landmark with an ordered list; the landmark label defaults to "Breadcrumb".',
      'The current page is a span with aria-current="page", not a link.',
      'Middle items beyond collapseAfter move into a labeled menu.',
      'Pass a router link component through an item\'s as prop, mirroring VerticalNavItem.',
    ],
  },
}
