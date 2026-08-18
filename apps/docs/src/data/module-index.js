/**
 * Light module index for the docs shell (sidebar, search, PrevNext, HomePage).
 * Full metadata loads per page from ./modules/{id}.js via catalog.jsx.
 * Keep group names and module order in sync with module-meta.js;
 * validate-registry.mjs fails when the two disagree.
 */
export const moduleIndexGroups = [
  {
    "name": "Actions",
    "modules": [
      {
        "id": "button",
        "name": "Button",
        "description": "Actions with consistent hierarchy, sizing, loading, and accessible icon treatment.",
        "apiNames": [
          "Button",
          "IconButton"
        ]
      },
      {
        "id": "button-group",
        "name": "Button Group",
        "description": "An attached cluster of related actions with hairline seams and shared corner radius.",
        "apiNames": [
          "ButtonGroup"
        ]
      },
      {
        "id": "toggle-group",
        "name": "Toggle Group",
        "description": "A cluster of Toggle-styled options with roving focus, in mutually exclusive single mode or independent multiple mode; variant=\"segmented\" renders an options array with a sliding selection pill.",
        "apiNames": [
          "ToggleGroup",
          "ToggleGroupItem"
        ]
      },
      {
        "id": "link",
        "name": "Link",
        "description": "Themed inline and standalone links with an external indicator.",
        "apiNames": [
          "Link"
        ]
      },
      {
        "id": "toggle",
        "name": "Toggle",
        "description": "A pressed-state button for binary preferences in toolbars and filter rows.",
        "apiNames": [
          "Toggle"
        ]
      },
      {
        "id": "toolbar",
        "name": "Toolbar",
        "description": "A horizontal action bar with grouped controls and hairline separators.",
        "apiNames": [
          "Toolbar",
          "ToolbarGroup",
          "ToolbarSeparator"
        ]
      },
      {
        "id": "split-button",
        "name": "Split Button",
        "description": "A primary action joined to a menu of related alternatives.",
        "apiNames": [
          "SplitButton"
        ]
      },
      {
        "id": "action-bar",
        "name": "Action Bar",
        "description": "A horizontal bar for contextual page-level actions such as a sticky save/cancel bar at the bottom of an editing surface.",
        "apiNames": [
          "ActionBar"
        ]
      },
      {
        "id": "bulk-action-bar",
        "name": "Bulk Action Bar",
        "description": "A bar that appears when list or table rows are selected, announcing the selection count and offering bulk actions.",
        "apiNames": [
          "BulkActionBar"
        ]
      },
      {
        "id": "floating-action-button",
        "name": "Floating Action Button",
        "description": "A fixed-position primary action button for the single most important creation task on a screen.",
        "apiNames": [
          "FloatingActionButton"
        ]
      },
      {
        "id": "share-button",
        "name": "Share Button",
        "description": "A button that opens a small popover with a copy-link action and, where supported, the native share sheet.",
        "apiNames": [
          "ShareButton"
        ]
      }
    ]
  },
  {
    "name": "Forms",
    "modules": [
      {
        "id": "field",
        "name": "Field",
        "description": "A deep form seam that connects labels, descriptions, errors, and required state.",
        "apiNames": [
          "Field",
          "Label"
        ]
      },
      {
        "id": "input",
        "name": "Input",
        "description": "A native single-line text control with Teal sizing, invalid states, and a forwarded ref; clearable adds a clear action, loading swaps it for a spinner, and type=\"password\" adds a reveal toggle.",
        "apiNames": [
          "Input"
        ]
      },
      {
        "id": "text-area",
        "name": "TextArea",
        "description": "Multi-line text entry with Teal sizing, invalid states, and a forwarded ref; autosize grows the field with its content.",
        "apiNames": [
          "TextArea"
        ]
      },
      {
        "id": "select",
        "name": "Select",
        "description": "An accessible single-value picker with keyboard navigation, typeahead, and collision-aware positioning.",
        "apiNames": [
          "Select"
        ]
      },
      {
        "id": "checkbox",
        "name": "Checkbox",
        "description": "Boolean and indeterminate selection with an integrated label and description; pass variant=\"card\" for a selectable card with a title, description, and optional icon.",
        "apiNames": [
          "Checkbox"
        ]
      },
      {
        "id": "switch",
        "name": "Switch",
        "description": "An immediate boolean setting with explicit labeling and controlled or uncontrolled state.",
        "apiNames": [
          "Switch"
        ]
      },
      {
        "id": "radio-group",
        "name": "Radio Group",
        "description": "A single-choice option set with an integrated label, description, and subtle borders; pass variant=\"card\" for selectable cards with a title, description, and optional icon.",
        "apiNames": [
          "RadioGroup"
        ]
      },
      {
        "id": "slider",
        "name": "Slider",
        "description": "A numeric value scrubber with an optional live value readout; range mode adds a second thumb for low/high pairs.",
        "apiNames": [
          "Slider"
        ]
      },
      {
        "id": "combobox",
        "name": "Combobox",
        "description": "A filterable picker combining free text with a suggestion list; pass multiple to select several values shown as removable pills.",
        "apiNames": [
          "Combobox"
        ]
      },
      {
        "id": "number-input",
        "name": "Number Input",
        "description": "A numeric field with stepper buttons and min/max clamping.",
        "apiNames": [
          "NumberInput"
        ]
      },
      {
        "id": "file-upload",
        "name": "File Upload",
        "description": "A drag-and-drop zone with a browse action and a removable file list.",
        "apiNames": [
          "FileUpload"
        ]
      },
      {
        "id": "pin-input",
        "name": "PIN Input",
        "description": "A segmented one-time code field with per-cell navigation, paste support, and masking.",
        "apiNames": [
          "PinInput"
        ]
      },
      {
        "id": "tags-input",
        "name": "Tags Input",
        "description": "A token entry field that turns typed text into removable chips.",
        "apiNames": [
          "TagsInput"
        ]
      },
      {
        "id": "input-group",
        "name": "Input Group",
        "description": "An input joined with leading or trailing addons such as protocols and units.",
        "apiNames": [
          "InputGroup",
          "InputAddon"
        ]
      },
      {
        "id": "editable",
        "name": "Editable",
        "description": "Click-to-edit text that commits on Enter or blur and cancels with Escape.",
        "apiNames": [
          "Editable"
        ]
      },
      {
        "id": "currency-input",
        "name": "Currency Input",
        "description": "A numeric amount field with a leading currency symbol that formats the value with Intl.NumberFormat on blur.",
        "apiNames": [
          "CurrencyInput"
        ]
      },
      {
        "id": "fieldset",
        "name": "Fieldset",
        "description": "A semantic fieldset/legend group for related fields, with optional help text linked to the whole group.",
        "apiNames": [
          "Fieldset"
        ]
      },
      {
        "id": "form",
        "name": "Form",
        "description": "A lightweight form wrapper that collects field values on submit and shares an error map through context, with no form library.",
        "apiNames": [
          "Form"
        ]
      },
      {
        "id": "form-error-summary",
        "name": "Form Error Summary",
        "description": "A top-of-form alert that lists validation errors as anchor links which focus the offending field.",
        "apiNames": [
          "FormErrorSummary"
        ]
      },
      {
        "id": "masked-input",
        "name": "Masked Input",
        "description": "A text field that enforces a simple digit mask, inserting separators automatically as the user types.",
        "apiNames": [
          "MaskedInput"
        ]
      },
      {
        "id": "mention-input",
        "name": "Mention Input",
        "description": "A textarea with @-mention autocomplete that inserts chosen people as plain text tokens.",
        "apiNames": [
          "MentionInput"
        ]
      },
      {
        "id": "password-strength-meter",
        "name": "Password Strength Meter",
        "description": "A progressbar-style meter that visualizes password strength from a caller-supplied or built-in score.",
        "apiNames": [
          "PasswordStrengthMeter"
        ]
      },
      {
        "id": "phone-input",
        "name": "Phone Input",
        "description": "A country calling-code dropdown paired with a national number field that emits an E.164-ish string.",
        "apiNames": [
          "PhoneInput"
        ]
      },
      {
        "id": "rich-text-editor",
        "name": "Rich Text Editor",
        "description": "A lightweight markdown editor whose toolbar formats the textarea selection, with an optional live preview pane.",
        "apiNames": [
          "RichTextEditor"
        ]
      },
      {
        "id": "transfer-list",
        "name": "Transfer List",
        "description": "A dual listbox that moves options between an available list and a chosen list with buttons or the keyboard.",
        "apiNames": [
          "TransferList"
        ]
      }
    ]
  },
  {
    "name": "Pickers",
    "modules": [
      {
        "id": "date-picker",
        "name": "Date Picker",
        "description": "A date field with a keyboard-navigable popover: day, month, year, or datetime modes, plus two-click range selection.",
        "apiNames": [
          "DatePicker"
        ]
      },
      {
        "id": "time-picker",
        "name": "Time Picker",
        "description": "A segmented hour and minute field with 12- and 24-hour cycles.",
        "apiNames": [
          "TimePicker"
        ]
      },
      {
        "id": "color-picker",
        "name": "Color Picker",
        "description": "A swatch trigger with preset colors and a validated hex field.",
        "apiNames": [
          "ColorPicker"
        ]
      },
      {
        "id": "timezone-select",
        "name": "Timezone Select",
        "description": "A searchable select over a curated set of IANA timezones with UTC offset labels.",
        "apiNames": [
          "TimezoneSelect"
        ]
      },
      {
        "id": "tree-select",
        "name": "Tree Select",
        "description": "A single-select control whose popover shows an expandable, typeahead-enabled tree of options; display=\"columns\" walks the hierarchy one column per level.",
        "apiNames": [
          "TreeSelect"
        ]
      }
    ]
  },
  {
    "name": "Surfaces",
    "modules": [
      {
        "id": "card",
        "name": "Card",
        "description": "A structural surface for related content without ambiguous interactive behavior.",
        "apiNames": [
          "Card",
          "CardHeader",
          "CardTitle",
          "CardDescription",
          "CardContent",
          "CardFooter"
        ]
      },
      {
        "id": "launcher-card",
        "name": "Launcher Card",
        "description": "An interactive application destination card with an icon, description, optional status, and an honest unavailable state.",
        "apiNames": [
          "LauncherCard"
        ]
      },
      {
        "id": "badge",
        "name": "Badge",
        "description": "A compact semantic status indicator using canonical information variants.",
        "apiNames": [
          "Badge"
        ]
      },
      {
        "id": "accordion",
        "name": "Accordion",
        "description": "A stacked disclosure list with single and multi-open modes driven by a compact item interface.",
        "apiNames": [
          "Accordion"
        ]
      },
      {
        "id": "chip",
        "name": "Chip",
        "description": "A compact filter or selection token with an optional remove affordance.",
        "apiNames": [
          "Chip"
        ]
      },
      {
        "id": "kbd",
        "name": "Kbd",
        "description": "An inline keyboard shortcut hint with a raised keycap treatment.",
        "apiNames": [
          "Kbd"
        ]
      },
      {
        "id": "scroll-area",
        "name": "Scroll Area",
        "description": "A scrollable region with styled, theme-consistent scrollbars.",
        "apiNames": [
          "ScrollArea"
        ]
      },
      {
        "id": "code-block",
        "name": "Code Block",
        "description": "A code panel with a language label, optional line numbers, and copy-to-clipboard.",
        "apiNames": [
          "CodeBlock"
        ]
      },
      {
        "id": "expandable-card",
        "name": "Expandable Card",
        "description": "A card that expands and collapses its extra content with a built-in trigger, chevron affordance, and smooth height animation.",
        "apiNames": [
          "ExpandableCard"
        ]
      }
    ]
  },
  {
    "name": "Overlays",
    "modules": [
      {
        "id": "dialog",
        "name": "Dialog",
        "description": "A modal surface that owns focus management, naming, dismissal, and scroll locking; placement renders it centered, fullscreen, as a left/right drawer, or as a bottom sheet.",
        "apiNames": [
          "Dialog"
        ]
      },
      {
        "id": "tooltip",
        "name": "Tooltip",
        "description": "A short contextual hint with accessible trigger association and collision handling.",
        "apiNames": [
          "Tooltip",
          "TooltipProvider"
        ]
      },
      {
        "id": "menu",
        "name": "Menu",
        "description": "A structured action menu with keyboard navigation, disabled items, icons, and danger styling.",
        "apiNames": [
          "Menu"
        ]
      },
      {
        "id": "popover",
        "name": "Popover",
        "description": "An anchored surface for arbitrary controls and supplemental content.",
        "apiNames": [
          "Popover"
        ]
      },
      {
        "id": "command",
        "name": "Command",
        "description": "A command palette dialog with grouped, filterable actions and keyboard navigation; pass a render function as children for full-screen search with caller-owned results.",
        "apiNames": [
          "Command"
        ]
      },
      {
        "id": "alert-dialog",
        "name": "Alert Dialog",
        "description": "A blocking confirmation that holds focus until an explicit choice is made.",
        "apiNames": [
          "AlertDialog"
        ]
      },
      {
        "id": "popconfirm",
        "name": "Popconfirm",
        "description": "A lightweight anchored confirmation for small destructive or irreversible actions.",
        "apiNames": [
          "Popconfirm"
        ]
      },
      {
        "id": "tour",
        "name": "Tour",
        "description": "A guided walkthrough that highlights target elements step by step.",
        "apiNames": [
          "Tour"
        ]
      },
      {
        "id": "action-sheet",
        "name": "Action Sheet",
        "description": "An iOS-style bottom sheet listing actions with a destructive option and a separated cancel button.",
        "apiNames": [
          "ActionSheet"
        ]
      },
      {
        "id": "cookie-consent",
        "name": "Cookie Consent",
        "description": "Polite, non-modal bottom banner for cookie consent with accept and decline actions and an optional preferences link.",
        "apiNames": [
          "CookieConsent"
        ]
      },
      {
        "id": "floating-panel",
        "name": "Floating Panel",
        "description": "A non-modal panel anchored to a viewport corner for tools that coexist with the page.",
        "apiNames": [
          "FloatingPanel"
        ]
      },
      {
        "id": "image-viewer",
        "name": "Image Viewer",
        "description": "Inline viewer for a single image with toolbar and keyboard zoom plus pointer-drag panning while zoomed.",
        "apiNames": [
          "ImageViewer"
        ]
      },
      {
        "id": "lightbox",
        "name": "Lightbox",
        "description": "Full-screen gallery overlay for paging through images with arrow keys, on-screen controls, and a live counter.",
        "apiNames": [
          "Lightbox"
        ]
      },
      {
        "id": "notification-center",
        "name": "Notification Center",
        "description": "Popover panel that lists recent notifications with read states and a mark-all-read action.",
        "apiNames": [
          "NotificationCenter"
        ]
      },
      {
        "id": "prompt-dialog",
        "name": "Prompt Dialog",
        "description": "A modal dialog with a single labeled input that returns the entered value on confirm.",
        "apiNames": [
          "PromptDialog"
        ]
      }
    ]
  },
  {
    "name": "Feedback",
    "modules": [
      {
        "id": "toast",
        "name": "Toast",
        "description": "Imperative, announced feedback with semantic variants, optional actions, and dismissal.",
        "apiNames": [
          "Toaster"
        ]
      },
      {
        "id": "empty-state",
        "name": "Empty State",
        "description": "An explanatory empty result with an optional action and SVG icon.",
        "apiNames": [
          "EmptyState"
        ]
      },
      {
        "id": "loading",
        "name": "Loading",
        "description": "Named progress and loading treatments for local, skeleton, and full-surface states.",
        "apiNames": [
          "LoadingState",
          "Spinner",
          "Skeleton",
          "Progress"
        ]
      },
      {
        "id": "alert",
        "name": "Alert",
        "description": "An inline feedback surface with semantic variants, an optional title, and dismissal; appearance renders it as a raised surface, a page-level banner strip, or a presentational callout.",
        "apiNames": [
          "Alert"
        ]
      },
      {
        "id": "notification-item",
        "name": "Notification Item",
        "description": "A sanitized ecosystem inbox row with severity, source application, read state, deep link, and delivery-state controls.",
        "apiNames": [
          "NotificationItem"
        ]
      },
      {
        "id": "health-indicator",
        "name": "Health Indicator",
        "description": "An explicit ecosystem health status that reports unknown and stale evidence instead of implying health.",
        "apiNames": [
          "HealthIndicator"
        ]
      },
      {
        "id": "step-up-notice",
        "name": "Step-Up Notice",
        "description": "An inline warning that explains a required fresh verification and hosts the caller’s verification action.",
        "apiNames": [
          "StepUpNotice"
        ]
      },
      {
        "id": "timeline",
        "name": "Timeline",
        "description": "A vertical activity feed with tone dots, connectors, and timestamps.",
        "apiNames": [
          "Timeline"
        ]
      },
      {
        "id": "meter",
        "name": "Meter",
        "description": "A scalar gauge for a known range with optimum-zone coloring.",
        "apiNames": [
          "Meter"
        ]
      },
      {
        "id": "rating",
        "name": "Rating",
        "description": "A star rating input with radio semantics, arrow keys, and a read-only display mode.",
        "apiNames": [
          "Rating"
        ]
      },
      {
        "id": "announcer",
        "name": "Announcer",
        "description": "A visually hidden live region that re-announces a message whenever it changes.",
        "apiNames": [
          "Announcer"
        ]
      },
      {
        "id": "blocking-overlay",
        "name": "Blocking Overlay",
        "description": "A full-surface overlay with a spinner that blocks interaction with the wrapped content during async work.",
        "apiNames": [
          "BlockingOverlay"
        ]
      },
      {
        "id": "error-boundary",
        "name": "Error Boundary",
        "description": "A class-based error boundary that isolates render failures behind a fallback UI with reset support.",
        "apiNames": [
          "ErrorBoundary"
        ]
      },
      {
        "id": "loading-bar",
        "name": "Loading Bar",
        "description": "A thin top-of-page progress bar with determinate and indeterminate modes.",
        "apiNames": [
          "LoadingBar"
        ]
      },
      {
        "id": "network-status",
        "name": "Network Status",
        "description": "An inline indicator of the browser's online/offline state with a render prop for custom display.",
        "apiNames": [
          "NetworkStatus"
        ]
      },
      {
        "id": "offline-banner",
        "name": "Offline Banner",
        "description": "A dismissible banner that appears at the top of the page when the browser loses connectivity.",
        "apiNames": [
          "OfflineBanner"
        ]
      },
      {
        "id": "save-status",
        "name": "Save Status",
        "description": "An inline saved/saving/error indicator with an optional relative timestamp.",
        "apiNames": [
          "SaveStatus"
        ]
      },
      {
        "id": "status-dot",
        "name": "Status Dot",
        "description": "A small colored dot with an optional text label for compact entity status; pass pulse for live presence or ongoing activity.",
        "apiNames": [
          "StatusDot"
        ]
      },
      {
        "id": "upload-progress",
        "name": "Upload Progress",
        "description": "A file upload progress row with file name, determinate bar, formatted size, and a cancel button.",
        "apiNames": [
          "UploadProgress"
        ]
      }
    ]
  },
  {
    "name": "Navigation",
    "modules": [
      {
        "id": "app-switcher",
        "name": "App Switcher",
        "description": "An entitlement-filtered application switcher with an explicit Home destination and keyboard navigation.",
        "apiNames": [
          "AppSwitcher"
        ]
      },
      {
        "id": "account-menu",
        "name": "Account Menu",
        "description": "A household account menu with an identity header, product items, and distinct app and SSO sign-out actions.",
        "apiNames": [
          "AccountMenu"
        ]
      },
      {
        "id": "tabs",
        "name": "Tabs",
        "description": "Keyboard-navigable content switching through a compact item interface.",
        "apiNames": [
          "Tabs"
        ]
      },
      {
        "id": "pagination",
        "name": "Pagination",
        "description": "A controlled page navigator with compact ranges and unavailable directions.",
        "apiNames": [
          "Pagination"
        ]
      },
      {
        "id": "page-header",
        "name": "Page Header",
        "description": "A responsive page title, supporting text, and action area.",
        "apiNames": [
          "PageHeader"
        ]
      },
      {
        "id": "nav-rail",
        "name": "Nav Rail",
        "description": "A fully rounded floating icon rail for dense product navigation.",
        "apiNames": [
          "NavRail",
          "NavRailItem"
        ]
      },
      {
        "id": "ecosystem-rail",
        "name": "Ecosystem Rail",
        "description": "A persistent cross-product rail with a stable Home destination, caller-filtered applications, and honest health status.",
        "apiNames": [
          "EcosystemRail"
        ]
      },
      {
        "id": "top-bar",
        "name": "Top Bar",
        "description": "A sticky top bar with brand, search, and action slots.",
        "apiNames": [
          "TopBar",
          "TopBarBrand",
          "TopBarSearch",
          "TopBarActions"
        ]
      },
      {
        "id": "breadcrumb",
        "name": "Breadcrumb",
        "description": "A hierarchical trail with router-ready items and automatic middle-item collapse.",
        "apiNames": [
          "Breadcrumb"
        ]
      },
      {
        "id": "steps",
        "name": "Steps",
        "description": "A numbered flow indicator with done, current, and upcoming states.",
        "apiNames": [
          "Steps"
        ]
      },
      {
        "id": "tree-view",
        "name": "Tree View",
        "description": "A hierarchical disclosure list with keyboard navigation and selection.",
        "apiNames": [
          "TreeView"
        ]
      },
      {
        "id": "menubar",
        "name": "Menubar",
        "description": "An application command bar of labeled dropdown menus with full keyboard navigation.",
        "apiNames": [
          "Menubar"
        ]
      },
      {
        "id": "navigation-menu",
        "name": "Navigation Menu",
        "description": "A top-level navigation bar mixing links with rich content panels in a shared viewport.",
        "apiNames": [
          "NavigationMenu"
        ]
      },
      {
        "id": "back-top",
        "name": "Back Top",
        "description": "A floating button that appears after scrolling and returns to the top of the page.",
        "apiNames": [
          "BackTop"
        ]
      },
      {
        "id": "anchor-nav",
        "name": "Anchor Nav",
        "description": "A scroll-spy nav of page section anchors that highlights the section in view and smooth-scrolls on click.",
        "apiNames": [
          "AnchorNav"
        ]
      },
      {
        "id": "bottom-nav",
        "name": "Bottom Nav",
        "description": "A mobile bottom navigation bar of three to five icon-and-label items with aria-current and safe-area padding.",
        "apiNames": [
          "BottomNav",
          "BottomNavItem"
        ]
      },
      {
        "id": "dock",
        "name": "Dock",
        "description": "A macOS-style dock of icon buttons with hover tooltips, accessible names, and an active-app indicator dot.",
        "apiNames": [
          "Dock",
          "DockItem"
        ]
      },
      {
        "id": "floating-toolbar",
        "name": "Floating Toolbar",
        "description": "A floating contextual toolbar that appears near a selection or anchored element, with roving tabindex and arrow-key navigation.",
        "apiNames": [
          "FloatingToolbar"
        ]
      },
      {
        "id": "sidebar",
        "name": "Sidebar",
        "description": "A full app sidebar with header, content, and footer slots. It collapses to an icon rail through the collapsed state, switches to a hover-expanding rail with mode=\"rail\", floats as a glass pill with floating, and sets aria-current on the active item.",
        "apiNames": [
          "Sidebar",
          "SidebarHeader",
          "SidebarContent",
          "SidebarFooter",
          "SidebarSection",
          "SidebarItem",
          "SidebarCollapseButton"
        ]
      },
      {
        "id": "skip-link",
        "name": "Skip Link",
        "description": "A visually-hidden-until-focused \"Skip to content\" link that becomes the first tab stop of the page.",
        "apiNames": [
          "SkipLink"
        ]
      },
      {
        "id": "sub-nav",
        "name": "Sub Nav",
        "description": "A secondary horizontal nav row with an underline indicator for the active item that scrolls when items overflow.",
        "apiNames": [
          "SubNav",
          "SubNavItem"
        ]
      }
    ]
  },
  {
    "name": "Data",
    "modules": [
      {
        "id": "permission-matrix",
        "name": "Permission Matrix",
        "description": "A people-by-applications access matrix with caller-supplied cell content and explicit no-access cells.",
        "apiNames": [
          "PermissionMatrix"
        ]
      },
      {
        "id": "table",
        "name": "Table",
        "description": "Accessible data presentation driven by column definitions, with caller-owned sorting and row selection, density, loading, and empty state.",
        "apiNames": [
          "Table"
        ]
      },
      {
        "id": "separator",
        "name": "Separator",
        "description": "A semantic or decorative divider for related content.",
        "apiNames": [
          "Separator"
        ]
      },
      {
        "id": "avatar",
        "name": "Avatar",
        "description": "A compact identity image with initials and icon fallbacks.",
        "apiNames": [
          "Avatar"
        ]
      },
      {
        "id": "description-list",
        "name": "Description List",
        "description": "A label/value definition list for detail pages, stacked or two-column.",
        "apiNames": [
          "DescriptionList"
        ]
      },
      {
        "id": "avatar-group",
        "name": "Avatar Group",
        "description": "An overlapping identity stack with an overflow count.",
        "apiNames": [
          "AvatarGroup"
        ]
      },
      {
        "id": "stat",
        "name": "Stat",
        "description": "A labeled metric with a trend delta and optional supporting content.",
        "apiNames": [
          "Stat"
        ]
      },
      {
        "id": "list",
        "name": "List",
        "description": "A vertical item list with leading and trailing slots, secondary text, and a dense mode.",
        "apiNames": [
          "List",
          "ListItem"
        ]
      },
      {
        "id": "calendar",
        "name": "Calendar",
        "description": "A month grid for picking a single date with bounds and disabled days.",
        "apiNames": [
          "Calendar"
        ]
      },
      {
        "id": "activity-feed",
        "name": "Activity Feed",
        "description": "Chronological list of actor-plus-action events with avatars or icons and timestamps, optionally grouped under day headings.",
        "apiNames": [
          "ActivityFeed"
        ]
      },
      {
        "id": "comment-thread",
        "name": "Comment Thread",
        "description": "Nested comment list with author avatars, timestamps, caller-wired reply buttons, and collapsible reply threads.",
        "apiNames": [
          "CommentThread"
        ]
      },
      {
        "id": "diff-viewer",
        "name": "Diff Viewer",
        "description": "Line-based diff view with added/removed/context coloring, a +/- gutter, and old/new line numbers.",
        "apiNames": [
          "DiffViewer"
        ]
      },
      {
        "id": "json-viewer",
        "name": "JSON Viewer",
        "description": "Collapsible JSON tree with type-colored values, key-count summaries, and optional hover copy-path buttons.",
        "apiNames": [
          "JsonViewer"
        ]
      },
      {
        "id": "kanban-board",
        "name": "Kanban Board",
        "description": "A column-based board where cards move between workflow stages with full keyboard support.",
        "apiNames": [
          "KanbanBoard"
        ]
      },
      {
        "id": "log-viewer",
        "name": "Log Viewer",
        "description": "Scrollable monospace log pane with severity coloring, a follow/auto-scroll toggle, and optional search highlighting.",
        "apiNames": [
          "LogViewer"
        ]
      },
      {
        "id": "markdown-view",
        "name": "Markdown View",
        "description": "Renders a safe markdown subset — headings, emphasis, links, lists, code, and quotes — as teal-styled elements with no raw HTML.",
        "apiNames": [
          "MarkdownView"
        ]
      },
      {
        "id": "qr-code",
        "name": "QR Code",
        "description": "Dependency-free SVG QR code renderer with a hand-rolled byte-mode encoder (error-correction level L).",
        "apiNames": [
          "QrCode"
        ]
      },
      {
        "id": "tree-grid",
        "name": "Tree Grid",
        "description": "A data table whose rows form an expandable tree, following the WAI-ARIA treegrid pattern.",
        "apiNames": [
          "TreeGrid"
        ]
      }
    ]
  },
  {
    "name": "Charts",
    "modules": [
      {
        "id": "sparkline",
        "name": "Sparkline",
        "description": "A tiny inline trend chart in line, area, or bar form with an accessible summary.",
        "apiNames": [
          "Sparkline"
        ]
      },
      {
        "id": "calendar-heatmap",
        "name": "Calendar Heatmap",
        "description": "GitHub-style year calendar heatmap with weeks-by-weekday cells, a 0–4 level color scale, and month labels.",
        "apiNames": [
          "CalendarHeatmap"
        ]
      },
      {
        "id": "chart-container",
        "name": "Chart Container",
        "description": "Accessible SVG frame for hand-rolled charts with an aria-label summary, a toggleable screen-reader data table, and reusable axis, grid, and legend primitives.",
        "apiNames": [
          "ChartContainer",
          "ChartAxis",
          "ChartGrid",
          "ChartLegend"
        ]
      },
      {
        "id": "bar-chart",
        "name": "Bar Chart",
        "description": "Grouped SVG bar chart with vertical or horizontal bars, optional value labels, a legend, and a built-in accessible data table.",
        "apiNames": [
          "BarChart"
        ]
      },
      {
        "id": "funnel-chart",
        "name": "Funnel Chart",
        "description": "SVG funnel of stages whose widths follow their values, with stage-to-stage conversion percentages.",
        "apiNames": [
          "FunnelChart"
        ]
      },
      {
        "id": "gantt-chart",
        "name": "Gantt Chart",
        "description": "A read-only SVG Gantt chart that plots task bars on a day grid with a today marker.",
        "apiNames": [
          "GanttChart"
        ]
      },
      {
        "id": "gauge-chart",
        "name": "Gauge Chart",
        "description": "Semicircle SVG gauge with min/max scale, threshold zones, and a centered value label.",
        "apiNames": [
          "GaugeChart"
        ]
      },
      {
        "id": "heatmap",
        "name": "Heatmap",
        "description": "Matrix heatmap that maps values to a color scale with row/column labels and cell tooltips.",
        "apiNames": [
          "Heatmap"
        ]
      },
      {
        "id": "line-chart",
        "name": "Line Chart",
        "description": "Multi-series SVG line chart with axis ticks, focusable points, simple or custom tooltips, a legend, and a built-in accessible data table. type=\"area\" fills under each series, with adjustable fill opacity and a stacked mode for part-to-whole trends.",
        "apiNames": [
          "LineChart"
        ]
      },
      {
        "id": "org-chart",
        "name": "Org Chart",
        "description": "A hierarchy of person nodes rendered as connected boxes, with collapsible subtrees.",
        "apiNames": [
          "OrgChart"
        ]
      },
      {
        "id": "pie-chart",
        "name": "Pie Chart",
        "description": "SVG pie and donut chart with keyboard-focusable segments, percentage labels, a legend, and a built-in accessible data table.",
        "apiNames": [
          "PieChart"
        ]
      },
      {
        "id": "radar-chart",
        "name": "Radar Chart",
        "description": "SVG radar (spider) chart that overlays multi-series polygons across a shared set of axes.",
        "apiNames": [
          "RadarChart"
        ]
      },
      {
        "id": "scatter-chart",
        "name": "Scatter Chart",
        "description": "Hand-rolled SVG scatter plot with x/y axes, multi-series dots, and optional size encoding.",
        "apiNames": [
          "ScatterChart"
        ]
      }
    ]
  },
  {
    "name": "Layout",
    "modules": [
      {
        "id": "stack",
        "name": "Stack",
        "description": "A flex primitive that stacks children along one axis with consistent spacing and alignment.",
        "apiNames": [
          "Stack"
        ]
      },
      {
        "id": "grid",
        "name": "Grid",
        "description": "A grid primitive with fixed columns or responsive auto-fit tracks.",
        "apiNames": [
          "Grid"
        ]
      },
      {
        "id": "resizable",
        "name": "Resizable",
        "description": "Pointer- and keyboard-resizable panes with percentage sizing and double-click reset.",
        "apiNames": [
          "ResizablePanelGroup",
          "ResizablePanel",
          "ResizableHandle"
        ]
      },
      {
        "id": "aspect-ratio",
        "name": "Aspect Ratio",
        "description": "Keeps media or content at a consistent width-to-height ratio.",
        "apiNames": [
          "AspectRatio"
        ]
      },
      {
        "id": "app-shell",
        "name": "AppShell",
        "description": "An application frame that places header, sidebar, main and footer regions into named grid areas.",
        "apiNames": [
          "AppShell",
          "AppShellHeader",
          "AppShellSidebar",
          "AppShellMain",
          "AppShellFooter"
        ]
      },
      {
        "id": "box",
        "name": "Box",
        "description": "The lowest-level layout primitive: a polymorphic box with spacing props, leaving surfaces and colors to className.",
        "apiNames": [
          "Box"
        ]
      },
      {
        "id": "center",
        "name": "Center",
        "description": "Centers children horizontally and vertically inside their box, with an inline option for flow content.",
        "apiNames": [
          "Center"
        ]
      },
      {
        "id": "columns",
        "name": "Columns",
        "description": "An equal-width grid column layout that keeps row alignment and collapses to fewer columns on narrow screens.",
        "apiNames": [
          "Columns"
        ]
      },
      {
        "id": "container",
        "name": "Container",
        "description": "Centers content in a max-width column with responsive horizontal padding and fixed size steps.",
        "apiNames": [
          "Container"
        ]
      },
      {
        "id": "flex",
        "name": "Flex",
        "description": "A flex container primitive with direction, gap, alignment and distribution props; defaults to a horizontal row.",
        "apiNames": [
          "Flex"
        ]
      },
      {
        "id": "masonry",
        "name": "Masonry",
        "description": "A CSS-columns masonry layout where unequal-height items pack tightly down each column without row gaps.",
        "apiNames": [
          "Masonry"
        ]
      },
      {
        "id": "scroll-shadow",
        "name": "ScrollShadow",
        "description": "A scroll container that fades the top and bottom edges to signal that more content exists in that direction.",
        "apiNames": [
          "ScrollShadow"
        ]
      },
      {
        "id": "section",
        "name": "Section",
        "description": "A semantic page section with vertical rhythm spacing and an optional centered container wrap.",
        "apiNames": [
          "Section"
        ]
      },
      {
        "id": "sticky-header",
        "name": "StickyHeader",
        "description": "A header that sticks to the top of its scrolling container and gains a shadow once it is stuck.",
        "apiNames": [
          "StickyHeader"
        ]
      }
    ]
  },
  {
    "name": "Utilities",
    "modules": [
      {
        "id": "visually-hidden",
        "name": "Visually Hidden",
        "description": "Hides content visually while keeping it available to assistive technology.",
        "apiNames": [
          "VisuallyHidden"
        ]
      },
      {
        "id": "copy-button",
        "name": "Copy Button",
        "description": "A button that copies a value to the clipboard and confirms with an icon swap and live feedback.",
        "apiNames": [
          "CopyButton"
        ]
      },
      {
        "id": "theme-toggle",
        "name": "Theme Toggle",
        "description": "An icon button that toggles the dark class on the document root and reports its state.",
        "apiNames": [
          "ThemeToggle"
        ]
      },
      {
        "id": "carousel",
        "name": "Carousel",
        "description": "A scroll-snap carousel with previous and next controls, dot indicators, and arrow-key support.",
        "apiNames": [
          "Carousel",
          "CarouselSlide"
        ]
      },
      {
        "id": "collapse",
        "name": "Collapse",
        "description": "Animates a region's height to show or hide content, marking it hidden and inert while closed.",
        "apiNames": [
          "Collapse"
        ]
      },
      {
        "id": "countdown-timer",
        "name": "Countdown Timer",
        "description": "Counts down to a target date with a default HH:MM:SS display or a custom render prop, firing onComplete at zero.",
        "apiNames": [
          "CountdownTimer"
        ]
      },
      {
        "id": "focus-trap",
        "name": "Focus Trap",
        "description": "Keeps Tab and Shift+Tab focus cycling within a container and restores focus when deactivated.",
        "apiNames": [
          "FocusTrap"
        ]
      },
      {
        "id": "highlight-text",
        "name": "Highlight Text",
        "description": "Wraps every case-insensitive match of a query in a styled mark element.",
        "apiNames": [
          "HighlightText"
        ]
      },
      {
        "id": "infinite-scroll",
        "name": "Infinite Scroll",
        "description": "Loads the next batch of content automatically when a sentinel scrolls into view via IntersectionObserver.",
        "apiNames": [
          "InfiniteScroll"
        ]
      },
      {
        "id": "lazy-image",
        "name": "Lazy Image",
        "description": "Defers an image request until it nears the viewport, showing a placeholder and fading the image in on load.",
        "apiNames": [
          "LazyImage"
        ]
      },
      {
        "id": "marquee",
        "name": "Marquee",
        "description": "Scrolls content horizontally in a seamless CSS-animation loop with pause-on-hover and reduced-motion support.",
        "apiNames": [
          "Marquee"
        ]
      },
      {
        "id": "number-ticker",
        "name": "Number Ticker",
        "description": "Animates a number toward its target with a requestAnimationFrame count-up and a pluggable formatter.",
        "apiNames": [
          "NumberTicker"
        ]
      },
      {
        "id": "portal",
        "name": "Portal",
        "description": "Renders children into a different DOM container, escaping overflow and stacking-context traps.",
        "apiNames": [
          "Portal"
        ]
      },
      {
        "id": "presence",
        "name": "Presence",
        "description": "Keeps children mounted through their exit transition before unmounting them.",
        "apiNames": [
          "Presence"
        ]
      },
      {
        "id": "reveal",
        "name": "Reveal",
        "description": "Fades and slides children in when they scroll into the viewport via IntersectionObserver.",
        "apiNames": [
          "Reveal"
        ]
      },
      {
        "id": "time-ago",
        "name": "Time Ago",
        "description": "Renders a self-updating relative timestamp like \"5 minutes ago\" with the absolute time on hover.",
        "apiNames": [
          "TimeAgo"
        ]
      },
      {
        "id": "truncated-text",
        "name": "Truncated Text",
        "description": "Clamps text to one or more lines with a show more/less toggle and a tooltip for the full text.",
        "apiNames": [
          "TruncatedText"
        ]
      },
      {
        "id": "virtual-list",
        "name": "Virtual List",
        "description": "Renders only the visible slice of a large fixed-height list, keeping thousands of rows scrolling smoothly.",
        "apiNames": [
          "VirtualList"
        ]
      }
    ]
  }
]

