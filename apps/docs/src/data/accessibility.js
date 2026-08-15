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
      'TextArea label and description props render a visible label wired with htmlFor and help text linked through aria-describedby; use aria-label when there is no visible label.',
      'In autosize mode, TextArea suppresses visual resize because the field sizes itself; keyboard and screen-reader behavior match a standard textarea.',
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
      { keys: ['Space', 'Enter'], action: 'In the card variant, toggles the focused card.' },
    ],
    notes: [
      'Supports a tri-state checked value for select-all patterns, announced as "mixed" by screen readers.',
      'The label is clickable and the description is linked through aria-describedby.',
      'Inside a Field, the Field label is the only rendered label; pass label only for standalone use.',
      'In the card variant, the card is a button with checkbox semantics (aria-checked); the label doubles as its accessible name and the check indicator is decorative.',
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
  'radio-group': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the selected radio, or the first option when none is selected.' },
      { keys: ['Arrow Up', 'Arrow Down', 'Arrow Left', 'Arrow Right'], action: 'Moves focus and selection between options.' },
      { keys: ['Space'], action: 'Selects the focused option when the group has no selection.' },
      { keys: ['Home', 'End'], action: 'In the card variant, checks the first or last enabled card.' },
    ],
    notes: [
      'Implements the ARIA radiogroup pattern through the Radix primitive with roving tab index.',
      'The group label is wired through aria-labelledby and each option keeps a clickable label.',
      'Disabled options stay visible but are skipped during keyboard navigation.',
      'In the card variant, cards expose radiogroup/radio semantics with aria-checked; arrow keys wrap around and skip disabled cards, which set aria-disabled.',
    ],
  },
  slider: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the thumb.' },
      { keys: ['Arrow Left', 'Arrow Down'], action: 'Decreases the value by one step.' },
      { keys: ['Arrow Right', 'Arrow Up'], action: 'Increases the value by one step.' },
      { keys: ['Home', 'End'], action: 'Jumps to the minimum or maximum value.' },
      { keys: ['Page Up', 'Page Down'], action: 'Steps the value by a larger increment.' },
    ],
    notes: [
      'Built on the Radix slider primitive, so the thumb exposes slider semantics with minimum, maximum, and current value.',
      'The label is wired through aria-labelledby and showValue mirrors the value as text.',
      'In range mode each thumb is a separate slider with its own accessible name from thumbLabels.',
      'Inside a Field, descriptions and errors link through aria-describedby and aria-invalid.',
    ],
  },
  'search-input': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the field and the clear button when it is visible.' },
      { keys: ['Enter', 'Space'], action: 'Activates the clear button and resets the value.' },
      { keys: ['Typing'], action: 'Edits the query using native text editing keys.' },
    ],
    notes: [
      'The leading search icon is decorative and hidden from assistive technology.',
      'The clear action is an IconButton labeled Clear search.',
      'The loading state swaps the clear action for a spinner, keeping focus on the field.',
    ],
  },
  combobox: {
    keyboard: [
      { keys: ['Typing'], action: 'Filters the option list and opens the listbox.' },
      { keys: ['Arrow Down', 'Arrow Up'], action: 'Moves the highlight through the filtered options.' },
      { keys: ['Enter'], action: 'Selects the highlighted option and closes the listbox.' },
      { keys: ['Escape'], action: 'Closes the listbox without changing the committed value.' },
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'In multiple mode, opens the listbox from the control.' },
      { keys: ['Tab'], action: 'In multiple mode, moves focus between the control, pill remove buttons, and the open listbox.' },
    ],
    notes: [
      'The input renders the combobox role with aria-autocomplete list and aria-activedescendant for the highlighted option.',
      'Options render option roles with aria-selected; disabled options cannot be chosen.',
      'The empty message appears inside the listbox when no option matches the filter.',
      'In multiple mode the control is a combobox-role trigger hosting selected pills, and the listbox popup is aria-multiselectable; every pill has a remove button labeled Remove plus the option name.',
    ],
  },
  'date-picker': {
    keyboard: [
      { keys: ['Arrow Down'], action: 'Opens the popover from the field.' },
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves the focused day by one day; in month or year mode, moves by one month or year.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the focused day by one week; in month or year mode, moves by one row.' },
      { keys: ['Home', 'End'], action: 'Jumps to the first or last month of the year, or year of the decade page.' },
      { keys: ['Enter', 'Space'], action: 'Selects the focused day, month, or year; in range mode, picks the start then the end.' },
    ],
    notes: [
      'Day, month, and year buttons use a roving tab index, so each panel is a single Tab stop.',
      'The month label, visible year, and decade range are announced with aria-live as the view changes.',
      'Dates outside minDate and maxDate are disabled and cannot be selected.',
      'Range start and end days expose their state through aria-pressed, and today keeps aria-current date.',
      'In datetime mode the time fields reuse the TimePicker group with labeled Hour and Minutes inputs, and Done closes the popover.',
    ],
  },
  'number-input': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the field and the stepper buttons.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused stepper to increment or decrement.' },
      { keys: ['Typing'], action: 'Edits the value directly; the field re-clamps on blur.' },
    ],
    notes: [
      'Steppers are labeled Increment and Decrement and disable at the min and max bounds.',
      'An empty field reports undefined rather than zero.',
      'Inside a Field, descriptions and errors link through aria-describedby and aria-invalid.',
    ],
  },
  'password-input': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the field and the visibility toggle.' },
      { keys: ['Enter', 'Space'], action: 'Toggles password visibility from the eye button.' },
      { keys: ['Typing'], action: 'Edits the secret using native text editing keys.' },
    ],
    notes: [
      'The visibility toggle reports its state through aria-pressed and keeps an accessible label.',
      'Set autoComplete to new-password or current-password so password managers fill the field.',
      'Inside a Field, descriptions and errors link through aria-describedby and aria-invalid.',
    ],
  },
  'file-upload': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the browse button and each file remove button.' },
      { keys: ['Enter', 'Space'], action: 'Opens the file picker from the browse button, or removes a file from its row.' },
    ],
    notes: [
      'The native file input is visually hidden; the visible Browse button opens it and the label still points at the input.',
      'File rows are list items with the name, formatted size, and an IconButton labeled Remove plus the file name.',
      'The upload and file icons are decorative and hidden from assistive technology.',
    ],
  },
  'pin-input': {
    keyboard: [
      { keys: ['Typing'], action: 'Enters a digit and advances to the next cell.' },
      { keys: ['Backspace'], action: 'Clears the cell, or retreats to the previous cell when empty.' },
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves focus between cells without changing digits.' },
      { keys: ['Paste'], action: 'Fills the cells from the focused position.' },
    ],
    notes: [
      'The cells sit in a group named by the field label; each cell is labeled Digit N of the total length.',
      'Masked mode hides the entered digits like a password field.',
      'onComplete fires as soon as every cell is filled.',
    ],
  },
  'tags-input': {
    keyboard: [
      { keys: ['Enter', ','], action: 'Commits the draft as a new tag.' },
      { keys: ['Backspace'], action: 'Removes the last tag when the draft is empty.' },
      { keys: ['Tab'], action: 'Moves focus to the chip remove buttons and out of the field.' },
    ],
    notes: [
      'Chips mirror the caller-owned value and each carries a labeled remove action.',
      'Duplicate tags are ignored instead of being committed twice.',
      'The max prop stops new entries once the cap is reached.',
    ],
  },
  'input-group': {
    notes: [
      'Addons are presentational text; give the input an aria-label or wrap the group in a Field so the control stays named.',
      'The group owns the border and focus ring, so the joined control reads as one box.',
      'Addons are not focusable; place interactive accessories next to the group instead.',
    ],
  },
  editable: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Starts editing from the preview or edit button.' },
      { keys: ['Enter'], action: 'Commits the draft while editing.' },
      { keys: ['Escape'], action: 'Cancels editing and restores the committed value.' },
      { keys: ['Tab'], action: 'Commits the draft on blur and moves focus on.' },
    ],
    notes: [
      'The preview is a real button showing the value or placeholder, so the entry point is keyboard reachable.',
      'The edit input autofocuses with the current value preselected and is named by the label.',
      'A separate IconButton labeled Edit plus the label offers an explicit affordance; the pencil icon is decorative.',
    ],
  },
  'time-picker': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the hour, minute, and period controls.' },
      { keys: ['Typing'], action: 'Edits a segment; values clamp as you type.' },
      { keys: ['Enter', 'Space'], action: 'Toggles AM or PM on the period buttons.' },
    ],
    notes: [
      'The segments sit in a group named by the field label; the hour and minute inputs are labeled Hour and Minutes.',
      'The AM/PM toggle reports its state through aria-pressed.',
      'The 24-hour cycle omits the period control entirely.',
    ],
  },
  'color-picker': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Opens the panel from the swatch trigger, or commits the focused preset.' },
      { keys: ['Tab'], action: 'Moves focus through the preset swatches and the hex field.' },
      { keys: ['Enter'], action: 'Normalizes and commits the typed hex value.' },
    ],
    notes: [
      'Every preset swatch has its name applied as an aria-label and reports selection through aria-pressed.',
      'The preset grid is a labeled group and the swatch preview is decorative.',
      'Invalid hex input marks the field aria-invalid and does not commit.',
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
  'button-group': {
    notes: [
      'Each button in the group keeps its own focus stop and accessible name; the group itself adds no keyboard behavior.',
      'Buttons butt together visually but remain separate controls, so screen readers announce each action individually.',
      'Disabled buttons keep their native semantics and are skipped in the tab order.',
    ],
  },
  link: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the link.' },
      { keys: ['Enter'], action: 'Follows the link.' },
    ],
    notes: [
      'Renders a native anchor, so screen readers announce it as a link and browser link behaviors work.',
      'External links open in a new tab with rel="noreferrer"; the indicator icon is decorative, so pair the text with wording that makes the destination clear.',
    ],
  },
  toggle: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the toggle.' },
      { keys: ['Enter', 'Space'], action: 'Flips the pressed state.' },
    ],
    notes: [
      'Exposes its state through aria-pressed, announced as a pressed or not-pressed toggle button.',
      'Icon-only toggles require aria-label to have an accessible name.',
    ],
  },
  toolbar: {
    notes: [
      'Renders role="toolbar" so assistive technology announces the grouped controls as one toolbar.',
      'ToolbarGroup uses role="group" to keep related controls together in the accessibility tree.',
      'ToolbarSeparator is decorative and hidden from assistive technology.',
      'Keyboard behavior comes from the controls inside; label icon buttons with IconButton\'s label prop.',
    ],
  },
  'split-button': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the main action and then to the menu trigger.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused half; the trigger opens the menu.' },
      { keys: ['Escape'], action: 'Closes the menu without selecting an item.' },
    ],
    notes: [
      'The main action and the menu trigger are separate focus stops with separate accessible names.',
      'The chevron trigger is named by menuLabel ("More actions" by default) and the menu shares that label.',
      'Menu items follow menu keyboard behavior through the underlying Menu component.',
    ],
  },
  'launcher-card': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the card link.' },
      { keys: ['Enter'], action: 'Navigates to the destination.' },
    ],
    notes: [
      'The whole card is a single anchor, so its label and description are announced together as the link name.',
      'Disabled cards are removed from the focus order and block navigation instead of being hidden.',
      'Status content is caller-supplied; keep it textual, like a Badge, so it is announced.',
    ],
  },
  chip: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the remove button when one is rendered.' },
      { keys: ['Enter', 'Space'], action: 'Removes the chip.' },
    ],
    notes: [
      'The chip itself is a passive token; only the remove button is interactive.',
      'The remove button is labelled "Remove <label>" from the chip text, so the action is announced with context.',
      'Disabled chips dim and disable the remove button.',
    ],
  },
  kbd: {
    notes: [
      'Renders a native kbd element, so assistive technology announces the content as keyboard input.',
      'Kbd is purely presentational and takes no focus; it should never be interactive.',
    ],
  },
  'scroll-area': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the scrollable viewport.' },
      { keys: ['Arrow keys', 'Page Up', 'Page Down'], action: 'Scrolls the focused viewport.' },
    ],
    notes: [
      'The viewport is focusable with tabIndex 0, so keyboard users can scroll content that has no focusable children.',
      'The styled scrollbar and thumb are visual only; scrolling itself stays native.',
    ],
  },
  'code-block': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the copy button and to the code region when it scrolls.' },
      { keys: ['Enter', 'Space'], action: 'Copies the code while the copy button is focused.' },
    ],
    notes: [
      'The copy confirmation swaps the icon for two seconds; pair it with the button label so the change is announced.',
      'Long code regions scroll horizontally and remain reachable by keyboard focus.',
      'The language label is plain text announced in reading order.',
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
      'Every placement (center, fullscreen, left, right, bottom) shares the same focus model and naming.',
      'When neither title nor description is given, a visually hidden "Dialog" title keeps the surface named.',
      'The drag handle on the bottom placement is a visual affordance only and is hidden from assistive technology.',
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
  'hover-card': {
    keyboard: [
      { keys: ['Focus'], action: 'Opens the card when the trigger receives keyboard focus.' },
      { keys: ['Escape'], action: 'Dismisses the open card.' },
    ],
    notes: [
      'Keyboard focus opens the card on the same content as hover, so the preview is not pointer-only.',
      'Keep card content read-only; interactive content belongs in a Popover.',
      'Touch users cannot hover, so anything important in the card needs another visible path.',
    ],
  },
  command: {
    keyboard: [
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight through the filtered commands.' },
      { keys: ['Enter'], action: 'Runs the highlighted command and closes the palette.' },
      { keys: ['Escape'], action: 'Closes the palette without running a command.' },
      { keys: ['Typing'], action: 'Filters the command list; query and highlight reset on every open.' },
    ],
    notes: [
      'The input renders role="combobox" with aria-activedescendant pointing at the highlighted option in the listbox.',
      'Each command renders role="option" with aria-selected reflecting the highlight.',
      'Focus is trapped in the dialog shell while the palette is open.',
    ],
  },
  'alert-dialog': {
    keyboard: [
      { keys: ['Escape'], action: 'Cancels and closes the dialog.' },
      { keys: ['Tab', 'Shift+Tab'], action: 'Cycles focus between the cancel and confirm actions.' },
    ],
    notes: [
      'Renders the alertdialog pattern: focus stays trapped until an explicit choice is made.',
      'The title names the dialog and the description states the consequence.',
      'tone="danger" styles the confirm action but the semantics stay identical.',
    ],
  },
  popconfirm: {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the popconfirm and returns focus to the trigger.' },
      { keys: ['Tab'], action: 'Moves focus to the confirm and cancel actions inside the panel.' },
    ],
    notes: [
      'Built on Popover, so the panel is anchored to the trigger and the page stays interactive.',
      'The trigger exposes aria-expanded for the confirmation panel.',
      'Confirm and cancel are real buttons; the choice is never implicit.',
    ],
  },
  tour: {
    keyboard: [
      { keys: ['Escape'], action: 'Ends the tour, like pressing Skip.' },
      { keys: ['Tab'], action: 'Moves focus through the step card\'s back, next, and skip controls.' },
    ],
    notes: [
      'The step card renders role="dialog" labelled by the step title.',
      'Targets scroll into view before their step shows; a missing target falls back to a centered dialog.',
      'Ending via Skip, Done, or Escape reports through the same close path.',
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
      'The status icon is always aria-hidden, including custom icon overrides; the title and description carry the meaning.',
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
      'appearance="banner" keeps the same role semantics; appearance="callout" renders no live region, so screen readers meet it in reading order rather than as an announcement.',
      'The variant icon is decorative and hidden from assistive technology; meaning is carried by the text.',
      'The dismiss control is a labeled button in the normal tab order.',
    ],
  },
  'notification-item': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the title link and to the mute and archive buttons.' },
      { keys: ['Enter'], action: 'Follows the title link to the source application.' },
      { keys: ['Enter', 'Space'], action: 'Activates the mute or archive button.' },
    ],
    notes: [
      'Unread items are bold and append a screen-reader-only ", unread" marker to the title link.',
      'The severity dot and icon are aria-hidden; severity must also be clear from the title or surrounding context.',
      'Mute and archive are IconButtons with explicit accessible labels.',
    ],
  },
  'health-indicator': {
    notes: [
      'The status renders as Badge text, so the state never depends on color alone.',
      'Stale, unknown, and checking are explicit states with their own wording; health is never implied by a missing value.',
    ],
  },
  'step-up-notice': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the caller-supplied verification action and the dismiss control.' },
      { keys: ['Enter', 'Space'], action: 'Activates the verification action or dismiss control.' },
    ],
    notes: [
      'Built on Alert with the warning variant, so it renders role="status" and is announced politely.',
      'Supply a labeled control as the action, such as a Button; it keeps its own accessible name.',
    ],
  },
  'progress-circle': {
    notes: [
      'Rendered as role="progressbar" with an aria-label; determinate mode adds aria-valuemin, aria-valuemax, and aria-valuenow.',
      'The centered percentage is aria-hidden because the progressbar value already carries it.',
      'The fill transition is disabled under prefers-reduced-motion.',
    ],
  },
  timeline: {
    notes: [
      'Items render as an ordered list, so screen readers announce position and count.',
      'Dots and connectors are aria-hidden; the tone meaning must also appear in the item title or description.',
    ],
  },
  meter: {
    notes: [
      'role="meter" exposes aria-valuemin, aria-valuemax, aria-valuenow, and an aria-valuetext built from formatValue.',
      'Zone color is supplementary; the label and numeric readout carry the value.',
      'The fill width transition is disabled under prefers-reduced-motion.',
    ],
  },
  rating: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the checked star, or the first star when nothing is rated.' },
      { keys: ['Arrow Left', 'Arrow Down'], action: 'Moves to and selects the previous star.' },
      { keys: ['Arrow Right', 'Arrow Up'], action: 'Moves to and selects the next star.' },
    ],
    notes: [
      'Stars form a radiogroup named by the label prop; each star is a role="radio" button with aria-checked.',
      'Roving tab index keeps one tab stop for the whole group.',
      'readOnly renders role="img" with an "x out of y stars" label and leaves the tab order entirely.',
    ],
  },
  announcer: {
    notes: [
      'Renders a visually hidden role="status" region with aria-live set from politeness and aria-atomic="true".',
      'The region clears and rewrites the message so an identical message is announced again.',
      'Reserve politeness="assertive" for urgent changes; polite is the default.',
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
      { keys: ['Tab'], action: 'Moves focus to the scroll region when the table overflows horizontally, and through any sort header buttons and row checkboxes.' },
      { keys: ['Arrow keys'], action: 'Scrolls the region horizontally when the table overflows.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused sort toggle or checkbox.' },
    ],
    notes: [
      'The caption is announced to screen readers and kept visually hidden.',
      'Header cells use scope="col", and the table keeps real table semantics for screen reader navigation.',
      'Sorted columns expose aria-sort="ascending" or "descending" on the column header.',
      'The select-all checkbox reports an indeterminate state when only some rows are selected; selected rows expose aria-selected.',
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
  'app-switcher': {
    keyboard: [
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'Opens the switcher menu from the trigger.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight between Home and the application items.' },
      { keys: ['Enter'], action: 'Follows the highlighted destination link.' },
      { keys: ['Escape'], action: 'Closes the menu and returns focus to the trigger.' },
    ],
    notes: [
      'Implements the dropdown menu pattern through the Radix primitive; the menu is named through the label prop.',
      'Home is always the first item; the current destination sets aria-current="page".',
      'Items are real anchor links, so open-in-new-tab and status-bar previews work.',
    ],
  },
  'ecosystem-rail': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between destinations. In rail mode, focusing an item expands the rail to reveal labels.' },
      { keys: ['Enter'], action: 'Follows the focused destination link.' },
    ],
    notes: [
      'Renders a nav landmark named through the ariaLabel prop, defaulting to "Kryv ecosystem".',
      'Home is always the first item; the current destination sets aria-current="page".',
      'Pass ariaLabel on a destination whose visible label is not a plain string so the collapsed rail keeps an accessible name.',
      'Destination health renders a text badge through HealthIndicator, so the status is announced as text rather than color alone.',
    ],
  },
  'nav-rail': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the circular items.' },
      { keys: ['Enter', 'Space'], action: 'Follows the link or activates the button item.' },
    ],
    notes: [
      'Renders a nav landmark named through aria-label, defaulting to "Primary".',
      'Every item requires a label, applied as aria-label and mirrored in a tooltip on hover or focus.',
      'The active item sets aria-current="page"; the badge dot is aria-hidden, so pair it with a labeled notification surface.',
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
      'Pass a router link component through an item\'s as prop, mirroring SidebarItem.',
    ],
  },
  'action-bar': {
    notes: [
      'Exposed as a labelled landmark region so screen-reader users can jump straight to the page actions.',
      'The label prop names the region; choose one that describes what the actions apply to.',
    ],
  },
  'bulk-action-bar': {
    notes: [
      'The selection count sits in an aria-live polite region so screen readers announce each change.',
      'Exposed as a labelled landmark region named by the label prop.',
    ],
  },
  'floating-action-button': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the button.' },
      { keys: ['Enter', 'Space'], action: 'Activates the button.' },
    ],
    notes: [
      'Icon-only by default, so the required label prop provides the accessible name via aria-label.',
      'The optional tooltip also exposes the name to sighted keyboard users on focus.',
    ],
  },
  'share-button': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Opens the share popover from the trigger.' },
      { keys: ['Escape'], action: 'Closes the popover and returns focus to the trigger.' },
    ],
    notes: [
      'Copy feedback is announced through a polite live region, not just the swapped icon.',
      'The popover is labelled by the trigger text and closes on Escape via the underlying Popover.',
    ],
  },
  'speed-dial': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Opens or closes the fan from the trigger.' },
      { keys: ['Arrow Down', 'Arrow Right'], action: 'Moves focus to the next action.' },
      { keys: ['Arrow Up', 'Arrow Left'], action: 'Moves focus to the previous action.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last action.' },
      { keys: ['Escape'], action: 'Closes the fan and returns focus to the trigger.' },
    ],
    notes: [
      'The trigger exposes aria-haspopup menu and aria-expanded so the state is announced.',
      'Actions are menuitems in a labelled menu whose orientation matches the fan direction.',
    ],
  },
  'currency-input': {
    notes: [
      'The visible label is associated with the input; use aria-label when there is no visible label.',
      'The currency symbol is decorative (aria-hidden) because the formatted value communicates the unit.',
      'inputMode="decimal" summons a numeric keypad on touch devices.',
    ],
  },
  fieldset: {
    notes: [
      'Renders a real fieldset/legend pair, so screen readers announce the legend when entering the group.',
      'The description is exposed through aria-describedby on the fieldset.',
    ],
  },
  form: {
    notes: [
      'Renders a semantic form element; give it an accessible name when the page has several forms.',
      'Error messages flow through context so fields can link them with aria-describedby and mark controls aria-invalid.',
    ],
  },
  'form-error-summary': {
    notes: [
      'The summary uses role="alert" so new validation failures are announced as soon as it renders.',
      'Each entry is a real anchor linking to the field id, so the destination is exposed to assistive technology even before activation.',
    ],
  },
  'masked-input': {
    notes: [
      'The mask doubles as the placeholder so the expected format is visible before typing.',
      'The visible label is associated with the input; use aria-label when there is no visible label.',
      'Non-digit key presses are ignored rather than announced; pair with a description for the expected format.',
    ],
  },
  'mention-input': {
    keyboard: [
      { keys: ['Arrow Down', 'Arrow Up'], action: 'Moves the highlight through the mention options.' },
      { keys: ['Enter', 'Tab'], action: 'Inserts the highlighted mention.' },
      { keys: ['Escape'], action: 'Dismisses the popup without changing the text.' },
    ],
    notes: [
      'The textarea keeps focus while the popup is open and points to the highlighted option with aria-activedescendant.',
      'aria-expanded and aria-controls mirror the popup state; options render in a listbox named "Mentions".',
    ],
  },
  'password-strength-meter': {
    notes: [
      'Exposes role="progressbar" with aria-valuemin 0, aria-valuemax 4, and the band name as aria-valuetext.',
      'The strength is never conveyed by color alone; the band label is visible text and an accessible value.',
    ],
  },
  'phone-input': {
    notes: [
      'The country dropdown has its own accessible name, "Country calling code".',
      'The visible label points at the number field; the dropdown precedes it in the tab order.',
      'type="tel" summons a telephone keypad on touch devices.',
    ],
  },
  'rich-text-editor': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between the toolbar buttons and the textarea.' },
    ],
    notes: [
      'Toolbar actions are grouped in a labelled toolbar and each button has an accessible name.',
      'The preview is a labelled region so screen reader users can skip or inspect the rendered markdown.',
    ],
  },
  'timezone-select': {
    keyboard: [
      { keys: ['Arrow Down'], action: 'Opens the list or moves the highlight to the next option.' },
      { keys: ['Arrow Up'], action: 'Moves the highlight to the previous option.' },
      { keys: ['Enter'], action: 'Selects the highlighted option.' },
      { keys: ['Escape'], action: 'Closes the list and restores the selected label.' },
    ],
    notes: [
      'The input is an aria-expanded combobox with aria-activedescendant pointing at the highlighted option.',
      'Each option\'s accessible name includes the city and its UTC offset.',
    ],
  },
  'toggle-group': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the group\'s current item.' },
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves focus between items without changing the selection.' },
      { keys: ['Enter', 'Space'], action: 'Toggles the focused item.' },
    ],
    notes: [
      'Single mode exposes radio semantics (aria-checked); multiple mode exposes toggle buttons (aria-pressed).',
      'The group needs an accessible name, usually through aria-label.',
      'With variant="segmented" the sliding selection pill is decorative and hidden from assistive technology.',
    ],
  },
  'transfer-list': {
    keyboard: [
      { keys: ['Arrow Down', 'Arrow Up'], action: 'Moves focus within the listbox.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last option.' },
      { keys: ['Space'], action: 'Toggles selection of the focused option.' },
      { keys: ['Enter'], action: 'Moves the selected options (or just the focused one) to the other list.' },
    ],
    notes: [
      'Both lists are listboxes with aria-multiselectable="true" and their own accessible names.',
      'The move buttons are labelled from the list names and disable while nothing is selected on their side.',
    ],
  },
  'tree-select': {
    keyboard: [
      { keys: ['Arrow Down', 'Arrow Up'], action: 'Moves focus between visible tree items.' },
      { keys: ['Arrow Right'], action: 'Expands a branch or moves into its first child; in columns display, expands the highlighted branch.' },
      { keys: ['Arrow Left'], action: 'Collapses a branch or moves to its parent; in columns display, moves focus back to the parent column.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last visible item.' },
      { keys: ['Enter'], action: 'Selects a leaf or toggles a branch.' },
      { keys: ['Character keys'], action: 'Typeahead moves focus to the next matching visible item.' },
      { keys: ['Escape'], action: 'Closes the popover and returns focus to the trigger.' },
    ],
    notes: [
      'The trigger is a combobox with aria-haspopup="tree"; options follow the tree/treeitem roles with aria-expanded and aria-selected.',
      'With display="columns" the trigger uses aria-haspopup="listbox" and each level is a labelled listbox that commits the full path of values.',
      'The selected value\'s ancestors are expanded automatically so the selection is visible on open.',
    ],
  },
  'expandable-card': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggles the extra content while the trigger is focused.' },
    ],
    notes: [
      'The trigger is a real button with aria-expanded and aria-controls, so screen readers announce the state change.',
      'Collapsed content is marked aria-hidden and inert, keeping hidden controls out of the tab order.',
    ],
  },
  'glass-panel': {
    notes: [
      'Backdrop blur does not change contrast guarantees; keep body text on the panel at normal text sizes and weights.',
      'The panel is a plain div, so supply your own headings or landmark roles when the content needs structure.',
    ],
  },
  panel: {
    notes: [
      'The title renders a real heading (h2 by default, adjustable via titleAs), so screen-reader users can navigate between panels.',
      'Actions are plain interactive elements and keep their own accessible names and focus rings.',
    ],
  },
  'action-sheet': {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the sheet without selecting an action.' },
      { keys: ['Tab'], action: 'Moves focus through the actions and the cancel button.' },
    ],
    notes: [
      'Renders with role="dialog", named by its title or the label prop as a fallback.',
      'Destructive actions are exposed as regular buttons with a data-destructive hook.',
    ],
  },
  'cookie-consent': {
    notes: [
      'Rendered as a labelled region, not a dialog: it never traps focus, blocks the page, or auto-announces over other content.',
      'Both actions are plain buttons and the manage option is a real link.',
    ],
  },
  'floating-panel': {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the panel when focus is inside it.' },
    ],
    notes: [
      'Renders as a non-modal role="dialog" named by its title; aria-modal is not set.',
      'Because focus is not trapped, the panel participates in the natural tab order.',
    ],
  },
  'image-viewer': {
    keyboard: [
      { keys: ['+'], action: 'Zooms in one step.' },
      { keys: ['-'], action: 'Zooms out one step.' },
      { keys: ['0'], action: 'Resets zoom and pan to the fitted view.' },
    ],
    notes: [
      'The viewer is a labelled region; the zoomed viewport itself is focusable for keyboard control.',
      'The current zoom percentage is announced via a polite live region.',
    ],
  },
  lightbox: {
    keyboard: [
      { keys: ['Arrow Right'], action: 'Shows the next image, wrapping past the last.' },
      { keys: ['Arrow Left'], action: 'Shows the previous image, wrapping before the first.' },
      { keys: ['Home'], action: 'Jumps to the first image.' },
      { keys: ['End'], action: 'Jumps to the last image.' },
      { keys: ['Escape'], action: 'Closes the lightbox.' },
    ],
    notes: [
      'Rendered as a labelled dialog that traps focus while open.',
      'The position counter (\'3 of 8\') is announced via a polite live region.',
      'Images always require alt text supplied by the caller.',
    ],
  },
  'notification-center': {
    keyboard: [
      { keys: ['Escape'], action: 'Closes the panel and returns focus to the trigger.' },
    ],
    notes: [
      'The panel is a labelled popover and the notifications form a labelled list.',
      'Unread rows append an \'unread\' marker to the link\'s accessible name.',
    ],
  },
  'prompt-dialog': {
    keyboard: [
      { keys: ['Enter'], action: 'Submits the entered value and closes the dialog.' },
      { keys: ['Escape'], action: 'Closes the dialog without submitting.' },
      { keys: ['Tab'], action: 'Moves focus between the input and the footer buttons.' },
    ],
    notes: [
      'Renders with role="dialog" named by its title; the input is associated with a visible label.',
      'The input receives focus automatically when the dialog opens.',
    ],
  },
  'search-overlay': {
    keyboard: [
      { keys: ['Arrow Down'], action: 'Moves the highlight to the next result, wrapping at the end.' },
      { keys: ['Arrow Up'], action: 'Moves the highlight to the previous result, wrapping at the start.' },
      { keys: ['Enter'], action: 'Selects the highlighted result and reports its index.' },
      { keys: ['Escape'], action: 'Closes the overlay.' },
    ],
    notes: [
      'The input is a combobox whose aria-activedescendant tracks the highlighted option; callers must spread the provided optionId onto each result.',
      'Rendered as a labelled dialog that traps focus while open.',
    ],
  },
  'blocking-overlay': {
    keyboard: [
      { keys: ['Tab'], action: 'Cycles focus within the overlay; the blocked content is unreachable.' },
      { keys: ['Shift + Tab'], action: 'Cycles focus within the overlay in reverse.' },
    ],
    notes: [
      'The wrapper exposes aria-busy while the overlay is visible.',
      'The overlay is a role="status" region labeled by the label prop, and focus is restored to the previously focused element when it hides.',
    ],
  },
  'error-boundary': {
    notes: [
      'Give the fallback an accessible error message, for example role="alert", so the failure is announced.',
      'Provide a keyboard-reachable recovery action such as a retry button.',
    ],
  },
  'loading-bar': {
    notes: [
      'Rendered as role="progressbar" with an aria-label; determinate mode adds aria-valuemin/max/now.',
      'Indeterminate motion is disabled under prefers-reduced-motion.',
    ],
  },
  'network-status': {
    notes: [
      'The icon is aria-hidden; the state is conveyed by the visible text label.',
      'Render-prop consumers should expose the state as text, not color alone.',
    ],
  },
  'offline-banner': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the dismiss button.' },
      { keys: ['Enter', 'Space'], action: 'Dismisses the banner when the dismiss button is focused.' },
    ],
    notes: [
      'Rendered as role="status" with aria-live="polite" so the appearance is announced without stealing focus.',
      'The dismiss button has an explicit accessible label.',
    ],
  },
  'save-status': {
    notes: [
      'Rendered as role="status" so state changes are announced politely.',
      'The saving spinner is aria-hidden and stops animating under prefers-reduced-motion.',
    ],
  },
  'status-dot': {
    notes: [
      'The colored dot is aria-hidden; always pair it with a text label or an aria-label so color is not the only signal.',
      'Color alone never conveys the status — the label text does.',
      'With pulse, the dot is rendered as role="status" with an aria-label that describes the live state; the pulsing ring is aria-hidden and uses motion-reduce to respect prefers-reduced-motion.',
    ],
  },
  'upload-progress': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the cancel button.' },
      { keys: ['Enter', 'Space'], action: 'Cancels the upload when the cancel button is focused.' },
    ],
    notes: [
      'The bar is a role="progressbar" labeled \'Uploading <file name>\' with aria-valuemin/max/now.',
      'The cancel button\'s accessible name includes the file name.',
    ],
  },
  'account-menu': {
    keyboard: [
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'Opens the account menu from the avatar trigger.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight through the items and sign-out actions.' },
      { keys: ['Enter'], action: 'Activates the highlighted item.' },
      { keys: ['Escape'], action: 'Closes the menu and returns focus to the avatar trigger.' },
    ],
    notes: [
      'Implements the dropdown menu pattern through the Radix primitive; the trigger is named after the signed-in user.',
      'App-session and SSO sign-out are distinct items with product-supplied labels, so the scope of each is announced.',
      'The identity header is presentational text inside the menu, not an actionable item.',
    ],
  },
  steps: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the clickable completed steps.' },
      { keys: ['Enter', 'Space'], action: 'Jumps back to the focused completed step.' },
    ],
    notes: [
      'Rendered as an ordered list, so each step\'s position and the total count are announced.',
      'The current step sets aria-current="step".',
      'Only completed steps become buttons when onStepClick is provided; upcoming steps stay inert.',
    ],
  },
  'tree-view': {
    keyboard: [
      { keys: ['Arrow Right'], action: 'Expands a collapsed parent, or moves to its first child.' },
      { keys: ['Arrow Left'], action: 'Collapses an expanded parent, or moves to its parent.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves between the visible items.' },
      { keys: ['Enter', 'Space'], action: 'Selects the focused item.' },
    ],
    notes: [
      'Renders a role="tree" named by its required aria-label, with role="group" lists for children.',
      'Parents expose aria-expanded; the selected item sets aria-selected.',
      'Toggle chevrons and icons are aria-hidden; state comes from the treeitem semantics.',
    ],
  },
  menubar: {
    keyboard: [
      { keys: ['Arrow Right', 'Arrow Left'], action: 'Moves between the menu triggers.' },
      { keys: ['Enter', 'Space', 'Arrow Down'], action: 'Opens the focused menu.' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves the highlight through the items of the open menu.' },
      { keys: ['Escape'], action: 'Closes the menu and refocuses its trigger.' },
    ],
    notes: [
      'Implements the menubar pattern through the Radix primitive, named by the label prop.',
      'Items support icons, separators, and a danger variant conveyed by text as well as color.',
      'Disabled items are exposed as disabled and skipped by highlight movement.',
    ],
  },
  'navigation-menu': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Follows a link item or opens a panel trigger.' },
      { keys: ['Arrow Right', 'Arrow Left'], action: 'Moves between the top-level items.' },
      { keys: ['Tab'], action: 'Moves into the open panel content and on to the next item.' },
      { keys: ['Escape'], action: 'Closes the open panel.' },
    ],
    notes: [
      'Implements the navigation menu pattern through the Radix primitive, named by the label prop.',
      'The active link item sets aria-current="page".',
      'All panels share one viewport, so panel content appears in a consistent location in the focus order.',
    ],
  },
  'back-top': {
    keyboard: [
      { keys: ['Tab'], action: 'Reaches the button once it appears past the scroll threshold.' },
      { keys: ['Enter', 'Space'], action: 'Scrolls the page back to the top.' },
    ],
    notes: [
      'Rendered as an IconButton with a required label; the arrow icon is aria-hidden.',
      'Smooth scrolling is skipped when the user prefers reduced motion.',
      'The button renders nothing below the threshold, so it never appears as a dead control on short pages.',
    ],
  },
  'anchor-nav': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the section links.' },
      { keys: ['Enter'], action: 'Smooth-scrolls the linked section into view and marks the item active.' },
    ],
    notes: [
      'Renders a navigation landmark labelled "On this page" by default.',
      'The active item exposes aria-current="location" so the position in the page is announced.',
      'Nested items render as indented sub-lists inside the same landmark, so the hierarchy is announced.',
      'Without IntersectionObserver the links still navigate; only the scroll tracking is skipped.',
    ],
  },
  'bottom-nav': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the destination links.' },
      { keys: ['Enter'], action: 'Follows the focused destination.' },
    ],
    notes: [
      'Renders a navigation landmark with a configurable aria-label.',
      'The active item is announced as the current page through aria-current="page".',
      'Badge counts render as text next to the label, so they are announced rather than color-only.',
    ],
  },
  dock: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the icon buttons.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused item.' },
    ],
    notes: [
      'Renders a navigation landmark labelled "Dock" by default.',
      'Each item\'s label becomes its aria-label, so icon-only buttons stay announced.',
      'The tooltip and active dot are aria-hidden; state is never conveyed by color alone to assistive technology.',
    ],
  },
  'floating-toolbar': {
    keyboard: [
      { keys: ['Arrow Right', 'Arrow Down'], action: 'Moves focus to the next control, wrapping at the end.' },
      { keys: ['Arrow Left', 'Arrow Up'], action: 'Moves focus to the previous control, wrapping at the start.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last control.' },
    ],
    notes: [
      'Renders a toolbar role with a configurable aria-label.',
      'Roving tabindex keeps exactly one control in the tab order, following focus as it moves.',
    ],
  },
  'mega-menu': {
    keyboard: [
      { keys: ['Arrow Down'], action: 'Opens the panel and focuses the first link.' },
      { keys: ['Arrow Right', 'Arrow Left'], action: 'Moves between triggers, or between links across columns inside an open panel.' },
      { keys: ['Arrow Up'], action: 'Returns focus from a panel link to its trigger.' },
      { keys: ['Escape'], action: 'Closes the panel and refocuses the trigger.' },
    ],
    notes: [
      'Triggers are buttons with aria-expanded and aria-haspopup pointing at their panel.',
      'Panels contain real links inside a navigation landmark, so structure is announced without a menubar role.',
    ],
  },
  sidebar: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus between the item links and the collapse button. In rail mode, focusing an item expands the rail to reveal labels.' },
      { keys: ['Enter'], action: 'Follows the focused item link.' },
      { keys: ['Enter', 'Space'], action: 'Toggles the sidebar between expanded and collapsed from the collapse button.' },
    ],
    notes: [
      'Renders a navigation landmark with a configurable aria-label.',
      'The active item is announced as the current page through aria-current="page"; in rail mode the active background is a circle around the icon.',
      'Rail mode expands on focus-within as well as hover, so keyboard users get the same labels mouse users see.',
      'The collapse button exposes aria-expanded and a label that switches between "Collapse sidebar" and "Expand sidebar".',
    ],
  },
  'skip-link': {
    keyboard: [
      { keys: ['Tab'], action: 'Reveals the link as the first tab stop on the page.' },
      { keys: ['Enter'], action: 'Follows the anchor to the main content target.' },
    ],
    notes: [
      'The link remains in the accessibility tree while hidden, so screen reader users can also reach it.',
      'Make sure the target (usually the main landmark) exists and can receive focus if the browser does not move it automatically.',
    ],
  },
  'sub-nav': {
    keyboard: [
      { keys: ['Arrow Right', 'Arrow Left'], action: 'Moves focus between items, wrapping at the ends.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last item.' },
    ],
    notes: [
      'Renders a navigation landmark with a configurable aria-label.',
      'The active item is announced as the current page through aria-current="page".',
    ],
  },
  'permission-matrix': {
    notes: [
      'Built on Table, so the matrix renders a labelled region with a visually hidden caption naming whose access is shown.',
      'The row-label column header is visually hidden but exposed to screen readers; it defaults to "Name" and can be overridden with rowHeader.',
      'The scroll region becomes focusable only when it overflows horizontally, so keyboard users can reach off-screen columns.',
      'Cells are caller-rendered; prefer text or badges over color-only indicators so access levels are announced.',
    ],
  },
  'description-list': {
    notes: [
      'Renders real dl, dt, and dd markup, so the label-value relationship is announced by screen readers.',
      'Each row pairs exactly one term with one definition inside a wrapper div, which is valid description-list HTML.',
    ],
  },
  'avatar-group': {
    notes: [
      'The group exposes role="group" with an aria-label joining every name, so overflowed members are still announced.',
      'The +N overflow bubble is aria-hidden; it summarizes visually without repeating the names.',
    ],
  },
  stat: {
    notes: [
      'The delta carries a visually hidden "up:", "down:", or "no change:" prefix, so direction never relies on color or the icon alone.',
      'Delta icons are aria-hidden; the value uses tabular numerals so updates do not shift layout.',
    ],
  },
  list: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the rows that have an onClick handler.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused row button.' },
    ],
    notes: [
      'Rows with onClick render real button elements inside each list item; static rows stay non-interactive.',
      'Titles and secondary text truncate visually, but the full text remains available to screen readers.',
    ],
  },
  sparkline: {
    notes: [
      'The aria-label is required and the SVG renders role="img", so the trend is announced as a labelled image.',
      'A visually hidden summary states the min, max, and last values for screen-reader users.',
    ],
  },
  calendar: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the month navigation buttons and the day buttons.' },
      { keys: ['Enter', 'Space'], action: 'Selects the focused day or changes the visible month.' },
    ],
    notes: [
      'The selected day exposes aria-pressed and today exposes aria-current="date".',
      'Out-of-range or disabledDates days render as native disabled buttons, removed from interaction.',
      'The month label is aria-live="polite", so previous and next navigation announces the new month.',
    ],
  },
  'activity-feed': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the feed articles.' },
      { keys: ['Page Down', 'Page Up'], action: 'Moves focus to the next or previous article in the feed.' },
    ],
    notes: [
      'Uses the ARIA feed pattern: the container has role feed and each event is a focusable article with an accessible name combining actor, action, and time.',
      'Each article exposes aria-posinset and aria-setsize so screen readers announce its position in the feed.',
    ],
  },
  'bar-chart': {
    notes: [
      'The chart is a labelled image; each bar has an aria-label and title with its series, category, and value.',
      'A visually hidden data table with all values is always present and can be revealed with the built-in toggle.',
    ],
  },
  'calendar-heatmap': {
    notes: [
      'The chart is a single role="img" with an aria-label; a visually hidden summary states the active-day count for the year.',
      'Every day cell tooltip states its level and date so intensity never relies on color alone.',
    ],
  },
  'chart-container': {
    notes: [
      'The chart is exposed as a single labelled image; pass a label that summarizes the takeaway, not just the chart type.',
      'Providing columns and data adds a visually hidden table so screen-reader users get the exact values; the toggle button exposes it visually with aria-expanded.',
      'Decorative axis and grid primitives are aria-hidden; only the summary and the table carry information.',
    ],
  },
  'comment-thread': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through reply and collapse buttons.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused reply or collapse button.' },
    ],
    notes: [
      'Comments render as nested lists, so screen readers announce the reply hierarchy.',
      'Collapse toggles expose aria-expanded and name the comment author in their accessible label.',
    ],
  },
  'diff-viewer': {
    notes: [
      'Each line carries a visually hidden Added, Removed, or Unchanged prefix so the change type is not conveyed by color alone.',
      'The gutter signs and line numbers are aria-hidden to keep the screen-reader output linear.',
    ],
  },
  'funnel-chart': {
    notes: [
      'The chart is a single role="img" with an aria-label; a visually hidden summary lists every stage value and conversion.',
      'Stage names and values are rendered as text, so the information never depends on band width or color alone.',
    ],
  },
  'gantt-chart': {
    notes: [
      'The SVG has role="img" with an accessible name; a visually hidden text summary lists every task with its dates.',
      'Day numbers, month labels, and the today marker are purely visual; no information is conveyed by color alone because labels sit beside every bar.',
    ],
  },
  'gauge-chart': {
    notes: [
      'The gauge is a single role="img" with an aria-label; a visually hidden summary states the value, range, and zones.',
      'The numeric value and label are real text, so the reading never depends on arc length or color alone.',
    ],
  },
  heatmap: {
    notes: [
      'The chart is a single role="img" with an aria-label; a visually hidden summary lists every row and value.',
      'Cell intensity uses opacity on top of color, and each cell tooltip states the exact value so it never relies on color alone.',
    ],
  },
  'json-viewer': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through node toggles and copy buttons.' },
      { keys: ['Enter', 'Space'], action: 'Expands or collapses the focused node.' },
    ],
    notes: [
      'Each container toggle exposes aria-expanded and a label naming its key.',
      'Copy-path buttons stay reachable from the keyboard even though they appear visually on hover.',
    ],
  },
  'kanban-board': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the board\'s single tab stop (the last active card).' },
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves focus between cards within a column.' },
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves focus to the adjacent column.' },
      { keys: ['Enter', 'Space'], action: 'Grabs the focused card, or drops a grabbed card.' },
      { keys: ['Arrow keys (while grabbed)'], action: 'Moves the grabbed card within or across columns.' },
      { keys: ['Escape'], action: 'Cancels the grab without moving the card.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last card in the column.' },
    ],
    notes: [
      'The board is a labelled region; each column is a section named by its heading, and each card is a button.',
      'A grabbed card exposes aria-pressed="true" so screen reader users know a move is in progress.',
    ],
  },
  'line-chart': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus through the data points; focusing a point shows its tooltip.' },
    ],
    notes: [
      'The chart is a labelled image whose summary comes from the label prop; every point also carries an aria-label with series, category, and value.',
      'A visually hidden data table with all series values is always present and can be revealed with the built-in toggle.',
      'With type="area" and stacked, points expose the raw per-series value via aria-label and the data table even though they plot at their cumulative position.',
    ],
  },
  'log-viewer': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the follow toggle and the scrollable pane.' },
      { keys: ['Enter', 'Space'], action: 'Toggles follow mode when the toggle is focused.' },
    ],
    notes: [
      'The pane has role log, so screen readers announce newly appended lines politely.',
      'Severity is conveyed by the uppercase level text, not by color alone.',
    ],
  },
  'markdown-view': {
    notes: [
      'Output uses semantic elements (headings, lists, blockquote, strong/em, code), so structure is conveyed to screen readers.',
      'Unsafe link schemes such as javascript: are rendered as plain text, never as anchors.',
    ],
  },
  'org-chart': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to each subtree toggle button in order.' },
      { keys: ['Enter', 'Space'], action: 'Collapses or expands the focused node\'s subtree.' },
    ],
    notes: [
      'The hierarchy is conveyed through nested lists, so screen readers announce the outline structure.',
      'Toggle buttons expose aria-expanded and a name that includes the person\'s name, e.g. "Collapse Ada\'s reports".',
    ],
  },
  'pie-chart': {
    keyboard: [
      { keys: ['Arrow Right', 'Arrow Down'], action: 'Moves focus to the next segment, wrapping at the end.' },
      { keys: ['Arrow Left', 'Arrow Up'], action: 'Moves focus to the previous segment, wrapping at the start.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last segment.' },
    ],
    notes: [
      'The chart is a labelled image; every segment is focusable with an aria-label of name, value, and percentage.',
      'A visually hidden data table lists each segment with its value and computed share, revealed by the built-in toggle.',
    ],
  },
  'qr-code': {
    notes: [
      'The SVG has role img and an aria-label; always pass a label describing what the code links to or contains.',
      'QR codes are inherently visual; keep the encoded destination available as a text link nearby.',
    ],
  },
  'radar-chart': {
    notes: [
      'The chart is a single role="img" with an aria-label; a visually hidden summary lists each series with per-axis values.',
      'Series colors pair with named tooltips so overlapping polygons remain distinguishable without color.',
    ],
  },
  'scatter-chart': {
    notes: [
      'The chart is a single role="img" with an aria-label; a visually hidden summary lists series names and point counts.',
      'Color distinguishes series, but every dot also has a text tooltip that names its series.',
    ],
  },
  'tree-grid': {
    keyboard: [
      { keys: ['Arrow Up', 'Arrow Down'], action: 'Moves focus between visible rows.' },
      { keys: ['Arrow Right'], action: 'Expands a collapsed parent row.' },
      { keys: ['Arrow Left'], action: 'Collapses an expanded parent row, or moves focus to its parent.' },
      { keys: ['Home', 'End'], action: 'Moves focus to the first or last visible row.' },
    ],
    notes: [
      'The table uses role="treegrid" with row, columnheader, and gridcell roles; rows expose aria-level and, for parents, aria-expanded.',
      'A single tab stop roves across rows, and each parent row also offers a chevron button named "Expand" or "Collapse" plus the row label.',
    ],
  },
  stack: {
    notes: [
      'Stack is purely visual; the DOM order is the reading order, so keep the source order meaningful.',
      'Use the as prop to render a semantic element (nav, ul) when the grouping has meaning.',
    ],
  },
  grid: {
    notes: [
      'Visual order matches DOM order, so keyboard and screen-reader users experience the same sequence as sighted users.',
      'Grid is purely visual; add list or landmark markup inside when the collection has meaning.',
    ],
  },
  resizable: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to and from the resize handle.' },
      { keys: ['Arrow Left', 'Arrow Up'], action: 'Shrinks the preceding panel by one step (default 5%).' },
      { keys: ['Arrow Right', 'Arrow Down'], action: 'Grows the preceding panel by one step (default 5%).' },
    ],
    notes: [
      'The handle renders role="separator" with aria-orientation and aria-valuenow/min/max, so assistive technology announces the current split.',
      'Double-clicking the handle resets the panels to their default sizes.',
      'A disabled handle sets aria-disabled and leaves the tab order.',
      'Panel sizes are percentages clamped by minSize and maxSize, so panes can always keep usable space.',
    ],
  },
  'aspect-ratio': {
    notes: [
      'The ratio wrapper is purely presentational; images and media inside still need their own alt text or captions.',
      'Content is clipped to the box, so make sure no focusable or meaningful content gets cut off.',
    ],
  },
  'app-shell': {
    notes: [
      'Regions render semantic landmarks (header, aside, main, footer) so assistive technology can jump between them.',
      'Keep exactly one AppShellMain on the page and put the primary content inside it.',
    ],
  },
  box: {
    notes: [
      'Box renders a div by default; use the as prop to give the content a meaningful landmark or grouping element.',
      'Box adds no visual styling or behavior beyond its spacing props; focus order and semantics come entirely from its children.',
    ],
  },
  center: {
    notes: [
      'Center has no semantics of its own; it keeps whatever element and accessible name its children provide.',
      'Centering is purely visual; make sure centered status content such as a Spinner carries an accessible name.',
    ],
  },
  columns: {
    notes: [
      'Visual order matches DOM order, so screen-reader and keyboard users experience the same sequence as sighted users.',
      'Cells have no semantics of their own; use list markup inside when the collection is a set of peer items.',
    ],
  },
  container: {
    notes: [
      'Container renders a div by default; pass as="main" when it wraps the primary page content.',
      'Centering and padding are purely visual; landmark roles come from the as prop or the content inside.',
    ],
  },
  flex: {
    notes: [
      'Flex is purely visual; use the as prop for a semantic element (nav, list) when the grouping has meaning.',
      'Reverse directions change only visual order, so keep the DOM order matching the reading order.',
    ],
  },
  masonry: {
    notes: [
      'Screen readers follow DOM order, which in a masonry runs down each column; keep that order sensible for the content.',
      'Masonry adds no keyboard behavior of its own; interactive children keep their normal tab order.',
    ],
  },
  'scroll-shadow': {
    notes: [
      'The fades are aria-hidden and pointer-events-none; scrollability is still announced by the content itself.',
      'Do not rely on the shadow alone to communicate overflow for keyboard users; keep focusable content reachable inside the region.',
    ],
  },
  section: {
    notes: [
      'Give each Section an accessible name (aria-labelledby pointing at its heading) when the page has several, so landmark navigation stays useful.',
      'A section element without an accessible name is not exposed as a landmark, so unnamed Sections read as plain content.',
    ],
  },
  'sticky-header': {
    notes: [
      'StickyHeader must be a direct child of the scrolling element so position: sticky works against it.',
      'The sentinel is aria-hidden and zero-height; the header keeps its normal place in the reading order.',
    ],
  },
  carousel: {
    keyboard: [
      { keys: ['Arrow Left', 'Arrow Right'], action: 'Moves to the previous or next slide.' },
      { keys: ['Tab'], action: 'Moves focus through the previous and next buttons and the dot indicators.' },
    ],
    notes: [
      'Each slide is a group with aria-roledescription="slide" and a label announcing its position, such as "2 of 3".',
      'The region takes its accessible name from the required label prop.',
      'Dot indicators are real buttons with 24px touch targets that jump straight to a slide.',
    ],
  },
  'copy-button': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Copies the value and confirms through the live region.' },
    ],
    notes: [
      'A visually hidden role="status" region announces the copy result politely.',
      'In iconOnly mode the label prop supplies the accessible name.',
      'Clipboard failures still surface feedback instead of failing silently.',
    ],
  },
  collapse: {
    notes: [
      'The closed region sets aria-hidden and the inert attribute, keeping hidden controls out of the tab order.',
      'Pair Collapse with a trigger button that sets aria-expanded and points at the region.',
    ],
  },
  'countdown-timer': {
    notes: [
      'The ticking display stays out of live regions so screen readers are not interrupted every second.',
      'On completion a visually hidden role="status" message announces completionMessage politely.',
      'Tabular numerals keep the readout from jittering as digits change.',
    ],
  },
  'focus-trap': {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to the next control, wrapping from the last back to the first.' },
      { keys: ['Shift', 'Tab'], action: 'Moves focus to the previous control, wrapping from the first back to the last.' },
    ],
    notes: [
      'When the trap activates, focus moves to its first focusable element if focus was outside.',
      'On deactivation or unmount, focus returns to the element that had it before the trap activated (disable with restoreFocus={false}).',
    ],
  },
  'highlight-text': {
    notes: [
      'Matches use the semantic mark element, which assistive technologies can announce as highlighted or relevant text.',
    ],
  },
  'infinite-scroll': {
    notes: [
      'The default loader is a role="status" region, so screen readers hear that more content is loading.',
      'Without IntersectionObserver support a real Load more button keeps the feature operable.',
      'The sentinel itself is aria-hidden and adds nothing to the accessibility tree.',
    ],
  },
  'lazy-image': {
    notes: [
      'The alt text is required and applied to the img as soon as it mounts, so the accessible name never depends on load state.',
      'The fade-in transition is disabled under prefers-reduced-motion.',
    ],
  },
  marquee: {
    notes: [
      'The duplicated copy is aria-hidden, so screen readers encounter the content exactly once.',
      'Under prefers-reduced-motion the animation is disabled and the content sits statically in view.',
      'Hover pausing gives pointer users time to read; keyboard users get the static reduced-motion experience only if their system requests it.',
    ],
  },
  'number-ticker': {
    notes: [
      'Tabular numerals prevent layout shift while digits animate.',
      'Under prefers-reduced-motion the value jumps straight to the target with no animation.',
      'The span is not a live region; pair it with an Announcer if the value change must be spoken.',
    ],
  },
  portal: {
    notes: [
      'Portalled content appears at the end of the DOM, so screen-reader and focus order may differ from visual order; prefer components like Dialog that manage focus when the content is interactive.',
    ],
  },
  presence: {
    notes: [
      'Content that is animating out remains in the DOM briefly; move focus elsewhere before setting present to false so it is not lost when the node unmounts.',
    ],
  },
  reveal: {
    notes: [
      'Content stays in the accessibility tree while visually hidden, so screen readers are unaffected by the entrance animation.',
      'The transition and transform are disabled under prefers-reduced-motion.',
    ],
  },
  'time-ago': {
    notes: [
      'Uses a semantic time element with a machine-readable dateTime attribute.',
      'The title attribute carries the locale-formatted absolute time for sighted users on hover.',
      'Updates swap the text content in place without a live region, so screen readers are not spammed by refreshes.',
    ],
  },
  'truncated-text': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggles between the clamped and expanded text.' },
    ],
    notes: [
      'The toggle button sets aria-expanded and keeps its label in sync (Show more / Show less).',
      'The full text is exposed as a title tooltip while clamped; consider repeating critical content elsewhere since title is not reachable by touch or keyboard alone.',
    ],
  },
  'virtual-list': {
    keyboard: [
      { keys: ['Arrow Up', 'Arrow Down', 'Page Up', 'Page Down'], action: 'Scrolls the list once it has focus.' },
      { keys: ['Tab'], action: 'Moves focus into the scrollable list, which is a tab stop.' },
    ],
    notes: [
      'Each mounted row exposes aria-posinset and aria-setsize so screen readers announce the true position in the full set.',
      'Rows outside the window are not in the DOM, so skip-links and find-in-page only see the rendered slice.',
    ],
  },
  'theme-toggle': {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggles between the light and dark theme.' },
    ],
    notes: [
      'aria-pressed carries the current theme state; the icon swap is decorative.',
      'Initialize from prefers-color-scheme when no stored choice exists so the control starts in sync.',
    ],
  },
  'visually-hidden': {
    notes: [
      'Uses the clip pattern (a 1px clipped box) so content stays in the accessibility tree without affecting layout.',
      'Never place focusable elements inside; a focus target with no visible presence disorients sighted keyboard users.',
      'Prefer visible labels where the design allows; VisuallyHidden is the fallback when space or convention forbids them.',
    ],
  },
}