/**
 * Merged-away module ids (0.5.1 consolidation) → surviving page.
 * ModulePage redirects these so existing bookmarks keep working.
 */
export const moduleRedirects = {
  // M1 — DatePicker
  'month-picker': 'date-picker',
  'year-picker': 'date-picker',
  'date-time-picker': 'date-picker',
  'date-range-picker': 'date-picker',
  // M2 — TreeSelect
  cascader: 'tree-select',
  // M3 — ToggleGroup
  'segmented-control': 'toggle-group',
  // M4 — Dialog
  'fullscreen-dialog': 'dialog',
  drawer: 'dialog',
  'bottom-sheet': 'dialog',
  // M5 — Alert
  banner: 'alert',
  callout: 'alert',
  // M6 — Slider
  'range-slider': 'slider',
  // M7 — Table
  'data-table': 'table',
  // M8 — Menu
  'context-menu': 'menu',
  // M9 — EmptyState
  result: 'empty-state',
  // M10 — AnchorNav
  'table-of-contents': 'anchor-nav',
  // M11 — LineChart
  'area-chart': 'line-chart',
  // M12 — Sidebar
  'vertical-nav': 'sidebar',
  'side-rail': 'sidebar',
  // M13 — StatusDot
  'pulse-dot': 'status-dot',
  // M14 — RadioGroup
  'radio-card': 'radio-group',
  // M15 — Checkbox
  'checkbox-card': 'checkbox',
  // M16 — Combobox
  'multi-select': 'combobox',
  // M17 — TextArea
  'autosize-textarea': 'text-area',
  // M18 — Popover
  'hover-card': 'popover',
  // M19 — FloatingActionButton
  'speed-dial': 'floating-action-button',
  // M20 — Progress (documented on the Loading page)
  'progress-circle': 'loading',
  // M21 — Card
  panel: 'card',
  'glass-panel': 'card',
  // M22 — Command
  'search-overlay': 'command',
  // M23 — NavigationMenu
  'mega-menu': 'navigation-menu',
  // M24 — Input
  'search-input': 'input',
  'password-input': 'input',
}
